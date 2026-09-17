import { st } from './entry.js'

// 語彙強化ロングリーディング（約4,000語）の構造台帳。節ごとに手で確かめて足していく。
// いまは「翌年より先を考える」から「制度と公共の信頼」まで（#1〜#120）。
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
  st('[S A price] [V is] [C a message {前| about scarcity}], [接 and] [S it] [V is] [M {前| at the very same time}] [C a bill {関係>a bill| [O that] [S some particular household] [V has to pay]}].', {
    chunks: [
      ['A price is a message about scarcity,', '価格は希少さについての伝言です'],
      ['and it is at the very same time a bill', 'そして同時に請求書でもあります'],
      ['that some particular household has to pay', 'どこかの家庭が払わねばならない（請求書）'],
    ],
    notes: {
      'A price is a message about scarcity,': 'scarcity は「足りないこと・希少さ」。',
    },
  }),
  st('[S {動名詞| [V Raising] [O a price]}] [V reduces] [O demand] [M very efficiently indeed], [接 and] [S it] [V reduces] [O that demand] [M most sharply] [M {前| among those {前| with the least money}}].', {
    chunks: [
      ['Raising a price reduces demand', '価格を上げれば需要は減ります'],
      ['very efficiently indeed,', '実にきわめて効率よく'],
      ['and it reduces that demand most sharply', 'そして最も鋭く減らします'],
      ['among those with the least money', 'お金の最も少ない人たちのあいだで'],
    ],
    notes: {
      'among those with the least money': 'those は「人々」。with the least money が後ろから説明しています。',
    },
  }),
  st('[S Both {前| of those statements}] [V are] [C entirely true], [接 and] [S any policy {関係>any policy| [S that] [V admits] [O only one {前| of them}]}] [V will] [M sooner or later] [V be resisted].', {
    chunks: [
      ['Both of those statements are entirely true,', 'その二つの言明はどちらもまったく正しいのです'],
      ['and any policy that admits only one of them', 'そして一方しか認めない政策は'],
      ['will sooner or later be resisted', '遅かれ早かれ抵抗を受けます'],
    ],
    notes: {
      'will sooner or later be resisted': 'sooner or later で「遅かれ早かれ」。be resisted は受け身です。',
    },
  }),
  st('[S {動名詞| [V Pairing] [O a price signal] [M {前| with a direct payment}]}] [V is] [M usually] [C the cheapest available way {to:形容詞>the cheapest available way| [V to keep] [O both effects] [M {前| at once}]}].', {
    chunks: [
      ['Pairing a price signal with a direct payment', '価格の合図に直接の給付を組み合わせることが'],
      ['is usually the cheapest available way', 'たいてい最も安上がりな方法です'],
      ['to keep both effects at once', '両方の効果を同時に保つ（方法）'],
    ],
    notes: {
      'Pairing a price signal with a direct payment': 'pair A with B で「AをBと組み合わせる」。',
    },
  }),
  st('[S Housing] [V is] [M {前| by a considerable margin}] [C the largest single expense {前| in the yearly budget {前| of most households}}].', {
    chunks: [
      ['Housing is by a considerable margin', '住居費はかなりの差をつけて'],
      ['the largest single expense', '最大の単一支出です'],
      ['in the yearly budget of most households', 'たいていの家計の一年の予算で'],
    ],
    notes: {
      'Housing is by a considerable margin': 'by a considerable margin で「かなりの差で」。',
    },
  }),
  st('[S It] [V is] [M also] [C the asset {関係>the asset| [M through which] [S most families] [V hold] [O the wealth {関係>the wealth| [O that] [S they] [V have managed] [O {to:名詞| [V to accumulate] [M {前| over a life}]}]}]}].', {
    chunks: [
      ['It is also the asset', 'それはまた資産でもあります（どんな資産かは次へ）'],
      ['through which most families hold the wealth', 'それを通して多くの家族が財産を持つ'],
      ['that they have managed to accumulate', 'どうにか蓄えてきた（財産を）'],
      ['over a life', '一生をかけて'],
    ],
    notes: {
      'that they have managed to accumulate': 'manage to ＋ 動詞 で「どうにか〜する」。that は accumulate の目的語にあたります。',
    },
  }),
  st('[S Those two roles] [V pull] [O housing policy] [M {前| in opposite directions}], [接 and] [S they] [V cannot] [M both] [V be fully satisfied] [M {前| at the same time}].', {
    chunks: [
      ['Those two roles pull housing policy', 'この二つの役割は住宅政策を引っぱります'],
      ['in opposite directions,', '反対の向きへ'],
      ['and they cannot both be fully satisfied', 'そして両方を完全に満たすことはできません'],
      ['at the same time', '同時には'],
    ],
    notes: {
      'and they cannot both be fully satisfied': 'not both … で「両方とも〜とはいかない」という部分否定です。',
    },
  }),
  st('[S Cheaper housing] [V is] [C good {前| for new buyers} and bad {前| for the existing owners {関係>the existing owners| [S who] [V voted] [M {前| for the rules {関係>the rules| [S that] [V are] [M now] [M {前| in force}]}}]}}].', {
    chunks: [
      ['Cheaper housing is good for new buyers', '住宅が安いことは新しい買い手にはよく'],
      ['and bad for the existing owners', '既存の所有者には悪いことです'],
      ['who voted for the rules', 'その所有者が賛成票を投じた規則があり'],
      ['that are now in force', 'それが今効力を持っています'],
    ],
    notes: {
      'that are now in force': 'in force は「効力がある」。that は the rules を受ける関係代名詞です。',
    },
  }),
  st('[S Debt] [V moves] [O consumption] [M {前| from the future}] [M {前| into the present}] [M {前| at a price {関係>a price| [S that] [V is] [M normally] [V stated] [M {前| in advance}]}}].', {
    chunks: [
      ['Debt moves consumption', '負債は消費を動かします'],
      ['from the future into the present', '未来から現在へ'],
      ['at a price that is normally stated in advance', 'ふつう前もって示される価格で'],
    ],
    notes: {
      'at a price that is normally stated in advance': 'in advance は「前もって」。ここでの price は利子などの負担です。',
    },
  }),
  st('[M {分詞構文:条件| [V Used] [M {前| for education} or {前| for the purchase {前| of a house}}]}], [S it] [V can raise] [O the income {前| of a whole life}] [M quite substantially].', {
    chunks: [
      ['Used for education or for the purchase of a house,', '教育や住宅の購入のために使われれば'],
      ['it can raise the income of a whole life', 'それは一生の所得を引き上げられます'],
      ['quite substantially', 'かなり大きく'],
    ],
    notes: {
      'Used for education or for the purchase of a house,': '文頭の Used … は「もし使われれば」という条件を表す分詞のまとまりです。',
    },
  }),
  st('[M {分詞構文:条件| [V Used] [M {前| for ordinary daily expenses}]}], [S it] [V converts] [O a temporary shortage] [M {前| into a permanent charge {前| on every future month}}].', {
    chunks: [
      ['Used for ordinary daily expenses,', 'ふだんの日々の支出に使われれば'],
      ['it converts a temporary shortage', 'それは一時的な不足を変えてしまいます'],
      ['into a permanent charge on every future month', '将来のあらゆる月にかかる恒久的な負担に'],
    ],
    notes: {
      'it converts a temporary shortage': 'convert A into B で「AをBに変える」。',
    },
  }),
  st('[S The very same instrument] [M therefore] [V builds] [O security] [M {前| for one household}] [接 and] [M steadily] [V removes] [O it] [M {前| from the next}].', {
    chunks: [
      ['The very same instrument therefore builds security', 'まったく同じ道具がしたがって安定を築きます'],
      ['for one household', 'ある家庭には'],
      ['and steadily removes it from the next', 'そして別の家庭からは着実にそれを奪います'],
    ],
    notes: {
      'and steadily removes it from the next': 'the next は「次の（別の）家庭」。it は security を指します。',
    },
  }),
  st('[S Insurance] [V is] [C the market instrument {関係>the market instrument| [S that] [V addresses] [O risk {前| between the generations}] [M more directly] [M {前| than any other instrument}]}].', {
    chunks: [
      ['Insurance is the market instrument', '保険は市場の道具です（どんな道具かは次へ）'],
      ['that addresses risk between the generations', '世代のあいだの危険に向き合う'],
      ['more directly than any other instrument', 'ほかのどの道具よりも直接に'],
    ],
    notes: {
      'that addresses risk between the generations': 'address はここでは「（問題に）取り組む」。',
    },
  }),
  st('[S It] [V works] [M {前| by {動名詞| [V pooling] [O events {関係>events| [S that] [V are] [C rare {前| for any single individual} and reasonably predictable {前| for a whole population}]}]}}].', {
    chunks: [
      ['It works by pooling events', 'それは出来事をまとめることで働きます'],
      ['that are rare for any single individual', 'どの個人にもまれで'],
      ['and reasonably predictable for a whole population', '集団全体にはかなり読める（出来事を）'],
    ],
    notes: {
      'It works by pooling events': 'pool は動詞で「一つにまとめる」。by ＋ -ing で「〜することによって」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a risk] [V becomes] [C common] [M {前| rather than rare}]}], [S that pool] [V stops] [O {動名詞| [V functioning] [M properly]}] [接 and] [S prices] [V rise] [M very sharply indeed].', {
    chunks: [
      ['When a risk becomes common rather than rare,', '危険がまれではなく当たり前になると'],
      ['that pool stops functioning properly', 'その集まりはうまく働かなくなり'],
      ['and prices rise very sharply indeed', 'そして価格は実に急激に上がります'],
    ],
    notes: {
      'that pool stops functioning properly': 'stop ＋ -ing で「〜するのをやめる」。functioning は stop の目的語です。',
    },
  }),
  st('[S Flood cover {前| in an exposed coastal district}] [V is] [C the clearest current example {前| of exactly that kind {前| of breakdown}}].', {
    chunks: [
      ['Flood cover in an exposed coastal district', '風雨にさらされる沿岸地区の水害保険は'],
      ['is the clearest current example', '最も明確な今の例です'],
      ['of exactly that kind of breakdown', 'まさにその種の破綻の'],
    ],
    notes: {
      'Flood cover in an exposed coastal district': 'cover はここでは名詞で「保険の補償」。exposed は「さらされた」。',
    },
  }),
  st('[S Markets] [V allocate] [O resources] [M very efficiently] [M {前| within the rules {関係>the rules| [O that] [S a society] [V has already chosen] [O {to:名詞| [V to set out] [M {前| for them}]}]}}].', {
    chunks: [
      ['Markets allocate resources very efficiently', '市場は資源をきわめて効率よく配分します'],
      ['within the rules', '規則の内側で'],
      ['that a society has already chosen', '社会がすでに選んだ（規則の）'],
      ['to set out for them', '市場のために定めることを'],
    ],
    notes: {
      'to set out for them': 'set out は「定める・示す」。them は Markets を指します。',
    },
  }),
  st('[S They] [V cannot choose] [O those rules] [M {前| for themselves}], [接 and] [S they] [V cannot notice] [O any cost {関係>any cost| [M that] [S nobody] [V has yet put] [O a price] [M on]}].', {
    chunks: [
      ['They cannot choose those rules for themselves,', '市場は自分でその規則を選べません'],
      ['and they cannot notice any cost', 'そしてどんな費用にも気づけません'],
      ['that nobody has yet put a price on', 'だれもまだ値をつけていない（費用に）'],
    ],
    notes: {
      'that nobody has yet put a price on': 'put a price on … で「…に値をつける」。文末の on の目的語が that です。',
    },
  }),
  st('[S {動名詞| [V Treating] [O a market outcome] [C {前| as a verdict {前| about fairness}}]}] [M therefore] [V confuses] [O a mechanism] [M {前| with a considered judgment}].', {
    chunks: [
      ['Treating a market outcome as a verdict', '市場の結果を判定として扱うことは'],
      ['about fairness', '公正さについての'],
      ['therefore confuses a mechanism', 'したがって仕組みを取り違えます'],
      ['with a considered judgment', 'よく考えられた判断と'],
    ],
    notes: {
      'therefore confuses a mechanism': 'confuse A with B で「AとBを取り違える」。',
    },
  }),
  st('[S The useful question] [V is] [M always] [C {疑問詞節| [S which particular set {前| of rules}] [V produces] [O outcomes {関係>outcomes| [M that] [S a city] [V is prepared] [C {to:補語| [V to live] [M with]}]}]}].', {
    chunks: [
      ['The useful question is always', '役に立つ問いは常に（何かは次へ）'],
      ['which particular set of rules produces outcomes', 'どの規則の組み合わせが結果を生むか、です'],
      ['that a city is prepared to live with', '都市が受け入れて暮らせる（結果を）'],
    ],
    notes: {
      'that a city is prepared to live with': 'live with … で「…を受け入れて暮らす」。文末の with の目的語が that です。',
    },
  }),
  st('[S An institution] [V is] [M essentially] [C a promise {関係>a promise| [S that] [V keeps] [O its force] [M even] [M {副詞節:時| [接 after] [S the people {関係>the people| [S who] [M first] [V made] [O it]}] [V have left] [O it] [M behind]}]}].', {
    chunks: [
      ['An institution is essentially a promise', '制度とは本質的に約束です（どんな約束かは次へ）'],
      ['that keeps its force even after', 'そのあとも効力を保つ（約束）'],
      ['the people who first made it', 'それを最初に作った人々が'],
      ['have left it behind', 'それを置いて去ったあとも'],
    ],
    notes: {
      'have left it behind': 'leave … behind で「…を置いていく」。',
    },
  }),
  st('[S Its value] [V comes] [M {前| from {動名詞| [V being] [C consistently predictable]}}] [M {前| rather than {前| from {動名詞| [V being] [C clever] [M {前| in any one particular case}]}}}].', {
    chunks: [
      ['Its value comes from being consistently predictable', 'その価値は、いつも予測できることから生まれます'],
      ['rather than from being clever', '賢いことからではなく'],
      ['in any one particular case', '個々の場面で'],
    ],
    notes: {
      'Its value comes from being consistently predictable': 'come from ＋ -ing で「〜することから生まれる」。',
    },
  }),
  st('[S A court {関係>A court| [S that] [V decided] [O every single case] [M purely] [M {前| on its own merits}]}] [V would be] [C entirely fair and completely useless].', {
    chunks: [
      ['A court that decided every single case', 'すべての事件を裁くような裁判所は'],
      ['purely on its own merits', 'その都度の是非だけで'],
      ['would be entirely fair and completely useless', 'まったく公正で、まったく役に立たないでしょう'],
    ],
    notes: {
      'purely on its own merits': 'on its own merits で「そのこと自体のよしあしで」。',
    },
  }),
  st('[S People] [V arrange] [O their whole lives] [M {前| around {what節| [O what] [S they] [M confidently] [V expect] [O an institution] [C {to:補語| [V to do] [M {前| in the following year}]}]}}].', {
    chunks: [
      ['People arrange their whole lives', '人は生活の全体を組み立てます'],
      ['around what they confidently expect', '自信を持って見込んでいることを軸に'],
      ['an institution to do in the following year', '制度が翌年に何をするか、という形で'],
    ],
    notes: {
      'around what they confidently expect': 'expect ＋ 目的語 ＋ to ＋ 動詞 で「〜が…すると見込む」。',
    },
  }),
  st('[S Procedure] [V is] [M very often] [V criticized] [M {前| as useless delay}], [接 and] [S a part {前| of that criticism}] [V is entirely justified].', {
    chunks: [
      ['Procedure is very often criticized', '手続きはしばしば批判されます'],
      ['as useless delay,', '無用な遅れとして'],
      ['and a part of that criticism is entirely justified', 'そしてその批判の一部はまったく正当です'],
    ],
    notes: {
      'and a part of that criticism is entirely justified': 'justified は「正当だと認められる」。',
    },
  }),
  st('[S The remaining part {前| of that criticism}] [V mistakes] [O a safeguard] [M {前| for an obstacle {関係>an obstacle| [S that] [V serves] [O no useful purpose] [M {前| at all}]}}].', {
    chunks: [
      ['The remaining part of that criticism', 'その批判の残りの部分は'],
      ['mistakes a safeguard for an obstacle', '安全装置を障害物と取り違えています'],
      ['that serves no useful purpose at all', '何の役にも立たない（障害物と）'],
    ],
    notes: {
      'mistakes a safeguard for an obstacle': 'mistake A for B で「AをBと取り違える」。',
    },
  }),
  st('[S A step {関係>A step| [S that] [V appears] [C useless] [M {前| in ninety-nine ordinary cases}]}] [V exists] [M entirely] [M {前| because of the one rare case {関係>the one rare case| [S that] [V remains]}}].', {
    chunks: [
      ['A step that appears useless', '無用に見える段階は'],
      ['in ninety-nine ordinary cases', '九十九のありふれた場合には'],
      ['exists entirely because of the one rare case', 'ただ一つのまれな場合のためだけに存在します'],
      ['that remains', '残っている（その場合の）'],
    ],
    notes: {
      'exists entirely because of the one rare case': 'because of ＋ 名詞 で「〜のせいで・〜のために」。',
    },
  }),
  st('[S Reform] [M therefore] [V requires] [O {動名詞| [V knowing] [O {疑問詞節| [O which particular kind {前| of case}] [S each step] [V was originally built] [C {to:補語| [V to catch]}]}]}].', {
    chunks: [
      ['Reform therefore requires knowing', 'したがって改革には知ることが必要です（何をかは次へ）'],
      ['which particular kind of case', 'どの種類の場合を'],
      ['each step was originally built to catch', '各段階がもともと捉えるために作られたのかを'],
    ],
    notes: {
      'each step was originally built to catch': 'be built to ＋ 動詞 で「〜するために作られる」。',
    },
  }),
  st('[S Accountability] [V means] [M simply] [O {that節| [接 that] [S someone] [V can be identified] [M {前| by name}] [M {前| at the point {関係>the point| [M when] [S a decision] [V turns out] [C {to:補語| [V to be] [C wrong]}]}}]}].', {
    chunks: [
      ['Accountability means simply that', '説明責任とは要するに〜ということです'],
      ['someone can be identified by name', 'だれかを名前で特定できる'],
      ['at the point when a decision turns out to be wrong', '決定が誤りだと分かる時点で'],
    ],
    notes: {
      'at the point when a decision turns out to be wrong': 'turn out to be … で「…だと分かる」。when は the point を受ける関係副詞です。',
    },
  }),
  st('[S Systems {関係>Systems| [S that] [V spread] [O responsibility] [M thinly] [M {前| across many offices}]}] [M consistently] [V produce] [O decisions {関係>decisions| [O that] [S nobody {前| at all}] [V owns]}].', {
    chunks: [
      ['Systems that spread responsibility thinly', '責任を薄く分散させる仕組みは'],
      ['across many offices', '多くの部署へ'],
      ['consistently produce decisions', '決まって決定を生みます（どんな決定かは次へ）'],
      ['that nobody at all owns', 'だれ一人引き受けない（決定を）'],
    ],
    notes: {
      'that nobody at all owns': 'own はここでは「自分のものとして引き受ける」。',
    },
  }),
  st('[S Such systems] [V are] [C comfortable {to:副詞(形容詞)| [V to work] [M inside]} and almost impossible {to:副詞(形容詞)| [V to correct] [M {前| from anywhere {前| outside them}}]}].', {
    chunks: [
      ['Such systems are comfortable to work inside', 'そうした仕組みは中で働くには居心地がよく'],
      ['and almost impossible to correct', 'そして正すのはほぼ不可能です'],
      ['from anywhere outside them', 'その外のどこからも'],
    ],
    notes: {
      'Such systems are comfortable to work inside': 'work inside で「中で働く」。inside は副詞です。',
    },
  }),
  st('[S {動名詞| [V Naming] [O the responsible office] [M well] [M {前| in advance}]}] [V is] [M therefore] [C a technical measure {前| rather than any form {前| of punishment}}].', {
    chunks: [
      ['Naming the responsible office well in advance', '責任のある部署を前もってはっきり示すことは'],
      ['is therefore a technical measure', 'したがって技術的な措置です'],
      ['rather than any form of punishment', '罰の一種ではなく'],
    ],
    notes: {
      'Naming the responsible office well in advance': 'well in advance で「かなり前もって」。',
    },
  }),
  st('[S Transparency] [V is] [M frequently] [V offered] [M {前| to the public}] [M {前| as a complete and sufficient answer {前| to every kind {前| of distrust}}}].', {
    chunks: [
      ['Transparency is frequently offered to the public', '透明性はしばしば人々に差し出されます'],
      ['as a complete and sufficient answer', '完全で十分な答えとして'],
      ['to every kind of distrust', 'あらゆる不信への'],
    ],
    notes: {
      'as a complete and sufficient answer': 'as は「〜として」。差し出される資格を表します。',
    },
  }),
  st('[S {動名詞| [V Publishing] [O a long document {関係>a long document| [O that] [S nobody] [V is actually able to read]}]}] [V produces] [O the appearance {前| of openness} and none {前| of its substance}].', {
    chunks: [
      ['Publishing a long document', '長い文書を公表することは'],
      ['that nobody is actually able to read', 'だれも実際には読めない（文書を）'],
      ['produces the appearance of openness', '公開の外見だけを生みます'],
      ['and none of its substance', 'そして中身は何も生みません'],
    ],
    notes: {
      'and none of its substance': 'none of … で「…のどれも〜ない」。substance は「中身」。',
    },
  }),
  st('[S Genuinely useful transparency] [V states] [O the decision, the reason {前| for it}, the alternatives, and the date {前| of the next review}].', {
    chunks: [
      ['Genuinely useful transparency states the decision,', '本当に役立つ透明性は、決定と'],
      ['the reason for it, the alternatives,', 'その理由と、ほかの選択肢と'],
      ['and the date of the next review', '次の見直しの期日を述べます'],
    ],
    notes: {
      'the reason for it, the alternatives,': 'alternatives は「ほかに取りえた選択肢」。',
    },
  }),
  st('[S Four short sentences {前| of that kind}] [V will] [M usually] [V do] [O more] [M {前| for public trust}] [M {前| than four hundred pages {前| of technical detail}}].', {
    chunks: [
      ['Four short sentences of that kind', 'その種の短い四つの文が'],
      ['will usually do more for public trust', 'たいてい公共の信頼により多く役立ちます'],
      ['than four hundred pages of technical detail', '四百頁の細かな説明よりも'],
    ],
    notes: {
      'will usually do more for public trust': 'do more for … で「…のためにより多くの働きをする」。',
    },
  }),
  st('[S Institutions] [V decay] [M very quietly], [接 and] [S that decay] [V becomes] [C visible] [M only] [M {前| in the way {関係省略:関係副詞>the way| [S they] [V respond] [M {前| to a genuine surprise}]}}].', {
    chunks: [
      ['Institutions decay very quietly,', '制度はきわめて静かに衰えます'],
      ['and that decay becomes visible only', 'そしてその衰えが見えるのはようやく（どこでかは次へ）'],
      ['in the way they respond', '反応の仕方にです'],
      ['to a genuine surprise', '本物の驚きへの'],
    ],
    notes: {
      'in the way they respond': 'the way ＋ 主語 ＋ 動詞 で「〜するやり方」。the way の後ろに how は置きません。',
    },
  }),
  st('[S A body {関係>A body| [S that] [V carries out] [O its routine work] [M extremely well]}] [V may] [M still] [V be] [C quite incapable {前| of {動名詞| [V admitting] [O a single error]}}].', {
    chunks: [
      ['A body that carries out its routine work', '定型の仕事をこなす組織でも'],
      ['extremely well', 'きわめてうまく'],
      ['may still be quite incapable', 'それでもまったくできないことがあります'],
      ['of admitting a single error', '一つの誤りを認めることが'],
    ],
    notes: {
      'may still be quite incapable': 'be incapable of ＋ -ing で「〜することができない」。',
    },
  }),
  st('[S The ability {to:形容詞>The ability| [V to reverse] [O an earlier decision] [M {前| in public}]}] [V is] [C the clearest available sign {同格that>sign| [接 that] [S an institution] [V is] [M still] [C fully alive]}].', {
    chunks: [
      ['The ability to reverse an earlier decision', '以前の決定を撤回できることが'],
      ['in public', '公の場で'],
      ['is the clearest available sign that', '最も明確な証です（何のかは次へ）'],
      ['an institution is still fully alive', '制度がまだ十分に生きているという'],
    ],
    notes: {
      'is the clearest available sign that': 'この that は同格の that で、sign の中身を説明します。',
    },
  }),
  st('[S A city] [V should test] [O that ability] [M deliberately] [M {前| in small matters}] [M {前| rather than {動名詞| [V waiting] [M {前:意味上の主語| for a crisis} {to:副詞(目的)| [V to test] [O it] [M {前| for them}]}]}}].', {
    chunks: [
      ['A city should test that ability deliberately', '都市はその力を意図的に試すべきです'],
      ['in small matters', '小さな事柄で'],
      ['rather than waiting for a crisis', '危機を待つのではなく'],
      ['to test it for them', '危機が代わりに試すのを'],
    ],
    notes: {
      'rather than waiting for a crisis': 'wait for A to ＋ 動詞 で「Aが〜するのを待つ」。for a crisis は to test の意味上の主語です。',
    },
  }),
])
