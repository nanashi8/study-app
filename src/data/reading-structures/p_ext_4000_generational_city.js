import { st } from './entry.js'

// 語彙強化ロングリーディング（約4,000語）の構造台帳。節ごとに手で確かめて足していく。
// いまは「翌年より先を考える」（#1〜#20）と「恐れ・希望・注意」（#21〜#40）まで。
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
])
