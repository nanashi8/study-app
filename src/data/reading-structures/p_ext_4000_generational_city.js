import { st } from './entry.js'

// 語彙強化ロングリーディング（約4,000語）の構造台帳。節ごとに手で確かめて足していく。
// 全200文（十の節すべて）を手で確かめて書いた。
// 残りの文は、台帳ができるまで解析器の表示のまま。
export default Object.freeze([
  st('[S A city] [V is] [M {前| above all}] [C a machine {前| for {動名詞| [V moving] [O {並列| costs | and benefits}] [M {前| across time}]}}], [M {副詞節:譲歩| [接 although] [S it] [V is] [M very rarely] [V described] [M {前| in quite those terms}]}].', {
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
  st('[S A road {関係>A road| [S that] [V is built] [M this year]}] [V will be {並列| repaired, | widened, | and eventually replaced}] [M {前| by people {関係>people| [S who] [V have not yet been born]}}].', {
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
  st('[S That gap] [M quietly] [V rewards] [O those decisions {並列| {関係>those decisions| [S whose benefits] [V appear] [M {前| at once}]} | and {関係>those decisions| [S whose costs] [V appear] [M only] [M {副詞節:時| [接 after] [S the next election] [V has passed]}]}}].', {
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
  st('[S Decisions {前| about {並列| land, | water, | pensions, | and public buildings}}] [M all] [V outlast] [M {前| by many years}] [O the people {関係>the people| [S who] [M first] [V make] [接 and] [V approve] [O them]}].', {
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
  st('[S A problem {関係>A problem| [O that] [S everybody] [V has noticed]}] [V will be answered] [M somehow], [M even] [M {前| in cases {関係>cases| [M where] [S it] [V is] [C {並列| comparatively small | and easy {to:副詞(形容詞)| [V to bear]}}]}}].', {
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
  st('[S A single dramatic accident] [V will change] [O more behavior] [M {前| in one month}] [M {前| than a whole decade {前| of {並列| quiet | and careful figures}}}].', {
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
  st('[S {動名詞| [V Removing] [O it] [M entirely]}] [V would leave] [O a city] [C {並列| perfectly accurate {前| about the present} | and quite incapable {前| of {動名詞| [V building] [O anything] [M {前| at all}]}}}].', {
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
  st('[S A rule {前| about {並列| wages, | working hours, | or safety}}] [V reaches] [O a household] [M only] [M {前| through the one particular job {関係>the one particular job| [O that] [S one member {前| of it}] [V does]}}].', {
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
  st('[S Any honest account {前| of a labor reform}] [M therefore] [V has to name] [O {並列| {疑問詞節| [S who] [V gains] [M {前| from it}]} | and {疑問詞節| [S who] [V loses] [M {前| by it}]}}].', {
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
  st('[S Training programs] [V reproduce] [O the manual] [M {並列| fully | and consistently}], [接 and] [S they] [V reproduce] [O the judgment] [M only] [M {前| with the greatest {前| of difficulty}}].', {
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
  st('[S A form {関係>A form| [S that] [V asks] [O an {並列| awkward | and apparently useless question}]}] [V is] [M very often] [C the trace {前| of an {並列| old | and extremely expensive mistake}}].', {
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
  st('[S The very same money], [M {副詞節:条件| [接 if] [S it] [V is used] [M earlier]}], [V reaches] [O workers] [M {副詞節:時| [接 while] [S they] [M still] [V have] [O {並列| savings, | contacts, | and a measure {前| of confidence}}]}].', {
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
  st('[S A single missed payment] [V is] [C {並列| a small trouble {前| for one household} | and the beginning {前| of a long spiral} {前| for another}}].', {
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
  st('[S A margin] [V is] [C the distance {前| between {並列| an ordinary setback | and a setback {関係>a setback| [S that] [V turns] [M {前| into something genuinely serious}]}}}].', {
    chunks: [
      ['A margin is the distance', '余裕とは距離のことです（何の距離かは次へ）'],
      ['between an ordinary setback and a setback', 'ありふれた不調と、もう一つの不調との'],
      ['that turns into something genuinely serious', '本当に深刻な事態に変わる（不調との）'],
    ],
    notes: {
      'that turns into something genuinely serious': 'turn into … で「…に変わる」。',
    },
  }),
  st('[S {並列| Savings, | family support, | and secure housing}] [M all] [V widen] [O that distance] [M {前| without {動名詞| [M ever] [V appearing] [M {前| in any published official figure}]}}].', {
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
  st('[S Two households {前| with identical incomes}] [V can] [M therefore] [V represent] [O entirely different degrees {前| of {並列| practical safety | and personal freedom}}].', {
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
  st('[S Time] [V is] [C the resource {並列| {関係>the resource| [O that] [S inequality] [V distributes] [M most unevenly]} | and {関係>the resource| [O that] [S public policy] [V notices] [M least often]}}].', {
    chunks: [
      ['Time is the resource', '時間は資源です（どんな資源かは次へ）'],
      ['that inequality distributes most unevenly', '不平等が最も不均等に分ける'],
      ['and that public policy notices least often', 'そして政策が最も気づきにくい（資源）'],
    ],
    notes: {
      'and that public policy notices least often': '二つの that はどちらも the resource を受ける関係代名詞です。',
    },
  }),
  st('[S {並列| A long journey {前| to work}, | an unpredictable shift, | and a second job}] [M all] [V consume] [O exactly the hours {関係>the hours| [O that] [S any serious planning] [V requires]}].', {
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
  st('[S Cheaper housing] [V is] [C {並列| good {前| for new buyers} | and bad {前| for the existing owners {関係>the existing owners| [S who] [V voted] [M {前| for the rules {関係>the rules| [S that] [V are] [M now] [M {前| in force}]}}]}}}].', {
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
  st('[M {分詞構文:条件| [V Used] [M {並列| {前| for education} | or {前| for the purchase {前| of a house}}}]}], [S it] [V can raise] [O the income {前| of a whole life}] [M quite substantially].', {
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
  st('[S It] [V works] [M {前| by {動名詞| [V pooling] [O events {関係>events| [S that] [V are] [C {並列| rare {前| for any single individual} | and reasonably predictable {前| for a whole population}}]}]}}].', {
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
  st('[S A court {関係>A court| [S that] [V decided] [O every single case] [M purely] [M {前| on its own merits}]}] [V would be] [C {並列| entirely fair | and completely useless}].', {
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
  st('[S Such systems] [V are] [C {並列| comfortable {to:副詞(形容詞)| [V to work] [M inside]} | and almost impossible {to:副詞(形容詞)| [V to correct] [M {前| from anywhere {前| outside them}}]}}].', {
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
  st('[S Transparency] [V is] [M frequently] [V offered] [M {前| to the public}] [M {前| as a {並列| complete | and sufficient answer {前| to every kind {前| of distrust}}}}].', {
    chunks: [
      ['Transparency is frequently offered to the public', '透明性はしばしば人々に差し出されます'],
      ['as a complete and sufficient answer', '完全で十分な答えとして'],
      ['to every kind of distrust', 'あらゆる不信への'],
    ],
    notes: {
      'as a complete and sufficient answer': 'as は「〜として」。差し出される資格を表します。',
    },
  }),
  st('[S {動名詞| [V Publishing] [O a long document {関係>a long document| [O that] [S nobody] [V is actually able to read]}]}] [V produces] [O {並列| the appearance {前| of openness} | and none {前| of its substance}}].', {
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
  st('[S Genuinely useful transparency] [V states] [O {並列| the decision, | the reason {前| for it}, | the alternatives, | and the date {前| of the next review}}].', {
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
  st('[S A city] [V passes on] [O a great deal more knowledge] [M {前| outside its schools}] [M {副詞節:比較| [接 than] [S it] [V will] [M ever] [V pass on] [M {前| inside them}]}].', {
    chunks: [
      ['A city passes on a great deal more knowledge', '都市は、はるかに多くの知識を受け渡します'],
      ['outside its schools', '学校の外で'],
      ['than it will ever pass on inside them', '学校の中で受け渡すよりも'],
    ],
    notes: {
      'A city passes on a great deal more knowledge': 'pass on … で「…を次へ渡す」。a great deal more で「はるかに多くの」。',
    },
  }),
  st('[S {並列| Libraries, | places {前| of work}, | families, | and neighbors}] [M together] [V carry] [O most {前| of {what節| [O what] [S a resident {前| of a city}] [M actually] [V ends up] [O {動名詞| [V learning]}]}}].', {
    chunks: [
      ['Libraries, places of work, families, and neighbors', '図書館と職場と家族と隣人が'],
      ['together carry most of what', '合わさって、〜ことの大半を運びます'],
      ['a resident of a city actually ends up learning', '都市の住民が結局実際に学ぶ'],
    ],
    notes: {
      'a resident of a city actually ends up learning': 'end up ＋ -ing で「結局〜することになる」。',
    },
  }),
  st('[S Schools] [V matter] [M so much] [M {副詞節:理由| [接 because] [S they] [V are] [C the one part {前| of that larger system} {関係>the one part| [O that] [S policy] [V can reach] [M directly]}]}].', {
    chunks: [
      ['Schools matter so much', '学校がこれほど大切なのは'],
      ['because they are the one part', 'それが唯一の部分だからです（何のかは次へ）'],
      ['of that larger system', 'その大きな仕組みのうち'],
      ['that policy can reach directly', '政策が直接届く（部分）'],
    ],
    notes: {
      'Schools matter so much': 'matter は動詞で「重要である」。',
    },
  }),
  st('[S {動名詞| [V Treating] [O schools] [M {副詞節:様態| [接 as though] [S they] [V were] [C the whole {前| of that system}]}]}] [V produces] [O reforms {関係>reforms| [S that] [V fail] [M {前| for reasons {関係省略:目的格(predicted)>reasons| [S nobody] [V had predicted]}}]}].', {
    chunks: [
      ['Treating schools as though they were the whole', '学校が全体であるかのように扱うことは'],
      ['of that system', 'その仕組みの'],
      ['produces reforms that fail', '失敗する改革を生みます'],
      ['for reasons nobody had predicted', 'だれも予測していなかった理由で'],
    ],
    notes: {
      'for reasons nobody had predicted': 'reasons の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[S Assessment] [V shapes] [O {what節| [S what] [V is] [M actually] [V taught] [M {前| in a classroom}]}] [M far more powerfully] [M {副詞節:比較| [接 than] [S any curriculum document] [M ever] [V manages] [O {to:名詞| [V to do]}]}].', {
    chunks: [
      ['Assessment shapes what is actually taught', '評価は実際に教えられる内容を形づくります'],
      ['in a classroom', '教室で'],
      ['far more powerfully', 'はるかに強く'],
      ['than any curriculum document ever manages to do', 'どの教育課程の文書ができるよりも'],
    ],
    notes: {
      'Assessment shapes what is actually taught': 'assessment は「評価・試験」。what 以下が shapes の目的語です。',
    },
  }),
  st('[S Teachers] [V respond] [M rationally] [M {前| to the things {関係>the things| [S that] [V are measured]}}], [接 and] [S they] [V are] [C entirely right {to:副詞(形容詞)| [V to respond] [M {前| in that way}]}].', {
    chunks: [
      ['Teachers respond rationally', '教師は理にかなった形で応じます（何にかは次へ）'],
      ['to the things that are measured,', '測られるものに'],
      ['and they are entirely right to respond in that way', 'そしてそう応じるのはまったく正しいのです'],
    ],
    notes: {
      'and they are entirely right to respond in that way': 'be right to ＋ 動詞 で「〜するのは正しい」。',
    },
  }),
  st('[S A test {関係>A test| [S that] [M mainly] [V rewards] [O recall]}] [V will] [M consistently] [V produce] [O classrooms {関係>classrooms| [S that] [V are organized] [M {前| around {並列| recall | and nothing else}}]}].', {
    chunks: [
      ['A test that mainly rewards recall', '主に暗記に報いる試験は'],
      ['will consistently produce classrooms', '決まって教室を生みます（どんな教室かは次へ）'],
      ['that are organized around recall and nothing else', '暗記だけを軸に組み立てられた（教室を）'],
    ],
    notes: {
      'A test that mainly rewards recall': 'recall は名詞で「思い出すこと・暗記」。',
    },
  }),
  st('[S {動名詞| [V Changing] [O {what節| [S what] [V is examined]}]}] [V is] [M therefore] [M {前| by far}] [C the fastest available way {to:形容詞>the fastest available way| [V to change] [O {what節| [S what] [V is] [M actually] [V taught]}]}].', {
    chunks: [
      ['Changing what is examined', '何が試験されるかを変えることが'],
      ['is therefore by far the fastest available way', 'したがって群を抜いて速い方法です'],
      ['to change what is actually taught', '実際に教えられる内容を変える（方法）'],
    ],
    notes: {
      'is therefore by far the fastest available way': 'by far は最上級を強めて「群を抜いて」。',
    },
  }),
  st('[S Some {前| of the most valuable outcomes {前| of an education}}] [V are] [M also] [C the very hardest {to:副詞(形容詞)| [V to measure] [M {前| at all}]}].', {
    chunks: [
      ['Some of the most valuable outcomes of an education', '教育の最も価値ある成果のいくつかは'],
      ['are also the very hardest to measure at all', 'そもそも測るのが最も難しいものでもあります'],
    ],
    notes: {
      'are also the very hardest to measure at all': 'the very ＋ 最上級 で「まさに最も〜」。to measure が hardest の内容を示します。',
    },
  }),
  st('[S {並列| Patience, | curiosity, | and a willingness {to:形容詞>a willingness| [V to revise] [O a strong belief]}}] [M all] [V resist] [O almost every simple instrument {前| of measurement}].', {
    chunks: [
      ['Patience, curiosity, and a willingness', '忍耐と好奇心と意志は'],
      ['to revise a strong belief', '固く抱いた信念を改める（意志）'],
      ['all resist almost every simple instrument', 'どれもほとんどどんな単純な道具にも抵抗します'],
      ['of measurement', '測るための'],
    ],
    notes: {
      'to revise a strong belief': 'a willingness to ＋ 動詞 で「〜しようとする気持ち」。',
    },
  }),
  st('[S {動名詞| [V Measuring] [M only] [O {what節| [S what] [V happens] [C {to:補語| [V to be] [C easy]}]}]}] [M therefore] [V produces] [O a system {関係>a system| [S that] [M quietly] [V discards] [O almost everything else {前| of value}]}].', {
    chunks: [
      ['Measuring only what happens to be easy', 'たまたま測りやすいものだけを測ることは'],
      ['therefore produces a system', 'したがって仕組みを生みます（どんな仕組みかは次へ）'],
      ['that quietly discards almost everything else', 'ほかのほとんどすべてを静かに捨てる'],
      ['of value', '価値のある（もの）'],
    ],
    notes: {
      'Measuring only what happens to be easy': 'happen to ＋ 動詞 で「たまたま〜である」。',
    },
  }),
  st('[S {動名詞| [V Stating] [O a goal {関係>a goal| [S that] [V is not measured]}] [M {前| in plain language}]}] [V is] [C a weak defense], [接 but] [S it] [V is] [C a good deal better {前| than nothing}].', {
    chunks: [
      ['Stating a goal that is not measured', '測られない目標を書いておくことは'],
      ['in plain language', '分かりやすい言葉で'],
      ['is a weak defense,', '弱い備えです'],
      ['but it is a good deal better than nothing', 'しかし何もないよりずっとましです'],
    ],
    notes: {
      'but it is a good deal better than nothing': 'a good deal は比較級を強めて「ずっと」。',
    },
  }),
  st('[S Adults] [V learn] [M {前| in quite a different way}] [M {前| from children}], [接 and] [S public systems] [M rarely] [V reflect] [O that difference] [M {前| at all}].', {
    chunks: [
      ['Adults learn in quite a different way', '大人はかなり違うやり方で学びます'],
      ['from children,', '子どもとは'],
      ['and public systems rarely reflect that difference at all', 'そして公的な仕組みがその違いを映すことはまれです'],
    ],
    notes: {
      'Adults learn in quite a different way': 'a different way from … で「…とは違うやり方」。',
    },
  }),
  st('[S An adult] [V brings] [O {並列| experience, | severely limited time, | and an immediate practical reason {前| for {動名詞| [V learning] [O one particular thing]}}}].', {
    chunks: [
      ['An adult brings experience,', '大人は経験と'],
      ['severely limited time,', 'ひどく限られた時間と'],
      ['and an immediate practical reason', 'そして差し迫った実際的な理由を持ち込みます'],
      ['for learning one particular thing', 'あることを学ぶための'],
    ],
    notes: {
      'and an immediate practical reason': 'immediate は「すぐ目の前の」。',
    },
  }),
  st('[S Courses {関係>Courses| [S that] [V were designed] [M {前| for eighteen-year-old students}]}] [V will waste] [O all three {前| of those considerable advantages}].', {
    chunks: [
      ['Courses that were designed', '設計された課程は'],
      ['for eighteen-year-old students', '十八歳の学生向けに'],
      ['will waste all three of those considerable advantages', 'その三つの大きな利点をすべて無駄にします'],
    ],
    notes: {
      'will waste all three of those considerable advantages': 'all three of … で「…の三つとも」。',
    },
  }),
  st('[S {並列| Short | and practical formats} {関係>Short and practical formats| [S that] [V can be repeated]}] [V reach] [O far more adults] [M {副詞節:比較| [接 than] [S long degree programs] [M ever] [V do]}].', {
    chunks: [
      ['Short and practical formats that can be repeated', '繰り返せる短く実際的な形式は'],
      ['reach far more adults', 'はるかに多くの大人に届きます'],
      ['than long degree programs ever do', '長い学位課程が届くよりも'],
    ],
    notes: {
      'than long degree programs ever do': 'この do は reach の代わりで、繰り返しを避けています。',
    },
  }),
  st('[S Public knowledge] [V decays] [M steadily] [M {副詞節:条件| [接 unless] [S someone] [V is] [M actually] [V paid] [C {to:補語| [V to maintain] [接 and] [V correct] [O it] [M {反復| year after year}]}]}].', {
    chunks: [
      ['Public knowledge decays steadily', '公共の知識は着実に朽ちていきます'],
      ['unless someone is actually paid', 'だれかが実際に報酬を受けて〜しないかぎり'],
      ['to maintain and correct it year after year', '毎年それを保ち、直す'],
    ],
    notes: {
      'unless someone is actually paid': 'unless は「〜しないかぎり」。be paid to ＋ 動詞 で「報酬を受けて〜する」。',
    },
  }),
  st('[S Records] [V are lost], [S formats] [V become] [C unreadable], [接 and] [S the people {関係>the people| [S who] [M once] [V understood] [O an old system]}] [M quietly] [V retire].', {
    chunks: [
      ['Records are lost,', '記録は失われ'],
      ['formats become unreadable,', '形式は読めなくなり'],
      ['and the people who once understood an old system', 'そして古い仕組みをかつて理解していた人は'],
      ['quietly retire', '静かに引退します'],
    ],
    notes: {
      'formats become unreadable,': 'format は「保存の形式」。unreadable は「読み取れない」。',
    },
  }),
  st('[S {動名詞| [V Maintaining] [O an archive]}] [V is] [C plain work {関係>plain work| [S that] [V is] [M never] [V rewarded]}], [接 and] [S it] [V is] [M usually] [C the first budget line {to:形容詞>the first budget line| [V to be cut]}].', {
    chunks: [
      ['Maintaining an archive is plain work', '文書館を保つことは地味な仕事です'],
      ['that is never rewarded,', '決して報われない（仕事）'],
      ['and it is usually the first budget line', 'そしてたいてい最初の予算項目です'],
      ['to be cut', '削られる（項目）'],
    ],
    notes: {
      'and it is usually the first budget line': 'budget line は「予算の項目」。',
    },
  }),
  st('[S A city {関係>A city| [S that] [V cannot consult] [O its own past]}] [V will keep on] [O {動名詞| [V repeating] [O experiments {関係>experiments| [O that] [S it] [V has already run] [M once before]}]}].', {
    chunks: [
      ['A city that cannot consult its own past', '自らの過去を参照できない都市は'],
      ['will keep on repeating experiments', '実験を繰り返し続けます（どんな実験かは次へ）'],
      ['that it has already run once before', 'すでに一度行った（実験を）'],
    ],
    notes: {
      'will keep on repeating experiments': 'keep on ＋ -ing で「〜し続ける」。run an experiment で「実験を行う」。',
    },
  }),
  st('[S Health] [V is produced] [M {前| for the most part}] [M {前| outside hospitals}], [接 and] [S it] [V is measured] [M almost entirely] [M {前| inside them}].', {
    chunks: [
      ['Health is produced for the most part', '健康はおおむね生み出されます（どこでかは次へ）'],
      ['outside hospitals,', '病院の外で'],
      ['and it is measured almost entirely inside them', 'そして測られるのはほとんどすべて病院の中です'],
    ],
    notes: {
      'Health is produced for the most part': 'for the most part で「おおむね・大部分は」。',
    },
  }),
  st('[S {並列| Housing, | work, | diet, | and the quality {前| of the air}}] [M together] [V account for] [O far more variation] [M {副詞節:比較| [接 than] [S any treatment] [M ever] [V does]}].', {
    chunks: [
      ['Housing, work, diet, and the quality of the air', '住まいと仕事と食事と空気の質が'],
      ['together account for far more variation', '合わさって、はるかに大きな差を生んでいます'],
      ['than any treatment ever does', 'どんな治療が生むよりも'],
    ],
    notes: {
      'together account for far more variation': 'account for … で「…を説明する・…の原因である」。',
    },
  }),
  st('[S A health budget {関係>A health budget| [S that] [V is used] [M entirely] [M {前| on treatment}]}] [V is] [M therefore] [V being used] [M {前| at the very last stage {前| of the process}}].', {
    chunks: [
      ['A health budget that is used entirely', 'すべてが使われる保健予算は'],
      ['on treatment', '治療に'],
      ['is therefore being used', 'したがって使われていることになります（どこでかは次へ）'],
      ['at the very last stage of the process', '過程のまさに最後の段階で'],
    ],
    notes: {
      'is therefore being used': 'is being used は「いま使われている」という受け身の進行形です。',
    },
  }),
  st('[S {動名詞| [V Moving] [O part {前| of that budget}] [M earlier]}] [V is] [C difficult] [M {副詞節:理由| [接 because] [S the benefits] [M then] [V appear] [M {前| in the accounts {前| of some other office}}]}].', {
    chunks: [
      ['Moving part of that budget earlier is difficult', 'その予算の一部を前倒しするのは難しいのです'],
      ['because the benefits then appear', 'なぜならそのとき利益が現れるからです（どこにかは次へ）'],
      ['in the accounts of some other office', 'ほかの部署の帳簿に'],
    ],
    notes: {
      'in the accounts of some other office': 'accounts はここでは「会計・帳簿」。',
    },
  }),
  st('[S Prevention] [V is] [C very cheap] [M {副詞節:時| [接 when] [S it] [V is counted] [M {前| in total}]}] [接 and] [M yet] [C completely invisible] [M {前| in every individual case}].', {
    chunks: [
      ['Prevention is very cheap', '予防はきわめて安上がりです'],
      ['when it is counted in total', '全体として数えれば'],
      ['and yet completely invisible', 'それでいてまったく目に見えません'],
      ['in every individual case', '一つ一つの場面では'],
    ],
    notes: {
      'and yet completely invisible': 'and yet は「それでいて」。前と対立する内容を続けます。',
    },
  }),
  st('[S Nobody] [V is] [M ever] [V able to point] [M {前| to the particular illness {関係>the particular illness| [O that] [S a clean water supply] [V did not happen] [C {to:補語| [V to cause]}]}}].', {
    chunks: [
      ['Nobody is ever able to point', 'だれも指し示すことができません（何をかは次へ）'],
      ['to the particular illness', 'その特定の病気を'],
      ['that a clean water supply did not happen to cause', '清潔な水道がたまたま起こさずにすんだ（病気を）'],
    ],
    notes: {
      'that a clean water supply did not happen to cause': 'that は to cause の目的語にあたります。happen to ＋ 動詞 で「たまたま〜する」。',
    },
  }),
  st('[S Treatment], [M {前| by contrast}], [V produces] [O a grateful patient {関係>a grateful patient| [S who] [V can be photographed] [接 and] [M publicly] [V thanked] [M {前| by name}]}].', {
    chunks: [
      ['Treatment, by contrast, produces a grateful patient', '対照的に、治療は感謝する患者を生みます'],
      ['who can be photographed', 'その患者は写真に撮られ'],
      ['and publicly thanked by name', '名前を挙げて公に感謝されます'],
    ],
    notes: {
      'and publicly thanked by name': 'can be photographed and thanked と、二つの過去分詞が can be を共有しています。',
    },
  }),
  st('[S That difference {前| in visibility}] [V explains] [O most {前| of the lasting imbalance {前| in the way {関係>the way| [M that] [S health money] [V is used]}}}].', {
    chunks: [
      ['That difference in visibility explains most', 'この見えやすさの違いが大半を説明します（何のかは次へ）'],
      ['of the lasting imbalance', '長く続く偏りの'],
      ['in the way that health money is used', '保健の予算の使われ方における'],
    ],
    notes: {
      'in the way that health money is used': 'the way that ＋ 主語 ＋ 動詞 で「〜するやり方」。in which に置きかえられます。',
    },
  }),
  st('[S Care {並列| {前| for the very old} | and {前| for the very young}}] [V is] [M largely] [C invisible], [接 and] [S it] [M hardly ever] [V appears] [M {前| in any official set {前| of figures}}].', {
    chunks: [
      ['Care for the very old and for the very young', '高齢者と幼い子どもへのケアは'],
      ['is largely invisible,', 'その大半が目に見えません'],
      ['and it hardly ever appears', 'そしてほとんど現れません（どこにかは次へ）'],
      ['in any official set of figures', 'どの公式の統計にも'],
    ],
    notes: {
      'and it hardly ever appears': 'hardly ever で「めったに〜ない」。',
    },
  }),
  st('[S It] [V is performed] [M {前| at home}], [M mostly] [M {前| by a woman {前| in the family}}], [接 and] [S it] [M never once] [V enters] [O the national accounts].', {
    chunks: [
      ['It is performed at home,', 'それは家庭で行われます'],
      ['mostly by a woman in the family,', '多くは家族の中の女性によって'],
      ['and it never once enters the national accounts', 'そして国民経済計算に入ることは一度もありません'],
    ],
    notes: {
      'and it never once enters the national accounts': 'the national accounts は国全体の経済を数える統計です。',
    },
  }),
  st('[S A policy {関係>A policy| [S that] [V shifts] [O care] [M {前| from an institution}] [M {前| to a family}]}] [V has] [M merely] [V moved] [O a cost] [接 rather than] [V removed] [O it].', {
    chunks: [
      ['A policy that shifts care', 'ケアを移す政策は'],
      ['from an institution to a family', '施設から家庭へ'],
      ['has merely moved a cost', '費用をただ移しただけです'],
      ['rather than removed it', 'それを取り除いたのではなく'],
    ],
    notes: {
      'rather than removed it': 'rather than … で「…ではなく」。moved と removed を比べています。',
    },
  }),
  st('[S {動名詞| [V Counting] [O that work] [M honestly], [M even] [M {副詞節:時| [接 when] [S nobody] [V is paid] [M {前| for it}]}]}], [V changes] [O {並列| {疑問詞節| [S which reform] [V looks] [C cheap]} | and {疑問詞節| [S which] [V looks] [C expensive]}}].', {
    chunks: [
      ['Counting that work honestly,', 'その仕事を誠実に数えることは'],
      ['even when nobody is paid for it,', 'だれも報酬を受けていないときでさえ'],
      ['changes which reform looks cheap', 'どの改革が安く見えるかを変えます'],
      ['and which looks expensive', 'そしてどれが高く見えるかを'],
    ],
    notes: {
      'changes which reform looks cheap': 'which reform … は「どの改革が…か」という間接疑問です。',
    },
  }),
  st('[S Medical technology] [V extends] [O the length {前| of a life}] [M far more consistently] [M {副詞節:比較| [接 than] [S it] [V manages] [O {to:名詞| [V to extend] [O {並列| independence | and comfort}]}]}].', {
    chunks: [
      ['Medical technology extends the length of a life', '医療技術は人生の長さを延ばします'],
      ['far more consistently', 'はるかに確実に'],
      ['than it manages to extend independence and comfort', '自立と快適さを延ばせるよりも'],
    ],
    notes: {
      'than it manages to extend independence and comfort': 'manage to ＋ 動詞 で「どうにか〜する」。',
    },
  }),
  st('[S A treatment {関係>A treatment| [S that] [V adds] [O five years {前| of life}]}] [V may] [M equally] [V add] [O five years {前| of dependence {前| on someone else}}].', {
    chunks: [
      ['A treatment that adds five years of life', '五年の命を加える治療は'],
      ['may equally add five years', '同じだけ五年を加えることもあります'],
      ['of dependence on someone else', 'ほかのだれかに頼る（五年を）'],
    ],
    notes: {
      'may equally add five years': 'equally はここでは「同じように・同じだけ」。',
    },
  }),
  st('[S Families] [M usually] [V discover] [O this] [M only] [M {副詞節:時| [接 after] [S the decision] [V has been made] [接 and] [V can] [M no longer easily] [V be reversed] [M {前| at all}]}].', {
    chunks: [
      ['Families usually discover this only', '家族がこれを知るのはたいてい（いつかは次へ）'],
      ['after the decision has been made', '決定が下されたあとです'],
      ['and can no longer easily be reversed at all', 'そしてもう簡単には覆せなくなってから'],
    ],
    notes: {
      'and can no longer easily be reversed at all': 'no longer は「もはや〜ない」。be reversed は「覆される」。',
    },
  }),
  st('[S {動名詞| [V Discussing] [O the question] [M well] [M {前| in advance}]}] [V is] [C unpleasant], [接 and] [S it] [V is] [C the only point {関係>the only point| [M at which] [S it] [V can be discussed] [M {前| at all}]}].', {
    chunks: [
      ['Discussing the question well in advance is unpleasant,', 'その問いを前もって話し合うのは気が進みません'],
      ['and it is the only point', 'そしてそれが唯一の時点でもあります'],
      ['at which it can be discussed at all', 'そもそも話し合える（時点）'],
    ],
    notes: {
      'at which it can be discussed at all': 'at which は「前置詞＋関係代名詞」で、at the point の意味です。',
    },
  }),
  st('[S Every health system {前| in the world}] [V shares out] [O care], [接 and] [S the honest ones] [V state] [M openly] [O {疑問詞節| [M how] [S they] [V do] [O it]}].', {
    chunks: [
      ['Every health system in the world shares out care,', '世界のどの医療制度もケアを配分しています'],
      ['and the honest ones state openly', 'そして誠実な制度は率直に述べます（何をかは次へ）'],
      ['how they do it', 'どうやって配分しているかを'],
    ],
    notes: {
      'Every health system in the world shares out care,': 'share out … で「…を分け合う・配分する」。',
    },
  }),
  st('[S {並列| Waiting lists, | prices, | distance, | and rules {前| about {疑問詞節| [S who] [V qualifies]}}}] [V are] [M all] [C different methods {前| of {動名詞| [V sharing out] [O care]}}].', {
    chunks: [
      ['Waiting lists, prices, distance, and rules', '待機名簿と価格と距離と規則は'],
      ['about who qualifies', 'だれに資格があるかについての'],
      ['are all different methods of sharing out care', 'どれもケアを配分する別々のやり方です'],
    ],
    notes: {
      'about who qualifies': 'この who は疑問詞で、about の目的語になる間接疑問を作ります。',
    },
  }),
  st('[S {動名詞| [V Pretending] [O {that節| [接 that] [S no such choice] [V is being made]}]}] [M merely] [V hides] [O the choice] [M {前| rather than {動名詞| [M actually] [V avoiding] [O it] [M {前| in any way}]}}].', {
    chunks: [
      ['Pretending that no such choice is being made', 'そんな選択はしていないふりをすることは'],
      ['merely hides the choice', 'その選択をただ隠すだけです'],
      ['rather than actually avoiding it in any way', '実際に避けているのではなく'],
    ],
    notes: {
      'Pretending that no such choice is being made': 'この that は接続詞で、pretend の目的語になる名詞節を作ります。',
    },
  }),
  st('[S A rule {関係>A rule| [S that] [V is stated] [M openly]}] [V can be argued] [M with], [M {副詞節:対比| [接 while] [S a rule {関係>a rule| [S that] [V is] [M never] [V stated]}] [V can] [M only] [V be quietly endured]}].', {
    chunks: [
      ['A rule that is stated openly can be argued with,', '公然と述べられた規則には反論できます'],
      ['while a rule that is never stated', '一方、決して述べられない規則は'],
      ['can only be quietly endured', '黙って耐えるほかありません'],
    ],
    notes: {
      'A rule that is stated openly can be argued with,': 'argue with … で「…に反論する」。受け身になって with が文の終わりに残っています。',
    },
  }),
  st('[S Every new tool {関係>Every new tool| [O that] [S a city] [V adopts]}] [V creates] [O {並列| a new capability | and a new dependence {前| on it}}] [M {前| at exactly the same moment}].', {
    chunks: [
      ['Every new tool that a city adopts', '都市が取り入れるどの新しい道具も'],
      ['creates a new capability and a new dependence on it', '新しい能力と、それへの新しい依存を生みます'],
      ['at exactly the same moment', 'まったく同じ瞬間に'],
    ],
    notes: {
      'creates a new capability and a new dependence on it': 'capability は「できること」、dependence on … は「…への依存」。',
    },
  }),
  st('[S A payment system {関係>A payment system| [S that] [V works] [M perfectly] [M {前| for many years}]}] [M quietly] [V becomes] [C infrastructure {関係>infrastructure| [S that] [V can] [M no longer] [V be turned off]}].', {
    chunks: [
      ['A payment system that works perfectly', '完璧に働く決済の仕組みは'],
      ['for many years', '何年も'],
      ['quietly becomes infrastructure', '静かに基盤設備になります（どんな設備かは次へ）'],
      ['that can no longer be turned off', 'もはや止められない（設備に）'],
    ],
    notes: {
      'that can no longer be turned off': 'turn off … で「…を止める」。no longer は「もはや〜ない」。',
    },
  }),
  st('[S The dependence] [V remains] [C quite invisible] [M {副詞節:時| [接 while] [S the tool] [V works]}] [接 and] [V becomes] [C total] [M {前| on the day {関係>the day| [M that] [S it] [M finally] [V fails]}}].', {
    chunks: [
      ['The dependence remains quite invisible', 'その依存は見えないままです'],
      ['while the tool works', '道具が働いているあいだは'],
      ['and becomes total on the day', 'そしてその日に全面的なものになります'],
      ['that it finally fails', 'ついに壊れる（日に）'],
    ],
    notes: {
      'that it finally fails': 'the day that ＋ 主語 ＋ 動詞 で「〜する日」。on which に置きかえられます。',
    },
  }),
  st('[S {動名詞| [V Planning] [M carefully] [M {前| for that day}]}] [V is] [C the whole difference {前| between {並列| a small trouble | and a complete stop}}].', {
    chunks: [
      ['Planning carefully for that day', 'その日に向けて丁寧に備えることが'],
      ['is the whole difference', '違いのすべてです（何の違いかは次へ）'],
      ['between a small trouble and a complete stop', '小さな面倒と完全な停止との'],
    ],
    notes: {
      'is the whole difference': 'the whole difference で「違いのすべて・分かれ目」。',
    },
  }),
  st('[S Networks] [V concentrate] [O value] [M {前| at their center}] [接 and] [V concentrate] [O most {前| of the risk}] [M {前| at their outer edges}] [M instead].', {
    chunks: [
      ['Networks concentrate value at their center', 'ネットワークは価値を中心に集めます'],
      ['and concentrate most of the risk', 'そして危険の大半を集めます'],
      ['at their outer edges instead', '代わりに外側の周縁に'],
    ],
    notes: {
      'at their outer edges instead': 'instead はここでは「そのかわりに」で、中心と周縁を対比しています。',
    },
  }),
  st('[S A service {関係>A service| [O that] [M absolutely] [S everybody] [V uses]}] [V is] [C highly efficient], [接 and] [S its failure] [M then] [V affects] [O everybody] [M {前| at once}].', {
    chunks: [
      ['A service that absolutely everybody uses', 'だれもが例外なく使う仕組みは'],
      ['is highly efficient,', 'きわめて効率的です'],
      ['and its failure then affects everybody at once', 'そして故障は全員に同時に及びます'],
    ],
    notes: {
      'A service that absolutely everybody uses': 'that は uses の目的語にあたる関係代名詞です。',
    },
  }),
  st('[S {動名詞| [V Keeping] [O several options] [C open]}] [V is] [C expensive] [M {前| in ordinary years}] [接 and] [V is] [C the reason {関係省略:関係副詞>the reason| [S a city] [V survives] [O an unusual one]}].', {
    chunks: [
      ['Keeping several options open is expensive', '複数の選択肢を残しておくのは高くつきます'],
      ['in ordinary years', 'ふつうの年には'],
      ['and is the reason a city survives an unusual one', 'そして異常な年に都市が生き延びる理由になります'],
    ],
    notes: {
      'Keeping several options open is expensive': 'keep ＋ 目的語 ＋ 形容詞 で「〜を…のままにしておく」。',
    },
  }),
  st('[S {動名詞| [V Deciding] [O {疑問詞to| [O how much duplication] [V to keep]}]}] [V is] [M {前| in the end}] [C a judgment {前| about {疑問詞節| [C how strange] [S the future] [V may turn out] [C {to:補語| [V to be]}]}}].', {
    chunks: [
      ['Deciding how much duplication to keep', 'どれだけ重ねて持つかを決めることは'],
      ['is in the end a judgment', '結局のところ判断です（何についてかは次へ）'],
      ['about how strange the future may turn out to be', '未来がどれほど奇妙だと分かりうるかについての'],
    ],
    notes: {
      'Deciding how much duplication to keep': '疑問詞 ＋ to ＋ 動詞 で「どれだけ〜すべきか」という名詞のまとまりになります。',
    },
  }),
  st('[S Data {関係>Data| [S that] [V is collected] [M {前| for one stated purpose}]}] [V is] [M almost always] [V used] [M later] [M {前| for some quite different one}].', {
    chunks: [
      ['Data that is collected for one stated purpose', 'ある目的のために集められたと言われるデータは'],
      ['is almost always used later', 'ほとんど常にのちに使われます'],
      ['for some quite different one', 'まったく別の目的のために'],
    ],
    notes: {
      'for some quite different one': 'この one は purpose の代わりで、「別の目的」という意味です。',
    },
  }),
  st('[S A record {関係>A record| [S that] [V is kept] [M {to:副詞(目的)| [V in order to run] [O a bus service]}]}] [V can] [M eventually] [V answer] [O a question {前| about school attendance}].', {
    chunks: [
      ['A record that is kept', '保たれている記録は'],
      ['in order to run a bus service', 'バスの運行のために'],
      ['can eventually answer a question', 'やがて問いに答えることができます'],
      ['about school attendance', '学校の出席についての'],
    ],
    notes: {
      'in order to run a bus service': 'in order to ＋ 動詞 で「〜するために」。run は「（事業を）運営する」。',
    },
  }),
  st('[S That very value] [V is] [M exactly] [C {疑問詞節| [M why] [S the limits] [V have to be agreed] [M {副詞節:時| [接 before] [S the data] [V is] [M ever] [V gathered]}]}].', {
    chunks: [
      ['That very value is exactly why', 'まさにその価値こそ理由です（何のかは次へ）'],
      ['the limits have to be agreed', '制限を取り決めておかねばならない'],
      ['before the data is ever gathered', 'データが集められる前に'],
    ],
    notes: {
      'the limits have to be agreed': 'agree はここでは「取り決める」。have to be agreed で「取り決めておかねばならない」。',
    },
  }),
  st('[S Rules {関係>Rules| [S that] [V are agreed] [M later]}] [V are] [M always] [V shaped] [M {前| by the value {前| of the material {関係>the material| [S that] [V has already been collected]}}}].', {
    chunks: [
      ['Rules that are agreed later', 'あとから取り決められる規則は'],
      ['are always shaped', '必ず形づくられます（何によってかは次へ）'],
      ['by the value of the material', '集めたものの価値によって'],
      ['that has already been collected', 'すでに集められた（ものの）'],
    ],
    notes: {
      'are always shaped': 'shape は「形づくる」。ここは受け身です。',
    },
  }),
  st('[S Automation] [V performs] [O its work] [M consistently], [接 and] [M {前| for the same reason}] [S it] [V fails] [M {前| in ways {関係>ways| [S that] [V are] [C equally consistent]}}].', {
    chunks: [
      ['Automation performs its work consistently,', '自動化は仕事を一貫してこなします'],
      ['and for the same reason it fails', 'そして同じ理由で失敗もします（どう失敗かは次へ）'],
      ['in ways that are equally consistent', '同じくらい一貫したやり方で'],
    ],
    notes: {
      'in ways that are equally consistent': 'equally は「同じくらい」。consistent は「いつも同じ」。',
    },
  }),
  st('[S A human error] [V affects] [O one case] [M {前| at a time}], [M {副詞節:対比| [接 while] [S a single error {前| in the code}] [V affects] [O every single case] [M simultaneously]}].', {
    chunks: [
      ['A human error affects one case at a time,', '人の誤りは一度に一件にしか及びません'],
      ['while a single error in the code', '一方、コードの中の一つの誤りは'],
      ['affects every single case simultaneously', '全件に同時に及びます'],
    ],
    notes: {
      'A human error affects one case at a time,': 'at a time で「一度に」。',
    },
  }),
  st('[S Scale] [M therefore] [V converts] [O a small mistake] [M {前| into a very large one}] [M {前| without any change {前| at all} {前| in the mistake itself}}].', {
    chunks: [
      ['Scale therefore converts a small mistake', 'したがって規模は小さな誤りを変えます'],
      ['into a very large one', '非常に大きな誤りに'],
      ['without any change at all', 'まったく変わらないまま'],
      ['in the mistake itself', '誤りそのものは'],
    ],
    notes: {
      'into a very large one': 'convert A into B で「AをBに変える」。one は mistake の代わりです。',
    },
  }),
  st('[S {動名詞| [V Testing] [M {前| at full scale}] [M {前| before any wide deployment}]}] [V is] [M therefore] [C {並列| not simple caution | but a matter {前| of ordinary arithmetic}}].', {
    chunks: [
      ['Testing at full scale', '実際の規模で試すことは'],
      ['before any wide deployment', '広く導入する前に'],
      ['is therefore not simple caution', 'したがって単なる慎重さではなく'],
      ['but a matter of ordinary arithmetic', 'ふつうの計算の問題です'],
    ],
    notes: {
      'is therefore not simple caution': 'not A but B で「AではなくB」。',
    },
  }),
  st('[S The strongest argument {前| in favor of {動名詞| [V adopting] [O a new tool]}}] [V is] [M very rarely] [C the fact {同格that>the fact| [接 that] [S the tool] [V is] [C new]}].', {
    chunks: [
      ['The strongest argument in favor of adopting a new tool', '新しい道具を推す最も強い論拠が'],
      ['is very rarely the fact that', '〜という事実であることはごくまれです'],
      ['the tool is new', 'その道具が新しい'],
    ],
    notes: {
      'is very rarely the fact that': 'この that は同格の that で、the fact の中身を示します。',
    },
  }),
  st('[S It] [V is] [C {that節| [接 that] [S the current arrangement] [V has] [O one specific failure {関係>one specific failure| [O which] [S this particular tool] [V would] [M {前| in fact} actually] [V address]}]}].', {
    chunks: [
      ['It is that the current arrangement has', '論拠は、今の仕組みに〜があるということです'],
      ['one specific failure', '一つの具体的な欠陥'],
      ['which this particular tool would in fact actually address', 'この道具が実際に手を打てる（欠陥が）'],
    ],
    notes: {
      'which this particular tool would in fact actually address': 'address はここでは「（問題に）対処する」。which は address の目的語にあたります。',
    },
  }),
  st('[S {動名詞| [V Adopting] [O a tool] [M {前| without {動名詞| [V naming] [O that failure]}}]}] [V guarantees] [O {that節| [接 that] [S nobody] [V will be able to evaluate] [O it] [M properly] [M later]}].', {
    chunks: [
      ['Adopting a tool without naming that failure', 'その欠陥を名指しせずに道具を取り入れると'],
      ['guarantees that nobody will be able', 'だれも〜できないことが確実になります'],
      ['to evaluate it properly later', 'のちにそれをきちんと評価する'],
    ],
    notes: {
      'guarantees that nobody will be able': 'guarantee that … で「…ということを確実にする」。',
    },
  }),
  st('[S {動名詞| [V Stating] [O the expected improvement] [M {前| in advance}]}] [V is] [M much] [C the cheapest form {前| of accountability {関係>accountability| [S that] [V is] [C available] [M {前| to a public body}]}}].', {
    chunks: [
      ['Stating the expected improvement in advance', '期待される改善を前もって述べておくことが'],
      ['is much the cheapest form of accountability', '最も安上がりな説明責任の形です'],
      ['that is available to a public body', '公的機関に取りうる（形の中で）'],
    ],
    notes: {
      'is much the cheapest form of accountability': 'much は最上級を強めて「ずば抜けて」。',
    },
  }),
  st('[S No plan] [V survives] [O an entire generation] [M completely intact], [接 and] [S the genuinely useful plans] [V are designed] [M {前| from the start}] [M {to:副詞(目的)| [V to be changed]}].', {
    chunks: [
      ['No plan survives an entire generation completely intact,', 'どんな計画も一世代を丸ごと無傷では越えられません'],
      ['and the genuinely useful plans are designed', 'そして本当に役立つ計画は設計されています'],
      ['from the start to be changed', '初めから、変えられるように'],
    ],
    notes: {
      'No plan survives an entire generation completely intact,': 'intact は「そのままの・無傷の」。',
    },
  }),
  st('[S The distinction {関係>The distinction| [S that] [M really] [V matters] [M here]}] [V lies] [M {前| between {並列| decisions {関係>decisions| [S that] [V can be reversed]} | and decisions {関係>decisions| [S that] [V cannot be reversed]}}}].', {
    chunks: [
      ['The distinction that really matters here', 'ここで本当に大切な区別は'],
      ['lies between decisions that can be reversed', '撤回できる決定と'],
      ['and decisions that cannot be reversed', '撤回できない決定とのあいだにあります'],
    ],
    notes: {
      'lies between decisions that can be reversed': 'lie between A and B で「AとBのあいだにある」。',
    },
  }),
  st('[S A tax rate] [V can be adjusted] [M again] [M next year], [M {副詞節:対比| [接 while] [S a building {関係>a building| [S that] [V has once been destroyed]}] [V can] [M never] [V be restored]}].', {
    chunks: [
      ['A tax rate can be adjusted again next year,', '税率は翌年また調整できます'],
      ['while a building that has once been destroyed', '一方、いったん壊された建物は'],
      ['can never be restored', '決して元に戻せません'],
    ],
    notes: {
      'while a building that has once been destroyed': 'once はここでは「いったん〜すると」。',
    },
  }),
  st('[S Decisions {関係>Decisions| [S that] [V cannot be reversed]}] [M therefore] [V deserve] [O a much higher standard {前| of evidence}] [M {前| than decisions {関係>decisions| [S that] [V can]}}].', {
    chunks: [
      ['Decisions that cannot be reversed', '撤回できない決定は'],
      ['therefore deserve a much higher standard of evidence', 'したがってずっと高い証拠の水準に値します'],
      ['than decisions that can', '撤回できる決定よりも'],
    ],
    notes: {
      'than decisions that can': 'that can の後ろに be reversed が省かれています。',
    },
  }),
  st('[S Uncertainty] [V is] [M really] [C an argument {前| for {動名詞| [V keeping] [O options] [C open]}} {前| rather than an argument {前| for {動名詞| [V doing] [O nothing] [M {前| at all}]}}}].', {
    chunks: [
      ['Uncertainty is really an argument', '不確実性は本当は論拠です（何のかは次へ）'],
      ['for keeping options open', '選択肢を開いておくことの'],
      ['rather than an argument for doing nothing at all', 'まったく何もしないことの論拠ではなく'],
    ],
    notes: {
      'for keeping options open': 'an argument for … で「…を支える論拠」。',
    },
  }),
  st('[S {動名詞| [V Doing] [O nothing]}] [V is] [M itself] [C a decision], [接 and] [S it] [V is] [M frequently] [C the hardest decision {前| of all} {to:副詞(形容詞)| [V to reverse] [M {前| at a later date}]}].', {
    chunks: [
      ['Doing nothing is itself a decision,', '何もしないこと自体が一つの決定です'],
      ['and it is frequently the hardest decision of all', 'そしてしばしば最も難しい決定です'],
      ['to reverse at a later date', 'あとで撤回するのが'],
    ],
    notes: {
      'to reverse at a later date': 'the hardest … to reverse で「撤回するのが最も難しい…」。',
    },
  }),
  st('[S Land {関係>Land| [S that] [V has been built on]}] [V cannot] [M easily] [V be cleared] [M again], [接 and] [S a species {関係>a species| [S that] [V is] [M once] [V lost]}] [V does not come back].', {
    chunks: [
      ['Land that has been built on', 'すでに建物が建った土地は'],
      ['cannot easily be cleared again,', '再び更地にするのは簡単ではありません'],
      ['and a species that is once lost does not come back', 'そして一度失われた種は戻ってきません'],
    ],
    notes: {
      'Land that has been built on': 'build on … で「…の上に建てる」。受け身なので、節の終わりに on が残っています。',
    },
  }),
  st('[S Delay] [V is] [M therefore] [M only] [C prudent] [M {前| in those particular cases {関係>those particular cases| [M where] [S the delay itself] [M genuinely] [V preserves] [O the choice] [M {前| for later}]}}].', {
    chunks: [
      ['Delay is therefore only prudent', 'したがって遅らせることが賢明なのは（どんな場合かは次へ）'],
      ['in those particular cases', 'そうした場合だけです'],
      ['where the delay itself genuinely preserves the choice', 'その遅れ自体が本当に選択を保つ'],
      ['for later', 'あとのために'],
    ],
    notes: {
      'Delay is therefore only prudent': 'prudent は「賢明な・用心深い」。',
    },
  }),
  st('[S A clearly stated review date] [V is] [M much] [C the cheapest instrument {前| for {動名詞| [V building] [O revision] [M {前| into almost any decision}]}}].', {
    chunks: [
      ['A clearly stated review date', 'はっきり示された見直しの期日は'],
      ['is much the cheapest instrument', 'ずば抜けて安上がりな道具です'],
      ['for building revision into almost any decision', 'ほとんどどんな決定にも見直しを組み込むための'],
    ],
    notes: {
      'for building revision into almost any decision': 'build A into B で「AをBに組み込む」。',
    },
  }),
  st('[S It] [V converts] [O a permanent commitment] [M {前| into a temporary one}] [M {前| without {動名詞| [V weakening] [O its force] [M {前| in any way} {前| at all}] [M today]}}].', {
    chunks: [
      ['It converts a permanent commitment', 'それは恒久的な約束を変えます'],
      ['into a temporary one', '暫定的なものに'],
      ['without weakening its force in any way at all today', '今日の効力をいささかも弱めずに'],
    ],
    notes: {
      'It converts a permanent commitment': 'commitment は「約束・確約」。',
    },
  }),
  st('[M {前| Without such a date}], [S a rule] [M simply] [V continues] [M {前| in force}] [M {副詞節:時| [接 until] [S someone] [V spends] [O real effort] [M {前| on {動名詞| [V getting] [O it] [C removed]}}]}].', {
    chunks: [
      ['Without such a date,', 'そのような期日がなければ'],
      ['a rule simply continues in force', '規則はただ効力を持ち続けます'],
      ['until someone spends real effort', 'だれかが実際に労力をかけるまで'],
      ['on getting it removed', 'それを取り除いてもらうことに'],
    ],
    notes: {
      'on getting it removed': 'get ＋ 目的語 ＋ 過去分詞 で「〜を…してもらう」。',
    },
  }),
  st('[S That asymmetry] [V explains] [O {疑問詞節| [M why] [S obsolete rules] [V accumulate] [M steadily] [M {前| in almost every long-lived public organization} there is]}].', {
    chunks: [
      ['That asymmetry explains why', 'この非対称が理由を説明します（何のかは次へ）'],
      ['obsolete rules accumulate steadily', '時代遅れの規則が着実にたまる'],
      ['in almost every long-lived public organization there is', '長く続く公的な組織のほとんどどれにも'],
    ],
    notes: {
      'in almost every long-lived public organization there is': 'every ＋ 名詞 ＋ there is で「存在するどの…にも」。',
    },
  }),
  st('[S Residents {関係>Residents| [S who] [V will live] [M {前| in this city}] [M {前| in fifty years}]}] [V cannot speak] [M {前| at any meeting {関係>any meeting| [S that] [V is arranged] [M today]}}].', {
    chunks: [
      ['Residents who will live in this city', 'この都市で暮らす住民は'],
      ['in fifty years', '五十年後に'],
      ['cannot speak at any meeting', 'どの会合でも発言できません'],
      ['that is arranged today', '今日開かれる（会合では）'],
    ],
    notes: {
      'in fifty years': 'in ＋ 期間 で「〜後に」。',
    },
  }),
  st('[S Any procedure {関係>Any procedure| [S that] [V counts] [O only the voices actually present {前| in the room}]}] [V will] [M systematically] [V favor] [O the people {前| of the present}].', {
    chunks: [
      ['Any procedure that counts only the voices', '声だけを数える手続きは'],
      ['actually present in the room', 'その部屋に実際にいる（声だけを）'],
      ['will systematically favor the people of the present', '決まって今の人々を有利にします'],
    ],
    notes: {
      'actually present in the room': 'present はここでは形容詞で「その場にいる」。voices を後ろから説明します。',
    },
  }),
  st('[S Some cities] [M now] [V appoint] [O an officer {関係>an officer| [S whose one formal task] [V is] [C {to:補語| [V to state] [O the long-term case] [M {前| at every public meeting}]}]}].', {
    chunks: [
      ['Some cities now appoint an officer', 'いまでは職員を置く都市もあります（どんな職員かは次へ）'],
      ['whose one formal task is', 'その職員の唯一の正式な仕事は'],
      ['to state the long-term case at every public meeting', 'どの公の会合でも長期の立場を述べることです'],
    ],
    notes: {
      'whose one formal task is': 'whose ＋ 名詞 で「その人の〜」。ここは an officer の職務を指します。',
    },
  }),
  st('[S That device] [V is] [C {前| far from perfect}], [接 and] [M yet] [S it] [V is] [C better] [M {前| than {動名詞| [M simply] [V assuming] [O {that節| [接 that] [S someone else] [V will remember]}]}}].', {
    chunks: [
      ['That device is far from perfect,', 'その仕掛けは完全からはほど遠いのですが'],
      ['and yet it is better', 'それでもましです（何よりかは次へ）'],
      ['than simply assuming that someone else will remember', 'だれかが覚えているだろうとただ思うよりも'],
    ],
    notes: {
      'That device is far from perfect,': 'far from ＋ 形容詞 で「〜からはほど遠い」。',
    },
  }),
  st('[S A city {関係>A city| [S that] [V expects] [O {to:名詞| [V to be] [C wrong] [M {前| about something}]}]}] [V builds] [M {前| in quite a different way}] [M {前| from one {関係>one| [S that] [V expects] [O {to:名詞| [V to be] [C right]}]}}].', {
    chunks: [
      ['A city that expects to be wrong about something', '何かで自分は誤りうると考える都市は'],
      ['builds in quite a different way', 'かなり違うやり方で造ります'],
      ['from one that expects to be right', '正しいと考える都市とは'],
    ],
    notes: {
      'from one that expects to be right': 'この one は a city の代わりです。',
    },
  }),
  st('[S It] [V leaves] [O physical space], [V keeps] [O its records], [V states] [O its assumptions], [接 and] [V schedules] [O the exact moment {前| of the next review}].', {
    chunks: [
      ['It leaves physical space,', 'それは物理的な余地を残し'],
      ['keeps its records,', '記録を保ち'],
      ['states its assumptions,', '前提を述べ'],
      ['and schedules the exact moment of the next review', 'そして次の見直しの時を予定に入れます'],
    ],
    notes: {
      'and schedules the exact moment of the next review': 'schedule は動詞で「予定に組み入れる」。',
    },
  }),
  st('[S None {前| of that}] [V guarantees] [O a good outcome], [M {前| for the simple reason {同格that>the simple reason| [接 that] [S no arrangement {前| at all}] [V can] [M ever] [V promise] [O one]}}].', {
    chunks: [
      ['None of that guarantees a good outcome,', 'そのどれもよい結果を保証しません'],
      ['for the simple reason that', '〜という単純な理由からです（内容は次へ）'],
      ['no arrangement at all can ever promise one', 'どんな仕組みもそれを約束できないという'],
    ],
    notes: {
      'no arrangement at all can ever promise one': 'この one は a good outcome の代わりです。',
    },
  }),
  st('[S {what節| [O What] [S it] [V does guarantee]}] [V is] [C {that節| [接 that] [S a mistake] [V will be found] [M {前| at a time {関係>a time| [M when] [M there] [V is] [M still] [S time {to:形容詞>time| [V to put] [O it] [C right]}]}}]}].', {
    chunks: [
      ['What it does guarantee is that', 'それが確かに保証するのは〜ということです'],
      ['a mistake will be found at a time', '誤りがその時点で見つかる'],
      ['when there is still time to put it right', 'まだ直す時間が残っているときに'],
    ],
    notes: {
      'What it does guarantee is that': 'does guarantee の does は guarantee を強めて「確かに保証する」。',
    },
  }),
])
