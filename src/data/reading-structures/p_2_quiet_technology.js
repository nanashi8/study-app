import { st } from './entry.js'

export default Object.freeze([
  st('[M {副詞節:時| [接 When] [S people] [V discuss] [O technology]}], [S they] [M often] [V imagine] [O large machines, bright screens, or dramatic changes {前| in daily life}].', {
    chunks: [
      ['When', '〜するとき（内容は次へ）'],
      ['people discuss technology', '人々がテクノロジーについて話す（とき）'],
      ['they often imagine', '人々はよく思い浮かべます（何をかは次へ）'],
      ['large machines, bright screens,', '大きな機械や明るい画面'],
      ['or dramatic changes in daily life', 'あるいは日常生活の劇的な変化を'],
    ],
    notes: {
      'people discuss technology': 'discuss は他動詞なので about を付けず、discuss technology で「テクノロジーについて話し合う」。',
    },
  }),
  st('[M {前| In recent years}], [M however], [S some {前| of the most useful technologies}] [V have been designed] [M {to:副詞(目的)| [V to be] [M almost] [C invisible]}].', {
    chunks: [
      ['In recent years', '近年'],
      ['however,', 'しかし'],
      ['some of the most useful technologies', '最も役に立つテクノロジーのいくつかは'],
      ['have been designed to be almost invisible', 'ほとんど目立たないように設計されてきました'],
    ],
    notes: {
      'have been designed to be almost invisible': 'have been designed は現在完了の受け身で「設計されてきた」。invisible は「目に見えない」で、ここでは使う人がほとんど気づかないという意味です。',
    },
  }),
  st('[M {前| For example}], [S several train stations] [V have introduced] [O sensors {関係>sensors| [S that] [V measure] [O {疑問詞節| [C how crowded] [S each platform] [V is]}]}].', {
    chunks: [
      ['For example', '例えば'],
      ['several train stations', 'いくつかの駅は'],
      ['have introduced sensors', 'センサーを導入しました'],
      ['that measure', 'そしてそのセンサーは測ります（何をかは次へ）'],
      ['how crowded each platform is', 'それぞれのホームがどれほど混雑しているかを'],
    ],
    notes: {
      'how crowded each platform is': 'how ＋ 形容詞 ＋ S ＋ V で「Sがどれほど〜か」。how crowded が is の補語です。',
    },
  }),
  st('[S The information] [V is sent] [M {前| to signs and phone apps}], [接 so] [S passengers] [V can choose] [O a less crowded area] [M {副詞節:時| [接 before] [S the train] [V arrives]}].', {
    chunks: [
      ['The information is sent', 'その情報は送られます'],
      ['to signs and phone apps', '表示板とスマートフォンのアプリへ'],
      ['so', 'そのため'],
      ['passengers', '乗客は'],
      ['can choose a less crowded area', 'より空いている場所を選べます'],
      ['before', '〜する前に（内容は次へ）'],
      ['the train arrives', '電車が到着する（前に）'],
    ],
    notes: {
      'can choose a less crowded area': 'less crowded は「より混雑していない」つまり「より空いている」。',
    },
  }),
  st('[S The system] [V does not tell] [O1 people] [O2 {疑問詞to| [O what] [V to do]}], [接 but] [S it] [V gives] [O1 them] [O2 a better source {前| of information}].', {
    chunks: [
      ['The system', 'その仕組みは'],
      ['does not tell people what to do', '人々に何をすべきかを指示するのではありません'],
      ['but', 'そうではなく'],
      ['it', 'その仕組みは'],
      ['gives them a better source of information', '人々により良い情報源を与えます'],
    ],
    notes: {
      'does not tell people what to do': 'tell ＋ 人 ＋ what to do で「人に何をすべきかを言う」。what to do は「何をすべきか」。',
      'gives them a better source of information': 'give ＋ 人 ＋ もの で「人にものを与える」。',
    },
  }),
  st('[S This small difference] [V can reduce] [O stress], [M especially {前| for elderly passengers or parents {現在分詞>parents| [V traveling] [M {前| with children}]}}].', {
    chunks: [
      ['This small difference', 'この小さな違いは'],
      ['can reduce stress,', 'ストレスを減らすことができます'],
      ['especially for elderly passengers', '特に高齢の乗客にとって'],
      ['or parents traveling with children', 'あるいは子どもを連れて移動する親にとって'],
    ],
    notes: {
      'or parents traveling with children': 'traveling with children は parents を後ろから説明する現在分詞のまとまりです。',
    },
  }),
  st('[S Another example] [V can be found] [M {前| in public libraries}].', {
    chunks: [
      ['Another example can be found', '別の例も見られます'],
      ['in public libraries', '公共図書館に'],
    ],
  }),
  st('[S Some libraries] [M now] [V use] [O quiet air-control systems {関係>quiet air-control systems| [S that] [V keep] [O rooms] [C comfortable] [M {副詞節:対比| [接 while] [V using] [O less energy {前| than older equipment}]}]}].', {
    chunks: [
      ['Some libraries', '一部の図書館は'],
      ['now', '今では'],
      ['use quiet air-control systems', '静かな空調システムを使っています'],
      ['that', 'そしてそのシステムは'],
      ['keep rooms comfortable', '部屋を快適に保ちます'],
      ['while using less energy', 'より少ないエネルギーで（保ちます）'],
      ['than older equipment', '古い設備よりも'],
    ],
    notes: {
      'keep rooms comfortable': 'keep ＋ O ＋ C で「OをCの状態に保つ」。',
      'while using less energy': 'while using は while (they are) using の形で、「〜しながら・〜と同時に」。',
    },
  }),
  st('[S Visitors] [V may not notice] [O the system] [M {前| at all}], [接 yet] [S it] [V affects] [O {疑問詞節| [M how long] [S they] [V can read] [接 or] [V study] [M {前| without {動名詞| [V becoming] [C tired]}}]}].', {
    chunks: [
      ['Visitors', '来館者は'],
      ['may not notice the system at all', 'そのシステムにまったく気づかないかもしれません'],
      ['yet', 'それでも'],
      ['it affects', 'そのシステムは影響しています（何にかは次へ）'],
      ['how long they can read or study', '来館者がどのくらい長く読書や勉強ができるか（に）'],
      ['without becoming tired', '疲れることなく'],
    ],
    notes: {
      'may not notice the system at all': 'not … at all で「まったく〜ない」。',
      yet: 'yet はここでは「それでも・しかし」という接続詞です。',
      'how long they can read or study': 'how long 以下は「どのくらい長く〜できるか」という名詞のまとまりで、affects の目的語です。',
    },
  }),
  st('[S These cases] [V suggest] [O {that節| [接 that] [S successful technology] [V is] [M not always] [C the technology {関係>the technology| [S that] [V attracts] [O the most attention]}]}].', {
    chunks: [
      ['These cases suggest', 'これらの例は示しています（内容は次へ）'],
      ['that', '〜ということを'],
      ['successful technology', '成功したテクノロジーが'],
      ['is not always the technology', '必ずしもそのテクノロジーだとは限らない（どんなテクノロジーかは次へ）'],
      ['that attracts the most attention', '最も多くの注目を集める（テクノロジーだとは）'],
    ],
    notes: {
      'is not always the technology': 'not always は「必ずしも〜とは限らない」という部分否定です。',
    },
  }),
  st('[S Cost] [V is] [M still] [C an important factor], [接 and] [S cities] [V must consider] [O {whether節| [接 whether] [S new systems] [V can be maintained] [M {前| for many years}]}].', {
    chunks: [
      ['Cost', '費用は'],
      ['is still an important factor', '今でも重要な要因です'],
      ['and', 'そして'],
      ['cities must consider', '都市は考えなければなりません（何をかは次へ）'],
      ['whether', '〜かどうかを'],
      ['new systems can be maintained', '新しいシステムを維持できる（かどうかを）'],
      ['for many years', '何年にもわたって'],
    ],
    notes: {
      whether: 'whether 以下は「〜かどうか」という名詞のまとまりで、consider の目的語です。',
    },
  }),
  st('[S Privacy] [V is] [C another concern] [M {副詞節:理由| [接 because] [S sensors] [V can collect] [O data {前| about public behavior}]}].', {
    chunks: [
      ['Privacy', 'プライバシーは'],
      ['is another concern', 'もう一つの懸念です'],
      ['because', 'なぜなら'],
      ['sensors', 'センサーは'],
      ['can collect data', 'データを集められます'],
      ['about public behavior', '公共の場での行動についての（データを集められるからです）'],
    ],
  }),
  st('[M {前| For that reason}], [S officials] [V should explain] [M clearly] [O {疑問詞節| [S what kind of data] [V is collected]} and {疑問詞節| [M how] [S it] [V will be protected]}].', {
    chunks: [
      ['For that reason', 'その理由から'],
      ['officials should explain', '担当者は説明するべきです（何をかは次へ）'],
      ['clearly', 'はっきりと'],
      ['what kind of data is collected', 'どんな種類のデータが集められるのか'],
      ['and how it will be protected', 'そして、それがどのように守られるのかを'],
    ],
    notes: {
      'what kind of data is collected': 'what kind of data は「どんな種類のデータ」で、疑問詞のまとまりが節の主語です。',
      'and how it will be protected': '二つの疑問詞の節が and で並び、どちらも explain の目的語です。it は data を指します。',
    },
  }),
  st('[M There] [V is] [M also] [S a social problem {関係>a social problem| [S that] [V is] [C easy {to:副詞(形容詞)| [V to overlook]}]}].', {
    chunks: [
      ['There is', 'あります（何があるかは次へ）'],
      ['also', 'また'],
      ['a social problem', '社会的な問題が'],
      ['that', 'そしてその問題は'],
      ['is easy to overlook', '見落とされやすいのです'],
    ],
    notes: {
      'There is': 'There is ＋ 名詞 で「〜がある」。主語は後ろの a social problem です。',
      'is easy to overlook': 'easy to overlook で「見落としやすい」。問題そのものが見落とされる側です。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [M only] [S wealthy areas] [V receive] [O the newest systems]}], [S technology] [V may make] [O public services] [C more unequal] [M {前| instead of more convenient}].', {
    chunks: [
      ['If', 'もし'],
      ['only wealthy areas', '裕福な地域だけが'],
      ['receive the newest systems', '最新のシステムを受け取るなら'],
      ['technology', 'テクノロジーは'],
      ['may make public services more unequal', '公共サービスをより不平等にするかもしれません'],
      ['instead of more convenient', 'より便利にするのではなく'],
    ],
    notes: {
      'may make public services more unequal': 'make ＋ O ＋ C で「OをCにする」。',
      'instead of more convenient': 'instead of more convenient は「（公共サービスを）より便利にするのではなく」と、C の more unequal と比べています。',
    },
  }),
  st('[S City leaders] [M therefore] [V need] [O {to:名詞| [V to ask] [O {疑問詞節| [M where] [S a new system] [V will have] [O the greatest effect]} and {疑問詞節| [S who] [V might be left out]}]}].', {
    chunks: [
      ['City leaders therefore need to ask', 'そのため都市の指導者は問う必要があります（何をかは次へ）'],
      ['where a new system', '新しいシステムがどこで'],
      ['will have the greatest effect', '最も大きな効果を上げるのか'],
      ['and who might be left out', 'そして、だれが取り残されるかもしれないのかを'],
    ],
    notes: {
      'and who might be left out': 'leave out は「取り残す・外す」。be left out はその受け身です。',
    },
  }),
  st('[M {前| In some cases}], [S a simple repair {前| to an old bus stop or a clearer sign}] [V may help] [O residents] [M more {前| than an expensive digital service}].', {
    chunks: [
      ['In some cases', '場合によっては'],
      ['a simple repair to an old bus stop', '古いバス停のちょっとした修理や'],
      ['or a clearer sign', 'より分かりやすい標識のほうが'],
      ['may help residents', '住民の役に立つかもしれません'],
      ['more than an expensive digital service', '高価なデジタルサービスよりも'],
    ],
  }),
  st('[S Several cities] [V have] [M therefore] [V begun] [O small trial programs] [M {前| before {動名詞| [V introducing] [O a system] [M everywhere]}}].', {
    chunks: [
      ['Several cities', 'いくつかの都市は'],
      ['have therefore begun small trial programs', 'そのため小規模な試験運用を始めています'],
      ['before introducing a system everywhere', 'システムを全域に導入する前に'],
    ],
    notes: {
      'before introducing a system everywhere': 'before ＋ -ing で「〜する前に」。introducing は前置詞 before の後ろの動名詞です。',
    },
  }),
  st('[S They] [V compare] [O energy use, waiting times, and complaints] [M {前| in different neighborhoods}] [接 and] [M then] [V publish] [O the results].', {
    chunks: [
      ['They', '都市は'],
      ['compare energy use, waiting times, and complaints', 'エネルギー使用量や待ち時間、苦情を比べます'],
      ['in different neighborhoods', '地域ごとに'],
      ['and then publish the results', 'そして、その結果を公表します'],
    ],
    notes: {
      They: 'They は前の文の Several cities を指します。',
    },
  }),
  st('[S This evidence] [V makes] [仮O it] [C easier] [真O {to:名詞| [V to improve] [O a design] [接 or] [V decide] [O {that節| [接 that] [S a simpler solution] [V would work] [M better]}]}].', {
    chunks: [
      ['This evidence', 'この根拠は'],
      ['makes it easier', '〜することをより簡単にします（it の中身は次へ）'],
      ['to improve a design', '設計を改善すること'],
      ['or decide', 'あるいは判断すること（内容は次へ）'],
      ['that a simpler solution would work better', 'より単純な解決策のほうがうまくいく、と'],
    ],
    notes: {
      'makes it easier': 'it は形式目的語で、中身は後ろの to improve … or decide … です。make it easier to do で「〜するのをより簡単にする」。',
      'or decide': 'decide は to improve と to を共有しています（(to) decide）。',
      'that a simpler solution would work better': 'would は「（そうすれば）〜だろう」という控えめな推量です。',
    },
  }),
  st('[S Technology] [V should be judged] [M not {前| by {疑問詞節| [C how modern] [S it] [V appears]}}], [接 but] [M {前| by {whether節| [接 whether] [S it] [V solves] [O a real problem {前| for the people {関係>the people| [S who] [V use] [O the space]}}]}}].', {
    chunks: [
      ['Technology should be judged', 'テクノロジーは判断されるべきです（何によってかは次へ）'],
      ['not by how modern it appears,', 'それがどれほど現代的に見えるかによってではなく'],
      ['but by whether', '〜かどうかによって（内容は次へ）'],
      ['it solves a real problem', 'それが実際の問題を解決する（かどうか）'],
      ['for the people', '人々にとっての（問題を）'],
      ['who use the space', 'その空間を使う（人々にとっての）'],
    ],
    notes: {
      'not by how modern it appears,': 'not by A but by B で「AによってではなくBによって」。how modern は「どれほど現代的に」で、appears の補語です。',
      'but by whether': 'whether 以下は「〜かどうか」という名詞のまとまりで、前置詞 by の目的語です。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S these issues] [V are handled] [M carefully]}], [S quiet technology] [V can improve] [O public spaces] [M {前| without {動名詞| [V making] [O people] [C {原形| [V feel] [C controlled {前| by it}]}]}}].', {
    chunks: [
      ['If', 'もし'],
      ['these issues are handled carefully', 'これらの問題が慎重に扱われれば'],
      ['quiet technology', '静かなテクノロジーは'],
      ['can improve public spaces', '公共空間をよりよくすることができます'],
      ['without making people feel controlled by it', '人々に、それに支配されていると感じさせることなく'],
    ],
    notes: {
      'without making people feel controlled by it': 'make ＋ 人 ＋ 動詞の原形 で「人に〜させる」。feel controlled で「支配されていると感じる」。it は quiet technology を指します。',
    },
  }),
])
