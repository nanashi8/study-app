import { st } from './entry.js'

// 語彙強化ロングリーディング（約4,000語）の構造台帳。節ごとに手で確かめて足していく。
// いまは「翌年より先を考える」から「結果を左右する条件」まで（#1〜#80）。
// 残りの文は、台帳ができるまで解析器の表示のまま。
export default Object.freeze([
  st('[S A city] [V is] [M {前| above all}] [C a machine {前| for {動名詞| [V moving] [O costs and benefits] [M {前| across time}]}}], [M {副詞節:譲歩| [接 although] [S it] [V is] [M very rarely] [V described] [M {前| in quite those terms}]}].', {
    chunks: [
      ['A city is above all a machine', '都市は何よりもまず装置です（どんな装置かは次へ）'],
      ['for moving costs and benefits', '費用と利益を移すための'],
      ['across time', '時間を越えて'],
      ['although it is very rarely described', 'ただし、そう説明されることはめったにありません'],
      ['in quite those terms', 'まさにそういう言葉では'],
    ],
    notes: {
      'A city is above all a machine': 'above all は「何よりも」。a machine が is の補語Cです。',
      'for moving costs and benefits': 'for の後ろは動名詞 moving で、「〜を移すための」と直前の machine を説明します。',
    },
  }),
  st('[S A road {関係>A road| [S that] [V is built] [M this year]}] [V will be repaired, widened, and eventually replaced] [M {前| by people {関係>people| [S who] [V have not yet been born]}}].', {
    chunks: [
      ['A road', '道路は'],
      ['that is built this year', '今年造られる（道路は）'],
      ['will be repaired, widened,', '修理され、広げられ'],
      ['and eventually replaced', 'そしてやがて造り替えられます'],
      ['by people', '人々によって'],
      ['who have not yet been born', 'まだ生まれていない（人々によって）'],
    ],
    notes: {
      'will be repaired, widened,': 'will be の後ろに repaired・widened・replaced と過去分詞が三つ並び、すべて受け身です。',
      'who have not yet been born': 'have not yet been born は現在完了の受け身で、「まだ生まれていない」。',
    },
  }),
  st('[S A pension {関係>A pension| [S that] [V is promised] [M this year]}] [V will be paid] [M {前| out of the future wages {前| of workers {関係>workers| [S who] [V are] [M still] [M {前| at school}] [M today]}}}].', {
    chunks: [
      ['A pension', '年金は'],
      ['that is promised this year', '今年約束される（年金は）'],
      ['will be paid', '支払われます（何からかは次へ）'],
      ['out of the future wages', '将来の賃金から'],
      ['of workers', '働き手の'],
      ['who are still at school today', '今日まだ学校にいる（働き手の）'],
    ],
    notes: {
      'out of the future wages': 'out of は「〜の中から」。ここは支払いの出どころを表します。',
    },
  }),
  st('[S Every serious argument {前| about the future {前| of a city}}] [V is] [M therefore] [M {前| in the end}] [C an argument {前| about {疑問詞節| [S who] [V pays] [M {前| for it}] [接 and] [M when]}}].', {
    chunks: [
      ['Every serious argument', 'あらゆる真剣な議論は'],
      ['about the future of a city', '都市の将来についての'],
      ['is therefore in the end an argument', 'したがって結局のところ議論です（何についてかは次へ）'],
      ['about who pays for it and when', 'だれがその費用を払うのか、そしていつなのかについての'],
    ],
    notes: {
      'about who pays for it and when': 'and when は and when they pay for it の省略で、when の後ろが省かれています。',
    },
  }),
  st('[S Economists] [M usually] [V handle] [O this problem] [M {前| with a discount rate, {同格>a discount rate| a single number {関係>a single number| [S that] [V states] [O {疑問詞節| [C how much] [S a future benefit] [V is worth] [M today]}]}}}].', {
    chunks: [
      ['Economists usually handle this problem', '経済学者はふつうこの問題を扱います（何でかは次へ）'],
      ['with a discount rate,', '割引率で'],
      ['a single number that states', 'それは〜を述べる一つの数値です（何をかは次へ）'],
      ['how much a future benefit is worth today', '将来の利益が今日どれほどの価値かを'],
    ],
    notes: {
      'a single number that states': 'a single number は a discount rate を言いかえた同格の名詞句です。',
      'how much a future benefit is worth today': 'how much ＋ 主語 ＋ is worth で「〜がどれほどの価値か」。',
    },
  }),
  st('[S A high rate] [V treats] [O the distant future] [C {前| as almost worth nothing}], [M {副詞節:対比| [接 while] [S a low rate] [V treats] [O that same future] [C {前| as very nearly present indeed}]}].', {
    chunks: [
      ['A high rate treats the distant future', '高い率は遠い未来を扱います（どう扱うかは次へ）'],
      ['as almost worth nothing', 'ほとんど価値のないものとして'],
      ['while a low rate treats that same future', '一方で低い率は同じ未来を扱います'],
      ['as very nearly present indeed', '実にほぼ現在と変わらないものとして'],
    ],
    notes: {
      'as almost worth nothing': 'treat A as B で「AをBとして扱う」。as の後ろが B にあたります。',
    },
  }),
  st('[S The choice {前| of that single number}] [M therefore] [V settles] [O the answer] [M long] [M {副詞節:時| [接 before] [S any piece {前| of evidence}] [V has actually been examined]}].', {
    chunks: [
      ['The choice of that single number', 'その一つの数値の選び方が'],
      ['therefore settles the answer', 'したがって答えを決めてしまいます'],
      ['long before any piece of evidence', 'どの証拠も〜するずっと前に'],
      ['has actually been examined', '実際に調べられる（ずっと前に）'],
    ],
    notes: {
      'long before any piece of evidence': 'long は before の節を強めて「ずっと前に」。any piece of evidence は「どの証拠も」。',
    },
  }),
  st('[S Honest analysis] [V states] [O the rate] [M openly] [M {前| at the very start}] [接 and] [M then] [V reports] [O {疑問詞節| [M how far] [S the conclusion] [V moves] [M {副詞節:時| [接 when] [S that rate] [V is changed]}]}].', {
    chunks: [
      ['Honest analysis states the rate openly', '誠実な分析はその率を率直に述べます'],
      ['at the very start', 'まさに初めに'],
      ['and then reports', 'そしてそのあと示します（何をかは次へ）'],
      ['how far the conclusion moves', '結論がどこまで動くかを'],
      ['when that rate is changed', 'その率を変えたとき'],
    ],
    notes: {
      'and then reports': 'and は states と reports をつなぎ、どちらも主語 Honest analysis の動詞です。',
    },
  }),
  st('[S The terms {関係>The terms| [O that] [S politicians] [V serve]}] [V are] [C very much shorter] [M {前| than the objects {関係>the objects| [O that] [S politics] [V builds] [接 and] [M then] [V maintains]}}].', {
    chunks: [
      ['The terms that politicians serve', '政治家が務める任期は'],
      ['are very much shorter', 'はるかに短いのです（何よりかは次へ）'],
      ['than the objects that politics builds', '政治が造る物よりも'],
      ['and then maintains', 'そしてそのあと維持する（物よりも）'],
    ],
    notes: {
      'The terms that politicians serve': 'ここの term は「任期」。serve a term で「任期を務める」。',
    },
  }),
  st('[S A mayor] [V is elected] [M {前| for four years}], [M {副詞節:対比| [接 while] [S the bridge {関係>the bridge| [O that] [S the same mayor] [V opens]}] [V is expected] [C {to:補語| [V to stand] [M {前| for a hundred}]}]}].', {
    chunks: [
      ['A mayor is elected for four years,', '市長は四年の任期で選ばれます'],
      ['while the bridge', '一方でその橋は'],
      ['that the same mayor opens', 'その同じ市長が開通させる（橋は）'],
      ['is expected to stand for a hundred', '百年立ち続けることが期待されます'],
    ],
    notes: {
      'is expected to stand for a hundred': 'for a hundred は for a hundred years のことで、years が省かれています。',
    },
  }),
  st('[S That gap] [M quietly] [V rewards] [O those decisions {関係>those decisions| [S whose benefits] [V appear] [M {前| at once}]} and {関係>those decisions| [S whose costs] [V appear] [M only] [M {副詞節:時| [接 after] [S the next election] [V has passed]}]}].', {
    chunks: [
      ['That gap quietly rewards those decisions', 'その隔たりは静かにそうした決定に報います'],
      ['whose benefits appear at once', 'その決定の利益はすぐに現れ'],
      ['and whose costs appear only', 'そして費用が現れるのはようやく（いつかは次へ）'],
      ['after the next election has passed', '次の選挙が過ぎたあとです'],
    ],
    notes: {
      'whose benefits appear at once': 'whose は所有格の関係代名詞で、whose benefits は「その決定の利益」。',
    },
  }),
  st('[S No individual] [V has to behave] [M badly] [M {前| at all}] [M {前:意味上の主語| for that pattern} {to:副詞(目的)| [V to repeat] [O itself] [M {前| in one city {前| after another}}] [M {前| for decades}]}].', {
    chunks: [
      ['No individual has to behave badly at all', 'だれ一人、悪くふるまう必要はありません'],
      ['for that pattern to repeat itself', 'その型が繰り返されるのに'],
      ['in one city after another', '次々と都市で'],
      ['for decades', '何十年も'],
    ],
    notes: {
      'for that pattern to repeat itself': 'for that pattern は to repeat の意味上の主語で、「その型が繰り返される」という関係です。',
    },
  }),
  st('[S Households] [V face] [O exactly the same problem] [M {前| on a much smaller scale}], [接 and] [S they] [M generally] [V solve] [O it] [M rather badly].', {
    chunks: [
      ['Households face exactly the same problem', '家庭もまったく同じ問題を抱えます'],
      ['on a much smaller scale,', 'はるかに小さな規模で'],
      ['and they generally solve it rather badly', 'そしてたいていかなり下手に解決します'],
    ],
    notes: {
      'on a much smaller scale,': 'on a … scale で「〜の規模で」。much は smaller を強めます。',
    },
  }),
  st('[S People] [V save] [O less] [M {副詞節:比較| [接 than] [S they] [V intend] [O {to:名詞| [V to save]}]}], [V buy] [O insurance] [M later] [M {副詞節:比較| [接 than] [S they] [V should]}], [接 and] [V repair] [O a thing] [M only] [M {副詞節:時| [接 after] [S it] [V has already failed]}].', {
    chunks: [
      ['People save less', '人が貯める額は少なく（何より少ないかは次へ）'],
      ['than they intend to save,', '自分で貯めようと思う額よりも'],
      ['buy insurance later', '保険に入るのは遅く'],
      ['than they should,', '入るべきときよりも'],
      ['and repair a thing only', 'そして物を直すのはようやく（いつかは次へ）'],
      ['after it has already failed', 'それがもう壊れてからです'],
    ],
    notes: {
      'than they should,': 'than they should は than they should buy insurance のことで、後ろが省かれています。',
    },
  }),
  st('[S Public bodies] [V repeat] [O all {前| of these habits}] [M quite faithfully], [M {前| for the simple reason {同格that>the simple reason| [接 that] [S they] [V are made] [M {前| of the very same people}]}}].', {
    chunks: [
      ['Public bodies repeat all of these habits', '公的機関はこうした習慣をどれも繰り返します'],
      ['quite faithfully,', 'かなり忠実に'],
      ['for the simple reason that', '〜という単純な理由からです（内容は次へ）'],
      ['they are made of the very same people', '公的機関が同じ人々でできているという'],
    ],
    notes: {
      'they are made of the very same people': 'be made of は「〜でできている」。the very same people は「まったく同じ人々」。',
    },
  }),
  st('[S {動名詞| [V Recognizing] [O the pattern]}] [V is] [C far more useful] [M {前| than {動名詞| [V blaming] [O the particular individuals {関係>the particular individuals| [S who] [V happen] [C {to:補語| [V to hold] [O public office] [M {前| at the time}]}]}]}}].', {
    chunks: [
      ['Recognizing the pattern', 'この型に気づくほうが'],
      ['is far more useful', 'はるかに役に立ちます（何よりかは次へ）'],
      ['than blaming the particular individuals', '特定の個人を責めるよりも'],
      ['who happen to hold public office', 'たまたま公職に就いている（個人を）'],
      ['at the time', 'そのときに'],
    ],
    notes: {
      'who happen to hold public office': 'happen to ＋ 動詞の原形 で「たまたま〜する」。',
    },
  }),
  st('[S A generation] [V is] [C a useful unit {前| of planning}] [M precisely] [M {副詞節:理由| [接 because] [S it] [V is] [C longer] [M {副詞節:比較| [接 than] [S any single working career] [V can ever be]}]}].', {
    chunks: [
      ['A generation is a useful unit of planning', '世代は計画の単位として役に立ちます'],
      ['precisely because it is longer', 'まさにそれが長いからです（何よりかは次へ）'],
      ['than any single working career can ever be', 'どんな一つの職業人生よりも'],
    ],
    notes: {
      'precisely because it is longer': 'precisely は because の節を強めて「まさに〜だから」。',
    },
  }),
  st('[S Decisions {前| about land, water, pensions, and public buildings}] [M all] [V outlast] [M {前| by many years}] [O the people {関係>the people| [S who] [M first] [V make] [接 and] [V approve] [O them]}].', {
    chunks: [
      ['Decisions about land, water, pensions,', '土地・水・年金についての決定は'],
      ['and public buildings all outlast', 'そして公共建築についての決定も、みな長く残ります'],
      ['by many years', '何年も長く'],
      ['the people who first make and approve them', 'それを最初に決めて承認する人々よりも'],
    ],
    notes: {
      'and public buildings all outlast': 'all は主語 Decisions を受けて「どれも」。outlast は「〜より長く残る」。',
    },
  }),
  st('[S A city {関係>A city| [S that] [V plans] [M {前| in generations}]}] [V does not] [M thereby] [V become] [C any wiser], [接 but] [S it] [V does become] [C considerably harder {to:副詞(形容詞)| [V to surprise]}].', {
    chunks: [
      ['A city that plans in generations', '世代単位で計画する都市が'],
      ['does not thereby become any wiser,', 'それで賢くなるわけではありません'],
      ['but it does become considerably harder', 'しかしかなり難しくはなります（何がかは次へ）'],
      ['to surprise', '驚かせることが'],
    ],
    notes: {
      'but it does become considerably harder': 'does become の does は become を強める助動詞で、「確かに〜なる」。',
    },
  }),
  st('[S The nine sections {関係>The nine sections| [S that] [V follow]}] [V examine] [O {疑問詞節| [M how] [S that longer view] [V changes] [O ordinary decisions] [M {前| across nine different fields {前| of public life}}]}].', {
    chunks: [
      ['The nine sections that follow examine', 'これから続く九つの節が調べます（何をかは次へ）'],
      ['how that longer view changes ordinary decisions', 'その長い視野が日常の決定をどう変えるかを'],
      ['across nine different fields of public life', '公共生活の九つの分野で'],
    ],
    notes: {
      'The nine sections that follow examine': 'that follow は「あとに続く」で、The nine sections を後ろから説明します。',
    },
  }),
  st('[S Public argument] [V is shaped] [M {前| by the direction {前| of public attention}}] [M long] [M {副詞節:時| [接 before] [S it] [V is shaped] [M {前| by any piece {前| of evidence}}]}].', {
    chunks: [
      ['Public argument is shaped', '公の議論は形づくられます（何によってかは次へ）'],
      ['by the direction of public attention', '公衆の注意の向きによって'],
      ['long before it is shaped', 'それが形づくられるずっと前に'],
      ['by any piece of evidence', 'どんな証拠によってよりも'],
    ],
    notes: {
      'long before it is shaped': 'long は before の節を強めて「ずっと前に」。',
    },
  }),
  st('[S A problem {関係>A problem| [O that] [S nobody {前| at all}] [V has noticed]}] [V cannot be solved], [M {副詞節:譲歩| [C however serious] [S that problem] [V may] [M later] [V turn out] [C {to:補語| [V to be]}]}].', {
    chunks: [
      ['A problem', '問題は'],
      ['that nobody at all has noticed', 'だれ一人気づいていない（問題は）'],
      ['cannot be solved,', '解決できません'],
      ['however serious', 'どれほど深刻だと'],
      ['that problem may later turn out to be', 'その問題がのちに分かろうとも'],
    ],
    notes: {
      'that nobody at all has noticed': 'nobody at all は「だれ一人〜ない」。at all は nobody を強めます。',
      'however serious': 'however ＋ 形容詞 で「どれほど〜でも」。文の後ろに譲歩のまとまりを作ります。',
    },
  }),
  st('[S A problem {関係>A problem| [O that] [S everybody] [V has noticed]}] [V will be answered] [M somehow], [M even] [M {前| in cases {関係>cases| [M where] [S it] [V is] [C comparatively small and easy {to:副詞(形容詞)| [V to bear]}]}}].', {
    chunks: [
      ['A problem', '問題は'],
      ['that everybody has noticed', 'だれもが気づいている（問題は）'],
      ['will be answered somehow,', '何らかの形で対処されます'],
      ['even in cases', '場合でさえ（どんな場合かは次へ）'],
      ['where it is comparatively small', 'それが比較的小さく'],
      ['and easy to bear', '耐えやすい（場合でさえ）'],
    ],
    notes: {
      'and easy to bear': 'easy to bear は「耐えやすい」。to bear が easy の内容を後ろから限定します。',
    },
  }),
  st('[S The order {関係>The order| [M in which] [S problems] [V arrive] [M {前| on a public agenda}]}] [V is] [M therefore] [M itself] [C an important political outcome {前| in its own right}] [M as well].', {
    chunks: [
      ['The order in which problems arrive', '問題が上ってくる順序は'],
      ['on a public agenda', '公の議題に'],
      ['is therefore itself an important political outcome', 'したがってそれ自体が重要な政治的結果です'],
      ['in its own right as well', 'それだけで見ても'],
    ],
    notes: {
      'The order in which problems arrive': 'in which は前置詞＋関係代名詞で、in the order（その順序で）の意味です。',
    },
  }),
  st('[S Fear] [V responds] [M {前| to vivid images}] [M far more readily] [M {副詞節:比較| [接 than] [S it] [V responds] [M {前| to rates}]}], [M {関係,>前の内容| [S which] [V is] [C {疑問詞節| [M why] [S rare events] [V dominate] [O discussion]}]}].', {
    chunks: [
      ['Fear responds to vivid images', '恐れは生々しい映像に反応します'],
      ['far more readily than it responds to rates', '割合に反応するよりはるかにたやすく'],
      ['which is why rare events dominate discussion', 'そのためまれな出来事が議論を占めます'],
    ],
    notes: {
      'which is why rare events dominate discussion': 'which は前の節の内容を受け、which is why … で「そのため〜」となります。',
    },
  }),
  st('[S A single dramatic accident] [V will change] [O more behavior] [M {前| in one month}] [M {前| than a whole decade {前| of quiet and careful figures}}].', {
    chunks: [
      ['A single dramatic accident will change', '一件の劇的な事故が変えます（何をかは次へ）'],
      ['more behavior in one month', '一か月でより多くの行動を'],
      ['than a whole decade', '十年分よりも'],
      ['of quiet and careful figures', '静かで丁寧な数値の'],
    ],
    notes: {
      'than a whole decade': 'than の後ろは比べる相手で、a whole decade of … figures と続きます。',
    },
  }),
  st('[S This] [V is not] [C simple stupidity], [M {副詞節:理由| [接 because] [S a single vivid case] [M really] [V does carry] [O information {関係>information| [O that] [S a long table {前| of numbers}] [V hides]}]}].', {
    chunks: [
      ['This is not simple stupidity,', 'これは単なる愚かさではありません'],
      ['because a single vivid case really does carry', 'なぜなら生々しい一つの事例が実際に運ぶからです'],
      ['information that a long table of numbers hides', '数字の長い表が隠す情報を'],
    ],
    notes: {
      'because a single vivid case really does carry': 'does carry の does は carry を強める助動詞で、「実際に運ぶ」。',
    },
  }),
  st('[S The error] [V appears] [M only] [M {前| at the moment {関係>the moment| [M when] [S that one vivid case] [V is treated] [M {副詞節:様態| [接 as though] [S it] [V were] [C entirely typical]}]}}].', {
    chunks: [
      ['The error appears only at the moment', '誤りが現れるのはその瞬間だけです'],
      ['when that one vivid case is treated', 'その生々しい一つの事例が扱われるとき'],
      ['as though it were entirely typical', 'まるでまったく典型であるかのように'],
    ],
    notes: {
      'as though it were entirely typical': 'as though ＋ 過去形 で、事実ではないことを「まるで〜かのように」と表します。',
    },
  }),
  st('[S Hope] [V is] [C quite as powerful] [M {副詞節:比較| [接 as] [S fear] [V is]}], [接 and] [S it] [V distorts] [O public planning] [M {前| in precisely the opposite direction {前| from fear}}].', {
    chunks: [
      ['Hope is quite as powerful as fear is,', '希望は恐れとまったく同じくらい強く'],
      ['and it distorts public planning', 'そして公共の計画をゆがめます'],
      ['in precisely the opposite direction from fear', '恐れとちょうど反対の向きに'],
    ],
    notes: {
      'Hope is quite as powerful as fear is,': 'as ＋ 形容詞 ＋ as … で「…と同じくらい〜」。',
    },
  }),
  st('[S Optimism {前| about a promising new technology}] [M regularly] [V produces] [O schedules {関係>schedules| [O that] [S nobody {過去分詞>nobody| [V involved] [M {前| in it}]}] [V could ever keep]}].', {
    chunks: [
      ['Optimism about a promising new technology', '有望な新技術への楽観は'],
      ['regularly produces schedules', '繰り返し工程表を生みます（どんな工程表かは次へ）'],
      ['that nobody involved in it could ever keep', 'それに関わるだれにも守れない（工程表を）'],
    ],
    notes: {
      'that nobody involved in it could ever keep': 'involved in it は nobody を後ろから説明して「それに関わるだれも」。',
    },
  }),
  st('[S That very same optimism] [M also] [V produces] [O the sustained effort {関係>the sustained effort| [S that] [M occasionally] [V makes] [O a genuinely difficult project] [C {原形| [V succeed]}]}].', {
    chunks: [
      ['That very same optimism also produces', 'そのまったく同じ楽観がまた生みます（何をかは次へ）'],
      ['the sustained effort', '持続的な努力を'],
      ['that occasionally makes a genuinely difficult project', 'ときに、本当に難しい事業を'],
      ['succeed', '成功させる（努力を）'],
    ],
    notes: {
      'succeed': 'make ＋ 目的語 ＋ 動詞の原形 で「〜に…させる」。succeed は to のない不定詞です。',
    },
  }),
  st('[S {動名詞| [V Removing] [O it] [M entirely]}] [V would leave] [O a city] [C perfectly accurate {前| about the present} and quite incapable {前| of {動名詞| [V building] [O anything] [M {前| at all}]}}].', {
    chunks: [
      ['Removing it entirely would leave a city', 'それを完全に取り除けば、都市は〜のままになるでしょう'],
      ['perfectly accurate about the present', '現在については完璧に正確で'],
      ['and quite incapable of building anything at all', 'しかも何一つ造れない（ままに）'],
    ],
    notes: {
      'Removing it entirely would leave a city': 'leave ＋ 目的語 ＋ 形容詞 で「〜を…のままにする」。',
    },
  }),
  st('[S Habits] [V perform] [O far more {前| of the work {前| of ordinary daily life}}] [M {副詞節:比較| [接 than] [S deliberate choices] [M ever] [V manage] [O {to:名詞| [V to perform]}]}].', {
    chunks: [
      ['Habits perform far more of the work', '習慣がはるかに多くの仕事を果たします'],
      ['of ordinary daily life', 'ふだんの日々の生活の'],
      ['than deliberate choices ever manage to perform', '意識的な選択が果たすよりも'],
    ],
    notes: {
      'than deliberate choices ever manage to perform': 'manage to ＋ 動詞 で「どうにか〜する」。ever は than の節の中で「これまでに」。',
    },
  }),
  st('[S A resident {関係>A resident| [S who] [V has to think] [M carefully] [M {前| about recycling}] [M every single week]}] [V will] [M {前| in the end}] [V stop] [O {動名詞| [V doing] [O it] [M completely]}].', {
    chunks: [
      ['A resident who has to think carefully', 'きちんと考えなければならない住民は'],
      ['about recycling every single week', '毎週リサイクルについて'],
      ['will in the end stop doing it completely', '最後にはすっかりやめてしまうでしょう'],
    ],
    notes: {
      'will in the end stop doing it completely': 'stop ＋ -ing で「〜するのをやめる」。doing it は stop の目的語です。',
    },
  }),
  st('[S A system {関係>A system| [S that] [V makes] [O the desired action] [C the easiest available action]}] [V will survive] [O every change {前| in public enthusiasm}].', {
    chunks: [
      ['A system that makes the desired action', '望ましい行動を〜にする仕組みは'],
      ['the easiest available action', '選べる中で最も簡単な行動に'],
      ['will survive every change in public enthusiasm', '世論の熱意のどんな変化も生き延びます'],
    ],
    notes: {
      'the easiest available action': 'make ＋ 目的語 ＋ 名詞 で「〜を…にする」。available は「選べる・利用できる」。',
    },
  }),
  st('[S Design] [M therefore] [V matters] [M far more] [M {前| than persuasion}] [M {前| for anything {前| at all} {関係>anything| [S that] [V has to continue] [M {前| for several decades}]}}].', {
    chunks: [
      ['Design therefore matters far more', 'したがって設計のほうがはるかに重要です'],
      ['than persuasion', '説得よりも'],
      ['for anything at all', 'どんなものについても'],
      ['that has to continue for several decades', '数十年続けなければならない（ものについては）'],
    ],
    notes: {
      'for anything at all': 'at all は anything を強めて「どんなものでも」。',
    },
  }),
  st('[S Trust] [V behaves] [M much more] [M {前| like a stock {関係>a stock| [S that] [V is slowly accumulated]}}] [M than {前| like a flow {関係>a flow| [S that] [V arrives] [M each year]}}].', {
    chunks: [
      ['Trust behaves much more like a stock', '信頼は蓄えのようにふるまいます'],
      ['that is slowly accumulated', 'ゆっくり積み上げられる（蓄えの）'],
      ['than like a flow that arrives each year', '毎年届く流れというよりも'],
    ],
    notes: {
      'Trust behaves much more like a stock': 'behave like … で「…のようにふるまう」。stock は「蓄え」、flow は「流れ」。',
    },
  }),
  st('[S It] [V builds up] [M slowly] [M {前| through a long series {前| of small promises {関係>small promises| [S that] [V are kept]}}}] [接 and] [V falls] [M very quickly] [M {副詞節:時| [接 when] [S one large promise] [V fails]}].', {
    chunks: [
      ['It builds up slowly', 'それはゆっくり積み上がります（何を通してかは次へ）'],
      ['through a long series of small promises', '小さな約束の長い連なりを通じて'],
      ['that are kept', '守られた（約束の）'],
      ['and falls very quickly', 'そして非常に速く落ちます'],
      ['when one large promise fails', '大きな約束が一つ破られたとき'],
    ],
    notes: {
      'and falls very quickly': 'and は builds up と falls をつなぎ、どちらも主語 It の動詞です。',
    },
  }),
  st('[S A city {前| with a deep reserve {前| of public trust}}] [V can attempt] [O reforms {関係>reforms| [O that] [S a more suspicious city] [M simply] [V cannot attempt] [M {前| at all}]}].', {
    chunks: [
      ['A city with a deep reserve of public trust', '公共の信頼の蓄えが厚い都市は'],
      ['can attempt reforms', '改革を試みることができます（どんな改革かは次へ）'],
      ['that a more suspicious city', 'もっと疑い深い都市には'],
      ['simply cannot attempt at all', 'とうてい試みられない（改革を）'],
    ],
    notes: {
      'simply cannot attempt at all': 'simply は否定を強めて「まったく〜ない」。at all も否定を強めます。',
    },
  }),
  st('[S {動名詞| [V Spending] [O that reserve] [M {前| on a project {関係>a project| [S that] [M then] [V fails]}}]}] [V is] [M therefore] [C much more expensive] [M {前| than the failed project itself}].', {
    chunks: [
      ['Spending that reserve on a project', 'その蓄えを事業に使うことは'],
      ['that then fails', 'そのあと失敗する（事業に）'],
      ['is therefore much more expensive', 'したがってずっと高くつきます'],
      ['than the failed project itself', 'その失敗した事業そのものよりも'],
    ],
    notes: {
      'Spending that reserve on a project': '動名詞 Spending … が文の主語Sです。',
    },
  }),
  st('[S Work] [V is] [C the place {関係>the place| [M where] [S most people] [M actually] [V meet] [O the economy]}], [接 and] [S it] [V is] [M also] [C {疑問詞節| [M where] [S most public policy] [M finally] [V lands]}].', {
    chunks: [
      ['Work is the place', '仕事こそが場所です（どんな場所かは次へ）'],
      ['where most people actually meet the economy,', '大半の人が実際に経済に出会う'],
      ['and it is also where', 'そしてそこはまた〜場所でもあります'],
      ['most public policy finally lands', '公共政策が最後に着地する'],
    ],
    notes: {
      'and it is also where': 'ここの where は「〜する場所」という意味のまとまりを作り、is の補語Cになります。',
    },
  }),
  st('[S A rule {前| about wages, working hours, or safety}] [V reaches] [O a household] [M only] [M {前| through the one particular job {関係>the one particular job| [O that] [S one member {前| of it}] [V does]}}].', {
    chunks: [
      ['A rule about wages, working hours, or safety', '賃金や労働時間や安全についての規則は'],
      ['reaches a household only', '家庭に届くのは〜を通してだけです'],
      ['through the one particular job', 'その一つの特定の仕事を通して'],
      ['that one member of it does', '家族の一人が就いている（仕事を）'],
    ],
    notes: {
      'that one member of it does': 'that は the one particular job を受ける関係代名詞で、does の目的語にあたります。',
    },
  }),
  st('[S {動名詞| [V Changing] [O that rule]}] [M therefore] [V changes] [O different households] [M {前| in ways {関係>ways| [O that] [S no average figure] [V is able to show] [M {前| at all}]}}].', {
    chunks: [
      ['Changing that rule therefore changes', 'その規則を変えることは、したがって変えます（何をかは次へ）'],
      ['different households in ways', '家庭ごとに違う形で（どんな形かは次へ）'],
      ['that no average figure', 'どんな平均値にも'],
      ['is able to show at all', 'まったく示せない（形で）'],
    ],
    notes: {
      'is able to show at all': 'be able to ＋ 動詞 で「〜できる」。at all は否定を強めます。',
    },
  }),
  st('[S Any honest account {前| of a labor reform}] [M therefore] [V has to name] [O {疑問詞節| [S who] [V gains] [M {前| from it}]} and {疑問詞節| [S who] [V loses] [M {前| by it}]}].', {
    chunks: [
      ['Any honest account of a labor reform', '労働改革のどんな誠実な説明も'],
      ['therefore has to name', 'したがって名指しする必要があります（何をかは次へ）'],
      ['who gains from it', 'だれがそれで得をするのか'],
      ['and who loses by it', 'そしてだれがそれで損をするのかを'],
    ],
    notes: {
      'who gains from it': 'この who は疑問詞で、「だれが得をするのか」という間接疑問を作ります。',
    },
  }),
  st('[S A skill] [V is not] [M {前| at all}] [C the same thing {前| as a certificate}], [M {副詞節:理由| [接 because] [S it] [V is] [C a set {前| of judgments {関係>judgments| [S that] [V are built] [M {前| by long repetition}]}}]}].', {
    chunks: [
      ['A skill is not at all the same thing', '技能はまったく同じものではありません'],
      ['as a certificate,', '証書と'],
      ['because it is a set of judgments', 'なぜならそれは一連の判断だからです'],
      ['that are built by long repetition', '長い繰り返しによって築かれる（判断）'],
    ],
    notes: {
      'A skill is not at all the same thing': 'the same A as B で「Bと同じA」。not at all は「まったく〜ない」。',
    },
  }),
  st('[S A worker {関係>A worker| [S who] [V has performed] [O a task] [M {前| for many years}]}] [V can see] [O a problem {関係>a problem| [O that] [S no printed manual] [V has ever been able to describe]}].', {
    chunks: [
      ['A worker who has performed a task', 'その作業をこなしてきた働き手は'],
      ['for many years', '何年も'],
      ['can see a problem', '問題を見て取れます（どんな問題かは次へ）'],
      ['that no printed manual', 'どの印刷された手引書にも'],
      ['has ever been able to describe', 'これまで書き表せたことのない（問題を）'],
    ],
    notes: {
      'has ever been able to describe': 'has been able to は「〜できたことがある」。no ＋ 名詞 と組んで「どれも〜できたことがない」。',
    },
  }),
  st('[S Training programs] [V reproduce] [O the manual] [M fully and consistently], [接 and] [S they] [V reproduce] [O the judgment] [M only] [M {前| with the greatest {前| of difficulty}}].', {
    chunks: [
      ['Training programs reproduce the manual', '研修は手引書を再現します'],
      ['fully and consistently,', '完全に、そして確実に'],
      ['and they reproduce the judgment only', 'そして判断を再現できるのはようやく'],
      ['with the greatest of difficulty', '最大の苦労をしてやっとです'],
    ],
    notes: {
      'with the greatest of difficulty': 'with difficulty で「苦労して」。the greatest of difficulty はその強めた形です。',
    },
  }),
  st('[S That] [V is] [M precisely] [C {疑問詞節| [M why] [S an experienced workforce] [V is] [C a valuable asset {関係>a valuable asset| [O that] [S no line {前| in any public budget}] [M ever] [V records]}]}].', {
    chunks: [
      ['That is precisely why', 'それがまさに理由です（何のかは次へ）'],
      ['an experienced workforce is a valuable asset', '経験を積んだ働き手が貴重な資産である'],
      ['that no line in any public budget', 'どの公共予算のどの項目も'],
      ['ever records', '記録することのない（資産）'],
    ],
    notes: {
      'That is precisely why': 'That is why … で「だからこそ〜」。precisely はそれを強めます。',
    },
  }),
  st('[S Organizations] [V remember] [O {what節| [O what] [S they] [V have learned]}] [M {前| through their formal procedures}] [M {前| rather than {前| through the memories {前| of their staff}}}].', {
    chunks: [
      ['Organizations remember what they have learned', '組織は学んだことを記憶します'],
      ['through their formal procedures', '成文の手順によって'],
      ['rather than through the memories of their staff', '職員の記憶によってではなく'],
    ],
    notes: {
      'Organizations remember what they have learned': 'what は先行詞を含む関係代名詞で、「学んだこと」というまとまりを作ります。',
    },
  }),
  st('[S A form {関係>A form| [S that] [V asks] [O an awkward and apparently useless question]}] [V is] [M very often] [C the trace {前| of an old and extremely expensive mistake}].', {
    chunks: [
      ['A form that asks an awkward', '厄介で〜質問をする書式は'],
      ['and apparently useless question', '一見無用な'],
      ['is very often the trace', 'しばしば痕跡です（何のかは次へ）'],
      ['of an old and extremely expensive mistake', '古く、きわめて高くついた失敗の'],
    ],
    notes: {
      'is very often the trace': 'trace は「痕跡」。ここは「昔の失敗の名残」という意味です。',
    },
  }),
  st('[S {動名詞| [V Removing] [O such questions] [M {to:副詞(目的)| [V in order to save] [O a little time]}]}] [V can] [M quietly] [V bring back] [O the failure {関係省略:目的格(prevent)>the failure| [S they] [V were designed] [C {to:補語| [V to prevent]}]}].', {
    chunks: [
      ['Removing such questions', 'そうした質問を消すことは'],
      ['in order to save a little time', '少し時間を節約するために'],
      ['can quietly bring back the failure', '失敗を静かに呼び戻しかねません'],
      ['they were designed to prevent', 'その質問が防ぐために作られた（失敗を）'],
    ],
    notes: {
      'in order to save a little time': 'in order to ＋ 動詞 で「〜するために」と目的をはっきり示します。',
    },
  }),
  st('[S {動名詞| [V Making] [O a procedure] [C simpler]}] [V is] [C valuable], [接 but] [S it] [V should] [M always] [V begin] [M {前| by {動名詞| [V asking] [O {疑問詞節| [M what] [S each step] [V was originally built] [M for]}]}}].', {
    chunks: [
      ['Making a procedure simpler is valuable,', '手順を簡単にすることには価値があります'],
      ['but it should always begin', 'しかし必ず始めるべきです（何からかは次へ）'],
      ['by asking what each step', '各段階が〜のかを問うことから'],
      ['was originally built for', 'もともと何のために作られた'],
    ],
    notes: {
      'was originally built for': 'what … for で「何のために」。for が文の終わりに残る形です。',
    },
  }),
  st('[S Automation] [V removes] [O particular tasks] [M {前| rather than whole occupations}] [M {前| in almost every single case {関係>every single case| [S that] [V has been carefully recorded]}}].', {
    chunks: [
      ['Automation removes particular tasks', '自動化は特定の作業を取り除きます'],
      ['rather than whole occupations', '職業全体ではなく'],
      ['in almost every single case', 'ほとんどどの場合でも'],
      ['that has been carefully recorded', '丁寧に記録された（場合では）'],
    ],
    notes: {
      'rather than whole occupations': 'rather than … は「…ではなく」。前の particular tasks と比べています。',
    },
  }),
  st('[S A job {関係>A job| [S that] [V is made up] [M {前| of ten separate tasks}]}] [V may lose] [O four {前| of them}] [接 and] [V become] [C a different job {前| with exactly the same title}].', {
    chunks: [
      ['A job that is made up of ten separate tasks', '十の別々の作業からなる仕事は'],
      ['may lose four of them', 'そのうち四つを失い'],
      ['and become a different job', 'そして別の仕事になることがあります'],
      ['with exactly the same title', 'まったく同じ名称の'],
    ],
    notes: {
      'A job that is made up of ten separate tasks': 'be made up of … で「…から成り立っている」。',
    },
  }),
  st('[S The person {現在分詞>The person| [V doing] [O that job]}] [V experiences] [O the change] [M {前| as a demand {前| for new skills}}] [M {前| rather than {前| as the simple loss {前| of employment}}}].', {
    chunks: [
      ['The person doing that job', 'その仕事をしている人は'],
      ['experiences the change', 'その変化を受け取ります（どう受け取るかは次へ）'],
      ['as a demand for new skills', '新しい技能の要求として'],
      ['rather than as the simple loss of employment', '単なる失職としてではなく'],
    ],
    notes: {
      'The person doing that job': 'doing that job は The person を後ろから説明する現在分詞のまとまりです。',
    },
  }),
  st('[S {whether節| [接 Whether] [S that demand] [V is truly answered]}] [V depends] [M entirely] [M {前| on training {関係>training| [S that] [V begins] [M well] [M {副詞節:時| [接 before] [S the change] [V has arrived]}]}}].', {
    chunks: [
      ['Whether that demand is truly answered', 'その要求が本当に満たされるかどうかは'],
      ['depends entirely on training', '訓練にすべてかかっています（どんな訓練かは次へ）'],
      ['that begins well before', 'ずっと前に始まる（訓練に）'],
      ['the change has arrived', 'その変化が到達するより'],
    ],
    notes: {
      'Whether that demand is truly answered': 'whether の節が文の主語Sです。「〜かどうか」というまとまりになります。',
    },
  }),
  st('[S Transitions] [V are] [C {疑問詞節| [M where] [S the whole cost {前| of change}] [V concentrates]}], [接 and] [S they] [V are] [M almost always] [V planned] [M last {前| of all}].', {
    chunks: [
      ['Transitions are where', '移行こそが〜場所です'],
      ['the whole cost of change concentrates,', '変化の費用が丸ごと集まる'],
      ['and they are almost always planned last of all', 'そして、ほとんど常に最後に計画されます'],
    ],
    notes: {
      'Transitions are where': 'ここの where は「〜する場所」という意味のまとまりを作り、are の補語Cになります。',
    },
  }),
  st('[S A city {関係>A city| [S that] [V funds] [O retraining] [M only] [M {副詞節:時| [接 after] [S a large factory] [V has finally closed]}]}] [V has already lost] [O several genuinely useful years].', {
    chunks: [
      ['A city that funds retraining only', '再訓練に資金を出すのがようやく〜の都市は'],
      ['after a large factory has finally closed', '大きな工場がついに閉じたあとになる'],
      ['has already lost several genuinely useful years', 'すでに本当に有用な数年を失っています'],
    ],
    notes: {
      'A city that funds retraining only': 'fund は動詞で「資金を出す」。only は後ろの after の節を限定します。',
    },
  }),
  st('[S The very same money], [M {副詞節:条件| [接 if] [S it] [V is used] [M earlier]}], [V reaches] [O workers] [M {副詞節:時| [接 while] [S they] [M still] [V have] [O savings, contacts, and a measure {前| of confidence}]}].', {
    chunks: [
      ['The very same money,', 'まったく同じ資金も'],
      ['if it is used earlier,', 'もっと早く使われれば'],
      ['reaches workers', '働き手に届きます（いつかは次へ）'],
      ['while they still have savings, contacts,', '彼らにまだ貯えと人脈'],
      ['and a measure of confidence', 'そしていくらかの自信があるうちに'],
    ],
    notes: {
      'and a measure of confidence': 'a measure of … で「いくらかの…」。',
    },
  }),
  st('[S Timing, {前| rather than generosity},] [M therefore] [V decides] [O {疑問詞節| [O how much] [S a transition program {前| of this kind}] [M actually] [V achieves]}].', {
    chunks: [
      ['Timing, rather than generosity,', '気前のよさではなく時期が'],
      ['therefore decides', 'したがって決めます（何をかは次へ）'],
      ['how much a transition program of this kind', 'この種の移行の施策がどれだけ'],
      ['actually achieves', '実際に成し遂げるかを'],
    ],
    notes: {
      'how much a transition program of this kind': 'how much は achieves の目的語で、「どれだけ成し遂げるか」。',
    },
  }),
  st('[S Two people {関係>Two people| [S who] [V make] [O exactly the same decision] [M {前| on the very same day}]}] [V can end up] [M {前| in two very different places}].', {
    chunks: [
      ['Two people who make exactly the same decision', 'まったく同じ決定をする二人が'],
      ['on the very same day', 'まさに同じ日に'],
      ['can end up in two very different places', 'まったく違う二つの場所に行き着くことがあります'],
    ],
    notes: {
      'can end up in two very different places': 'end up in … で「最後には…に行き着く」。',
    },
  }),
  st('[S The difference] [M usually] [V lies] [M {前| in the conditions {関係>the conditions| [S that] [V surround] [O the decision]}}] [M {前| rather than {前| in the quality {前| of the decision itself}}}] [M {前| at all}].', {
    chunks: [
      ['The difference usually lies', 'その違いがあるのはたいてい（どこかは次へ）'],
      ['in the conditions that surround the decision', '決定を取り巻く条件のほうです'],
      ['rather than in the quality', '質のほうではなく'],
      ['of the decision itself at all', 'その決定そのものの'],
    ],
    notes: {
      'The difference usually lies': 'lie in … で「…にある」。違いや原因のありかを示します。',
    },
  }),
  st('[S A single missed payment] [V is] [C a small trouble {前| for one household} and the beginning {前| of a long spiral} {前| for another}].', {
    chunks: [
      ['A single missed payment is a small trouble', '支払いが一度遅れることは小さな面倒です'],
      ['for one household', 'ある家庭にとっては'],
      ['and the beginning of a long spiral', 'そして長い転落の始まりです'],
      ['for another', '別の家庭にとっては'],
    ],
    notes: {
      'and the beginning of a long spiral': 'spiral は「らせん」で、ここでは悪い方向へ回り続ける状態を指します。',
    },
  }),
  st('[S Any policy {関係>Any policy| [S that] [V ignores] [O this asymmetry]}] [V will end] [M {前| by {動名詞| [V describing] [O the second {前| of those households}] [C {前| as {動名詞| [V being] [C simply careless]}}]}}].', {
    chunks: [
      ['Any policy that ignores this asymmetry', 'この非対称を無視する政策は'],
      ['will end by describing', '結局〜と書くことになります（何をかは次へ）'],
      ['the second of those households', 'そうした家庭のうち後者を'],
      ['as being simply careless', '単に不注意なだけだと'],
    ],
    notes: {
      'will end by describing': 'end by ＋ -ing で「結局〜することになる」。',
    },
  }),
  st('[S A margin] [V is] [C the distance {前| between an ordinary setback and a setback {関係>a setback| [S that] [V turns] [M {前| into something genuinely serious}]}}].', {
    chunks: [
      ['A margin is the distance', '余裕とは距離のことです（何の距離かは次へ）'],
      ['between an ordinary setback and a setback', 'ありふれた不調と、もう一つの不調との'],
      ['that turns into something genuinely serious', '本当に深刻な事態に変わる（不調との）'],
    ],
    notes: {
      'that turns into something genuinely serious': 'turn into … で「…に変わる」。',
    },
  }),
  st('[S Savings, family support, and secure housing] [M all] [V widen] [O that distance] [M {前| without {動名詞| [M ever] [V appearing] [M {前| in any published official figure}]}}].', {
    chunks: [
      ['Savings, family support, and secure housing', '貯蓄と家族の支えと安定した住まいは'],
      ['all widen that distance', 'どれもその距離を広げます'],
      ['without ever appearing', '一度も現れることなく（どこにかは次へ）'],
      ['in any published official figure', '公表されるどの公式の数値にも'],
    ],
    notes: {
      'without ever appearing': 'without ＋ -ing で「〜することなく」。ever は「一度も」。',
    },
  }),
  st('[S Two households {前| with identical incomes}] [V can] [M therefore] [V represent] [O entirely different degrees {前| of practical safety and personal freedom}].', {
    chunks: [
      ['Two households with identical incomes', '同じ収入の二つの家庭が'],
      ['can therefore represent entirely different degrees', 'したがってまったく異なる度合いを表しえます'],
      ['of practical safety and personal freedom', '実際の安全と個人の自由の'],
    ],
    notes: {
      'can therefore represent entirely different degrees': 'represent はここでは「（ある状態を）表している」。',
    },
  }),
  st('[S {動名詞| [V Measuring] [O income] [M {前| by itself}]}] [V hides] [O most {前| of {what節| [S what] [M actually] [V determines] [O {疑問詞節| [M how] [S a sudden shock] [V is going to be absorbed]}]}}].', {
    chunks: [
      ['Measuring income by itself hides most', '収入だけを測ることは大半を隠します（何のかは次へ）'],
      ['of what actually determines', '実際に決めているものの'],
      ['how a sudden shock is going to be absorbed', '突然の衝撃がどう吸収されるのかを'],
    ],
    notes: {
      'Measuring income by itself hides most': 'by itself は「それだけで」。動名詞 Measuring … が文の主語Sです。',
    },
  }),
  st('[S Time] [V is] [C the resource {関係>the resource| [O that] [S inequality] [V distributes] [M most unevenly]} and {関係>the resource| [O that] [S public policy] [V notices] [M least often]}].', {
    chunks: [
      ['Time is the resource', '時間は資源です（どんな資源かは次へ）'],
      ['that inequality distributes most unevenly', '不平等が最も不均等に分ける'],
      ['and that public policy notices least often', 'そして政策が最も気づきにくい（資源）'],
    ],
    notes: {
      'and that public policy notices least often': '二つの that はどちらも the resource を受ける関係代名詞です。',
    },
  }),
  st('[S A long journey {前| to work}, an unpredictable shift, and a second job] [M all] [V consume] [O exactly the hours {関係>the hours| [O that] [S any serious planning] [V requires]}].', {
    chunks: [
      ['A long journey to work,', '長い通勤と'],
      ['an unpredictable shift, and a second job', '予測できない勤務と二つ目の仕事は'],
      ['all consume exactly the hours', 'どれもまさにその時間を食いつぶします'],
      ['that any serious planning requires', 'まじめな計画に必要な（時間を）'],
    ],
    notes: {
      'all consume exactly the hours': 'all は主語をまとめて「どれも」。consume は「使い尽くす」。',
    },
  }),
  st('[S Advice {関係>Advice| [S that] [M quietly] [V assumes] [O a free evening {前| at home}]}] [V is] [C entirely useless] [M {前| to the people {関係>the people| [S who] [M most] [V need] [O that advice]}}].', {
    chunks: [
      ['Advice that quietly assumes', '〜を暗に当てにした助言は'],
      ['a free evening at home', '家で空いている夜を'],
      ['is entirely useless to the people', '人々にはまったく役立ちません'],
      ['who most need that advice', 'その助言を最も必要とする（人々には）'],
    ],
    notes: {
      'Advice that quietly assumes': 'assume はここでは「（当然のこととして）前提にする」。',
    },
  }),
  st('[S Public services {過去分詞>Public services| [V designed] [M {前| around the schedules {前| of their own staff}}]}] [V exclude] [O exactly those residents] [M most {前| of all}] [M {前| in practice}].', {
    chunks: [
      ['Public services designed around the schedules', '〜の予定に合わせて作られた行政の窓口は'],
      ['of their own staff', '職員自身の'],
      ['exclude exactly those residents', 'まさにそうした住民を締め出します'],
      ['most of all in practice', '実際には最も強く'],
    ],
    notes: {
      'Public services designed around the schedules': 'designed around … は Public services を後ろから説明する過去分詞のまとまりです。',
    },
  }),
  st('[S Place] [V multiplies] [O every other condition {関係>every other condition| [O that] [S a household] [V faces]}], [M {副詞節:譲歩| [接 whether] [M {前| in a favorable direction}] [接 or] [M {前| in the opposite one}]}].', {
    chunks: [
      ['Place multiplies every other condition', '場所は他のあらゆる条件を何倍にもします'],
      ['that a household faces,', '家庭が直面する（条件を）'],
      ['whether in a favorable direction', 'よい向きであれ'],
      ['or in the opposite one', '反対の向きであれ'],
    ],
    notes: {
      'whether in a favorable direction': 'whether A or B で「AであれBであれ」。ここは主語と be動詞が省かれています。',
    },
  }),
  st('[S A child {現在分詞>A child| [V growing up] [M ten kilometers away] [M {前| from a good school}]}] [M effectively] [V lives] [M {前| in a different city}] [M {前| from a nearer neighbor}].', {
    chunks: [
      ['A child growing up ten kilometers away', '十キロ離れて育つ子どもは'],
      ['from a good school', 'よい学校から'],
      ['effectively lives in a different city', '事実上、別の都市に暮らしています'],
      ['from a nearer neighbor', 'より近い隣人とは'],
    ],
    notes: {
      'effectively lives in a different city': 'effectively はここでは「事実上」。',
    },
  }),
  st('[S Transport policy] [V is] [M therefore] [C education policy] [M as well], [M {副詞節:譲歩| [接 although] [S the two] [V are] [M almost never] [V discussed] [M {前| in the same room}]}].', {
    chunks: [
      ['Transport policy is therefore education policy as well,', 'したがって交通政策は教育政策でもあります'],
      ['although the two are almost never discussed', 'ただし、この二つが論じられることはほとんどありません'],
      ['in the same room', '同じ場で'],
    ],
    notes: {
      'in the same room': 'in the same room は「同じ部屋で」で、ここでは同じ会議の場という意味です。',
    },
  }),
  st('[S {動名詞| [V Moving] [O a single bus route]}] [V can change] [O more outcomes {前| for children}] [M {前| than an entirely new curriculum {前| in the same district}}].', {
    chunks: [
      ['Moving a single bus route', 'バス路線を一本動かすことは'],
      ['can change more outcomes for children', '子どもにとってより多くの結果を変えられます'],
      ['than an entirely new curriculum', 'まったく新しい教育課程よりも'],
      ['in the same district', '同じ地区の'],
    ],
    notes: {
      'Moving a single bus route': '動名詞 Moving … が文の主語Sです。',
    },
  }),
  st('[S None {前| of this argument}] [V removes] [O responsibility] [M {前| from the individual {関係>the individual| [S who] [M finally] [V makes] [O one particular choice]}}].', {
    chunks: [
      ['None of this argument removes responsibility', 'この議論のどれも責任を取り去りません'],
      ['from the individual', '個人から'],
      ['who finally makes one particular choice', '最後に特定の選択をする（個人から）'],
    ],
    notes: {
      'None of this argument removes responsibility': 'none of … は「…のどれも〜ない」。',
    },
  }),
  st('[S {what節| [O What] [S it] [V changes]}] [V is] [C the list {前| of things {関係>things| [O that] [S a fair comparison {前| between two individuals}] [V would have to hold] [C constant]}}].', {
    chunks: [
      ['What it changes is the list of things', 'それが変えるのは事柄の一覧です（どんな事柄かは次へ）'],
      ['that a fair comparison between two individuals', '二人を公平に比べるときに'],
      ['would have to hold constant', 'そろえておかねばならない（事柄の）'],
    ],
    notes: {
      'would have to hold constant': 'hold ＋ 目的語 ＋ constant で「〜を一定に保つ」。ここは that が hold の目的語です。',
    },
  }),
  st('[S A city {関係>A city| [S that] [V improves] [O conditions]}] [V is] [M therefore] [V not excusing] [O anyone], [M {副詞節:理由| [接 because] [S {what節| [O what] [S it] [V is doing]}] [V is] [C {動名詞| [V widening] [O the margin]}]}].', {
    chunks: [
      ['A city that improves conditions', '条件を良くする都市は'],
      ['is therefore not excusing anyone,', 'したがってだれかを免責しているのではありません'],
      ['because what it is doing', 'なぜならしていることは'],
      ['is widening the margin', '余裕を広げることだからです'],
    ],
    notes: {
      'because what it is doing': 'what it is doing は「それがしていること」というまとまりで、because の節の主語です。',
    },
  }),
  st('[S The practical question {前| in every single case}] [V is] [C {疑問詞節| [S which {前| of those conditions}] [V can be changed] [M {前| at a cost {関係>a cost| [S that] [V is] [C worth {動名詞| [V paying]}]}}]}].', {
    chunks: [
      ['The practical question in every single case', 'どの場合でも実際的な問いは'],
      ['is which of those conditions can be changed', 'それらの条件のどれを変えられるか、です'],
      ['at a cost that is worth paying', '払う価値のある費用で'],
    ],
    notes: {
      'at a cost that is worth paying': 'be worth ＋ -ing で「〜する価値がある」。',
    },
  }),
])
