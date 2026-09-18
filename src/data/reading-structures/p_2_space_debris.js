import { st } from './entry.js'

export default Object.freeze([
  st('[S {数量| More than ten thousand} satellites] [M now] [V travel] [M {前| around the Earth}], [接 and] [S thousands more] [V are planned].', {
    chunks: [
      ['More than ten thousand satellites now travel', '1万を超える人工衛星が、今、回っています（どこをかは次へ）'],
      ['around the Earth,', '地球のまわりを'],
      ['and thousands more are planned', 'そして、さらに何千基もが計画されています'],
    ],
    notes: {
      'More than ten thousand satellites now travel': 'More than ten thousand が satellites の数を表すまとまりです。now は「今では」。',
      'and thousands more are planned': 'thousands more は「さらに何千基も」。are planned は受け身で「計画されている」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'parallel-shape'],
  }),
  st('[S They] [V carry] [O {並列| weather data, | navigation signals, | and internet service}] [M {前| to remote communities}].', {
    chunks: [
      ['They carry weather data, navigation signals,', 'それらは、気象データや位置を知らせる信号'],
      ['and internet service', 'そしてネットの通信を運んでいます（どこへかは次へ）'],
      ['to remote communities', '遠く離れた地域へ'],
    ],
    notes: {
      'They carry weather data, navigation signals,': 'They は前の文の satellites を指します。carry はここでは「（情報を）運ぶ・届ける」。',
      'and internet service': 'and は三つ目の目的語 internet service を加えます。carry の目的語は三つです。',
      'to remote communities': 'to remote communities は carry にかかり「遠く離れた地域へ（届ける）」。',
    },
  }),
  st('[S Modern life] [V depends] [M {前| on these services}] [M more {副詞節:比較| [接 than] [S most people] [V notice]}].', {
    chunks: [
      ['Modern life depends on these services', '現代の生活は、これらのサービスに頼っています（どのくらいかは次へ）'],
      ['more than most people notice', '多くの人が気づいている以上に'],
    ],
    notes: {
      'Modern life depends on these services': 'depend on 〜 で「〜に頼る」。',
      'more than most people notice': 'more は depends にかかり「より多く」。than の後ろの most people notice は、比べる相手（人々が気づいている程度）です。',
    },
  }),
  st('[M However], [S the same orbits] [M also] [V hold] [O {並列| used rocket parts, | broken satellites, | and countless small fragments}].', {
    chunks: [
      ['However, the same orbits', 'しかし、同じ軌道には'],
      ['also hold used rocket parts,', '使い終わったロケットの部品や'],
      ['broken satellites, and countless small fragments', '壊れた衛星、数えきれない小さな破片もあります'],
    ],
    notes: {
      'However, the same orbits': 'However は、便利な面から話を折り返す合図です。the same orbits は衛星が回っているのと同じ軌道です。',
      'also hold used rocket parts,': 'hold はここでは「（中に）抱えている」。also は、衛星に加えてごみも、という意味です。',
      'broken satellites, and countless small fragments': 'countless は「数えきれないほど多い」。hold の目的語が三つ並んでいます。',
    },
  }),
  st('[M Even] [S a fragment one centimeter wide] [V is] [C faster {前| than a bullet}].', {
    chunks: [
      ['Even a fragment one centimeter wide', '幅わずか1センチの破片でさえ'],
      ['is faster than a bullet', '銃弾より速いのです'],
    ],
    notes: {
      'Even a fragment one centimeter wide': 'one centimeter wide は a fragment を後ろから説明して「幅1センチの破片」。Even は「〜でさえ」。',
      'is faster than a bullet': 'faster は fast の比較級。than a bullet で「銃弾より」。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'noun-boundary'],
  }),
  st('[M {前| At such speeds}], [M even] [S a small piece] [V can destroy] [O an expensive spacecraft].', {
    chunks: [
      ['At such speeds, even a small piece', 'そんな速さでは、小さなかけらでさえ'],
      ['can destroy an expensive spacecraft', '高価な宇宙機を壊してしまうことがあります'],
    ],
    notes: {
      'At such speeds, even a small piece': 'such speeds は前の文の「銃弾より速い」速さのことです。',
      'can destroy an expensive spacecraft': 'can はここでは「〜することがある・〜しうる」という可能性です。',
    },
  }),
  st('[S Operators] [M already] [V move] [O satellites] [M several times a year] [M {to:副詞(目的)| [V to avoid] [O possible collisions]}].', {
    chunks: [
      ['Operators already move satellites several times a year', '衛星を運用する人たちは、すでに年に数回衛星を動かしています（何のためかは次へ）'],
      ['to avoid possible collisions', '起こりうる衝突を避けるために'],
    ],
    notes: {
      'Operators already move satellites several times a year': 'operator は「（機械や設備を）運用する人・会社」。several times a year で「1年に数回」。',
      'to avoid possible collisions': 'to avoid 〜 は目的を表し「〜を避けるために」。possible は「起こりうる」。',
    },
  }),
  st('[S Each {前| of these movements}] [V uses] [O fuel] [接 and] [V shortens] [O the useful life {前| of the satellite}].', {
    chunks: [
      ['Each of these movements uses fuel', 'こうした移動は、一回ごとに燃料を使い'],
      ['and shortens the useful life of the satellite', '衛星が使える期間を縮めます'],
    ],
    notes: {
      'Each of these movements uses fuel': 'Each of 〜 は「〜の一つ一つ」で、単数として uses を取ります。',
      'and shortens the useful life of the satellite': 'and の後ろの shortens の主語も Each of these movements です。useful life は「使える期間・寿命」。',
    },
  }),
  st('[S Ground teams] [V must] [M also] [V track] [O objects] [M continuously], [M {関係,>前の内容| [S which] [V requires] [O {並列| expensive radar | and staff}]}].', {
    chunks: [
      ['Ground teams must also track objects continuously,', '地上のチームは、物体を絶えず追い続けなければならず'],
      ['which requires expensive radar and staff', 'それには高価なレーダーと人手が必要です'],
    ],
    notes: {
      'Ground teams must also track objects continuously,': 'track はここでは動詞で「（動きを）追う」。continuously は「絶えず」。',
      'which requires expensive radar and staff': 'which の先行詞は前の内容全体（物体を絶えず追い続けること）です。staff は「職員・人手」。',
    },
  }),
  st('[S Researchers] [V say] [O {that節| [接 that] [S a single collision] [V can create] [O thousands {前| of new fragments}]}].', {
    chunks: [
      ['Researchers say that', '研究者たちは〜と言います（内容は次へ）'],
      ['a single collision', 'たった一度の衝突が'],
      ['can create thousands of new fragments', '何千もの新しい破片を生むことがある（と）'],
    ],
    notes: {
      'a single collision': 'single は「たった一つの」。',
      'can create thousands of new fragments': 'thousands of 〜 で「何千もの〜」。',
    },
    rules: ['paragraph-map', 'that-diagnosis', 'cause-result'],
  }),
  st('[S Those fragments] [V may] [M then] [V strike] [O other objects] [接 and] [V produce] [O still more debris].', {
    chunks: [
      ['Those fragments may then strike other objects', 'するとそれらの破片が、ほかの物体にぶつかり'],
      ['and produce still more debris', 'さらに多くのごみを生むかもしれません'],
    ],
    notes: {
      'Those fragments may then strike other objects': 'may は「〜かもしれない」。then は「そうなると」。strike はここでは「ぶつかる」。',
      'and produce still more debris': 'still more は「さらにいっそう多くの」。ごみがごみを生む連鎖の話です。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S this process] [V continues]}], [S certain orbits] [V could become] [C too dangerous {to:副詞(程度)| [V to use]}].', {
    chunks: [
      ['If this process continues,', 'この流れが続けば'],
      ['certain orbits could become too dangerous', 'いくつかの軌道は、危険すぎるものになりかねません（何をするにはかは次へ）'],
      ['to use', '使うには'],
    ],
    notes: {
      'If this process continues,': 'this process は、破片が衝突してさらに破片を生む流れのことです。',
      'certain orbits could become too dangerous': 'too 〜 to … で「…するには〜すぎる（ので…できない）」。could は「〜かもしれない」。',
    },
  }),
  st('[S The consequences] [V would not stop] [M {前| at space companies}].', {
    chunks: [
      ['The consequences would not stop at space companies', 'その影響は、宇宙の会社だけでは終わらないでしょう'],
    ],
    notes: {
      'The consequences would not stop at space companies': 'stop at 〜 は「〜で止まる」。not があるので「宇宙の会社だけにとどまらない」。',
    },
  }),
  st('[S {並列| Farmers, | pilots, | and emergency services}] [M all] [V depend] [M {前| on satellite information}].', {
    chunks: [
      ['Farmers, pilots, and emergency services all depend', '農家も、パイロットも、救急などの機関も、みな頼っています（何にかは次へ）'],
      ['on satellite information', '衛星からの情報に'],
    ],
    notes: {
      'Farmers, pilots, and emergency services all depend': 'all は主語の三つを受けて「みな」。前の文の「宇宙の会社だけではない」の具体例です。',
    },
  }),
  st('[S Several solutions] [V have been proposed], [接 and] [S none {前| of them}] [V is] [C simple].', {
    chunks: [
      ['Several solutions have been proposed,', 'いくつかの解決策が示されてきました'],
      ['and none of them is simple', 'ただ、そのどれも簡単ではありません'],
    ],
    notes: {
      'Several solutions have been proposed,': 'have been proposed は現在完了の受け身で「（これまでに）提案されてきた」。',
      'and none of them is simple': 'none of 〜 で「〜のどれも…ない」。',
    },
    rules: ['paragraph-map', 'negation-scope', 'parallel-shape'],
  }),
  st('[S Some engineers] [V argue] [O {that節| [接 that] [S every satellite] [V should carry] [O enough fuel {to:形容詞>enough fuel| [V to leave] [O orbit] [M {前| at the end {前| of its mission}}]}]}].', {
    chunks: [
      ['Some engineers argue that', '〜と主張する技術者もいます（内容は次へ）'],
      ['every satellite should carry enough fuel', 'どの衛星も、十分な燃料を積んでおくべきだ（何のための燃料かは次へ）'],
      ['to leave orbit', '軌道を離れるための'],
      ['at the end of its mission', '任務の終わりに（と）'],
    ],
    notes: {
      'every satellite should carry enough fuel': 'should は「〜すべきだ」。enough fuel to 〜 で「〜するのに十分な燃料」。',
      'at the end of its mission': 'its は every satellite を指します。任務を終えたら軌道から出て、ごみにならないようにするという考えです。',
    },
  }),
  st('[S Other teams] [V design] [O {並列| nets | and magnets} {関係>nets and magnets| [S that] [V could capture] [O large objects]}].', {
    chunks: [
      ['Other teams design nets and magnets', 'ほかのチームは、網や磁石を設計しています（どんなものかは次へ）'],
      ['that could capture large objects', '大きな物体を捕まえられるかもしれない（網や磁石を）'],
    ],
    notes: {
      'Other teams design nets and magnets': 'Other teams は、前の文の Some engineers と対になる「ほかのチーム」です。',
      'that could capture large objects': 'could は「〜できるかもしれない」。まだ試している段階だということです。',
    },
  }),
  st('[S A successful test] [V does not show] [O {that節| [接 that] [S the method] [V works] [M {前| at a useful scale}]}].', {
    chunks: [
      ['A successful test does not show that', '実験がうまくいっても、〜ということにはなりません（内容は次へ）'],
      ['the method works at a useful scale', 'その方法が、役に立つ規模でうまくいく（ということ）'],
    ],
    notes: {
      'A successful test does not show that': 'not show that 〜 で「〜ということを示さない」。一度の成功と実際の役立ちを分けて考えています。',
      'the method works at a useful scale': 'work はここでは「うまくいく」。at a useful scale は「役に立つほどの規模で」。',
    },
  }),
  st('[S {動名詞| [V Removing] [O a few large objects] [M each year]}] [V may be] [C far cheaper {前| than {動名詞| [V removing] [O thousands {前| of fragments}] [M later]}}].', {
    chunks: [
      ['Removing a few large objects each year', '毎年、少数の大きな物体を取り除くことは'],
      ['may be far cheaper', 'はるかに安くすむかもしれません（何よりかは次へ）'],
      ['than removing thousands of fragments later', 'あとで何千もの破片を取り除くよりも'],
    ],
    notes: {
      'Removing a few large objects each year': 'Removing 以下は動名詞のまとまりで、文全体の主語です。a few は「少しの」。',
      'may be far cheaper': 'far は比較級を強めて「はるかに」。',
      'than removing thousands of fragments later': 'than の後ろも動名詞で、比べているのは「今少し取り除くこと」と「あとでたくさん取り除くこと」です。',
    },
  }),
  st('[S The deeper difficulty] [V is] [C political {前| rather than technical}].', {
    chunks: [
      ['The deeper difficulty is political', 'もっと根の深い難しさは、政治的なものです（何と比べてかは次へ）'],
      ['rather than technical', '技術的なものというより'],
    ],
    notes: {
      'The deeper difficulty is political': 'deeper は deep の比較級で「より根の深い」。',
      'rather than technical': 'A rather than B で「BというよりA」。技術よりも国どうしの決めごとが難しい、という段落の要点です。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'main-clause-skeleton'],
  }),
  st('[S Space {前| near the Earth}] [V belongs] [M {前| to no single country}].', {
    chunks: [
      ['Space near the Earth', '地球の近くの宇宙は'],
      ['belongs to no single country', 'どの一つの国のものでもありません'],
    ],
    notes: {
      'belongs to no single country': 'belong to 〜 で「〜のものである」。no single country で「どの一国も〜ない」。',
    },
  }),
  st('[S A company {関係>A company| [S that] [V spends] [O money] [M {前| on careful design}]}] [V gains] [O no direct advantage] [M {副詞節:条件| [接 if] [S others] [V ignore] [O the risk]}].', {
    chunks: [
      ['A company that spends money on careful design', '慎重な設計にお金をかける会社は'],
      ['gains no direct advantage', 'じかに得になることが何もありません（どんな場合かは次へ）'],
      ['if others ignore the risk', 'ほかの会社が危険を気にかけなければ'],
    ],
    notes: {
      'A company that spends money on careful design': 'spend money on 〜 で「〜にお金をかける」。',
      'gains no direct advantage': 'no direct advantage は「直接の利益が何もない」。',
      'if others ignore the risk': 'others は「ほかの会社」。一社だけが気をつけても軌道は安全にならない、ということです。',
    },
  }),
  st('[S Rules] [M therefore] [V need] [O international agreement], [接 and] [S such agreements] [V take] [O years].', {
    chunks: [
      ['Rules therefore need international agreement,', 'そのため決まりには、国どうしの合意が必要で'],
      ['and such agreements take years', 'そうした合意には何年もかかります'],
    ],
    notes: {
      'Rules therefore need international agreement,': 'therefore は、前の2文（宇宙は一国のものではない・一社だけでは得にならない）を受けます。',
      'and such agreements take years': 'take はここでは「（時間が）かかる」。',
    },
  }),
  st('[M Meanwhile], [S the number {前| of launches}] [V continues] [O {to:名詞| [V to rise] [M each year]}].', {
    chunks: [
      ['Meanwhile, the number of launches', 'その間にも、打ち上げの数は'],
      ['continues to rise each year', '毎年増え続けています'],
    ],
    notes: {
      'Meanwhile, the number of launches': 'Meanwhile は「その間にも」。合意に何年もかかっている間に、という意味です。',
      'continues to rise each year': 'continue to 〜 で「〜し続ける」。rise は「増える・上がる」。',
    },
  }),
  st('[S Some progress] [V has] [M already] [V been made].', {
    chunks: [
      ['Some progress has already been made', 'いくらかの前進は、すでに見られます'],
    ],
    notes: {
      'Some progress has already been made': 'has been made は現在完了の受け身で「なされてきた」。make progress（前進する）が受け身になった形です。',
    },
    rules: ['paragraph-map', 'passive-active', 'main-clause-skeleton'],
  }),
  st('[S Several agencies] [M now] [V set] [O a fixed period {前| for {動名詞| [V leaving] [O crowded orbits]}}].', {
    chunks: [
      ['Several agencies now set a fixed period', '今では、いくつかの機関が決まった期限を定めています（何の期限かは次へ）'],
      ['for leaving crowded orbits', '混み合った軌道を離れるまでの'],
    ],
    notes: {
      'Several agencies now set a fixed period': 'set はここでは「定める」。agency は「（国などの）機関」。',
      'for leaving crowded orbits': 'leaving は for の後ろの動名詞で「離れること」。',
    },
  }),
  st('[S Insurance companies] [V have] [M also] [V begun] [O {to:名詞| [V to ask] [M {前| about disposal plans}]}] [M {副詞節:時| [接 before] [S they] [V accept] [O a customer]}].', {
    chunks: [
      ['Insurance companies have also begun', '保険会社も、〜し始めています（何をかは次へ）'],
      ['to ask about disposal plans', '使い終えたあとの処分の計画を尋ねることを'],
      ['before they accept a customer', '客を引き受ける前に'],
    ],
    notes: {
      'Insurance companies have also begun': 'have begun は現在完了で「始めている」。間の also は「〜も」。',
      'to ask about disposal plans': 'disposal は「処分・片づけ」。任務を終えた衛星をどう片づけるかの計画です。',
      'before they accept a customer': 'they は Insurance companies を指します。',
    },
  }),
  st('[M Yet] [S enforcement] [V remains] [C weak], [M {副詞節:理由| [接 because] [S no authority] [V can inspect] [O every launch]}].', {
    chunks: [
      ['Yet enforcement remains weak,', 'それでも、決まりを守らせる力は弱いままです（なぜかは次へ）'],
      ['because no authority can inspect every launch', 'すべての打ち上げを調べられる機関は、どこにもないからです'],
    ],
    notes: {
      'Yet enforcement remains weak,': 'enforcement は「（決まりを）守らせること」。remain ＋ 形容詞 で「〜のままである」。',
      'because no authority can inspect every launch': 'no authority は「どの機関も〜ない」。inspect は「調べる・検査する」。',
    },
  }),
  st('[S These measures] [V show] [O {that節| [接 that] [S the problem] [V is understood]}], [M not] [O {that節| [接 that] [S it] [V is solved]}].', {
    chunks: [
      ['These measures show that', 'これらの対策が示しているのは、〜ということです（内容は次へ）'],
      ['the problem is understood,', '問題が理解されている'],
      ['not that it is solved', '問題が解決された、ということではありません'],
    ],
    notes: {
      'These measures show that': 'These measures は前の段落の期限・保険会社の確認などの対策です。',
      'not that it is solved': 'A, not B の形で「Bではなく、Aを示す」。it は the problem を指し、is solved は受け身で「解決されている」。',
    },
    rules: ['paragraph-map', 'that-diagnosis', 'contrast-concession'],
  }),
  st('[S The orbits {前| around the Earth}] [V are] [C a shared resource], [接 and] [S shared resources] [V fail] [M {副詞節:時| [接 when] [S each user] [V acts] [M alone]}].', {
    chunks: [
      ['The orbits around the Earth', '地球のまわりの軌道は'],
      ['are a shared resource,', 'みんなで分け合う資源です'],
      ['and shared resources fail', 'そして、分け合う資源はうまくいかなくなります（どんなときかは次へ）'],
      ['when each user acts alone', '使う一人ひとりが、自分だけの判断で動くとき'],
    ],
    notes: {
      'are a shared resource,': 'shared resource は「共有の資源」。だれか一人のものではない、という第21文の話とつながります。',
      'when each user acts alone': 'act alone は「単独で行動する」。全員で決まりを守らないと資源が損なわれる、という結論です。',
    },
  }),
])
