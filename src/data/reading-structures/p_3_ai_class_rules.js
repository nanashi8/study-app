import { st } from './entry.js'

export default Object.freeze([
  st('[M Last year], [S many students {前| at our school}] [V began] [O {動名詞| [V using] [O AI chat tools] [M {前| for homework}]}].', {
    chunks: [
      ['Last year, many students at our school', '昨年、私たちの学校の多くの生徒が'],
      ['began using AI chat tools', 'AIチャットの道具を使い始めました（何のためかは次へ）'],
      ['for homework', '宿題のために'],
    ],
    notes: {
      'began using AI chat tools': 'begin ＋ -ing で「〜し始める」。using 以下が began の目的語です。',
    },
    rules: ['paragraph-map', 'ing-ed-role', 'main-clause-skeleton'],
  }),
  st('[S Some] [V used] [O them] [M {to:副詞(目的)| [V to check] [O spelling]}], [接 and] [S others] [V asked] [M {前| for ideas}] [M {前| before {動名詞| [V writing]}}].', {
    chunks: [
      ['Some used them to check spelling,', 'つづりを確かめるために使う生徒もいました'],
      ['and others asked for ideas before writing', '書く前に、考えのもとを求める生徒もいました'],
    ],
    notes: {
      'Some used them to check spelling,': 'Some は「一部の生徒」。them は前の文の AI chat tools を指します。',
      'and others asked for ideas before writing': 'Some …, and others … で「〜する人もいれば、〜する人もいる」。ask for 〜 で「〜を求める」。',
    },
  }),
  st('[S A few students] [V copied] [O whole answers] [接 and] [V did not read] [O them] [M carefully].', {
    chunks: [
      ['A few students copied whole answers', '答えを丸ごと写す生徒も少しいました'],
      ['and did not read them carefully', 'しかも、その答えをよく読んでいませんでした'],
    ],
    notes: {
      'and did not read them carefully': 'and の後ろの did not read の主語も A few students です。',
    },
  }),
  st('[S One teacher] [V noticed] [O {that節| [接 that] [S several reports] [V used] [O the same unusual phrase]}].', {
    chunks: [
      ['One teacher noticed that', 'ある先生は〜ことに気づきました（内容は次へ）'],
      ['several reports used the same unusual phrase', 'いくつかの報告が同じ珍しい言い方を使っていた（ことに）'],
    ],
    notes: {
      'several reports used the same unusual phrase': 'unusual は「ふつうでない・珍しい」。同じ言い方が並ぶことが手がかりになりました。',
    },
  }),
  st('[S Teachers] [V were worried], [接 but] [S they] [V did not want] [O {to:名詞| [V to ban] [O the tools] [M completely]}].', {
    chunks: [
      ['Teachers were worried,', '先生たちは心配しました'],
      ['but they did not want', 'しかし、〜したいとは思いませんでした（何をかは次へ）'],
      ['to ban the tools completely', 'その道具を全部禁止しようとは'],
    ],
    notes: {
      'but they did not want': 'want to 〜 で「〜したい」。not が want を打ち消しています。completely は「すっかり・全部」。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'infinitive-role'],
  }),
  st('[M Instead], [S the school] [V asked] [O each class] [C {to:補語| [V to write] [O its own rules]}].', {
    chunks: [
      ['Instead, the school asked each class', 'その代わりに、学校は各クラスに求めました（何をかは次へ）'],
      ['to write its own rules', '自分たちのルールを作るように'],
    ],
    notes: {
      'Instead, the school asked each class': 'Instead は「（禁止する）代わりに」。ask ＋ 人 ＋ to 〜 で「人に〜するよう求める」。',
      'to write its own rules': 'its own rules の its は each class を指します。',
    },
  }),
  st('[S Our class] [M first] [V collected] [O examples {前| of {並列| good | and bad use}}].', {
    chunks: [
      ['Our class first collected examples', '私たちのクラスはまず、例を集めました（何のかは次へ）'],
      ['of good and bad use', 'よい使い方と悪い使い方の'],
    ],
    notes: {
      'Our class first collected examples': 'first は「まず」。ルールを作る前に、実際の使い方を集めました。',
    },
  }),
  st('[S The class] [V found] [O {that節| [接 that] [S a list {前| of ideas}] [V was] [M often] [C helpful]}].', {
    chunks: [
      ['The class found that', 'クラスは〜と分かりました（内容は次へ）'],
      ['a list of ideas was often helpful', '考えのもとを並べた一覧は、役に立つことが多い（と）'],
    ],
    notes: {
      'a list of ideas was often helpful': 'a list of ideas は「思いつきを並べたもの」。ここまでは認められた使い方です。',
    },
  }),
  st('[S The class] [M also] [V found] [O {that節| [接 that] [S {動名詞| [V copying] [O a finished report]}] [V was not] [C honest work]}].', {
    chunks: [
      ['The class also found that', 'クラスはまた、〜とも分かりました（内容は次へ）'],
      ['copying a finished report was not honest work', '完成した報告をそのまま写すのは、正しい取り組みではない（と）'],
    ],
    notes: {
      'copying a finished report was not honest work': 'copying a finished report は動名詞のまとまりで、that 節の主語です。honest work は「ごまかしのない取り組み」。',
    },
  }),
  st('[S A student] [V pointed out] [O {that節| [接 that] [S the tools] [M sometimes] [V give] [O {並列| confident | but wrong answers}]}].', {
    chunks: [
      ['A student pointed out that', 'ある生徒は〜と指摘しました（内容は次へ）'],
      ['the tools sometimes give confident but wrong answers', 'その道具は、自信ありげでも間違った答えを出すことがある（と）'],
    ],
    notes: {
      'A student pointed out that': 'point out 〜 で「〜を指摘する」。out は動詞とひとまとまりです。',
      'the tools sometimes give confident but wrong answers': 'confident but wrong で「自信ありげなのに間違っている」。',
    },
  }),
  st('[M Then] [S we] [V ran] [O a short experiment] [M {前| with the tools}].', {
    chunks: [
      ['Then we ran a short experiment', 'それから、私たちは短い実験をしました（何を使ってかは次へ）'],
      ['with the tools', 'その道具を使って'],
    ],
    notes: {
      'Then we ran a short experiment': 'run an experiment で「実験を行う」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S Half {前| of the class}] [V wrote] [O a summary] [M alone], [接 and] [S the other half] [V used] [O AI] [M first].', {
    chunks: [
      ['Half of the class wrote a summary alone,', 'クラスの半分は、自分だけで要約を書きました'],
      ['and the other half used AI first', 'もう半分は、先にAIを使いました'],
    ],
    notes: {
      'Half of the class wrote a summary alone,': 'alone は「自分だけで」。2つのやり方を比べる実験です。',
      'and the other half used AI first': 'the other half は「残りの半分」。',
    },
  }),
  st('[S The AI group] [V finished] [M faster], [接 but] [S their sentences] [V were] [M often] [C too general].', {
    chunks: [
      ['The AI group finished faster,', 'AIを使った組のほうが早く終わりました'],
      ['but their sentences were often too general', 'しかし、その文はおおざっぱすぎることがよくありました'],
    ],
    notes: {
      'The AI group finished faster,': 'finish はここでは目的語を取らず「終わる」。faster は「より早く」。',
      'but their sentences were often too general': 'too general は「ざっくりしすぎている」。速さと中身を分けて見ています。',
    },
  }),
  st('[S Two answers] [M even] [V included] [O a fact {関係>a fact| [O that] [S no other source] [V mentioned]}].', {
    chunks: [
      ['Two answers even included a fact', '2つの答えには、事実まで入っていました（どんな事実かは次へ）'],
      ['that no other source mentioned', 'ほかのどの資料も書いていない（事実が）'],
    ],
    notes: {
      'Two answers even included a fact': 'even は「〜まで」と意外さを表します。',
      'that no other source mentioned': 'that は a fact を受ける関係代名詞で、mentioned の目的語にあたります。ほかに出どころのない「事実」だったということです。',
    },
  }),
  st('[S We] [V reported] [O both results] [M {前| to the whole school}] [M {前| at a morning meeting}].', {
    chunks: [
      ['We reported both results to the whole school', '私たちは、両方の結果を全校に報告しました（いつかは次へ）'],
      ['at a morning meeting', '朝の集会で'],
    ],
    notes: {
      'We reported both results to the whole school': 'both results は、速さと中身の両方の結果です。',
    },
  }),
  st('[S Our rules] [M therefore] [V include] [O one important step].', {
    chunks: [
      ['Our rules therefore include one important step', 'そのため、私たちのルールには大事な手順が一つ入っています'],
    ],
    notes: {
      'Our rules therefore include one important step': 'therefore は、実験で分かったことを受けています。次の文がその手順の中身です。',
    },
    rules: ['paragraph-map', 'cause-result', 'main-clause-skeleton'],
  }),
  st('[S Each report] [V must list] [O the source {前| of every piece {前| of information}}].', {
    chunks: [
      ['Each report must list the source', 'どの報告も、出どころを挙げなければなりません（何のかは次へ）'],
      ['of every piece of information', 'すべての情報の'],
    ],
    notes: {
      'of every piece of information': 'every piece of information で「一つ一つの情報」。source は「出どころ」。',
    },
  }),
  st('[S They] [V must] [M also] [V write] [O a short note] [M {前| about the parts {関係省略:目的格>the parts| [S they] [V changed] [M themselves]}}].', {
    chunks: [
      ['They must also write a short note', '生徒は、短い覚え書きも書かなければなりません（何についてかは次へ）'],
      ['about the parts they changed themselves', '自分で書き直した部分について'],
    ],
    notes: {
      'They must also write a short note': 'They は生徒たちを指します。',
      'about the parts they changed themselves': 'the parts の後ろは、関係代名詞が省かれた形です。themselves は「自分たちで」。',
    },
  }),
  st('[S The rules] [M also] [V ask] [O students] [C {to:補語| [V to keep] [O their first draft]}].', {
    chunks: [
      ['The rules also ask students', 'ルールはまた、生徒に求めています（何をかは次へ）'],
      ['to keep their first draft', '最初の下書きを残しておくように'],
    ],
    notes: {
      'to keep their first draft': 'draft は「下書き」。あとで見比べられるようにするためです。',
    },
  }),
  st('[S Teachers] [V can] [M then] [V compare] [O the draft] [M {前| with the finished report}].', {
    chunks: [
      ['Teachers can then compare the draft', 'そうすれば先生は、下書きを比べられます（何とかは次へ）'],
      ['with the finished report', '完成した報告と'],
    ],
    notes: {
      'Teachers can then compare the draft': 'compare A with B で「AをBと比べる」。then は「そうすれば」。',
    },
  }),
  st('[S The rules] [V are not] [C perfect], [接 and] [S we] [V will read] [O them] [M again] [M {前| in March}].', {
    chunks: [
      ['The rules are not perfect,', 'そのルールは完全ではありません'],
      ['and we will read them again in March', 'そして私たちは、3月にもう一度読み直します'],
    ],
    notes: {
      'The rules are not perfect,': '自分たちで作ったルールにも直す余地があると認めています。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[S Our class] [V will collect] [O new examples] [M every month] [M {前| until then}].', {
    chunks: [
      ['Our class will collect new examples every month', '私たちのクラスは、毎月新しい例を集めます（いつまでかは次へ）'],
      ['until then', 'そのときまで'],
    ],
    notes: {
      'until then': 'then は前の文の「3月」を指します。',
    },
  }),
  st('[S Some students] [M still] [V think] [O {that節| [接 that] [S any use {前| of AI}] [V is] [C unfair]}].', {
    chunks: [
      ['Some students still think that', '今でも〜と考えている生徒がいます（内容は次へ）'],
      ['any use of AI is unfair', 'AIをどう使っても不公平だ（と）'],
    ],
    notes: {
      'any use of AI is unfair': 'any use of AI で「AIのどんな使い方も」。unfair は「公平でない」。',
    },
  }),
  st('[S Others] [V say] [O {that節| [接 that] [S people] [V will use] [O these tools] [M {前| at work}] [M {前| in the future}]}].', {
    chunks: [
      ['Others say that', '〜と言う生徒もいます（内容は次へ）'],
      ['people will use these tools at work', '人はこうした道具を仕事で使うようになる'],
      ['in the future', '将来は（そうなると）'],
    ],
    notes: {
      'Others say that': 'Others は前の文の Some students と対になる「ほかの生徒」です。',
    },
  }),
  st('[S Our teacher] [V told] [O1 us] [O2 {that節| [接 that] [S {動名詞| [V learning] [O {to:名詞| [V to judge] [O information]}]}] [V is] [C the real skill]}].', {
    chunks: [
      ['Our teacher told us that', '先生は私たちに〜と言いました（内容は次へ）'],
      ['learning to judge information is the real skill', '情報を見分けられるようになることが、本当の力だ（と）'],
    ],
    notes: {
      'Our teacher told us that': 'tell ＋ 人 ＋ that 節 で「人に〜と言う」。',
      'learning to judge information is the real skill': 'learning to judge information が動名詞のまとまりで、that 節の主語です。judge は「見分ける・判断する」。',
    },
    rules: ['that-diagnosis', 'svoc-core', 'author-stance'],
  }),
])
