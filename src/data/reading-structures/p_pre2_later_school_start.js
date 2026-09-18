import { st } from './entry.js'

export default Object.freeze([
  st('[S Many teenagers] [V arrive] [M {前| at school}] [M {分詞構文:付帯状況| [V feeling] [C tired]}], [M {副詞節:譲歩| [接 even when] [S they] [V try] [O {to:名詞| [V to go] [M {前| to bed}] [M {前| at a reasonable time}]}]}].', {
    chunks: [
      ['Many teenagers arrive at school', '多くの10代の生徒は学校に着きます'],
      ['feeling tired,', '疲れを感じながら'],
      ['even when they try to go to bed', 'たとえ寝ようとしても（いつかは次へ）'],
      ['at a reasonable time', '適切な時刻に（寝ようとしても）'],
    ],
    notes: {
      'feeling tired,': 'feeling tired は「疲れを感じながら」と、学校に着くときの様子を表す分詞構文です。',
      'even when they try to go to bed': 'even when ＋ 主語 ＋ 動詞 で「たとえ〜するときでも」。try to 〜 で「〜しようとする」。they は Many teenagers を指します。',
    },
  }),
  st('[S Sleep researchers] [V explain] [O {that節| [接 that] [S the body clock] [M often] [V changes] [M {前| during the teenage years}]}].', {
    chunks: [
      ['Sleep researchers explain that', '睡眠の研究者は〜と説明しています（内容は次へ）'],
      ['the body clock often changes', '体内時計が変わることが多い（と）'],
      ['during the teenage years', '10代の時期に'],
    ],
    notes: {
      'the body clock often changes': 'body clock は「体内時計」。often は「よく・しばしば」。',
    },
    rules: ['author-stance', 'that-diagnosis', 'main-clause-skeleton'],
  }),
  st('[S The brain] [V begins] [O {to:名詞| [V to feel] [C sleepy]}] [M later] [M {前| at night}], [接 but] [S students] [V must] [M still] [V wake up] [M early] [M {前| for school}].', {
    chunks: [
      ['The brain begins to feel sleepy', '脳は眠気を感じ始めます（いつかは次へ）'],
      ['later at night,', '夜のより遅い時間に'],
      ['but', 'しかし'],
      ['students must still wake up early', '生徒はそれでも早く起きなければなりません'],
      ['for school', '学校に行くために'],
    ],
    notes: {
      'The brain begins to feel sleepy': 'begin to 〜 で「〜し始める」。feel ＋ 形容詞 で「〜と感じる」。',
      'later at night,': 'later は late の比較級で、「（以前より）遅い時間に」。',
      'students must still wake up early': 'still は「それでも」。脳が遅くまで眠くならないのに、という流れを受けています。',
    },
  }),
  st('[M {前| For this reason}], [S some schools] [V have moved] [O their starting time] [M {前| from eight o’clock}] [M {前| to a later hour}].', {
    chunks: [
      ['For this reason,', 'この理由から'],
      ['some schools have moved their starting time', 'いくつかの学校は始業時刻を移しました（いつからいつへかは次へ）'],
      ['from eight o’clock', '8時から'],
      ['to a later hour', 'もっと遅い時刻へ'],
    ],
    notes: {
      'For this reason,': 'this reason は、前の段落で述べた「10代は夜遅くまで眠くならないのに早く起きなければならない」ことを指します。',
      'some schools have moved their starting time': 'have moved は現在完了で、「（これまでに）移した」。from A to B で「AからBへ」。',
    },
    rules: ['cause-result', 'reference-chain', 'paragraph-map'],
  }),
  st('[S Several studies] [V report] [O {that節| [接 that] [S students {前| at these schools}] [V sleep] [M longer] [M {前| on ordinary weekdays}]}].', {
    chunks: [
      ['Several studies report that', 'いくつかの研究は〜と報告しています（内容は次へ）'],
      ['students at these schools', 'こうした学校の生徒は'],
      ['sleep longer', 'より長く眠る（と）'],
      ['on ordinary weekdays', 'ふだんの平日に'],
    ],
    notes: {
      'students at these schools': 'these schools は、前の文の始業時刻を遅らせた学校を指します。',
    },
  }),
  st('[S Teachers] [V have] [M also] [V seen] [O {並列| greater attention | and fewer late arrivals}] [M {前| in morning classes}].', {
    chunks: [
      ['Teachers have also seen', '教師たちも〜を目にしてきました（何をかは次へ）'],
      ['greater attention', '集中力が高まったことや'],
      ['and fewer late arrivals', '遅刻が減ったことを'],
      ['in morning classes', '朝の授業で'],
    ],
    notes: {
      'greater attention': 'greater は great の比較級、fewer は few の比較級で、どちらも「以前より」の変化を表します。',
    },
  }),
  st('[M {前| In one experiment}], [S {並列| attendance | and mood}] [V improved], [M {副詞節:譲歩| [接 although] [S test scores] [V did not rise] [M immediately]}].', {
    chunks: [
      ['In one experiment,', 'ある実験では'],
      ['attendance and mood improved,', '出席状況と気分がよくなりました'],
      ['although', '〜ではあるものの（内容は次へ）'],
      ['test scores did not rise immediately', 'テストの点数はすぐには上がらなかった（ものの）'],
    ],
    notes: {
      'test scores did not rise immediately': 'not … immediately で「すぐには〜ない」。上がらなかったのではなく、すぐには上がらなかったという意味です。',
    },
  }),
  st('[S A later start], [M however], [V can cause] [O practical problems] [M {前| for {並列| families | and communities}}].', {
    chunks: [
      ['A later start,', '始業を遅らせることは'],
      ['however,', 'しかし'],
      ['can cause practical problems', '実際の問題を引き起こすことがあります'],
      ['for families and communities', '家庭や地域にとって'],
    ],
    notes: {
      'however,': 'however は、ここから始業を遅らせることの問題点に話が変わる合図です。',
    },
  }),
  st('[S School buses] [V may need] [O new schedules], [M {関係,>前の内容| [S which] [V can increase] [O transportation costs]}].', {
    chunks: [
      ['School buses may need new schedules,', 'スクールバスには新しい運行予定が必要になるかもしれません'],
      ['which can increase transportation costs', 'そしてそのことで交通費が増える可能性があります'],
    ],
    notes: {
      'which can increase transportation costs': 'コンマの後ろの which は、前の文の内容（新しい運行予定が必要になること）を受けています。',
    },
  }),
  st('[S {並列| Sports practice | and music activities}] [V may finish] [M {前| after dark}], [M especially {前| in winter}].', {
    chunks: [
      ['Sports practice and music activities', '運動部の練習や音楽活動は'],
      ['may finish after dark,', '暗くなってから終わるかもしれません'],
      ['especially in winter', '特に冬には'],
    ],
    notes: {
      'may finish after dark,': 'after dark は「暗くなってから」。始業が遅くなると、放課後の活動も遅く終わります。',
    },
  }),
  st('[S Some parents] [M also] [V depend] [M {前| on older children} {to:補語| [V to care for] [O younger family members] [M {前| after school}]}].', {
    chunks: [
      ['Some parents also depend on older children', 'また、一部の保護者は年上の子どもを当てにしています（何をしてもらうかは次へ）'],
      ['to care for younger family members', '年下の家族の世話をすることを'],
      ['after school', '放課後に'],
    ],
    notes: {
      'Some parents also depend on older children': 'depend on A to 〜 で「Aが〜してくれるのを当てにする」。',
      'to care for younger family members': 'care for 〜 で「〜の世話をする」。世話をするのは older children です。',
    },
  }),
  st('[M {前| At one school}], [S students] [V helped] [O {原形| [V design] [O the change]}], [接 and] [S their suggestions] [V produced] [O a bus timetable {関係>a bus timetable| [S that] [V protected] [O {並列| both sleep | and afternoon activities}]}].', {
    chunks: [
      ['At one school,', 'ある学校では'],
      ['students helped design the change,', '生徒たちがその変更の中身を考えるのを手伝いました'],
      ['and', 'そして'],
      ['their suggestions produced a bus timetable', '生徒たちの提案からバスの時刻表が生まれました'],
      ['that protected both sleep and afternoon activities', '睡眠と午後の活動の両方を守る（時刻表が）'],
    ],
    notes: {
      'students helped design the change,': 'help ＋ 動詞の原形 で「〜するのを手伝う」。design はここでは「（計画を）考えて作る」。',
      'that protected both sleep and afternoon activities': 'that は a bus timetable を受ける関係代名詞です。both A and B で「AとBの両方」。',
    },
  }),
  st('[S This cooperation] [V made] [O families] [C more willing {to:副詞(形容詞)| [V to try] [O the new schedule] [M {前| for a full year}]}].', {
    chunks: [
      ['This cooperation made families more willing', 'この協力は家庭をより前向きにしました（何にかは次へ）'],
      ['to try the new schedule', '新しい予定を試すことに'],
      ['for a full year', '丸1年間'],
    ],
    notes: {
      'This cooperation made families more willing': 'make ＋ O ＋ C で「OをCにする」。be willing to 〜 で「進んで〜する」。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S each community] [V is] [C different]}], [S {動名詞| [V changing] [O the clock] [M alone]}] [V is not] [C a complete solution].', {
    chunks: [
      ['Because each community is different,', '地域はそれぞれ異なるので'],
      ['changing the clock alone', '始業の時刻を変えるだけでは'],
      ['is not a complete solution', '完全な解決策ではありません'],
    ],
    notes: {
      'changing the clock alone': 'changing 以下は「〜を変えること」という動名詞のまとまりで、主語です。alone は「〜だけ」。',
    },
  }),
  st('[S Schools] [V need] [O {to:名詞| [V to examine] [O {並列| bus routes, | club times, | and family needs}] [M {前| before {動名詞| [V choosing] [O a new schedule]}}]}].', {
    chunks: [
      ['Schools need to examine', '学校は調べる必要があります（何をかは次へ）'],
      ['bus routes, club times, and family needs', 'バスの路線や部活動の時間、家庭の事情を'],
      ['before choosing a new schedule', '新しい予定を選ぶ前に'],
    ],
    notes: {
      'Schools need to examine': 'need to 〜 で「〜する必要がある」。',
      'before choosing a new schedule': 'before の後ろに動名詞 choosing を置き、「〜を選ぶ前に」。',
    },
  }),
  st('[S They] [V should] [M also] [V teach] [O1 students] [O2 {that節| [接 that] [S a later start] [V is not] [C an invitation {to:形容詞>an invitation| [V to stay] [C online] [M longer] [M {前| at night}]}]}].', {
    chunks: [
      ['They should also teach students that', '学校は生徒に〜ということも教えるべきです（内容は次へ）'],
      ['a later start is not an invitation', '始業が遅いことは、〜してよいという合図ではない（何をかは次へ）'],
      ['to stay online longer at night', '夜にもっと長くオンラインで過ごして（よいという合図ではないと）'],
    ],
    notes: {
      'They should also teach students that': 'teach ＋ 人 ＋ that 〜 で「人に〜ということを教える」。They は Schools を指します。',
      'a later start is not an invitation': 'invitation はここでは「〜してもよいという合図」のこと。遅く寝てよいという意味ではない、と伝えています。',
    },
  }),
  st('[S The strongest argument {前| for change}] [V does not demand] [O one starting time {前| for every school}].', {
    chunks: [
      ['The strongest argument for change', '変更を支持する最も強い主張は'],
      ['does not demand one starting time', '一つの始業時刻を求めてはいません'],
      ['for every school', 'すべての学校に共通の（始業時刻を）'],
    ],
    notes: {
      'The strongest argument for change': 'argument for 〜 で「〜に賛成する主張」。strongest は strong の最上級です。',
    },
  }),
  st('[S It] [V is] [C {that節| [接 that] [S school policies] [V should take] [O evidence {前| about teenage sleep}] [M seriously]}].', {
    chunks: [
      ['It is that', 'その主張とは〜ということです（内容は次へ）'],
      ['school policies should take evidence about teenage sleep', '学校の方針は10代の睡眠についての証拠を受け止めるべきだ'],
      ['seriously', '真剣に（受け止めるべきだ、ということです）'],
    ],
    notes: {
      'It is that': 'It は前の文の The strongest argument for change を指し、that 以下がその主張の中身です。',
      seriously: 'take A seriously で「Aを真剣に受け止める」。',
    },
    rules: ['reference-chain', 'that-diagnosis', 'svoc-core'],
  }),
  st('[S A community] [V can] [M then] [V balance] [O health benefits] [M {前| with local challenges}] [接 and] [V test] [O {whether節| [接 whether] [S its plan] [V is] [C effective]}].', {
    chunks: [
      ['A community can then balance health benefits', 'その上で地域は、健康上の利点を釣り合わせることができます（何とかは次へ）'],
      ['with local challenges', '地域の課題と'],
      ['and test', 'そして確かめることができます（何をかは次へ）'],
      ['whether its plan is effective', 'その計画が効果的かどうかを'],
    ],
    notes: {
      'A community can then balance health benefits': 'balance A with B で「AとBの釣り合いを取る」。then は「その上で」。',
      'and test': 'test も can を共有しています（can test）。',
    },
  }),
  st('[S Careful changes] [V are] [C more useful {前| than {動名詞| [V keeping] [O an old schedule] [M simply {副詞節:理由| [接 because] [S it] [V is] [C familiar]}]}}], [M especially {副詞節:時| [接 when] [S schools] [V review] [O them] [M regularly]}].', {
    chunks: [
      ['Careful changes are more useful', '慎重な変更のほうが役に立ちます（比べる相手は次へ）'],
      ['than keeping an old schedule', '古い予定をそのまま続けることよりも'],
      ['simply because it is familiar,', 'ただ慣れているという理由だけで（続けることよりも）'],
      ['especially when schools review them regularly', '学校が変更を定期的に見直すときは特にそうです'],
    ],
    notes: {
      'than keeping an old schedule': 'than の後ろに動名詞 keeping を置き、「〜を続けること」と比べています。',
      'simply because it is familiar,': 'simply because 〜 で「ただ〜という理由だけで」。it は an old schedule を指します。',
      'especially when schools review them regularly': 'them は Careful changes を指します。',
    },
  }),
])
