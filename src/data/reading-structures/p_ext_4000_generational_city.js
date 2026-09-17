import { st } from './entry.js'

// 語彙強化ロングリーディング（約4,000語）の構造台帳。節ごとに手で確かめて足していく。
// いまは「翌年より先を考える」（#1〜#20）まで。残りの文は、台帳ができるまで解析器の表示のまま。
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
])
