import { st } from './entry.js'

export default Object.freeze([
  st('[S Many students] [V say] [O {that節| [接 that] [S phones] [V help] [O them] [C {原形| [V organize] [O homework] [接 and] [V contact] [O their families]}]}].', {
    chunks: [
      ['Many students say that', '多くの生徒は〜と言います（内容は次へ）'],
      ['phones help them organize homework', 'スマートフォンは生徒が宿題を整理するのを助け'],
      ['and contact their families', '家族に連絡するのも助ける（と）'],
    ],
    notes: {
      'phones help them organize homework': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。them は Many students を指します。',
      'and contact their families': 'and は organize と contact をつなぎ、どちらも help them の後ろの動詞の原形です。',
    },
  }),
  st('[S The same phones], [M however], [V can interrupt] [O study] [M {前| with messages {関係>messages| [S that] [V feel] [C urgent]}}].', {
    chunks: [
      ['The same phones, however,', 'しかし、同じスマートフォンが'],
      ['can interrupt study', '学習を中断させることがあります（何でかは次へ）'],
      ['with messages that feel urgent', '緊急に感じられるメッセージで'],
    ],
    notes: {
      'The same phones, however,': 'however は文の途中にコンマで挟まれ、前の文と反対の内容が来ることを示します。',
      'can interrupt study': 'can は「〜することがある」という可能性です。interrupt は「中断させる・じゃまをする」。',
      'with messages that feel urgent': 'that は messages を受ける関係代名詞です。feel ＋ 形容詞 で「〜に感じられる」。',
    },
    rules: ['insertion', 'relative-clause', 'contrast-concession'],
  }),
  st('[S One high school] [V tested] [O a daily phone-free hour] [M {前| instead of {動名詞| [V banning] [O phones] [M all day]}}].', {
    chunks: [
      ['One high school', 'ある高校は'],
      ['tested a daily phone-free hour', '毎日スマートフォンを使わない1時間を試しました'],
      ['instead of banning phones all day', '一日中スマートフォンを禁止する代わりに'],
    ],
    notes: {
      'tested a daily phone-free hour': 'phone-free は「スマートフォンのない」、daily は「毎日の」。',
      'instead of banning phones all day': 'instead of ＋ -ing で「〜する代わりに」。banning は前置詞の後ろの動名詞です。',
    },
  }),
  st('[M {前| At the beginning {前| of the hour}}], [S students] [V placed] [O phones] [M {前| in {並列| their bags | or lockers}}].', {
    chunks: [
      ['At the beginning of the hour,', 'その1時間の始めに'],
      ['students placed phones', '生徒たちはスマートフォンを入れました（どこにかは次へ）'],
      ['in their bags or lockers', '自分のかばんやロッカーに'],
    ],
    notes: {
      'students placed phones': 'place はここでは動詞で「置く・入れる」。',
    },
  }),
  st('[S The office] [V kept] [O a number {関係>a number| [O that] [S families] [V could call] [M {前| in an emergency}]}].', {
    chunks: [
      ['The office kept a number', '事務室は番号を用意しておきました（どんな番号かは次へ）'],
      ['that families could call in an emergency', '緊急時に家族が電話をかけられる（番号を）'],
    ],
    notes: {
      'The office kept a number': 'The office は学校の事務室です。keep はここでは「（使えるように）持っておく」。',
      'that families could call in an emergency': 'that は a number を受ける関係代名詞で、call の目的語にあたります。',
    },
  }),
  st('[S Teachers] [V used] [O the time] [M {前| for {並列| reading, | writing, | or problems {関係>problems| [S that] [V required] [O steady attention]}}}].', {
    chunks: [
      ['Teachers used the time', '先生たちはその時間を使いました（何にかは次へ）'],
      ['for reading, writing, or problems', '読むこと、書くこと、または問題に（どんな問題かは次へ）'],
      ['that required steady attention', '継続的な集中が必要な（問題に）'],
    ],
    notes: {
      'for reading, writing, or problems': 'for の後ろに reading, writing, problems の3つが並んでいます。',
      'that required steady attention': 'that は problems を受ける関係代名詞です。steady attention は「途切れない集中」。',
    },
  }),
  st('[M {前| For four weeks}], [S two classes] [V followed] [O the plan] [M {副詞節:対比| [接 while] [S two other classes] [V kept] [O their usual rules]}].', {
    chunks: [
      ['For four weeks,', '4週間'],
      ['two classes followed the plan', '2つのクラスがその方法を実施しました'],
      ['while two other classes kept their usual rules', '一方、ほかの2つのクラスはいつもの規則を続けました'],
    ],
    notes: {
      'two classes followed the plan': 'follow the plan で「計画どおりに行う」。the plan はスマートフォンを使わない1時間のことです。',
      'while two other classes kept their usual rules': 'while はここでは「一方で」と2つのグループを対比します。',
    },
  }),
  st('[S Both groups] [V completed] [O the same short reading tasks] [M each Friday].', {
    chunks: [
      ['Both groups completed the same short reading tasks', '両方のグループが同じ短い読解課題をやり終えました'],
      ['each Friday', '毎週金曜日に'],
    ],
    notes: {
      'Both groups completed the same short reading tasks': 'Both groups は、方法を実施したクラスといつもの規則のクラスの両方です。同じ課題にすることで、結果を比べられます。',
    },
    rules: ['comparison-pairs', 'reference-chain', 'svoc-core'],
  }),
  st('[S Students] [M also] [V reported] [O {疑問詞節| [M how often] [S their attention] [V moved] [M away {前| from the work}]}].', {
    chunks: [
      ['Students also reported', '生徒たちは〜も報告しました（何をかは次へ）'],
      ['how often their attention moved away', 'どのくらいの頻度で注意がそれたかを'],
      ['from the work', '課題から（それたか）'],
    ],
    notes: {
      'how often their attention moved away': 'how often 以下は「どのくらいの頻度で〜か」という名詞のまとまりで、reported の目的語です。move away from で「〜から離れる」。',
    },
    rules: ['wh-clause', 'logic-connectors', 'svoc-core'],
  }),
  st('[S The school] [V revealed] [O the comparison group] [M only {副詞節:時| [接 after] [S the four-week trial] [V ended]}].', {
    chunks: [
      ['The school revealed the comparison group', '学校は比較グループを明らかにしました（いつかは次へ）'],
      ['only after the four-week trial ended', '4週間の試行が終わってから初めて'],
    ],
    notes: {
      'The school revealed the comparison group': 'comparison group は、いつもの規則を続けた「比べるためのグループ」です。',
      'only after the four-week trial ended': 'only after 〜 で「〜して初めて」。after は接続詞で、後ろに the four-week trial ended という主語と動詞が続きます。',
    },
    rules: ['comparison-pairs', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S This] [V reduced] [O the chance {同格that>the chance| [接 that] [S expectations alone] [V would change] [O {疑問詞節| [M how] [S students] [V described] [O their focus]}]}].', {
    chunks: [
      ['This reduced the chance', 'このことは、可能性を小さくしました（どんな可能性かは次へ）'],
      ['that expectations alone would change', '期待だけが〜を変えてしまうという（何をかは次へ）'],
      ['how students described their focus', '生徒が自分の集中をどう答えるかを'],
    ],
    notes: {
      'This reduced the chance': 'This は前の文の「試行が終わるまで比較グループを明かさなかったこと」を指します。',
      'that expectations alone would change': 'that は the chance の中身を説明する同格の that です。alone は expectations を後ろから限定して「期待だけ」。',
      'how students described their focus': 'how 以下は「どのように〜か」という名詞のまとまりで、change の目的語です。',
    },
    rules: ['reference-chain', 'that-diagnosis', 'wh-clause'],
  }),
  st('[S The phone-free classes] [V finished] [O slightly more questions] [接 and] [V reported] [O fewer interruptions].', {
    chunks: [
      ['The phone-free classes finished slightly more questions', 'スマートフォンなしのクラスは、わずかに多くの問題を解き終え'],
      ['and reported fewer interruptions', '中断がより少なかったと報告しました'],
    ],
    notes: {
      'The phone-free classes finished slightly more questions': 'slightly は「わずかに」。いつもの規則のクラスと比べて、解き終えた問題が少し多かったということです。',
      'and reported fewer interruptions': 'fewer は few の比較級で「より少ない」。interruption は interrupt の名詞形です。',
    },
  }),
  st('[S The school] [V compared] [O completion rates] [接 but] [V did not treat] [O a few extra answers] [C {前| as proof {前| of deeper learning}}].', {
    chunks: [
      ['The school compared completion rates', '学校は課題を終えた割合を比べました'],
      ['but did not treat a few extra answers', 'しかし、数問多い答えを〜とはみなしませんでした（何とかは次へ）'],
      ['as proof of deeper learning', 'より深い学びの証拠（とは）'],
    ],
    notes: {
      'The school compared completion rates': 'completion rate は「完了率」で、課題をどれだけ終えられたかの割合です。',
      'but did not treat a few extra answers': 'treat A as B で「AをBとみなす」。but の後ろの主語も The school です。',
      'as proof of deeper learning': 'deeper は deep の比較級です。数問の差だけでは深く学べたとは言えない、という慎重な判断です。',
    },
  }),
  st('[S The result] [V did not mean] [O {that節| [接 that] [S every student] [V liked] [O the plan]}].', {
    chunks: [
      ['The result did not mean that', 'その結果は〜という意味ではありませんでした（内容は次へ）'],
      ['every student liked the plan', 'すべての生徒がその方法を気に入った（という）'],
    ],
    notes: {
      'The result did not mean that': 'not は mean を打ち消し、「すべての生徒が気に入ったとまでは言えない」という部分的な否定になります。',
    },
    rules: ['negation-scope', 'that-diagnosis', 'paragraph-map'],
  }),
  st('[S Some] [V felt] [C anxious] [M {副詞節:理由| [接 because] [S they] [M regularly] [V received] [O health messages {前| from home}]}].', {
    chunks: [
      ['Some felt anxious', '不安を感じる生徒もいました'],
      ['because they regularly received', '定期的に受け取っていたので（何をかは次へ）'],
      ['health messages from home', '家庭からの健康に関する連絡を'],
    ],
    notes: {
      'Some felt anxious': 'Some は「一部の生徒」。feel ＋ 形容詞 で「〜に感じる」。',
      'because they regularly received': 'they は Some（一部の生徒）を指します。regularly は「定期的に」。',
    },
  }),
  st('[S Others] [V needed] [O {並列| translation | or reading tools} {関係>translation or reading tools| [S that] [V were] [C available] [M {前| on their phones}]}].', {
    chunks: [
      ['Others needed translation or reading tools', 'ほかの生徒は、翻訳や読むのを助けるツールを必要としました（どんなツールかは次へ）'],
      ['that were available on their phones', 'スマートフォンで使える（ツールを）'],
    ],
    notes: {
      'Others needed translation or reading tools': 'Others は前の文の Some と対になる「ほかの生徒」です。',
      'that were available on their phones': 'that は translation or reading tools を受ける関係代名詞です。available は「利用できる」。',
    },
  }),
  st('[S The school] [M therefore] [V allowed] [O teachers] [C {to:補語| [V to approve] [O necessary learning tools]}].', {
    chunks: [
      ['The school therefore allowed teachers', 'そこで学校は、先生たちに認めました（何をかは次へ）'],
      ['to approve necessary learning tools', '必要な学習ツールを許可することを'],
    ],
    notes: {
      'The school therefore allowed teachers': 'allow ＋ 人 ＋ to 〜 で「人が〜するのを認める」。therefore は前の2文の生徒の事情を受けています。',
      'to approve necessary learning tools': 'approve は「許可する・認める」。',
    },
  }),
  st('[S A second survey] [V showed] [O another limit {前| of the experiment}].', {
    chunks: [
      ['A second survey showed another limit', '2回目のアンケートは、もう一つの限界を示しました（何のかは次へ）'],
      ['of the experiment', 'この実験の'],
    ],
    notes: {
      'A second survey showed another limit': 'another limit は、前の段落の例外に続く「もう一つの限界」です。',
    },
    rules: ['paragraph-map', 'reference-chain', 'main-clause-skeleton'],
  }),
  st('[M {副詞節:条件| [接 If] [S an assignment] [V was] [C unclear]}], [S students] [V became] [C distracted] [M even {前| without a phone nearby}].', {
    chunks: [
      ['If an assignment was unclear,', '課題が分かりにくいと'],
      ['students became distracted', '生徒の集中は途切れました'],
      ['even without a phone nearby', '近くにスマートフォンがなくても'],
    ],
    notes: {
      'students became distracted': 'become ＋ 形容詞 で「〜になる」。distracted は「気が散った」。',
      'even without a phone nearby': 'without A nearby で「Aが近くにない状態で」。even は「〜でさえ」。',
    },
  }),
  st('[S {動名詞| [V Reducing] [O messages]}] [V could support] [O attention], [接 but] [S it] [V could not replace] [O clear teaching].', {
    chunks: [
      ['Reducing messages could support attention,', 'メッセージを減らすことは集中を支えることができました'],
      ['but it could not replace clear teaching', 'しかし、それは分かりやすい指導の代わりにはなれませんでした'],
    ],
    notes: {
      'Reducing messages could support attention,': 'Reducing messages は動名詞のまとまりで、文の主語です。',
      'but it could not replace clear teaching': 'it は Reducing messages を指します。replace は「〜の代わりになる」。前の文の、課題が分かりにくいと集中が途切れたことを受けています。',
    },
  }),
  st('[S The school] [M now] [V keeps] [O the hour] [接 but] [V reviews] [O the rules] [M every term].', {
    chunks: [
      ['The school now keeps the hour', '学校は今もその1時間を続けています'],
      ['but reviews the rules every term', 'しかし、学期ごとに規則を見直しています'],
    ],
    notes: {
      'but reviews the rules every term': 'but の後ろの reviews の主語も The school です。term はここでは「学期」。',
    },
  }),
  st('[S It] [M also] [V teaches] [O students] [C {to:補語| [V to choose] [O {並列| {疑問詞節| [M when] [S a device] [V helps]} | and {疑問詞節| [M when] [S it] [V interrupts]}}]}].', {
    chunks: [
      ['It also teaches students', '学校はまた、生徒に教えています（何をかは次へ）'],
      ['to choose when a device helps', '機器がいつ役立つかを判断するように'],
      ['and when it interrupts', 'そして、いつ邪魔になるかを（判断するように）'],
    ],
    notes: {
      'It also teaches students': 'It は前の文の The school を指します。teach ＋ 人 ＋ to 〜 で「人に〜するように教える」。',
      'to choose when a device helps': 'when 以下は「いつ〜か」という名詞のまとまりで、choose の目的語です。choose はここでは「判断して決める」。',
      'and when it interrupts': 'and は2つの when のまとまりをつなぎます。it は a device を指します。',
    },
  }),
  st('[M {前| At home}], [S students] [V can silence] [O alerts] [接 or] [V place] [O a device] [M {前| out of reach}] [M {副詞節:時| [接 while] [V studying]}].', {
    chunks: [
      ['At home,', '家庭では'],
      ['students can silence alerts', '生徒は通知が鳴らないようにしたり'],
      ['or place a device out of reach', '機器を手の届かない所に置いたりできます'],
      ['while studying', '勉強している間に'],
    ],
    notes: {
      'students can silence alerts': 'silence はここでは動詞で「音を出さないようにする」。alert は「通知」。',
      'or place a device out of reach': 'place はここでは動詞で「置く」。can は silence と place の両方にかかります。out of reach は「手の届かない所に」。',
      'while studying': 'while ＋ -ing で「〜している間に」。while の後ろの they are が省かれた形です。',
    },
  }),
  st('[S The goal] [V is] [C {並列| not simply {to:名詞| [V to remove] [O phones]}, | but {to:名詞| [V to build] [O habits {関係>habits| [S that] [V protect] [O attention]}]}}].', {
    chunks: [
      ['The goal is not simply to remove phones,', '目標は、単にスマートフォンを取り除くことではなく'],
      ['but to build habits', '習慣を身につけることです（どんな習慣かは次へ）'],
      ['that protect attention', '集中を守る（習慣を）'],
    ],
    notes: {
      'The goal is not simply to remove phones,': 'not simply A, but B で「単にAではなくB」。筆者の言いたいことは but の後ろにあります。to remove は is の補語になる名詞的用法です。',
      'but to build habits': 'to build も is の補語で、to remove と並んでいます。',
      'that protect attention': 'that は habits を受ける関係代名詞です。',
    },
    rules: ['contrast-concession', 'infinitive-role', 'relative-clause'],
  }),
])
