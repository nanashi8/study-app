import { st } from './entry.js'

export default Object.freeze([
  st('[S Predictions {前| about {動名詞| [S machines] [V replacing] [O human work]}}] [V are] [C older {前| than the machines themselves}].', {
    chunks: [
      ['Predictions about machines replacing human work', '機械が人間の仕事に取って代わるという予測は'],
      ['are older than the machines themselves', '機械そのものよりも古くからあります'],
    ],
    notes: {
      'Predictions about machines replacing human work': 'machines replacing human work は about の後ろの動名詞のまとまりで、machines が replacing の意味上の主語です。「機械が〜すること」と読みます。',
      'are older than the machines themselves': 'older は old の比較級。themselves は「〜そのもの」と machines を強めます。',
    },
    rules: ['paragraph-map', 'ing-ed-role', 'comparison-pairs'],
  }),
  st('[S Each generation] [V has produced] [O confident forecasts], [接 and] [S most {前| of them}] [V have been] [C wrong] [M {前| in interesting ways}].', {
    chunks: [
      ['Each generation has produced confident forecasts,', 'どの世代も、自信たっぷりの予測を生んできました'],
      ['and most of them have been wrong', 'そしてその大半は、外れてきました（どう外れたかは次へ）'],
      ['in interesting ways', '興味深い形で'],
    ],
    notes: {
      'Each generation has produced confident forecasts,': 'has produced は現在完了で「（今までに）生んできた」。forecast は「予測」。',
      'and most of them have been wrong': 'them は confident forecasts を指します。have been wrong は「（ずっと）外れてきた」。',
    },
  }),
  st('[S Recent systems {関係>Recent systems| [S that] [V generate] [O {並列| text, | images, | and computer code}]}] [V have revived] [O the debate] [M {前| with unusual intensity}].', {
    chunks: [
      ['Recent systems', '最近のシステムが（どんなものかは次へ）'],
      ['that generate text, images, and computer code', '文章や画像、プログラムを作り出す（システムが）'],
      ['have revived the debate', 'その議論をよみがえらせました（どのようにかは次へ）'],
      ['with unusual intensity', 'いつにない激しさで'],
    ],
    notes: {
      'that generate text, images, and computer code': 'generate は「作り出す」。computer code は「プログラム」。',
      'have revived the debate': 'revive は「よみがえらせる」。the debate は、機械が仕事を奪うかどうかの議論です。',
    },
  }),
  st('[S Public discussion] [M often] [V moves] [M {前| between two extremes}], [M {分詞構文:付帯状況| [V promising] [O {並列| mass unemployment | or effortless wealth}]}].', {
    chunks: [
      ['Public discussion often moves between two extremes,', '世間の議論はしばしば、二つの極端の間を揺れ動きます'],
      ['promising mass unemployment or effortless wealth', '大量の失業か、苦労のいらない豊かさが来ると言いながら'],
    ],
    notes: {
      'Public discussion often moves between two extremes,': 'extreme は名詞で「極端（な考え）」。',
      'promising mass unemployment or effortless wealth': 'promising は分詞構文で、主語は Public discussion。promise はここでは「〜が来ると請け合う」。二つの極端の中身が mass unemployment と effortless wealth です。',
    },
  }),
  st('[S The current technology] [V differs] [M {前| from earlier automation}] [M {前| in one important respect}].', {
    chunks: [
      ['The current technology differs from earlier automation', '今の技術は、以前の自動化とは違います（どの点でかは次へ）'],
      ['in one important respect', '一つの大事な点で'],
    ],
    notes: {
      'The current technology differs from earlier automation': 'differ from 〜 で「〜と違う」。automation は「自動化」。',
      'in one important respect': 'respect はここでは「点」。次の文からその点の説明が始まります。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'main-clause-skeleton'],
  }),
  st('[S Previous machines] [M mainly] [V replaced] [O {並列| physical effort | or highly repetitive calculation}].', {
    chunks: [
      ['Previous machines mainly replaced physical effort', '以前の機械は主に、体を使う労力を置き換えました'],
      ['or highly repetitive calculation', 'あるいは、同じことをくり返す計算を'],
    ],
    notes: {
      'Previous machines mainly replaced physical effort': 'mainly は「主に」。replace は「取って代わる・置き換える」。',
      'or highly repetitive calculation': 'or は replaced の二つ目の目的語を加えます。repetitive は「くり返しの多い」。',
    },
  }),
  st('[S The newer systems] [V produce] [O {並列| drafts, | summaries, | and designs} {関係>drafts, summaries, and designs| [S that] [V resemble] [O skilled office work]}].', {
    chunks: [
      ['The newer systems produce drafts, summaries, and designs', '新しいシステムは、下書きや要約、設計を作ります（どんなものかは次へ）'],
      ['that resemble skilled office work', '熟練した事務の仕事に似た（ものを）'],
    ],
    notes: {
      'The newer systems produce drafts, summaries, and designs': 'newer は new の比較級で、前の文の Previous machines と対比しています。',
      'that resemble skilled office work': 'resemble は「〜に似ている」。前の文の「体を使う労力」とは違い、頭を使う仕事に近いということです。',
    },
  }),
  st('[S Tasks {関係>Tasks| [S that] [V seemed] [C safe] [M {副詞節:理由| [接 because] [S they] [V required] [O judgment]}]}] [M now] [V appear] [C partly reproducible].', {
    chunks: [
      ['Tasks that seemed safe because they required judgment', '判断が必要なので安全だと思われていた作業が'],
      ['now appear partly reproducible', '今では、一部は機械でもまねできるように見えます'],
    ],
    notes: {
      'Tasks that seemed safe because they required judgment': 'safe はここでは「（機械に取られない）安全な」。they は Tasks を指します。',
      'now appear partly reproducible': 'appear ＋ 形容詞 で「〜に見える」。reproducible は「再現できる」、partly は「一部は」。',
    },
  }),
  st('[S {並列| Programmers, | translators, | designers, | and junior analysts}] [V have] [M all] [V noticed] [O changes {前| in demand}].', {
    chunks: [
      ['Programmers, translators, designers, and junior analysts', 'プログラマー、翻訳者、デザイナー、若手のアナリストは'],
      ['have all noticed changes in demand', 'みな、求められ方の変化に気づいています'],
    ],
    notes: {
      'have all noticed changes in demand': 'have noticed の間の all は、主語の4つの職業を受けて「みな」。demand は「需要（求められる量）」。',
    },
  }),
  st('[S Careful studies] [V describe] [O change] [M {前| at the level {前| of tasks {前| rather than whole occupations}}}].', {
    chunks: [
      ['Careful studies describe change', '注意深い研究は、変化をとらえます（どの単位でかは次へ）'],
      ['at the level of tasks', '作業の単位で'],
      ['rather than whole occupations', '職業全体ではなく'],
    ],
    notes: {
      'at the level of tasks': 'at the level of 〜 で「〜の単位で」。task は仕事の中の一つ一つの「作業」です。',
      'rather than whole occupations': 'A rather than B で「BではなくA」。tasks と whole occupations を比べています。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'noun-boundary'],
  }),
  st('[S Most jobs] [V consist] [M {前| of many tasks}], [接 and] [M only] [S some {前| of them}] [V can be automated] [M well].', {
    chunks: [
      ['Most jobs consist of many tasks,', 'ほとんどの仕事は、たくさんの作業からできていて'],
      ['and only some of them', 'そのうちの一部だけが'],
      ['can be automated well', 'うまく自動化できます'],
    ],
    notes: {
      'Most jobs consist of many tasks,': 'consist of 〜 で「〜からできている」。',
      'and only some of them': 'only は some of them を「一部だけ」と限ります。them は many tasks を指します。',
    },
  }),
  st('[S A hospital doctor] [V reads] [O images], [接 but] [M also] [V explains] [O results], [V weighs] [O uncertainty], [接 and] [V decides] [O {疑問詞to| [O what] [V to do] [M next]}].', {
    chunks: [
      ['A hospital doctor reads images,', '病院の医師は、画像を読み取ります'],
      ['but also explains results, weighs uncertainty,', 'しかし、結果を説明し、不確かさを見きわめ'],
      ['and decides what to do next', '次に何をするかも決めます'],
    ],
    notes: {
      'but also explains results, weighs uncertainty,': 'but の後ろの explains・weighs・decides の主語も A hospital doctor です。weigh はここでは「よく考えて見きわめる」。',
      'and decides what to do next': 'what to do で「何をすべきか」。画像を読む以外の作業の例です。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S one task] [V becomes] [C cheaper]}], [S the value {前| of the remaining tasks}] [M often] [V rises].', {
    chunks: [
      ['When one task becomes cheaper,', '一つの作業が安くなると'],
      ['the value of the remaining tasks often rises', '残りの作業の価値が上がることがよくあります'],
    ],
    notes: {
      'When one task becomes cheaper,': 'cheaper は cheap の比較級。機械に任せて安くできる、ということです。',
      'the value of the remaining tasks often rises': 'remaining は「残っている」。rise は「上がる」。',
    },
  }),
  st('[S The whole service] [V may] [M then] [V attract] [O more demand {前| rather than less}].', {
    chunks: [
      ['The whole service may then attract more demand', 'そうなると、そのサービス全体は、かえって多くの需要を集めるかもしれません（何と比べてかは次へ）'],
      ['rather than less', '減るのではなく'],
    ],
    notes: {
      'The whole service may then attract more demand': 'then は「そうなると」。may は「〜かもしれない」。attract は「引きつける」。',
      'rather than less': 'less は less demand のことで、「需要が減るのではなく」。',
    },
  }),
  st('[S This pattern] [V has appeared] [M before] [M {前| in other fields}].', {
    chunks: [
      ['This pattern has appeared before in other fields', 'この型は、ほかの分野でも以前に現れています'],
    ],
    notes: {
      'This pattern has appeared before in other fields': 'This pattern は、前の段落の「一つの作業が安くなると、残りの価値と需要が上がる」流れのことです。before は「以前に」という副詞です。',
    },
    rules: ['paragraph-map', 'reference-chain', 'main-clause-skeleton'],
  }),
  st('[S Cash machines] [V reduced] [O the routine work {前| of bank clerks}].', {
    chunks: [
      ['Cash machines reduced the routine work', 'ATM は、決まりきった仕事を減らしました（だれのかは次へ）'],
      ['of bank clerks', '銀行の窓口係の'],
    ],
    notes: {
      'Cash machines reduced the routine work': 'cash machine は「現金自動預け払い機（ATM）」。routine は「決まりきった」。',
    },
  }),
  st('[S Branches] [V became] [C cheaper {to:副詞(形容詞)| [V to operate]}], [接 so] [S banks] [V opened] [O more {前| of them}], [接 and] [S staff] [V moved] [M {前| toward {並列| advice | and sales}}].', {
    chunks: [
      ['Branches became cheaper to operate,', '支店を動かす費用が安くなったので'],
      ['so banks opened more of them,', '銀行は支店をさらに増やし'],
      ['and staff moved toward advice and sales', '行員は相談や販売の仕事へ移りました'],
    ],
    notes: {
      'Branches became cheaper to operate,': 'cheaper to operate で「運営するのがより安い」。to operate は形容詞 cheaper の中身を限定します。',
      'so banks opened more of them,': 'them は Branches を指します。so は「だから」と結果を続けます。',
      'and staff moved toward advice and sales': 'staff は「職員たち」。toward は「〜の方へ」。',
    },
  }),
  st('[S Employment {前| in that occupation}] [V did not collapse] [M {前| for two decades}].', {
    chunks: [
      ['Employment in that occupation did not collapse', 'その職業の雇用は崩れませんでした（どのくらいの間かは次へ）'],
      ['for two decades', '20年の間'],
    ],
    notes: {
      'Employment in that occupation did not collapse': 'that occupation は bank clerks（銀行の窓口係）の仕事です。collapse は「崩れる」。',
      'for two decades': 'decade は「10年」。two decades で「20年」。',
    },
  }),
  st('[S Such examples] [V should encourage] [O caution {前| rather than comfort}].', {
    chunks: [
      ['Such examples should encourage caution rather than comfort', 'こうした例は、安心よりもむしろ慎重さを促すべきものです'],
    ],
    notes: {
      'Such examples should encourage caution rather than comfort': 'Such examples は銀行の例のことです。A rather than B で「BよりむしろA」。should はここでは「〜べきだ」で、この例をどう受け止めるべきかという筆者の主張です。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'author-stance'],
  }),
  st('[S The adjustment] [V was] [C slow], [接 and] [S individual workers] [M still] [V lost] [O income] [M {前| during it}].', {
    chunks: [
      ['The adjustment was slow,', 'その調整はゆっくりでした'],
      ['and individual workers still lost income during it', 'そしてその間にも、一人ひとりの働き手は収入を失いました'],
    ],
    notes: {
      'The adjustment was slow,': 'adjustment は「調整（仕事の移り変わり）」。',
      'and individual workers still lost income during it': 'still は「それでもなお」。it は The adjustment を指し、during it で「調整の間に」。',
    },
  }),
  st('[S Aggregate stability] [V can hide] [O serious harm {前| to {並列| particular regions | and age groups}}].', {
    chunks: [
      ['Aggregate stability can hide serious harm', '全体としての安定は、深刻な打撃を覆い隠すことがあります（だれへのかは次へ）'],
      ['to particular regions and age groups', '特定の地域や年齢層への'],
    ],
    notes: {
      'Aggregate stability can hide serious harm': 'aggregate は「全体をまとめた」。can は「〜することがある」という可能性です。',
      'to particular regions and age groups': 'to 以下は serious harm を後ろから説明して「〜への打撃」。',
    },
  }),
  st('[S A worker {前| of fifty-five}] [M rarely] [V benefits] [M {前| from jobs {過去分詞>jobs| [V created] [M ten years later] [M {前| in another city}]}}].', {
    chunks: [
      ['A worker of fifty-five rarely benefits', '55歳の働き手が得をすることは、めったにありません（何からかは次へ）'],
      ['from jobs created ten years later', '10年後に生まれる仕事から（どこでかは次へ）'],
      ['in another city', '別の都市で'],
    ],
    notes: {
      'A worker of fifty-five rarely benefits': 'a worker of fifty-five は「55歳の働き手」。rarely は「めったに〜ない」。benefit from 〜 で「〜から得をする」。',
      'from jobs created ten years later': 'created 以下は jobs を後ろから説明する過去分詞で「作られる仕事」。',
    },
  }),
  st('[S Retraining programs] [V assume] [O {並列| mobility, | savings, | and confidence} {関係>mobility, savings, and confidence| [O that] [S many households] [V do not have]}].', {
    chunks: [
      ['Retraining programs assume mobility, savings, and confidence', '学び直しの制度は、引っ越せること・貯え・自信を前提にしています（どんなものかは次へ）'],
      ['that many households do not have', '多くの家庭が持っていない（ものを）'],
    ],
    notes: {
      'Retraining programs assume mobility, savings, and confidence': 'assume はここでは「〜があるものとして考える」。mobility は仕事のために移り住めることです。',
      'that many households do not have': 'that は mobility, savings, and confidence の三つをまとめて受けます。',
    },
  }),
  st('[S The distribution {前| of gains}] [V is] [M therefore] [C a central question].', {
    chunks: [
      ['The distribution of gains', '利益の分け方が'],
      ['is therefore a central question', 'それゆえ、中心となる問いです'],
    ],
    notes: {
      'The distribution of gains': 'distribution は「分配・分け方」。gains は技術がもたらす「利益」です。',
      'is therefore a central question': 'therefore は、前の段落の「特定の人が損をする」ことを受けます。',
    },
    rules: ['paragraph-map', 'cause-result', 'main-clause-skeleton'],
  }),
  st('[M {副詞節:条件| [接 If] [S productivity] [V rises] [接 but] [S wages] [V do not]}], [S the benefit] [V reaches] [O owners {前| rather than workers}].', {
    chunks: [
      ['If productivity rises but wages do not,', '生産性が上がっても賃金が上がらなければ'],
      ['the benefit reaches owners rather than workers', '利益は、働く人ではなく持ち主に届きます'],
    ],
    notes: {
      'If productivity rises but wages do not,': 'wages do not の後ろには rise が省かれています。',
      'the benefit reaches owners rather than workers': 'owner は会社などの「持ち主」。A rather than B で「BではなくA」。',
    },
  }),
  st('[S Early evidence] [V suggests] [O {that節| [接 that] [S assistance tools] [V help] [O less experienced staff] [M more {前| than expert staff}]}].', {
    chunks: [
      ['Early evidence suggests that', '初期の証拠は〜ことを示しています（内容は次へ）'],
      ['assistance tools help less experienced staff', '補助の道具は、経験の浅い人を助ける（どれほどかは次へ）'],
      ['more than expert staff', '熟練した人よりも多く（ということを）'],
    ],
    notes: {
      'Early evidence suggests that': 'suggest はここでは「〜ということを示す」。',
      'assistance tools help less experienced staff': 'less experienced は「経験がより少ない」。',
      'more than expert staff': 'more は help にかかり、than 以下が比べる相手です。',
    },
  }),
  st('[S That effect] [V could narrow] [O wage gaps], [接 or] [S it] [V could reduce] [O the reward {前| for long training}].', {
    chunks: [
      ['That effect could narrow wage gaps,', 'その効果は、賃金の差を縮めるかもしれません'],
      ['or it could reduce the reward', 'あるいは、見返りを減らすかもしれません（何へのかは次へ）'],
      ['for long training', '長い訓練への'],
    ],
    notes: {
      'That effect could narrow wage gaps,': 'That effect は前の文の「経験の浅い人をより助ける」ことです。narrow はここでは動詞で「狭める」。',
      'or it could reduce the reward': 'or は二つの可能性を並べます。it は That effect を指します。reward は「見返り・報い」。',
    },
  }),
  st('[S The result] [V depends] [M {前| on institutions}] [M {前| rather than {前| on the technology alone}}].', {
    chunks: [
      ['The result depends on institutions', 'その結果は、制度しだいです（何と比べてかは次へ）'],
      ['rather than on the technology alone', '技術だけで決まるのではなく'],
    ],
    notes: {
      'The result depends on institutions': 'The result は、前の文の二つのうちどちらになるかです。depend on 〜 で「〜しだいである」。institution は「制度・仕組み」。',
      'rather than on the technology alone': 'rather than の後ろに on the technology alone が来て、depends on と比べています。alone は「〜だけ」。',
    },
  }),
  st('[S {並列| Employment law, | union strength, | and public investment}] [V decide] [O {疑問詞節| [M how] [S any productivity gain] [V is shared]}].', {
    chunks: [
      ['Employment law, union strength, and public investment', '雇用の法律、労働組合の力、公共の投資が'],
      ['decide how any productivity gain is shared', '生産性が上がった分がどう分けられるかを決めます'],
    ],
    notes: {
      'Employment law, union strength, and public investment': '主語は三つの名詞の並びです。',
      'decide how any productivity gain is shared': 'how 以下が decide の目的語になる疑問詞の節です。is shared は受け身で「分けられる」。any は「どんな〜でも」。',
    },
  }),
  st('[S Education systems] [V face] [O a related difficulty].', {
    chunks: [
      ['Education systems face a related difficulty', '教育の仕組みも、関連した難しさに直面しています'],
    ],
    notes: {
      'Education systems face a related difficulty': 'face はここでは動詞で「〜に直面する」。related は「（前の話と）関係のある」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Students {関係>Students| [S who] [M only] [V learn] [O {to:名詞| [V to produce] [O text {関係>text| [O that] [S a machine] [V can] [M also] [V produce]}]}]}] [V are] [M poorly] [V prepared].', {
    chunks: [
      ['Students who only learn to produce text', '文章を作ることしか学ばない生徒は（どんな文章かは次へ）'],
      ['that a machine can also produce', '機械にも作れる（文章を）'],
      ['are poorly prepared', '準備が足りていません'],
    ],
    notes: {
      'Students who only learn to produce text': 'only は learn to produce text を「〜しか学ばない」と限ります。',
      'that a machine can also produce': 'that は text を受ける関係代名詞で、produce の目的語にあたります。also は「機械も」。',
      'are poorly prepared': 'are prepared は「備えができている」。poorly は「不十分に」。',
    },
  }),
  st('[S {並列| {動名詞| [V Questioning] [O sources]} | and {動名詞| [V judging] [O quality]}}] [V remain] [C valuable skills].', {
    chunks: [
      ['Questioning sources and judging quality', '出どころを疑い、質を見きわめることは'],
      ['remain valuable skills', '今も大切な力です'],
    ],
    notes: {
      'Questioning sources and judging quality': '二つの動名詞のまとまりが and で並んで、文全体の主語になっています。',
      'remain valuable skills': 'remain ＋ 名詞 で「〜のままである」。機械の時代でも価値がなくならない、ということです。',
    },
  }),
  st('[M Yet] [S those abilities] [V are] [C difficult {to:副詞(形容詞)| [V to measure]}], [接 and] [S examinations] [V reward] [O {what節| [S what] [V is] [C easy {to:副詞(形容詞)| [V to score]}]}].', {
    chunks: [
      ['Yet those abilities are difficult to measure,', 'しかし、そうした力は測るのが難しく'],
      ['and examinations reward what is easy to score', '試験は、点をつけやすいものを評価します'],
    ],
    notes: {
      'Yet those abilities are difficult to measure,': 'difficult to measure で「測るのが難しい」。to measure は difficult の中身を限定します。',
      'and examinations reward what is easy to score': 'what は「〜もの」という関係代名詞で、what is easy to score が reward の目的語です。score はここでは動詞で「点をつける」。',
    },
  }),
  st('[S Schools] [M also] [V need] [O {並列| time | and equipment} {関係>time and equipment| [O that] [S many districts] [M currently] [V lack]}].', {
    chunks: [
      ['Schools also need time and equipment', '学校には、時間と設備も必要です（どんなものかは次へ）'],
      ['that many districts currently lack', '多くの地域に今は足りていない（時間と設備が）'],
    ],
    notes: {
      'Schools also need time and equipment': 'also は、前の文の「測りにくさ」に加えて、という意味です。',
      'that many districts currently lack': 'lack は「〜が足りない」。district は「地区・学区」。',
    },
  }),
  st('[S Policy responses] [V fall] [M {前| into several groups}].', {
    chunks: [
      ['Policy responses fall into several groups', '政策の対応は、いくつかのまとまりに分かれます'],
    ],
    notes: {
      'Policy responses fall into several groups': 'fall into 〜 で「〜に分かれる・分類される」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'parallel-shape'],
  }),
  st('[S Some governments] [V emphasize] [O retraining], [M {副詞節:譲歩| [接 though] [S programs] [M often] [V reach] [O the workers {関係>the workers| [S who] [V need] [O them] [M least]}]}].', {
    chunks: [
      ['Some governments emphasize retraining,', '学び直しを重んじる政府もあります'],
      ['though programs often reach the workers', 'ただし、その制度が届くのは多くの場合、次のような働き手です（どんな働き手かは次へ）'],
      ['who need them least', 'それをいちばん必要としていない（働き手）'],
    ],
    notes: {
      'Some governments emphasize retraining,': 'emphasize は「重んじる・強調する」。retraining は「学び直し・再訓練」。',
      'who need them least': 'them は programs を指します。least は「いちばん少なく」。本当に必要な人に届きにくいということです。',
    },
  }),
  st('[S Others] [V discuss] [O {並列| shorter working hours, | wage insurance, | or support {前| for regions {現在分詞>regions| [V losing] [O employers]}}}].', {
    chunks: [
      ['Others discuss shorter working hours, wage insurance,', 'ほかの政府は、労働時間の短縮や賃金の保険'],
      ['or support for regions losing employers', 'あるいは雇い主を失っていく地域への支援を、話し合っています'],
    ],
    notes: {
      'Others discuss shorter working hours, wage insurance,': 'Others は前の文の Some governments と対になる「ほかの政府」です。discuss の目的語が三つ並びます。',
      'or support for regions losing employers': 'losing employers は regions を後ろから説明する現在分詞で「雇い主を失っている地域」。',
    },
  }),
  st('[S Each proposal] [V carries] [O costs], [接 and] [S none] [V removes] [O the need {前| for continuous adjustment}].', {
    chunks: [
      ['Each proposal carries costs,', 'どの提案にも費用がかかり'],
      ['and none removes the need for continuous adjustment', 'どれも、調整を続ける必要をなくしはしません'],
    ],
    notes: {
      'Each proposal carries costs,': 'carry はここでは「（費用などを）伴う」。',
      'and none removes the need for continuous adjustment': 'none は「どれも〜ない」で、提案のどれ一つとして、という意味です。continuous は「絶え間ない」。',
    },
  }),
  st('[S Evaluation] [V is] [C as important {前| as ambition}], [M {副詞節:理由| [接 since] [S untested programs] [V consume] [O budgets {関係>budgets| [S that] [V could support] [O proven ones]}]}].', {
    chunks: [
      ['Evaluation is as important as ambition,', '評価は、意欲と同じくらい大切です（なぜかは次へ）'],
      ['since untested programs consume budgets', '試されていない制度が予算を使ってしまうからです（どんな予算かは次へ）'],
      ['that could support proven ones', '効果が確かめられた制度を支えられたはずの（予算を）'],
    ],
    notes: {
      'Evaluation is as important as ambition,': 'as 〜 as … で「…と同じくらい〜」。ambition は「意欲・大きな目標」。',
      'since untested programs consume budgets': 'since はここでは「〜なので」と理由を表します。consume は「使い果たす」。',
      'that could support proven ones': 'ones は programs の代わりです。proven は「効果が確かめられた」。',
    },
  }),
  st('[S The most misleading question] [V asks] [O {whether節| [接 whether] [S machines] [V will take] [O our jobs]}].', {
    chunks: [
      ['The most misleading question asks whether', 'いちばん誤解を招く問いは、〜かどうかを尋ねるものです（内容は次へ）'],
      ['machines will take our jobs', '機械が私たちの仕事を奪う（かどうか）'],
    ],
    notes: {
      'The most misleading question asks whether': 'misleading は「誤解を招く」。whether 以下が asks の目的語です。',
    },
    rules: ['paragraph-map', 'wh-clause', 'author-stance'],
  }),
  st('[S Work] [V is not] [C a fixed quantity {現在分詞>a fixed quantity| [V waiting] [M {to:副詞(目的)| [V to be divided]}]}].', {
    chunks: [
      ['Work is not a fixed quantity', '仕事は、決まった量のものではありません（どんなものかは次へ）'],
      ['waiting to be divided', '分けられるのを待っている（決まった量）'],
    ],
    notes: {
      'Work is not a fixed quantity': 'quantity は「量」。仕事の量は増えたり形を変えたりする、という考えです。',
      'waiting to be divided': 'waiting 以下は a fixed quantity を後ろから説明する現在分詞。to be divided は受け身の不定詞で「分けられるために」。',
    },
  }),
  st('[仮S It] [V is] [C more useful] [真S {to:名詞| [V to ask] [O {並列| {疑問詞節| [S who] [V decides] [O {疑問詞節| [M how] [S these systems] [V are used]}]} | and {疑問詞節| [S who] [V is protected] [M {前| during the transition}]}}]}].', {
    chunks: [
      ['It is more useful to ask', '〜を問うほうが役に立ちます（何をかは次へ）'],
      ['who decides how these systems are used', 'こうしたシステムの使い方をだれが決めるのか'],
      ['and who is protected during the transition', 'そして、移り変わりの間にだれが守られるのか（を）'],
    ],
    notes: {
      'It is more useful to ask': 'It は形式主語で、本当の主語は to ask 以下です。more useful は、前の文の問い方よりも「役に立つ」という比較です。',
      'who decides how these systems are used': 'who decides が一つ目の問い、その中の how these systems are used が decides の目的語です。',
      'and who is protected during the transition': 'and は ask の二つの目的語（二つの問い）を並べます。transition は「移り変わり（の期間）」。',
    },
  }),
])
