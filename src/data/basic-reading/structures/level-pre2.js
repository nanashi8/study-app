// 基礎長文・準2級の構造台帳（本文の順に1文ずつ）。書き方は entry.js と長文の構造台帳を見る。
import { bs } from './entry.js'

export const BASIC_READING_STRUCTURES_PRE2 = Object.freeze({
  brp2_work_experience: Object.freeze([
    bs('[独 Dear second-year students],', {
      fragment: true,
      chunks: [
        ['Dear second-year students,', '2年生のみなさんへ'],
      ],
      notes: {
        'Dear second-year students,': 'Eメールの書き出しの呼びかけです。先生から生徒への連絡だと分かります。',
      },
      rules: ['purpose-first'],
    }),
    bs('[S This] [V is] [C Mr. Yamada, {同格>Mr. Yamada| the teacher {前| in charge {前| of the work experience program}}}].', {
      chunks: [
        ['This is Mr. Yamada,', 'こちらは山田です'],
        ['the teacher in charge', '担当の先生である'],
        ['of the work experience program.', '職場体験の'],
      ],
      rules: ['purpose-first'],
    }),
    bs('[S I] [V am] [C happy {to:副詞(原因)| [V to tell] [O1 you] [O2 {that節| [接 that] [S twelve places {前| in our town}] [V have agreed] [O {to:名詞| [V to accept] [O students] [M this year]}]}]}].', {
      chunks: [
        ['I am happy to tell you', 'みなさんにお知らせできてうれしいです'],
        ['that twelve places in our town', '町の12か所が'],
        ['have agreed to accept students', '生徒を受け入れることに同意したということを'],
        ['this year.', '今年'],
      ],
      notes: {
        'that twelve places in our town': 'that の後ろが主語と動詞のそろった文なので「〜ということ」の節で、tell の伝える内容です。',
      },
      rules: ['that-diagnosis'],
    }),
    bs('[S The program] [V will be held] [M {前| for three days}], [M {前| from November 5} {前| to November 7}].', {
      chunks: [
        ['The program will be held', '職場体験は行われます'],
        ['for three days,', '3日間'],
        ['from November 5 to November 7.', '11月5日から11月7日まで'],
      ],
    }),
    bs('[S You] [V can choose] [M {前| from places {前| such as {並列| Aoba Hospital, | the city library, | a bakery, | and Sakura Nursery School}}}].', {
      chunks: [
        ['You can choose from places', '場所から選ぶことができます'],
        ['such as Aoba Hospital,', '青葉病院や'],
        ['the city library, a bakery,', '市立図書館、パン屋'],
        ['and Sakura Nursery School.', 'そしてさくら保育園のような'],
      ],
    }),
    bs('[M Please] [V look] [M {前| at the list {前| on the school website}}] [接 and] [V choose] [O three places {関係>three places| [M that] [S you] [V are] [C interested] [M in]}].', {
      chunks: [
        ['Please look at the list', '一覧を見てください'],
        ['on the school website', '学校のウェブサイトの'],
        ['and choose three places', 'そして三つの場所を選んでください'],
        ['that you are interested in.', '興味のある'],
      ],
      notes: {
        'that you are interested in.': 'be interested in の in の目的語が欠けていて、それが three places です。',
      },
    }),
    bs('[M {to:副詞(目的)| [V To apply]}], [V fill out] [O the form] [接 and] [V give] [O it] [M {前| to your class teacher}] [M {前| by October 10}].', {
      chunks: [
        ['To apply,', '申しこむには'],
        ['fill out the form', '用紙に記入してください'],
        ['and give it to your class teacher', 'そして担任の先生に出してください'],
        ['by October 10.', '10月10日までに'],
      ],
      notes: {
        'by October 10.': '期限を表す by の語句です。設問の「10月10日までに」と同じ内容を本文から探すと、この文が根拠です。',
      },
      rules: ['evidence-backtrack'],
    }),
    bs('[S We] [V will try] [O {to:名詞| [V to send] [O each student] [M {前| to {並列| his | or her} first choice}]}], [接 but] [S this] [V may] [M not] [M always] [V be] [C possible].', {
      chunks: [
        ['We will try to send each student', '一人一人を行かせるようにします'],
        ['to his or her first choice,', '第一希望の場所に'],
        ['but this may not always be possible.', 'しかし、いつもそうできるとは限りません'],
      ],
      notes: {
        'but this may not always be possible.': 'not always は「いつも〜とは限らない」という部分否定です。',
      },
    }),
    bs('[M {前| After the program}], [S every student] [V must write] [O a short report {前| about {what節| [O what] [S {並列| he | or she}] [V learned]}}].', {
      chunks: [
        ['After the program,', '職場体験のあと'],
        ['every student must write', '全員が書かなければなりません'],
        ['a short report', '短い報告書を'],
        ['about what he or she learned.', '自分が学んだことについての'],
      ],
    }),
    bs('[S This program] [V is] [C a valuable opportunity {to:形容詞>a valuable opportunity| [V to see] [O {疑問詞節| [O what] [S working adults] [M actually] [V do] [M every day]}]}].', {
      chunks: [
        ['This program is a valuable opportunity', 'この職場体験は貴重な機会です'],
        ['to see', '知るための'],
        ['what working adults actually do', '働く大人が実際に何をしているかを'],
        ['every day.', '毎日'],
      ],
    }),
    bs('[S You] [V may visit] [O places {関係>places| [S that] [V are] [C unfamiliar {前| to you}]}], [接 so] [仮S it] [V is] [C natural] [真S {to:名詞| [V to feel] [M a little] [C anxious] [M {前| at first}]}].', {
      chunks: [
        ['You may visit places', '場所を訪れるかもしれません'],
        ['that are unfamiliar to you,', 'なじみのない'],
        ['so it is natural', 'だから自然なことです'],
        ['to feel a little anxious', '少し不安に感じるのは'],
        ['at first.', '最初は'],
      ],
    }),
    bs('[M Please] [V be] [C punctual], [V wear] [O appropriate clothes], [接 and] [V greet] [O everyone] [M politely].', {
      chunks: [
        ['Please be punctual,', '時間を守ってください'],
        ['wear appropriate clothes,', 'ふさわしい服装をしてください'],
        ['and greet everyone politely.', 'そしてみんなにていねいにあいさつしてください'],
      ],
    }),
    bs('[S People] [V will judge] [O our school] [M {前| by your behavior}], [接 so] [S I] [V expect] [O you] [C {to:補語| [V to act] [M {前| in a responsible way}]}].', {
      chunks: [
        ['People will judge our school', '人は学校を判断します'],
        ['by your behavior,', 'みなさんのふるまいで'],
        ['so I expect you', 'だから、みなさんに期待します'],
        ['to act in a responsible way.', '責任ある行動をとることを'],
      ],
    }),
    bs(`[M {副詞節:条件| [接 If] [S you] [V have] [O any questions]}], [M please] [V come] [接 and] [V see] [O me] [M {前| in the teachers' room}].`, {
      chunks: [
        ['If you have any questions,', 'もし質問があれば'],
        ['please come and see me', 'わたしのところへ来てください'],
        ["in the teachers' room.", '職員室の'],
      ],
    }),
    bs('[独 Best regards],', {
      fragment: true,
      chunks: [
        ['Best regards,', 'よろしくお願いします'],
      ],
    }),
    bs('[独 Taro Yamada]', {
      fragment: true,
      chunks: [
        ['Taro Yamada', '山田太郎'],
      ],
    }),
  ]),
  brp2_plastic: Object.freeze([
    bs('[S Plastic] [V is] [C {並列| cheap, | light, | and strong}], [接 so] [S it] [V is used] [M {前| for many products}].', {
      chunks: [
        ['Plastic is cheap, light, and strong,', 'プラスチックは安く、軽く、じょうぶです'],
        ['so it is used', 'だから使われています'],
        ['for many products.', '多くの製品に'],
      ],
    }),
    bs('[M However], [S a lot {前| of plastic}] [V ends up] [M {前| in the ocean}], [接 and] [S this] [V has become] [C a serious problem].', {
      chunks: [
        ['However,', 'しかし'],
        ['a lot of plastic ends up', '多くのプラスチックが最後には行き着きます'],
        ['in the ocean,', '海に'],
        ['and this has become a serious problem.', 'そしてこれは深刻な問題になっています'],
      ],
    }),
    bs('[S Plastic] [V does not disappear] [M easily].', {
      chunks: [
        ['Plastic does not disappear easily.', 'プラスチックは簡単にはなくなりません'],
      ],
      notes: {
        'Plastic does not disappear easily.': '段落の最初の文から、この段落はプラスチックが海で害を与える仕組みを説明する役割だと見当をつけます。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[M {前| In the ocean}], [S {並列| waves | and sunlight}] [M slowly] [V break] [O it] [M {前| into very small pieces}].', {
      chunks: [
        ['In the ocean,', '海の中で'],
        ['waves and sunlight slowly break it', '波と日光がそれを少しずつくだきます'],
        ['into very small pieces.', 'とても小さなかけらに'],
      ],
    }),
    bs('[S {並列| Fish | and sea birds}] [M often] [V eat] [O these pieces] [M {副詞節:理由| [接 because] [S they] [V look like] [O food]}].', {
      chunks: [
        ['Fish and sea birds often eat', '魚や海鳥はよく食べます'],
        ['these pieces', 'このかけらを'],
        ['because they look like food.', 'なぜなら、えさのように見えるからです'],
      ],
      notes: {
        'because they look like food.': 'because の後ろが原因（えさに見える）、前が結果（食べてしまう）です。',
      },
      rules: ['cause-result'],
    }),
    bs('[M {前| As a result}], [S some animals] [V become] [C {並列| sick | or die}].', {
      chunks: [
        ['As a result,', 'その結果'],
        ['some animals become sick or die.', '病気になったり死んだりする動物もいます'],
      ],
      rules: ['cause-result'],
    }),
    bs('[S Many countries] [V are] [M now] [V trying] [O {to:名詞| [V to reduce] [O plastic waste]}].', {
      chunks: [
        ['Many countries are now trying', '今、多くの国がしようとしています'],
        ['to reduce plastic waste.', 'プラスチックのごみを減らすことを'],
      ],
      notes: {
        'to reduce plastic waste.': '次の文の For example の具体例は、この「ごみを減らす取り組み」の例です。',
      },
      rules: ['example-restatement'],
    }),
    bs('[M {前| For example}], [M {前| since 2020}], [S stores {前| in Japan}] [V have charged] [O customers] [M {前| for plastic shopping bags}].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['since 2020,', '2020年から'],
        ['stores in Japan have charged customers', '日本の店は客にお金を求めています'],
        ['for plastic shopping bags.', 'レジぶくろに'],
      ],
      rules: ['example-restatement'],
    }),
    bs('[S Some cafes] [V have] [M also] [V stopped] [O {動名詞| [V using] [O plastic straws]}].', {
      chunks: [
        ['Some cafes have also stopped', 'やめたカフェもあります'],
        ['using plastic straws.', 'プラスチックのストローを使うことを'],
      ],
    }),
    bs('[S These] [V are] [C small changes], [接 but] [S they] [V can make] [O a big difference] [M {副詞節:条件| [接 if] [S many people] [V join in]}].', {
      chunks: [
        ['These are small changes,', 'これらは小さな変化です'],
        ['but they can make a big difference', 'しかし大きな違いを生むことができます'],
        ['if many people join in.', 'もし多くの人が加われば'],
      ],
    }),
    bs('[S Each {前| of us}] [V can start] [M {前| by {動名詞| [V carrying] [O {並列| our own bag | and bottle}]}}].', {
      chunks: [
        ['Each of us can start', 'わたしたち一人一人は始められます'],
        ['by carrying our own bag and bottle.', '自分のふくろと水とうを持ち歩くことで'],
      ],
    }),
    bs('[S Companies] [V are] [M also] [V developing] [O new materials {関係>new materials| [S that] [V break down] [M {前| in nature}]}], [接 and] [S consumers] [V can help] [M {前| by {動名詞| [V choosing] [O products {過去分詞>products| [V made] [M {前| from them}]}]}}].', {
      chunks: [
        ['Companies are also developing', '会社も開発しています'],
        ['new materials', '新しい素材を'],
        ['that break down in nature,', '自然の中で分解される'],
        ['and consumers can help', 'そして消費者は協力できます'],
        ['by choosing products', '製品を選ぶことで'],
        ['made from them.', 'それで作られた'],
      ],
    }),
    bs('[S {動名詞| [V Protecting] [O the ocean]}] [M also] [V means] [O {動名詞| [V protecting] [O the wildlife {関係>the wildlife| [S that] [V lives] [M there]}]}].', {
      chunks: [
        ['Protecting the ocean also means', '海を守ることは意味してもいます'],
        ['protecting the wildlife', '野生の生き物を守ることを'],
        ['that lives there.', 'そこにすむ'],
      ],
    }),
    bs('[S Plastic] [V is] [M also] [V made] [M {前| from oil, {同格>oil| a resource {関係>a resource| [S that] [V will not last] [M forever]}}}].', {
      chunks: [
        ['Plastic is also made from oil,', 'プラスチックは石油からも作られます'],
        ['a resource', 'つまり資源で'],
        ['that will not last forever.', '永遠にはもたない'],
      ],
    }),
    bs('[M {前| In addition}], [S some chemicals {前| in plastic}] [V may be] [C harmful {前| to human health}].', {
      chunks: [
        ['In addition,', 'さらに'],
        ['some chemicals in plastic', 'プラスチックの中の化学物質のいくつかは'],
        ['may be harmful to human health.', '人の健康に有害かもしれません'],
      ],
    }),
    bs('[S Recycling] [V is] [C essential], [接 but] [S {動名詞| [V solving] [O this problem]}] [V will need] [O the cooperation {前| of every individual}].', {
      chunks: [
        ['Recycling is essential,', 'リサイクルは欠かせません'],
        ['but solving this problem', 'しかし、この問題を解決するには'],
        ['will need the cooperation', '協力が必要でしょう'],
        ['of every individual.', '一人一人の'],
      ],
    }),
  ]),
  brp2_robots: Object.freeze([
    bs('[S Robots] [V are] [M no longer] [M only] [M {前| in factories}].', {
      chunks: [
        ['Robots are no longer', 'ロボットはもう〜ではありません'],
        ['only in factories.', '工場の中だけにいる'],
      ],
    }),
    bs('[M Today], [S we] [V can see] [O them] [M {前| in {並列| hospitals, | farms, | and even restaurants}}].', {
      chunks: [
        ['Today, we can see them', '今では、それを見かけることができます'],
        ['in hospitals, farms, and even restaurants.', '病院や農場、さらにはレストランで'],
      ],
    }),
    bs('[M {前| In some restaurants {前| in Japan}}], [S food] [V is carried] [M {前| to the tables}] [M {前| by robots}].', {
      chunks: [
        ['In some restaurants in Japan,', '日本のいくつかのレストランでは'],
        ['food is carried', '料理が運ばれます'],
        ['to the tables', 'テーブルまで'],
        ['by robots.', 'ロボットによって'],
      ],
      notes: {
        'food is carried': 'be＋過去分詞の受け身です。by robots を主語にすると「ロボットが料理を運ぶ」となります。',
      },
      rules: ['passive-active'],
    }),
    bs('[S This] [V allows] [O the staff] [C {to:補語| [V to spend] [O more time] [M {動名詞| [V talking] [M {前| with customers}]}]}].', {
      chunks: [
        ['This allows the staff', 'これは店員にさせてくれます'],
        ['to spend more time', 'より多くの時間を使うことを'],
        ['talking with customers.', '客と話すのに'],
      ],
      notes: {
        'This allows the staff': 'This は前の文の「ロボットが料理を運ぶこと」を指します。allow＋人＋to do で「人が〜できるようにする」。',
      },
    }),
    bs('[M {前| In hospitals}], [S some robots] [V help] [O nurses] [C {原形| [V lift] [O patients]}], [接 so] [S the nurses] [V do not hurt] [O their backs].', {
      chunks: [
        ['In hospitals,', '病院では'],
        ['some robots help nurses', 'いくつかのロボットが看護師を手伝います'],
        ['lift patients,', '患者をかかえ上げるのを'],
        ['so the nurses do not hurt', 'だから看護師は痛めません'],
        ['their backs.', '腰を'],
      ],
    }),
    bs('[S Many people] [V welcome] [O these robots] [M {副詞節:理由| [接 because] [M there] [V are not] [S enough workers {前| in many jobs}]}].', {
      chunks: [
        ['Many people welcome these robots', '多くの人がこうしたロボットを歓迎しています'],
        ['because there are not enough workers', 'なぜなら、働く人が足りないからです'],
        ['in many jobs.', '多くの仕事で'],
      ],
    }),
    bs('[M However], [S some people] [V worry] [O {that節| [接 that] [S robots] [V will take away] [O their jobs]}].', {
      chunks: [
        ['However,', 'しかし'],
        ['some people worry', '心配する人もいます'],
        ['that robots will take away their jobs.', 'ロボットが自分の仕事をうばうのではないかと'],
      ],
    }),
    bs(`[S Robots] [V are] [C good {前| at {動名詞| [V repeating] [O the same work]}}], [接 but] [S they] [V are not] [C good {前| at {動名詞| [V understanding] [O people's feelings]}}].`, {
      chunks: [
        ['Robots are good at', 'ロボットは得意です'],
        ['repeating the same work,', '同じ作業をくり返すことが'],
        ['but they are not good at', 'しかし得意ではありません'],
        ["understanding people's feelings.", '人の気持ちを理解することは'],
      ],
      notes: {
        'but they are not good at': 'but の前の「得意なこと」より、後ろの「苦手なこと」が、最後の段落の結論につながる側です。',
      },
      rules: ['contrast-concession'],
    }),
    bs('[M {前| In the future}], [S the most important skill {前| for workers}] [V may be] [C the ability {to:形容詞>the ability| [V to work] [M well] [M {前| with robots}]}].', {
      chunks: [
        ['In the future,', '将来'],
        ['the most important skill for workers', '働く人にとっていちばん大切な技能は'],
        ['may be the ability', '力かもしれません'],
        ['to work well with robots.', 'ロボットとうまくいっしょに働く'],
      ],
      notes: {
        'may be the ability': 'the を目印に読み進めると、中心の名詞は ability です。後ろの to work … が「どんな力か」を説明しています。',
      },
      rules: ['noun-boundary'],
    }),
    bs('[M {前| At one factory}], [M {前| for example}], [S robots] [V carry] [O heavy parts], [M {副詞節:対比| [接 while] [S workers] [V check] [O the quality {前| of the products}]}].', {
      chunks: [
        ['At one factory, for example,', 'たとえばある工場では'],
        ['robots carry heavy parts,', 'ロボットが重い部品を運びます'],
        ['while workers check the quality', '一方で、働く人が質を確かめます'],
        ['of the products.', '製品の'],
      ],
    }),
    bs('[S Robots] [V may change] [O many jobs], [接 but] [S they] [V will] [M also] [V create] [O new ones, {前| such as {動名詞| [V {並列| designing | and repairing}] [O robots]}}].', {
      chunks: [
        ['Robots may change many jobs,', 'ロボットは多くの仕事を変えるかもしれません'],
        ['but they will also create new ones,', 'しかし新しい仕事も生み出すでしょう'],
        ['such as designing and repairing robots.', 'ロボットを設計したり修理したりするような'],
      ],
    }),
    bs('[S Robots] [V have] [O great potential], [M especially] [M {前| in {並列| agriculture | and medical care}}].', {
      chunks: [
        ['Robots have great potential,', 'ロボットは大きな可能性を持っています'],
        ['especially in agriculture and medical care.', '特に農業と医療で'],
      ],
    }),
    bs('[M However], [S some people] [V are] [C concerned] [M {that節| [接 that] [S {動名詞| [V depending] [M too much] [M {前| on robots}]}] [V may weaken] [O our own skills]}].', {
      chunks: [
        ['However, some people are concerned', 'しかし、心配する人もいます'],
        ['that depending too much on robots', 'ロボットにたよりすぎることが'],
        ['may weaken our own skills.', '自分たちの技能を弱めるかもしれないと'],
      ],
    }),
    bs('[M {前| Rather than {動名詞| [V fearing] [O robots]}}], [S we] [V should expect] [O {to:名詞| [V to learn] [O new ways {前| of {動名詞| [V working] [M {前| with them}]}}]}].', {
      chunks: [
        ['Rather than fearing robots,', 'ロボットをこわがるよりも'],
        ['we should expect to learn', 'わたしたちは身につけるつもりでいるべきです'],
        ['new ways of working with them.', 'ロボットと働く新しいやり方を'],
      ],
    }),
  ]),
  brp2_sleep: Object.freeze([
    bs('[S Doctors] [V say] [O {that節| [接 that] [S teenagers] [V need] [O eight {前| to ten hours {前| of sleep}}] [M every night]}].', {
      chunks: [
        ['Doctors say', '医者は言います'],
        ['that teenagers need', '10代の若者は必要だと'],
        ['eight to ten hours of sleep', '8時間から10時間の睡眠が'],
        ['every night.', '毎晩'],
      ],
    }),
    bs('[M However], [S many high school students {前| in Japan}] [V sleep] [M {数量| less than seven} hours].', {
      chunks: [
        ['However,', 'しかし'],
        ['many high school students in Japan', '日本の多くの高校生は'],
        ['sleep less than seven hours.', '7時間より短い時間しか眠っていません'],
      ],
    }),
    bs('[S Sleep] [V is] [C important {前| for {並列| both the body | and the brain}}].', {
      chunks: [
        ['Sleep is important', '睡眠は大切です'],
        ['for both the body and the brain.', '体にも脳にも'],
      ],
    }),
    bs('[M {副詞節:時| [接 While] [S we] [V sleep]}], [S the brain] [V sorts] [O the information {関係>the information| [O that] [S we] [V got] [M {前| during the day}]}].', {
      chunks: [
        ['While we sleep,', '眠っている間に'],
        ['the brain sorts the information', '脳は情報を整理します'],
        ['that we got during the day.', 'その日に得た'],
      ],
      notes: {
        'the brain sorts the information': '睡眠が脳に役立つしくみの説明です。睡眠不足の原因をたずねる設問なら、ここは大まかに読みます。',
      },
      rules: ['reading-mode'],
    }),
    bs('[S Students {関係>Students| [S who] [V sleep] [M well]}] [V remember] [O {what節| [O what] [S they] [V studied]}] [M better {前| than students {関係>students| [S who] [V stay up] [M late]}}].', {
      chunks: [
        ['Students who sleep well', 'よく眠る生徒は'],
        ['remember what they studied', '勉強したことを覚えています'],
        ['better than students', '生徒よりもよく'],
        ['who stay up late.', '夜ふかしする'],
      ],
      notes: {
        'better than students': 'better than で比べています。比べているのはよく眠る生徒と夜ふかしする生徒、比べる点は勉強したことの覚え方です。',
      },
      rules: ['comparison-pairs'],
    }),
    bs('[S People {関係>People| [S who] [V do not get] [O enough sleep]}] [M often] [V feel] [C drowsy] [M {前| in the daytime}].', {
      chunks: [
        ['People who do not get enough sleep', '十分に眠らない人は'],
        ['often feel drowsy', 'よく眠気を感じます'],
        ['in the daytime.', '昼間に'],
      ],
      notes: {
        'often feel drowsy': '知らない語 drowsy は、feel の後ろなので様子を表す形容詞です。次の文の「目を開けていられない」から意味を推測します。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[M {前| In class}], [S they] [V cannot keep] [O their eyes] [C open], [接 and] [S they] [V find] [仮O it] [C hard] [真O {to:名詞| [V to pay] [O attention]}].', {
      chunks: [
        ['In class,', '授業中'],
        ['they cannot keep their eyes open,', 'その人たちは目を開けていられません'],
        ['and they find it hard', 'そしてむずかしいと感じます'],
        ['to pay attention.', '集中することが'],
      ],
      notes: {
        'and they find it hard': 'it は形式目的語で、中身は後ろの to pay attention です。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[S One reason {前| for the lack {前| of sleep}}] [V is] [C the use {前| of smartphones} {前| at night}].', {
      chunks: [
        ['One reason for the lack of sleep', '睡眠不足の原因の一つは'],
        ['is the use of smartphones', 'スマートフォンの使用です'],
        ['at night.', '夜の'],
      ],
      notes: {
        'One reason for the lack of sleep': '設問の「睡眠不足の原因」と同じ内容が書かれた文で、ペースを落として読みます。',
      },
      rules: ['reading-mode'],
    }),
    bs('[S The light {前| from the screen}] [V tells] [O1 the brain] [O2 {that節| [接 that] [S it] [V is] [M still] [C daytime]}], [接 so] [仮S it] [V becomes] [C harder] [真S {to:名詞| [V to go] [M {前| to sleep}]}].', {
      chunks: [
        ['The light from the screen', '画面の光は'],
        ['tells the brain', '脳に伝えます'],
        ['that it is still daytime,', 'まだ昼間だと'],
        ['so it becomes harder', 'だから、よりむずかしくなります'],
        ['to go to sleep.', '寝つくのが'],
      ],
    }),
    bs('[S Experts] [V suggest] [O {動名詞| [V putting] [O phones] [M away] [M {前| at least one hour}] [M {前| before {動名詞| [V going] [M {前| to bed}]}}]}].', {
      chunks: [
        ['Experts suggest putting phones away', '専門家はスマートフォンを片づけることをすすめています'],
        ['at least one hour', '少なくとも1時間'],
        ['before going to bed.', '寝る前に'],
      ],
    }),
    bs('[S {動名詞| [V Getting] [O enough sleep]}] [V is] [C one {前| of the easiest ways {to:形容詞>the easiest ways| [V to improve] [O {並列| both your health | and your grades}]}}].', {
      chunks: [
        ['Getting enough sleep is one', '十分に眠ることは一つです'],
        ['of the easiest ways', 'いちばん簡単な方法の'],
        ['to improve both your health', '健康をよくする'],
        ['and your grades.', 'そして成績も'],
      ],
    }),
    bs('[S Lack {前| of sleep}] [V can] [M also] [V affect] [O our feelings], [M {分詞構文:結果| [V making] [O us] [C {原形| [V feel] [C {並列| anxious | or easily irritated}]}]}].', {
      chunks: [
        ['Lack of sleep can also affect', '睡眠不足は影響することもあります'],
        ['our feelings,', '気持ちに'],
        ['making us feel', 'そしてわたしたちに感じさせます'],
        ['anxious or easily irritated.', '不安やいらいらしやすさを'],
      ],
      notes: {
        'making us feel': 'コンマのあとの making は分詞構文で、前の内容の結果（〜させることになる）を表します。',
      },
    }),
    bs('[M {前| In fact}], [S some schools {前| in other countries}] [V have started] [O classes] [M later] [M {前| in the morning}], [接 and] [S they] [V have seen] [O better {並列| attendance | and concentration}].', {
      chunks: [
        ['In fact,', '実際に'],
        ['some schools in other countries', '外国のいくつかの学校は'],
        ['have started classes later', '授業を遅く始めました'],
        ['in the morning,', '朝の'],
        ['and they have seen', 'そして見てきました'],
        ['better attendance and concentration.', '出席と集中がよくなるのを'],
      ],
    }),
    bs('[S Sleep] [V is] [C essential {前| for {並列| both our physical | and mental health}}].', {
      chunks: [
        ['Sleep is essential', '睡眠は欠かせません'],
        ['for both our physical and mental health.', '体と心の両方の健康に'],
      ],
    }),
  ]),
  brp2_washi: Object.freeze([
    bs('[S Washi, {同格>Washi| a kind {前| of paper} {過去分詞>paper| [V made] [M {前| by hand}] [M {前| in Japan}]}},] [V has] [O a history {前| of {数量| more than 1,300} years}].', {
      chunks: [
        ['Washi,', '和紙は'],
        ['a kind of paper', '紙の一種で'],
        ['made by hand in Japan,', '日本で手作りされる'],
        ['has a history', '歴史があります'],
        ['of more than 1,300 years.', '千三百年を超える'],
      ],
      notes: {
        'a kind of paper': '二つのコンマにはさまれた補足で、Washi を言いかえています。外すと Washi has a history of more than 1,300 years. が残ります。',
      },
      rules: ['insertion'],
    }),
    bs('[S It] [V is made] [M {前| from the inside {前| of the branches {前| of certain plants}}}].', {
      chunks: [
        ['It is made', '和紙は作られます'],
        ['from the inside of the branches', '枝の内側の部分から'],
        ['of certain plants.', 'ある種の植物の'],
      ],
    }),
    bs('[M {副詞節:理由| [接 Because] [S the fibers] [V are] [C long]}], [S washi] [V is] [C {並列| thin | but very strong}].', {
      chunks: [
        ['Because the fibers are long,', '繊維が長いので'],
        ['washi is thin but very strong.', '和紙はうすいのにとてもじょうぶです'],
      ],
    }),
    bs('[M {前| In the past}], [S washi] [V was used] [M {前| for {並列| books, | letters, | and the doors {前| of houses}}}].', {
      chunks: [
        ['In the past,', '昔'],
        ['washi was used', '和紙は使われていました'],
        ['for books, letters,', '本や手紙に'],
        ['and the doors of houses.', 'そして家の戸に'],
      ],
    }),
    bs('[M Today], [S it] [V is] [M also] [V used] [M {前| by museums {前| around the world}, {関係,>museums| [S which] [V repair] [O {並列| old books | and paintings}] [M {前| with it}]}}].', {
      chunks: [
        ['Today, it is also used', '今では、和紙は使われてもいます'],
        ['by museums around the world,', '世界中の美術館によって'],
        ['which repair old books and paintings', 'そして美術館は古い本や絵を修理しています'],
        ['with it.', 'それで'],
      ],
      notes: {
        'which repair old books and paintings': 'コンマのあとの which は、前の museums around the world を受けて説明を足します。',
      },
      rules: ['relative-clause'],
    }),
    bs('[S This] [V is] [C {副詞節:理由| [接 because] [S washi] [V lasts] [M {前| for a very long time}]}].', {
      chunks: [
        ['This is because', 'これは〜だからです'],
        ['washi lasts', '和紙はもちます'],
        ['for a very long time.', 'とても長い間'],
      ],
      notes: {
        'This is because': 'This は直前の名詞一つではなく、前の文の「美術館が和紙で修理していること」全体を指します。',
      },
      rules: ['reference-chain'],
    }),
    bs(`[M {前| In 2014}], [S the skills {前| of {動名詞| [V making] [O washi]}}] [V were added] [M {前| to UNESCO's list {前| of cultural heritage}}].`, {
      chunks: [
        ['In 2014,', '2014年'],
        ['the skills of making washi', '和紙を作る技術は'],
        ['were added', '加えられました'],
        ["to UNESCO's list", 'ユネスコの一覧に'],
        ['of cultural heritage.', '文化遺産の'],
      ],
    }),
    bs('[M However], [S the number {前| of people {関係>people| [S who] [V make] [O washi] [M {前| by hand}]}}] [V is getting] [C smaller].', {
      chunks: [
        ['However,', 'しかし'],
        ['the number of people', '人の数は'],
        ['who make washi by hand', '手で和紙を作る'],
        ['is getting smaller.', '減ってきています'],
      ],
    }),
    bs('[S Some young people {関係>Some young people| [S who] [V want] [O {to:名詞| [V to protect] [O this tradition]}]}] [V are] [M now] [V learning] [O the skills] [M {前| from older makers}].', {
      chunks: [
        ['Some young people', '何人かの若者は'],
        ['who want to protect this tradition', 'この伝統を守りたいと思う'],
        ['are now learning the skills', '今、技術を学んでいます'],
        ['from older makers.', '年上の職人から'],
      ],
    }),
    bs('[S Some {前| of them}] [M also] [V create] [O new products, {前| such as {並列| lamps | and bags}} {過去分詞>lamps and bags| [V made] [M {前| of washi}]}], [M {to:副詞(目的)| [V to attract] [O younger customers]}].', {
      chunks: [
        ['Some of them also create', 'その中の何人かは作ってもいます'],
        ['new products,', '新しい製品を'],
        ['such as lamps and bags', 'ランプやかばんのような'],
        ['made of washi,', '和紙で作られた'],
        ['to attract younger customers.', '若い客を引きつけるために'],
      ],
    }),
    bs('[S {動名詞| [V Making] [O washi]}] [V takes] [O a lot {前| of patience}], [M {副詞節:理由| [接 because] [S each piece {前| of paper}] [V is made] [M carefully] [M {前| by hand}]}].', {
      chunks: [
        ['Making washi takes', '和紙を作るにはいります'],
        ['a lot of patience,', 'たいへんな根気が'],
        ['because each piece of paper', 'なぜなら、一枚一枚の紙が'],
        ['is made carefully by hand.', '手でていねいに作られるからです'],
      ],
    }),
    bs('[S The work] [M also] [V needs] [O clean, cold water], [接 so] [S many makers] [V live] [M {前| in rural areas {前| near rivers}}].', {
      chunks: [
        ['The work also needs', 'その仕事は必要としてもいます'],
        ['clean, cold water,', 'きれいで冷たい水を'],
        ['so many makers live', 'だから多くの職人は住んでいます'],
        ['in rural areas near rivers.', '川の近くの農村部に'],
      ],
    }),
    bs('[S Each region] [V is] [C proud {前| of its own kind {前| of washi}}].', {
      chunks: [
        ['Each region is proud', 'どの地域もほこりにしています'],
        ['of its own kind of washi.', '自分たちの種類の和紙を'],
      ],
    }),
    bs('[M {前| By {動名詞| [V using] [O washi products]}}], [S we] [V can help] [O {原形| [V preserve] [O this valuable tradition] [M {前| for the future}]}].', {
      chunks: [
        ['By using washi products,', '和紙の製品を使うことで'],
        ['we can help preserve', 'わたしたちは残す手助けができます'],
        ['this valuable tradition', 'この貴重な伝統を'],
        ['for the future.', '未来のために'],
      ],
    }),
  ]),
  brp2_bees: Object.freeze([
    bs('[M {副詞節:時| [接 When] [S people] [V think of] [O bees]}], [S many {前| of them}] [V think of] [O honey].', {
      chunks: [
        ['When people think of bees,', '人がミツバチのことを思うとき'],
        ['many of them think of honey.', 'その多くははちみつを思いうかべます'],
      ],
    }),
    bs('[接 But] [S bees] [V do] [O much more {前| than {原形| [V make] [O honey]}}].', {
      chunks: [
        ['But bees do much more', 'でも、ミツバチはずっと多くのことをしています'],
        ['than make honey.', 'はちみつを作るよりも'],
      ],
      notes: {
        'But bees do much more': 'But で「はちみつ以上のこと」と言うので、次の段落ではちみつ以外の働きが説明されると予測できます。',
      },
      rules: ['genre-prediction'],
    }),
    bs('[M {副詞節:時| [接 When] [S bees] [V fly] [M {前| from flower} {前| to flower}] [M {to:副詞(目的)| [V to collect] [O food]}]}], [S they] [M also] [V move] [O tiny yellow grains] [M {前| from one flower} {前| to another}].', {
      chunks: [
        ['When bees fly', 'ミツバチが飛ぶとき'],
        ['from flower to flower', '花から花へ'],
        ['to collect food,', '食べ物を集めるために'],
        ['they also move tiny yellow grains', '小さな黄色い粒も運びます'],
        ['from one flower to another.', '一つの花からほかの花へ'],
      ],
    }),
    bs('[S This] [V helps] [O plants] [C {原形| [V produce] [O {並列| fruit | and seeds}]}].', {
      chunks: [
        ['This helps plants', 'これは植物を助けます'],
        ['produce fruit and seeds.', '実や種を作るのを'],
      ],
    }),
    bs('[S Many {前| of {並列| the fruits | and vegetables} {関係>the fruits and vegetables| [O that] [S we] [V eat]}}] [V would not grow] [M well] [M {前| without bees}].', {
      chunks: [
        ['Many of the fruits and vegetables', '果物や野菜の多くは'],
        ['that we eat', 'わたしたちが食べる'],
        ['would not grow well', 'よく育たないでしょう'],
        ['without bees.', 'ミツバチがいなければ'],
      ],
    }),
    bs('[S Scientists] [V have] [M also] [V studied] [O {疑問詞節| [M how] [S bees] [V share] [O information]}].', {
      chunks: [
        ['Scientists have also studied', '科学者は研究もしてきました'],
        ['how bees share information.', 'ミツバチがどのように情報を伝え合うかを'],
      ],
    }),
    bs('[S A scientist {過去分詞>A scientist| [V named] [C Karl von Frisch]}] [V found] [O {that節| [接 that] [S bees] [V dance] [M {to:副詞(目的)| [V to tell] [O1 other bees] [O2 {疑問詞節| [M where] [S flowers] [V are]}]}]}].', {
      chunks: [
        ['A scientist named Karl von Frisch', 'カール・フォン・フリッシュという科学者は'],
        ['found that bees dance', 'ミツバチがダンスをすることを発見しました'],
        ['to tell other bees', 'ほかのミツバチに伝えるために'],
        ['where flowers are.', '花がどこにあるかを'],
      ],
      notes: {
        'where flowers are.': 'where から are までがひとかたまりの名詞で、tell の伝える内容です。中は flowers are のふつうの語順です。',
      },
      rules: ['wh-clause'],
    }),
    bs('[S He] [V won] [O a Nobel Prize] [M {前| for this work}] [M {前| in 1973}].', {
      chunks: [
        ['He won a Nobel Prize', 'フリッシュはノーベル賞を受賞しました'],
        ['for this work', 'この研究で'],
        ['in 1973.', '1973年に'],
      ],
    }),
    bs('[M Today], [M however], [S the number {前| of bees}] [V is falling] [M {前| in many parts {前| of the world}}].', {
      chunks: [
        ['Today, however,', 'しかし今'],
        ['the number of bees is falling', 'ミツバチの数が減っています'],
        ['in many parts of the world.', '世界の多くの地域で'],
      ],
    }),
    bs('[S Scientists] [V do not know] [O all the reasons], [接 but] [S {並列| chemicals {過去分詞>chemicals| [V used] [M {前| on farms}]} | and diseases}] [V seem] [C {to:補語| [V to be] [C part {前| of the cause}]}].', {
      chunks: [
        ['Scientists do not know', '科学者は知っているわけではありません'],
        ['all the reasons,', '理由のすべてを'],
        ['but chemicals used on farms and diseases', 'しかし農場で使われる化学物質と病気が'],
        ['seem to be part of the cause.', '原因の一部のようです'],
      ],
      notes: {
        'Scientists do not know': 'do not know all は「すべてを知っているわけではない」という部分否定です。分かっていることもあります。',
      },
      rules: ['negation-scope'],
    }),
    bs('[S {動名詞| [V Protecting] [O bees]}] [V means] [O {動名詞| [V protecting] [O our food]}].', {
      chunks: [
        ['Protecting bees means', 'ミツバチを守ることは意味します'],
        ['protecting our food.', 'わたしたちの食べ物を守ることを'],
      ],
    }),
    bs('[S Farmers] [V can help] [M {前| by {並列| {動名詞| [V planting] [O more flowers]} | and {動名詞| [V using] [O fewer chemicals]}}}].', {
      chunks: [
        ['Farmers can help', '農家の人は協力できます'],
        ['by planting more flowers', '花をもっと植えることで'],
        ['and using fewer chemicals.', 'そして化学物質を減らすことで'],
      ],
    }),
    bs('[S Some cities] [M even] [V keep] [O bees] [M {前| on the roofs {前| of buildings}}] [M {to:副詞(目的)| [V to provide] [O them] [M {前| with a safe habitat}]}].', {
      chunks: [
        ['Some cities even keep bees', 'ミツバチを飼っている都市さえあります'],
        ['on the roofs of buildings', 'ビルの屋上で'],
        ['to provide them', 'ミツバチにあたえるために'],
        ['with a safe habitat.', '安全なすみかを'],
      ],
    }),
    bs('[S Bees] [V are] [M also] [C sensitive {前| to changes {前| in temperature}}], [接 so] [S global warming] [V may be] [C another danger {前| to them}].', {
      chunks: [
        ['Bees are also sensitive', 'ミツバチは敏感でもあります'],
        ['to changes in temperature,', '気温の変化に'],
        ['so global warming may be', 'だから地球温暖化は〜かもしれません'],
        ['another danger to them.', 'ミツバチにとってのもう一つの危険'],
      ],
    }),
    bs('[S The loss {前| of bees}] [V would have] [O a serious impact {前| on {並列| crops | and agriculture}}], [接 and] [S it] [V could] [M even] [V threaten] [O our food supply].', {
      chunks: [
        ['The loss of bees would have', 'ミツバチがいなくなれば、もたらすでしょう'],
        ['a serious impact', '深刻な影響を'],
        ['on crops and agriculture,', '作物と農業に'],
        ['and it could even threaten', 'そしておびやかすことさえあるかもしれません'],
        ['our food supply.', '食料の供給を'],
      ],
    }),
    bs('[S Bees] [V are] [C small], [接 but] [S they] [V are] [C essential {前| to our lives}].', {
      chunks: [
        ['Bees are small,', 'ミツバチは小さいです'],
        ['but they are essential to our lives.', 'しかし、わたしたちの暮らしに欠かせません'],
      ],
    }),
  ]),
  brp2_curry: Object.freeze([
    bs('[S {成句| Curry and rice}] [V is] [C one {前| of the most popular dishes {前| in Japan}}].', {
      chunks: [
        ['Curry and rice is one', 'カレーライスは一つです'],
        ['of the most popular dishes', 'もっとも人気のある料理の'],
        ['in Japan.', '日本で'],
      ],
    }),
    bs('[M However], [S curry] [V is not] [M originally] [C a Japanese food].', {
      chunks: [
        ['However,', 'しかし'],
        ['curry is not originally', 'カレーはもともと〜ではありません'],
        ['a Japanese food.', '日本の食べ物'],
      ],
      notes: {
        'However,': 'However は前の内容と反対の向き（日本で人気だが、日本生まれではない）を示す接続語です。',
      },
      rules: ['logic-connectors'],
    }),
    bs('[S Curry] [V came] [M {前| from India}], [接 but] [S it] [V was introduced] [M {前| to Japan}] [M {前| by Britain}] [M about 150 years ago].', {
      chunks: [
        ['Curry came from India,', 'カレーはインドから来ました'],
        ['but it was introduced to Japan', 'しかし日本に伝えられたのは'],
        ['by Britain', 'イギリスによってです'],
        ['about 150 years ago.', '約150年前に'],
      ],
    }),
    bs('[M {前| At that time}], [S British people {現在分詞>British people| [V living] [M {前| in India}]}] [V had brought] [O curry] [M back] [M {前| to their country}].', {
      chunks: [
        ['At that time,', 'その当時'],
        ['British people', 'イギリスの人々が'],
        ['living in India', 'インドに住んでいた'],
        ['had brought curry back', 'カレーを持ち帰っていました'],
        ['to their country.', '自分の国に'],
      ],
      notes: {
        'living in India': 'British people を後ろから「インドに住んでいた」と説明しています。文の動詞は had brought です。',
      },
      rules: ['postmodifier'],
    }),
    bs('[S They] [V changed] [O it] [接 and] [V made] [O it] [C thicker], [接 and] [S this British style {前| of curry}] [V reached] [O Japan].', {
      chunks: [
        ['They changed it', '彼らはそれに手を加えました'],
        ['and made it thicker,', 'そしてとろみをつけました'],
        ['and this British style of curry', 'そして、このイギリス風のカレーが'],
        ['reached Japan.', '日本に届きました'],
      ],
    }),
    bs('[M {前| In Japan}], [S curry] [V was] [M first] [V served] [M {前| in the navy}].', {
      chunks: [
        ['In Japan,', '日本では'],
        ['curry was first served', 'カレーは最初に出されました'],
        ['in the navy.', '海軍で'],
      ],
    }),
    bs('[S It] [V was] [C an easy way {to:形容詞>an easy way| [V to give] [O1 sailors] [O2 {並列| meat | and vegetables}] [M {前| at the same time}]}].', {
      chunks: [
        ['It was an easy way', 'それは手軽な方法でした'],
        ['to give sailors', '船員にあたえる'],
        ['meat and vegetables', '肉と野菜を'],
        ['at the same time.', '同時に'],
      ],
    }),
    bs('[M {前| After that}], [S curry] [V spread] [M {前| to {並列| schools | and homes}}], [接 and] [S it] [V became] [C a favorite dish {前| of many families}].', {
      chunks: [
        ['After that,', 'そのあと'],
        ['curry spread to schools and homes,', 'カレーは学校や家庭に広まりました'],
        ['and it became a favorite dish', 'そして大好きな料理になりました'],
        ['of many families.', '多くの家族の'],
      ],
    }),
    bs('[M Today], [S you] [V can find] [O {並列| curry bread, | curry noodles, | and many other dishes} {過去分詞>many other dishes| [V inspired] [M {前| by curry}]}].', {
      chunks: [
        ['Today, you can find', '今では見つけることができます'],
        ['curry bread, curry noodles,', 'カレーパンやカレーうどん'],
        ['and many other dishes', 'そしてほかの多くの料理を'],
        ['inspired by curry.', 'カレーから着想を得た'],
      ],
      notes: {
        'inspired by curry.': 'inspired の前に be も have もないので、many other dishes を後ろから説明する過去分詞です。',
      },
      rules: ['ing-ed-role'],
    }),
    bs('[M {前| In some areas}], [S towns] [V use] [O their own local curry] [M {to:副詞(目的)| [V to attract] [O tourists]}].', {
      chunks: [
        ['In some areas,', 'いくつかの地域では'],
        ['towns use their own local curry', '町が地元のカレーを使っています'],
        ['to attract tourists.', '観光客を呼ぶために'],
      ],
    }),
    bs('[S Curry] [V is] [M now] [C so familiar] [M {副詞節:結果| [接 that] [S many people] [V regard] [O it] [M {前| as a Japanese dish}]}].', {
      chunks: [
        ['Curry is now so familiar', 'カレーは今ではとても身近です'],
        ['that many people regard it', 'それで多くの人がそれをみなしています'],
        ['as a Japanese dish.', '日本の料理だと'],
      ],
    }),
    bs('[S Each region {前| of Japan}] [V has] [O its own kind {前| of curry}, {過去分詞>its own kind of curry| [V made] [M {前| with local ingredients {前| such as {並列| seafood | or vegetables}}}]}].', {
      chunks: [
        ['Each region of Japan', '日本の各地域には'],
        ['has its own kind of curry,', 'その土地のカレーがあります'],
        ['made with local ingredients', '地元の材料で作られた'],
        ['such as seafood or vegetables.', '海産物や野菜のような'],
      ],
    }),
    bs('[S Japanese curry] [V is] [M also] [M usually] [C milder {前| than Indian curry}] [接 and] [V uses] [O less spice].', {
      chunks: [
        ['Japanese curry is also usually milder', '日本のカレーはまた、ふつうよりまろやかです'],
        ['than Indian curry', 'インドのカレーよりも'],
        ['and uses less spice.', 'そして香辛料も少なめです'],
      ],
    }),
    bs('[仮S It] [V is] [C interesting] [真S {that節| [接 that] [S a dish {前| from India}] [V became] [C part {前| of Japanese culture}] [M {前| through Britain}]}].', {
      chunks: [
        ['It is interesting', 'おもしろいことです'],
        ['that a dish from India', 'インドの料理が'],
        ['became part of Japanese culture', '日本の文化の一部になったのは'],
        ['through Britain.', 'イギリスを通って'],
      ],
    }),
  ]),
  brp2_tourism: Object.freeze([
    bs('[S The number {前| of tourists {現在分詞>tourists| [V visiting] [O Japan]}}] [V has been growing] [M quickly].', {
      chunks: [
        ['The number of tourists', '観光客の数は'],
        ['visiting Japan', '日本を訪れる'],
        ['has been growing quickly.', '急速に増えています'],
      ],
    }),
    bs('[S Some people] [V are] [C happy {前| about this}], [M {副詞節:理由| [接 because] [S tourists] [V spend] [O money] [M {前| in local {並列| shops | and hotels}}]}].', {
      chunks: [
        ['Some people are happy about this,', 'これを喜ぶ人もいます'],
        ['because tourists spend money', 'なぜなら観光客がお金を使うからです'],
        ['in local shops and hotels.', '地元の店やホテルで'],
      ],
      rules: ['author-stance'],
    }),
    bs('[M {前| On the other hand}], [S some popular places] [V have] [O a serious problem]: [S they] [V are] [C too crowded].', {
      chunks: [
        ['On the other hand,', '一方で'],
        ['some popular places', 'いくつかの人気の場所は'],
        ['have a serious problem:', '深刻な問題をかかえています'],
        ['they are too crowded.', 'こみすぎているのです'],
      ],
      marks: [[':', '前の「深刻な問題」が何かを、コロンの後ろで説明します（こみすぎていること）。']],
      rules: ['punctuation-map'],
    }),
    bs('[M {前| In Kyoto}], [M {前| for example}], [S local people] [M sometimes] [V cannot get on] [O buses] [M {副詞節:理由| [接 because] [S they] [V are] [C full {前| of visitors}]}].', {
      chunks: [
        ['In Kyoto, for example,', 'たとえば京都では'],
        ['local people sometimes cannot get on buses', '地元の人がバスに乗れないことがあります'],
        ['because they are full of visitors.', 'なぜなら、バスが観光客でいっぱいだからです'],
      ],
      notes: {
        'local people sometimes cannot get on buses': 'sometimes は「ときどき」。選択肢で never や always に強められていないかを比べます。',
      },
      rules: ['distractor-strength'],
    }),
    bs('[S Some residents] [V are] [M also] [C unhappy {前| about {並列| noise | and garbage}}].', {
      chunks: [
        ['Some residents are also unhappy', '不満を持つ住民もいます'],
        ['about noise and garbage.', 'さわがしさやごみに'],
      ],
      rules: ['author-stance', 'distractor-strength'],
    }),
    bs('[M {前| In my opinion}], [S tourists] [V can help] [O towns], [接 but] [M only] [M {副詞節:条件| [接 if] [S their visits] [V are managed] [M well]}].', {
      chunks: [
        ['In my opinion,', 'わたしの考えでは'],
        ['tourists can help towns,', '観光客は町の助けになります'],
        ['but only if their visits', 'しかし、それは訪問が〜場合に限ります'],
        ['are managed well.', 'うまく管理される'],
      ],
      notes: {
        'In my opinion,': 'In my opinion から筆者自身の意見が始まります。but only if で条件をつけています。',
      },
      rules: ['author-stance'],
    }),
    bs('[S Cities] [V should ask] [O tourists] [C {to:補語| [V to pay] [O a small fee]}], [接 and] [S the money] [V should be used] [M {to:副詞(目的)| [V to keep] [O the town] [C clean]}].', {
      chunks: [
        ['Cities should ask tourists', '市は観光客に求めるべきです'],
        ['to pay a small fee,', '少額の料金を払うように'],
        ['and the money should be used', 'そして、そのお金は使われるべきです'],
        ['to keep the town clean.', '町をきれいに保つために'],
      ],
      rules: ['author-stance'],
    }),
    bs('[S Tourists] [V should] [M also] [V try] [O {to:名詞| [V to visit] [O less famous places, {関係,>less famous places| [S which] [V are] [M often] [C {成句| just as beautiful}]}]}].', {
      chunks: [
        ['Tourists should also try', '観光客もしてみるべきです'],
        ['to visit less famous places,', 'あまり有名でない場所を訪れることを'],
        ['which are often just as beautiful.', 'そこも同じくらい美しいことが多いのです'],
      ],
      notes: {
        'which are often just as beautiful.': 'often は「〜なことが多い」。いつも美しいとは言っていません。',
      },
      rules: ['distractor-strength'],
    }),
    bs('[S Some towns] [V have] [M already] [V started] [O {to:名詞| [V to limit] [O the number {前| of visitors} {前| to popular spots}]}].', {
      chunks: [
        ['Some towns have already started', 'すでに始めた町もあります'],
        ['to limit the number of visitors', '訪れる人の数を制限することを'],
        ['to popular spots.', '人気の場所を'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S {並列| visitors | and residents}] [V respect] [O each other]}], [S both {前| of them}] [V can enjoy] [O the town].', {
      chunks: [
        ['If visitors and residents', 'もし観光客と住民が'],
        ['respect each other,', 'おたがいを尊重すれば'],
        ['both of them can enjoy the town.', 'どちらも町を楽しむことができます'],
      ],
    }),
    bs('[S Tourists] [V are] [M also] [C an important source {前| of income} {前| for rural areas {関係>rural areas| [S whose populations] [V are shrinking]}}].', {
      chunks: [
        ['Tourists are also', '観光客は〜でもあります'],
        ['an important source of income', '大切な収入源'],
        ['for rural areas', '農村部にとって'],
        ['whose populations are shrinking.', '人口が減っている'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S visitors] [V travel] [M {前| to these places}]}], [S the towns] [V can become] [C more lively].', {
      chunks: [
        ['If visitors travel to these places,', '観光客がそうした場所を訪れれば'],
        ['the towns can become more lively.', '町はもっと活気づくことができます'],
      ],
    }),
    bs('[S Local governments] [V should provide] [O information] [M {前| in several languages}] [M {副詞節:目的| [接 so that] [S visitors] [V can learn] [O local manners]}].', {
      chunks: [
        ['Local governments should provide', '自治体は伝えるべきです'],
        ['information in several languages', 'いくつかの言語で情報を'],
        ['so that visitors can learn', '観光客が知ることができるように'],
        ['local manners.', '地元のマナーを'],
      ],
    }),
    bs('[M {前| With careful planning}], [S {並列| tourists | and the local community}] [V can live] [M together] [M {前| in harmony}].', {
      chunks: [
        ['With careful planning,', 'よく計画すれば'],
        ['tourists and the local community', '観光客と地域の社会は'],
        ['can live together in harmony.', '仲よくいっしょに暮らすことができます'],
      ],
    }),
  ]),
  brp2_online_classes: Object.freeze([
    bs('[M {前| During the last few years}], [S many schools] [V have started] [O {to:名詞| [V to use] [O online classes]}].', {
      chunks: [
        ['During the last few years,', 'ここ数年で'],
        ['many schools have started', '多くの学校が始めました'],
        ['to use online classes.', 'オンライン授業を使うことを'],
      ],
    }),
    bs('[S Some people] [V think] [O {that節| [接 that] [S schools] [V should use] [O them] [M more often]}].', {
      chunks: [
        ['Some people think', '考える人もいます'],
        ['that schools should use them', '学校はそれを使うべきだと'],
        ['more often.', 'もっとひんぱんに'],
      ],
    }),
    bs('[S Online classes] [V have] [O some clear good points].', {
      chunks: [
        ['Online classes have', 'オンライン授業にはあります'],
        ['some clear good points.', 'いくつかのはっきりしたよい点が'],
      ],
    }),
    bs('[S Students] [V can watch] [O a lesson] [M {成句| again and again}], [接 and] [S they] [V can study] [M {前| at their own pace}].', {
      chunks: [
        ['Students can watch a lesson', '生徒は授業を見ることができます'],
        ['again and again,', '何度も'],
        ['and they can study', 'そして勉強することができます'],
        ['at their own pace.', '自分のペースで'],
      ],
      notes: {
        'and they can study': 'and の後ろの they can study（主語＋can＋動詞）と同じ形は、前の Students can watch です。二つの節が並んでいます。',
      },
      rules: ['parallel-shape'],
    }),
    bs('[S Students {関係>Students| [S who] [V live] [M {前| far from school}]}] [M also] [V save] [O time].', {
      chunks: [
        ['Students who live far from school', '学校から遠くに住む生徒も'],
        ['also save time.', '時間の節約になります'],
      ],
    }),
    bs('[S Online classes] [M also] [V allow] [O students {前| in remote areas}] [C {to:補語| [V to take] [O courses {関係>courses| [O that] [S their local schools] [V cannot offer]}]}].', {
      chunks: [
        ['Online classes also allow', 'オンライン授業はできるようにもします'],
        ['students in remote areas', 'へき地の生徒が'],
        ['to take courses', '講座を受けることを'],
        ['that their local schools cannot offer.', '地元の学校が用意できない'],
      ],
    }),
    bs('[M However], [S I] [V believe] [O {that節| [接 that] [S students] [M still] [V need] [O {to:名詞| [V to go] [M {前| to school}]}]}].', {
      chunks: [
        ['However, I believe', 'しかし、わたしは考えます'],
        ['that students still need', '生徒はやはり必要だと'],
        ['to go to school.', '学校へ行くことが'],
      ],
    }),
    bs('[S The friends {関係>The friends| [O that] [S we] [V make] [M {前| in the classroom}]}] [V teach] [O1 us] [O2 {疑問詞to| [M how] [V to work] [M {前| with other people}]}].', {
      chunks: [
        ['The friends', '友達は'],
        ['that we make in the classroom', '教室でできる'],
        ['teach us', 'わたしたちに教えてくれます'],
        ['how to work with other people.', 'ほかの人とどう協力するかを'],
      ],
      notes: {
        'that we make in the classroom': 'that から classroom までを（ ）に入れると、The friends … teach という骨組みが残ります。',
      },
      rules: ['main-clause-skeleton'],
    }),
    bs('[S {動名詞| [V Talking] [M {成句| face to face}]}] [M also] [V makes] [O our ideas] [C clearer].', {
      chunks: [
        ['Talking face to face', '顔を合わせて話すことは'],
        ['also makes our ideas clearer.', '自分の考えをよりはっきりさせてもくれます'],
      ],
      notes: {
        'also makes our ideas clearer.': 'make＋もの＋状態で「ものを〜の状態にする」。our ideas が目的語、clearer が補語です。',
      },
      rules: ['svoc-core'],
    }),
    bs('[M However], [S some students] [V find] [仮O it] [C difficult] [真O {to:名詞| [V to concentrate] [M {前| at home}]}] [M {前| because of {並列| noise | or other things {前| around them}}}].', {
      chunks: [
        ['However, some students find it difficult', 'しかし、むずかしいと感じる生徒もいます'],
        ['to concentrate at home', '家で集中することが'],
        ['because of noise', '物音のために'],
        ['or other things around them.', 'あるいはまわりのほかの物のために'],
      ],
    }),
    bs('[S Schools] [V will] [M also] [V need] [O {to:名詞| [V to provide] [O {並列| training {前| for teachers} | and reliable internet service {前| for every student}}]}].', {
      chunks: [
        ['Schools will also need to provide', '学校は用意する必要もあるでしょう'],
        ['training for teachers', '先生のための研修と'],
        ['and reliable internet service', '安定したインターネットを'],
        ['for every student.', 'すべての生徒のための'],
      ],
    }),
    bs('[S Online classes] [V are] [C a useful tool], [接 but] [S they] [V cannot do] [O everything {関係>everything| [O that] [S a school] [V does]}].', {
      chunks: [
        ['Online classes are a useful tool,', 'オンライン授業は便利な道具です'],
        ['but they cannot do everything', 'しかし、すべてができるわけではありません'],
        ['that a school does.', '学校がしていることの'],
      ],
    }),
    bs('[S The best way] [V may be] [C {to:補語| [V to use] [O both kinds {前| of classes}] [M wisely]}].', {
      chunks: [
        ['The best way may be', 'いちばんよい方法は〜かもしれません'],
        ['to use both kinds of classes wisely.', '両方の授業を賢く使うこと'],
      ],
    }),
    bs('[M {前| For example}], [S students] [V could watch] [O lectures] [M {前| at home}] [接 and] [V use] [O class time] [M {前| for discussions}].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['students could watch lectures at home', '生徒は家で講義を見ることができるでしょう'],
        ['and use class time', 'そして授業の時間を使う'],
        ['for discussions.', '話し合いに'],
      ],
    }),
    bs('[M {前| In this way}], [S schools] [V can enjoy] [O the strengths {前| of both styles}].', {
      chunks: [
        ['In this way,', 'このようにして'],
        ['schools can enjoy the strengths', '学校は長所を生かすことができます'],
        ['of both styles.', '両方のやり方の'],
      ],
    }),
  ]),
  brp2_community_cafe: Object.freeze([
    bs(`[M Every Saturday], [S a small cafe] [V opens] [M {前| in the community center {前| near Daiki's house}}].`, {
      chunks: [
        ['Every Saturday,', '毎週土曜日'],
        ['a small cafe opens', '小さなカフェが開きます'],
        ['in the community center', '公民館で'],
        ["near Daiki's house.", 'ダイキの家の近くの'],
      ],
    }),
    bs('[S It] [V is run] [M {前| by volunteers}], [接 and] [S most {前| of the customers}] [V are] [C elderly people {関係>elderly people| [S who] [V live] [M alone]}].', {
      chunks: [
        ['It is run by volunteers,', 'カフェはボランティアによって運営されています'],
        ['and most of the customers', 'そして客のほとんどは'],
        ['are elderly people', 'お年寄りです'],
        ['who live alone.', '一人で暮らす'],
      ],
    }),
    bs(`[M Last spring], [S Daiki's mother] [V asked] [O him] [C {to:補語| [V to help] [M {前| at the cafe}]}].`, {
      chunks: [
        ['Last spring,', '去年の春'],
        ["Daiki's mother asked him", 'ダイキの母はダイキに頼みました'],
        ['to help at the cafe.', 'カフェを手伝うように'],
      ],
      notes: {
        'to help at the cafe.': 'ask＋人＋to do で「人に〜するように頼む」。to help は頼んだ中身を表します。',
      },
      rules: ['infinitive-role'],
    }),
    bs('[S Daiki] [V was] [C shy] [接 and] [V did not like] [O {動名詞| [V talking] [M {前| with strangers}]}], [接 so] [S he] [V said] [O no] [M {前| at first}].', {
      chunks: [
        ['Daiki was shy', 'ダイキははずかしがり屋でした'],
        ['and did not like talking with strangers,', 'そして知らない人と話すのが好きではありませんでした'],
        ['so he said no', 'だから断りました'],
        ['at first.', '最初は'],
      ],
      rules: ['repair-monitor'],
    }),
    bs('[M {前| In the end}], [S he] [V agreed] [O {to:名詞| [V to go] [M just once]}].', {
      chunks: [
        ['In the end,', '結局'],
        ['he agreed to go just once.', 'ダイキは一度だけ行くことにしました'],
      ],
      rules: ['repair-monitor'],
    }),
    bs('[M {前| At the cafe}], [S an old man] [V asked] [O Daiki] [C {to:補語| [V to teach] [O1 him] [O2 {疑問詞to| [M how] [V to use] [O a smartphone]}]}].', {
      chunks: [
        ['At the cafe,', 'カフェで'],
        ['an old man asked Daiki', 'あるおじいさんがダイキに頼みました'],
        ['to teach him', '教えてほしいと'],
        ['how to use a smartphone.', 'スマートフォンの使い方を'],
      ],
    }),
    bs('[M {副詞節:時| [接 When] [S Daiki] [V showed] [O1 him] [O2 {疑問詞to| [M how] [V to send] [O photos]}]}], [S the man] [V smiled] [接 and] [V said] [O {that省略| [S he] [V could] [M now] [V see] [O pictures {前| of his family}] [M far away]}].', {
      chunks: [
        ['When Daiki showed him', 'ダイキが教えると'],
        ['how to send photos,', '写真の送り方を'],
        ['the man smiled and said', 'おじいさんはにっこりして言いました'],
        ['he could now see', 'これで見られると'],
        ['pictures of his family far away.', '遠くに住む家族の写真を'],
      ],
      notes: {
        'the man smiled and said': '主語と組になる動詞は showed・smiled・said と、said の中の could see です。節は When の節・the man の節・he could see の節の三つです。',
      },
      rules: ['finite-verb-check', 'repair-monitor'],
    }),
    bs('[S Daiki] [M never] [V missed] [O a Saturday] [M {前| after that}].', {
      chunks: [
        ['Daiki never missed a Saturday', 'ダイキは土曜日を一度も休みませんでした'],
        ['after that.', 'それから'],
      ],
      notes: {
        'Daiki never missed a Saturday': '人と話すのが苦手だったのに毎週通った、と食い違うように見えたら、前の文の出来事を読み直します。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[S He] [M still] [V feels] [C nervous] [M {副詞節:時| [接 when] [S he] [V meets] [O new people]}], [接 but] [S he] [V has learned] [O {that節| [接 that] [S {動名詞| [V helping] [O others]}] [V can make] [O him] [C happy], [M too]}].', {
      chunks: [
        ['He still feels nervous', 'ダイキは今でも緊張します'],
        ['when he meets new people,', '初めての人に会うときは'],
        ['but he has learned', 'しかし学びました'],
        ['that helping others', '人を助けることが'],
        ['can make him happy, too.', '自分も幸せにしてくれるということを'],
      ],
      rules: ['repair-monitor'],
    }),
    bs('[M Now] [S he] [V wants] [O {to:名詞| [V to become] [C a social worker] [M {前| in the future}] [接 and] [V support] [O people] [M {前| in his community}]}].', {
      chunks: [
        ['Now he wants to become', '今ダイキはなりたいと思っています'],
        ['a social worker in the future', '将来ソーシャルワーカーに'],
        ['and support people', 'そして人々を支えたいと'],
        ['in his community.', '地域の'],
      ],
    }),
    bs('[M {前| Thanks to young people {前| like him}}], [S the cafe] [V has become] [C a valuable place {前| for elderly people {関係>elderly people| [S who] [V used to feel] [C isolated]}}].', {
      chunks: [
        ['Thanks to young people like him,', 'ダイキのような若者のおかげで'],
        ['the cafe has become', 'カフェはなりました'],
        ['a valuable place', '大切な場所に'],
        ['for elderly people', 'お年寄りにとって'],
        ['who used to feel isolated.', '以前は孤独を感じていた'],
      ],
    }),
    bs('[S Some {前| of his classmates}] [V have] [M also] [V started] [O {to:名詞| [V to participate]}], [接 and] [S their faces] [V have become] [C familiar {前| to the visitors}].', {
      chunks: [
        ['Some of his classmates', 'クラスメートの何人かも'],
        ['have also started to participate,', '参加し始めました'],
        ['and their faces have become familiar', 'そしてその顔はなじみのあるものになりました'],
        ['to the visitors.', '客にとって'],
      ],
    }),
    bs(`[S {動名詞| [V Helping] [M {前| at the cafe}]}] [V is] [M now] [C part {前| of Daiki's weekly routine}], [接 and] [S it] [V has given] [O1 him] [O2 confidence].`, {
      chunks: [
        ['Helping at the cafe is now part', 'カフェの手伝いは今では一部です'],
        ["of Daiki's weekly routine,", 'ダイキの毎週の習慣の'],
        ['and it has given him confidence.', 'そして彼に自信をあたえています'],
      ],
    }),
    bs('[S Daiki] [M now] [V encourages] [O other teenagers] [C {to:補語| [V to volunteer] [M as well]}].', {
      chunks: [
        ['Daiki now encourages other teenagers', 'ダイキは今、ほかの10代の若者にすすめています'],
        ['to volunteer as well.', 'ボランティアをするようにも'],
      ],
    }),
  ]),
})
