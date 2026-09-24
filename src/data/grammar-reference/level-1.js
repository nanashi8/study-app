// 文法の参考書：英検1級（大学上級程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_1 = [
  referenceUnit({
    key: 'tense',
    level: '1',
    topic: '時制・相',
    title: '時制と相（出来事をどう捉えるか）',
    lead: '時制（現在・過去）は「いつのことか」、相（進行・完了）は「出来事をどう捉えるか」を表す。時を表す語句だけで機械的に選ばず、基準の時とのつながりを考えて形を決める。',
    forms: [
      ['未来完了', 'will have ＋ 過去分詞', 'By next year, the team will have completed the survey.', '来年までに、チームは調査を終えているでしょう。'],
      ['未来完了進行形', 'will have been ＋ 動詞ing', 'By June, she will have been serving on the board for ten years.', '6月で、彼女は10年間理事を務めていることになります。'],
    ],
    points: [
      {
        title: '単純形・進行形・完了形のちがい',
        table: [
          ['形', '捉え方'],
          ['単純形（studies / studied）', '事実・全体として捉える'],
          ['進行形（is studying）', '進行中・一時的なこととして捉える'],
          ['完了形（has studied）', '基準の時とのつながりで捉える'],
          ['完了進行形（has been studying）', '基準の時まで続いてきた活動として捉える'],
        ],
        examples: [
          ['Researchers have studied the issue for decades, but no consensus has emerged.', '研究者は何十年もその問題を研究してきましたが、意見の一致はまだ生まれていません。'],
        ],
      },
      {
        title: '未来の基準までの完了・継続',
        text: [
          '未来のある時までに終わっていることは will have＋過去分詞、その時まで続いている動作は will have been＋動詞ing。by the time の中は現在形。',
        ],
        examples: [
          ['By the time the merger is completed, the firms will have operated independently for decades.', '合併が完了するころには、両社は何十年も独立して営業してきたことになります。'],
        ],
      },
      {
        title: 'This is the first time 〜 の後ろ',
        text: [
          'This is the first time（〜するのはこれが初めてだ）の後ろは、今までの経験として現在完了を使う。過去の話なら That was the first time 〜 had＋過去分詞。',
        ],
        examples: [
          ['This is the first time the issue has been raised publicly.', 'その問題が公に取り上げられたのはこれが初めてです。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'This is the first time のあとは現在完了／調査を完了するは complete the survey／意見の一致が生まれるは emerge。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This is the first time I have visited this city.', '私がこの都市を訪れたのは、これが初めてです。'],
          ['By next spring, the team will have completed the study.', '来年の春までに、チームは研究を完了しているでしょう。'],
          ['Experts have studied the problem for decades, but no consensus has emerged.', '専門家たちは何十年もその問題を研究してきましたが、意見の一致は生まれていません。'],
        ],
      },
    ],
    mistakes: [
      ['This is the first time I visit Kyoto.', 'This is the first time I have visited Kyoto.', 'This is the first time の後ろは現在完了。'],
      ['By June, she will be serving on the board for ten years.', 'By June, she will have been serving on the board for ten years.', '未来の基準まで続く動作は will have been＋動詞ing。'],
    ],
    check: [
      '単純形＝事実、進行形＝進行中、完了形＝基準の時とのつながり。',
      'will have＋過去分詞・will have been＋動詞ing。',
      'This is the first time＋現在完了。',
    ],
  }),

  referenceUnit({
    key: 'hedging',
    level: '1',
    topic: '助動詞・推量',
    title: '推量の強さ（must / may / cannot have・ヘッジ）',
    lead: '助動詞や seem・tend などを使い分けると、主張の確かさの度合いを調整できる。論説文や英作文では、根拠の強さに合う言い方を選ぶことが大切。',
    forms: [
      ['過去への推量', 'must / may / cannot have ＋ 過去分詞', 'She cannot have overlooked such an obvious error.', '彼女がそんな明らかな誤りを見落としたはずがありません。'],
      ['確かさを控えめに', 'may / tend to / appear to ＋ 原形', 'The pattern may reflect differences in access to education.', 'その傾向は教育を受ける機会の差を反映している可能性があります。'],
    ],
    points: [
      {
        title: '推量の強さの順番',
        table: [
          ['言い方', '確かさ'],
          ['must（have done）', 'ほぼ確実（〜にちがいない）'],
          ['will / would', 'かなり確か（〜だろう）'],
          ['should', 'たぶん（〜のはずだ）'],
          ['may / might / could', '可能性がある（〜かもしれない）'],
          ['cannot / can’t（have done）', 'ほぼありえない（〜のはずがない）'],
        ],
        examples: [
          ['Given the ambiguity, he may well have misunderstood the instruction.', 'あいまいさを考えれば、彼が指示を誤解したのも十分ありえます。'],
          ['The committee cannot have revised the proposal without consulting anyone.', '委員会がだれにも相談せずに提案を修正したはずがありません。'],
        ],
      },
      {
        title: '後悔・不要だったこと',
        text: [
          'should have＋過去分詞 は「〜すべきだったのに（しなかった）」、need not have＋過去分詞 は「〜する必要はなかったのに（した）」。',
        ],
        examples: [
          ['You should have informed us before releasing the statement.', '声明を出す前に、私たちに知らせるべきでした。'],
          ['The report need not have been so lengthy; a summary would have sufficed.', '報告書はあれほど長くする必要はありませんでした。要約で十分だったでしょう。'],
        ],
      },
      {
        title: '書くときの「控えめな言い方」',
        text: [
          '限られた証拠から always・prove・everyone と言い切ると、言い過ぎになる。suggest・indicate・tend to・in many cases などで、根拠に合う強さにする。',
        ],
        examples: [
          ['People tend to value information that confirms their beliefs.', '人は自分の考えを裏づける情報を重く見る傾向があります。'],
          ['The findings suggest that the policy may reduce inequality.', 'その結果は、政策が不平等を減らす可能性を示しています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'need not have＋過去分詞／控えめに述べる suggest／誤解するは misunderstand。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['The letter need not have been so long; a note would have sufficed.', 'その手紙はあれほど長くする必要はなかったのに。短いメモで十分でした。'],
          ['The findings suggest that the policy may reduce inequality.', 'その調査結果は、その政策が不平等を減らす可能性を示唆しています。'],
          ['Given the noise, he may well have misunderstood the question.', 'さわがしかったことを考えると、彼が質問を誤解したのももっともです。'],
        ],
      },
    ],
    rewrites: [
      ['This proves that the policy always works.', 'This suggests that the policy may be effective in these conditions.', '限られた証拠から言い切らず、suggest・may・条件で主張の範囲を限定する。'],
    ],
    mistakes: [
      ['She must overlooked the error.', 'She must have overlooked the error.', '過去への推量は must have＋過去分詞。'],
      ['He may well has misunderstood it.', 'He may well have misunderstood it.', '助動詞の後ろは原形の have。'],
    ],
    check: [
      'must have done＞may have done＞cannot have done の順に確かさが変わる。',
      'should have done＝すべきだったのに、need not have done＝必要はなかったのに。',
      '書くときは suggest・tend to・may で強さを調整する。',
    ],
  }),

  referenceUnit({
    key: 'subjunctive',
    level: '1',
    topic: '仮定法・語法',
    title: '仮定法と語法（仮定法現在・Were S to・It is high time）',
    lead: '要求・提案の that 節の原形（仮定法現在）、if を省いた倒置（Were S to do / Had it not been for）、It is high time＋過去形、would sooner＋過去形など、かたい文章で使う仮定法を学ぶ。',
    forms: [
      ['仮定法現在', 'suggest / demand / recommend ＋ that ＋ 主語 ＋ 原形', 'The doctor suggested that he take a rest.', '医者は彼が休むよう勧めました。'],
      ['if の省略', 'Were ＋ 主語 ＋ to ＋ 原形 〜, 主語 ＋ would ….', 'Were the policy to fail, the council would review it.', '万一その政策が失敗すれば、議会はそれを見直すでしょう。'],
    ],
    points: [
      {
        title: '仮定法現在（原形）',
        text: [
          'suggest・demand・recommend・insist・require や、It is essential / vital / necessary that 〜 の that 節では、主語や時にかかわらず原形を使う。受け身なら be＋過去分詞。',
        ],
        examples: [
          ['It is essential that every student be present.', '生徒全員が出席していることが不可欠です。', { present: '出席している' }],
          ['He demanded that the rule be changed.', '彼は規則を変えるよう要求しました。'],
          ['The experts recommended that the committee revise the proposal.', '専門家は委員会が提案を修正するよう勧めました。'],
        ],
      },
      {
        title: 'if を省いた倒置',
        table: [
          ['if を使う形', '倒置した形'],
          ['If I were to do it again, 〜', 'Were I to do it again, 〜'],
          ['If it had not been for your advice, 〜', 'Had it not been for your advice, 〜'],
          ['If the evidence were to be disclosed, 〜', 'Were the evidence to be disclosed, 〜'],
        ],
        examples: [
          ['Were I to do it again, I would choose differently.', 'もしもう一度するなら、ちがう選択をするでしょう。'],
          ['Had it not been for your advice, I would have failed.', 'あなたの助言がなかったら、私は失敗していたでしょう。'],
          ['Were the evidence to be disclosed, public trust would collapse.', '万一その証拠が公表されれば、人々の信頼は崩れるでしょう。'],
        ],
      },
      {
        title: '過去形を使う決まった言い方',
        table: [
          ['言い方', '意味'],
          ['It is (high) time ＋ 主語 ＋ 過去形', 'もう〜すべき時だ'],
          ['would sooner / rather ＋ 主語 ＋ 過去形', '（人に）むしろ〜してほしい'],
          ['if need be', '必要なら'],
        ],
        examples: [
          ['It is high time the regulation was reconsidered.', 'もうその規制を見直すべき時です。'],
          ['It is high time the committee finally revised the proposal.', 'もう委員会がようやく提案を修正すべき時です。'],
          ['I would sooner the matter remained confidential.', 'その件はむしろ内密にしておいてほしいのです。'],
          ['If need be, the deadline can be extended.', '必要なら、締め切りは延ばせます。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'It is essential that の中は原形／Were I to do の倒置／It is high time＋過去形。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['It is essential that every student be present at the ceremony.', 'すべての生徒が式典に出席していることが不可欠です。'],
          ['Were I to start over, I would choose another field.', '一からやり直すとしたら、私は別の分野を選ぶでしょう。'],
          ['It is high time the old rule was reconsidered.', 'その古い規則はそろそろ見直されてよいころです。'],
        ],
      },
    ],
    mistakes: [
      ['The doctor suggested that he takes a rest.', 'The doctor suggested that he take a rest.', '提案の that 節は原形。'],
      ['Was I to do it again, I would choose differently.', 'Were I to do it again, I would choose differently.', '仮定の倒置は Were。'],
      ['It is high time the rule is reconsidered.', 'It is high time the rule was reconsidered.', 'It is high time の後ろは過去形。'],
    ],
    check: [
      '要求・提案・It is essential that＋主語＋原形。',
      'Were S to do＝If S were to do、Had it not been for＝If it had not been for。',
      'It is high time＋過去形、would sooner＋主語＋過去形、if need be。',
    ],
  }),

  referenceUnit({
    key: 'optative',
    level: '1',
    topic: '祈願文',
    title: '祈願文（May 〜! / Long live 〜!）',
    lead: '「〜しますように」と願いを表す文。May＋主語＋原形、または may を使わずに原形で始める決まった言い方（Long live 〜! / God bless you! / Heaven forbid 〜）がある。',
    forms: [
      ['May を使う', 'May ＋ 主語 ＋ 原形 〜!', 'May all your efforts be rewarded!', 'あなたの努力がすべて報われますように。'],
      ['原形で始める', 'Long live 〜! / Heaven forbid 〜', 'Long live the king!', '国王万歳。'],
    ],
    points: [
      {
        title: '祈願文の形',
        text: [
          'May＋主語＋原形 の語順にする。may を使わない決まった言い方では、主語が3人称単数でも動詞は原形のまま（Long live the king! の live、God bless you! の bless）。',
        ],
        table: [
          ['言い方', '意味'],
          ['May you be happy!', 'お幸せに'],
          ['Long live 〜!', '〜万歳'],
          ['God bless you!', '神のお恵みがありますように'],
          ['Heaven forbid (that) 〜', '〜なんてことがありませんように'],
        ],
        examples: [
          ['Heaven forbid that such a disaster should happen again.', 'あのような災害が二度と起こりませんように。'],
          ['May you both be happy!', 'お二人がお幸せでありますように。'],
        ],
      },
      {
        title: '原形を使う理由',
        text: [
          '祈願文の原形（God bless you!・Long live the king!）は、要求・提案の that 節で使う原形（仮定法現在）と同じ形。Heaven forbid の後ろの that 節では、should＋原形 もよく使う。',
        ],
        examples: [
          ['God bless you!', '神のお恵みがありますように。'],
          ['May the new year bring you happiness!', '新しい年があなたに幸せをもたらしますように。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '祈願の May は文の先頭／Long live は原形のまま／God bless も原形。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['May you both be happy together!', 'お二人がともに幸せでありますように。'],
          ['Long live the queen!', '女王万歳。'],
          ['God bless you and your family!', 'あなたとご家族に神の祝福がありますように。'],
        ],
      },
    ],
    mistakes: [
      ['Long lives the king!', 'Long live the king!', '祈願文の動詞は原形。'],
      ['Can all your efforts be rewarded!', 'May all your efforts be rewarded!', '祈願は May＋主語＋原形。'],
    ],
    check: [
      'May＋主語＋原形 〜!＝〜しますように。',
      'Long live 〜!・God bless 〜!・Heaven forbid 〜 は原形のまま。',
    ],
  }),

  referenceUnit({
    key: 'inversion',
    level: '1',
    topic: '倒置・強調',
    title: '倒置（Not until・Only・On no account・So ＋形容詞）',
    lead: '否定・限定の語句（Not until・Only・On no account・Not only）や、So＋形容詞・Such を文の最初に出すと倒置が起こる。どこから倒置が始まるかを正確につかむ。',
    forms: [
      ['否定・限定の語句', '語句 ＋ 助動詞 ＋ 主語 ＋ 動詞 〜.', 'Not until then did I realize the truth.', 'そのとき初めて、私は真実に気づきました。'],
      ['So ＋ 形容詞', 'So ＋ 形容詞 ＋ be動詞 ＋ 主語 ＋ that ….', 'So absurd was the story that no one believed it.', 'その話はあまりにばかげていたので、だれも信じませんでした。'],
    ],
    points: [
      {
        title: '倒置が起こるのは主節',
        text: [
          'Not until 〜・Only when 〜 のまとまりが節のときも、倒置するのは後ろの主節。Only I 〜 のように主語を限るだけなら倒置しない。',
        ],
        examples: [
          ['Only after the war did they learn the truth.', '戦争が終わって初めて、彼らは真実を知りました。'],
          ['Only when the audit was complete did the scale of the loss become clear.', '監査が終わって初めて、損失の大きさが明らかになりました。'],
          ['Not until the audit ended did the error become clear.', '監査が終わって初めて、誤りが明らかになりました。'],
        ],
      },
      {
        title: '強い否定の語句',
        text: [
          'On no account・Under no circumstances（どんなことがあっても〜ない）、Not only（〜だけでなく）を前に出すと、後ろは助動詞＋主語＋動詞。',
        ],
        examples: [
          ['On no account should confidential data be disclosed.', 'どんなことがあっても、機密データを公開してはなりません。'],
          ['Not only did the policy fail, but it also increased costs.', 'その政策は失敗しただけでなく、費用も増やしました。'],
          ['No sooner had the committee revised the proposal than the public began to respond.', '委員会が提案を修正するとすぐに、人々が反応し始めました。'],
        ],
      },
      {
        title: 'So ＋ 形容詞・Such ＋ be動詞',
        text: [
          'So＋形容詞 を前に出すと be動詞＋主語 の順になる（So compelling was her argument that 〜）。Such was 〜 that … は「〜はあまりのものだったので…」。',
        ],
        examples: [
          ['So compelling was her argument that the committee reconsidered.', '彼女の主張があまりに説得力があったので、委員会は考え直しました。'],
          ['Such was his anger that he left at once.', '彼はあまりに怒っていたので、すぐに立ち去りました。'],
        ],
      },
      {
        title: 'if を省いた倒置',
        text: [
          'Had the evidence been examined earlier（If the evidence had been examined earlier）のように、仮定法の if を省いた倒置も読めるようにする。',
        ],
        examples: [
          ['Had the evidence been examined earlier, the error might have been found.', 'もっと早く証拠が調べられていれば、誤りは見つかっていたかもしれません。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '決して〜ないは on no account／規模は scale／公表するは disclose。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['On no account should visitors enter this area.', 'どんなことがあっても訪問者はこの区域に入ってはいけません。'],
          ['Only when the audit ended did the scale of the damage become clear.', '監査が終わって初めて、被害の規模がはっきりしました。'],
          ['On no account should such records be disclosed.', 'そのような記録を決して公表してはいけません。'],
        ],
      },
    ],
    mistakes: [
      ['Not until then I realized the truth.', 'Not until then did I realize the truth.', 'Not until を前に出したら did＋主語＋原形。'],
      ['So absurd the story was that no one believed it.', 'So absurd was the story that no one believed it.', 'So＋形容詞を前に出したら be動詞＋主語。'],
      ['On no account confidential data should be disclosed.', 'On no account should confidential data be disclosed.', 'On no account の後ろは助動詞＋主語。'],
    ],
    check: [
      'Not until・Only・On no account・Not only を前に出すと主節が倒置。',
      'So＋形容詞＋be動詞＋主語＋that …、Such was 〜 that …。',
      'Had / Were＋主語 〜＝if を省いた仮定。',
    ],
  }),

  referenceUnit({
    key: 'emphasis',
    level: '1',
    topic: '強調・倒置',
    title: '強調（What S V is 〜・It is 〜 that・the very）',
    lead: '伝えたい部分を強める言い方を使い分ける。What S V is 〜（…するのは〜だ）は焦点を文の後ろに置き、It is 〜 that … は焦点を前に置く。the very＋名詞 は名詞そのものを強める。',
    forms: [
      ['焦点を後ろに', 'What ＋ 主語 ＋ 動詞 ＋ is ＋ 焦点', 'What the committee objects to is not the cost but the lack of evidence.', '委員会が反対しているのは、費用ではなく証拠がないことです。'],
      ['焦点を前に', 'It is / was ＋ 焦点 ＋ that 〜', 'It was the lack of transparency that provoked public anger.', '人々の怒りを招いたのは、透明性のなさでした。'],
    ],
    points: [
      {
        title: 'What S V is 〜（疑似分裂文）',
        text: [
          'What で始まるまとまりで「話題」を先に示し、is の後ろに「いちばん伝えたいこと」を置く。論説文でよく使う。',
        ],
        examples: [
          ['What the committee needs is more evidence to revise the proposal.', '委員会に必要なのは、提案を修正するためのさらなる証拠です。'],
        ],
      },
      {
        title: '名詞を強める the very・否定語句の倒置',
        text: [
          'the very＋名詞 は「まさにその〜」。Little did 〜 know（〜は少しも知らなかった）のような否定の倒置も強調の働きをする。',
        ],
        examples: [
          ['That is the very thing I wanted.', 'それこそまさに私がほしかった物です。'],
          ['Little did the public know how the data had been altered.', 'データがどう書き換えられていたのか、人々は少しも知りませんでした。'],
          ['So complex was the system that few users understood it.', 'その仕組みはあまりに複雑だったので、理解できる利用者はほとんどいませんでした。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '名詞を強めるのは the very／欠けていることは the lack of／反対するは object to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['That is the very thing I wanted to ask about.', 'それこそ、私が聞きたかったことです。'],
          ['It was the lack of evidence that weakened the report.', 'その報告書を弱めたのは、証拠の欠如でした。'],
          ['What the board objects to is not the cost but the timing.', '理事会が反対しているのは、費用ではなく時期です。'],
        ],
      },
    ],
    mistakes: [
      ['That the committee needs is more evidence.', 'What the committee needs is more evidence.', '「委員会に必要なもの」は what。that では needs の目的語がなくなる。'],
      ['It was the lack of transparency what provoked anger.', 'It was the lack of transparency that provoked anger.', '強調構文は It is 〜 that …。'],
    ],
    check: [
      'What S V is 〜＝焦点を後ろ、It is 〜 that …＝焦点を前。',
      'the very＋名詞＝まさにその〜。',
    ],
  }),

  referenceUnit({
    key: 'relapp',
    level: '1',
    topic: '関係詞応用',
    title: '関係詞の応用（the extent to which・of which・what little）',
    lead: '前置詞＋which（the extent to which 〜）、数量＋of which（two of which）、, which（前の文全体を受ける）、what little＋名詞（わずかながらあるすべての〜）など、論説文で多い関係詞の形を読み解く。',
    forms: [
      ['前置詞＋which', 'the extent to which ＋ 主語 ＋ 動詞 〜', 'The extent to which the data were manipulated remains unclear.', 'データがどの程度操作されたのかは、はっきりしないままです。'],
      ['数量＋of which', '先行詞, ＋ 数量 ＋ of which ＋ 動詞 〜', 'She has published five papers, two of which won awards.', '彼女は5本の論文を発表し、そのうち2本は賞をとりました。'],
    ],
    points: [
      {
        title: '前置詞＋which の決まった形',
        text: [
          'the extent to which 〜（どの程度〜か）、the way in which 〜（〜するやり方）、the degree to which 〜（〜の程度）のように、前置詞の位置ごと覚えると読みやすい。',
        ],
        examples: [
          ['The extent to which the committee revised the proposal remains unclear.', '委員会がどの程度提案を修正したのかは、はっきりしないままです。'],
        ],
      },
      {
        title: '前の文全体を受ける , which',
        text: [
          ', which は直前の名詞だけでなく、前の文の内容全体を受けることがある。「そしてそのことは」と読むと構造が見える。',
        ],
        examples: [
          ['The trial was postponed, which surprised the participants.', '試験は延期され、そのことは参加者を驚かせました。'],
          ['The report lists ten risks, several of which are avoidable.', '報告書は10の危険を挙げており、そのうちいくつかは避けられます。'],
        ],
      },
      {
        title: 'what little ＋ 名詞',
        text: [
          'what little＋名詞 は「わずかながらあるすべての〜」、what few＋複数名詞 は「わずかながらいるすべての〜」。',
        ],
        examples: [
          ['What little evidence remained was purely circumstantial.', 'わずかに残っていた証拠は、すべて状況証拠にすぎませんでした。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'what little＋名詞／どの程度かは the extent to which／危険を挙げるは list risks。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['What little money remained was spent on repairs.', 'わずかに残っていたお金は、すべて修理に使われました。'],
          ['The extent to which the rules were ignored remains unclear.', '規則がどの程度無視されたのかは、はっきりしないままです。'],
          ['The paper lists twelve risks, several of which are avoidable.', 'その論文は12の危険を挙げており、そのうちいくつかは避けられます。'],
        ],
      },
    ],
    mistakes: [
      ['She has published five papers, two of them won awards.', 'She has published five papers, two of which won awards.', 'コンマだけで2つの文をつながず、two of which にする。'],
      ['The extent to that the data were manipulated is unclear.', 'The extent to which the data were manipulated is unclear.', '前置詞の後ろは which。'],
    ],
    check: [
      'the extent to which＝どの程度〜か。',
      '数量＋of which / whom、前の文全体を受ける , which。',
      'what little＋名詞＝わずかながらあるすべての〜。',
    ],
  }),

  referenceUnit({
    key: 'comparison',
    level: '1',
    topic: '高度比較',
    title: '高度な比較（all the more・none the less・superior to）',
    lead: 'all the＋比較級＋because 〜（〜なのでなおさら）、none the less＋形容詞＋for 〜（〜だからといって少しも劣らない）、superior to 〜（than ではなく to を使う比較）など、論説文で使う比較の形を学ぶ。',
    forms: [
      ['なおさら〜', 'all the ＋ 比較級 ＋ because / for 〜', 'The issue is all the more serious because children are affected.', '子どもたちが影響を受けているので、その問題はなおさら深刻です。'],
      ['to を使う比較', 'superior / inferior / senior / junior ＋ to 〜', 'The new method is superior to the old one in accuracy.', '新しい方法は正確さで古い方法より優れています。'],
    ],
    points: [
      {
        title: 'the＋比較級 の決まった言い方',
        table: [
          ['言い方', '意味'],
          ['all the ＋ 比較級 ＋ because / for 〜', '〜なのでなおさら…'],
          ['none the ＋ 比較級 ＋ for 〜', '〜だからといって少しも…でない'],
          ['none the less', 'それでもやはり'],
        ],
        examples: [
          ['His explanation was none the less convincing for being brief.', '彼の説明は短かったが、それでも少しも説得力を失っていませんでした。'],
        ],
      },
      {
        title: 'than の代わりに to を使う形容詞',
        text: [
          'superior（より優れた）・inferior（より劣った）・senior（年上の）・junior（年下の）・prior（より前の）は、もともと比べる意味をもつので、比べる相手の前に than ではなく to を置く。more も付けない。',
        ],
        examples: [
          ['In handling the proposal, this approach is superior to the previous one in accuracy.', '提案を扱ううえで、この方法は正確さで以前の方法より優れています。'],
        ],
      },
      {
        title: 'not so much A as B・no more A than B',
        text: [
          'not so much A as B は「AというよりむしろB」、no more A than B は「Bと同じようにAでもない」。',
        ],
        examples: [
          ['He is not so much a scholar as a poet.', '彼は学者というよりむしろ詩人です。'],
          ['There is no more reason to doubt her account than his.', '彼の説明を疑う理由がないのと同じく、彼女の説明を疑う理由もありません。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          'superior は than ではなく to／all the＋比較級／打ち消しをそろえる no more A than B。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['This approach is superior to the previous one in accuracy.', 'この方法は正確さで前の方法より優れています。'],
          ['The loss is all the more painful because it was avoidable.', '避けられたことなので、その損失はなおさらつらいものです。'],
          ['There is no more reason to trust this source than that one.', 'あの情報源を信じる理由がないのと同じで、この情報源を信じる理由もありません。'],
        ],
      },
    ],
    mistakes: [
      ['The new method is superior than the old one.', 'The new method is superior to the old one.', 'superior は than ではなく to。'],
      ['The issue is all the most serious because children are affected.', 'The issue is all the more serious because children are affected.', 'all the＋比較級。'],
    ],
    check: [
      'all the＋比較級＋because＝なおさら、none the＋比較級＋for＝〜だからといって劣らない。',
      'superior / inferior / senior / junior / prior＋to。',
      'not so much A as B、no more A than B。',
    ],
  }),

  referenceUnit({
    key: 'agreement',
    level: '1',
    topic: '主語と動詞の一致',
    title: '主語と動詞の一致（数の決まり方がまぎらわしい主語）',
    lead: 'neither A nor B、more than one＋単数名詞、a number of と the number of、many a＋単数名詞、割合の of など、数の判断がまぎらわしい主語で動詞を正しく選ぶ。',
    forms: [
      ['近いほうに合わせる', 'neither A nor B ＋ B に合う動詞', 'Neither the chair nor the members were willing to compromise.', '議長もメンバーも歩み寄る気はありませんでした。', { chair: '議長' }],
      ['意味は複数でも単数', 'more than one ＋ 単数名詞 ＋ 単数動詞', 'More than one applicant has withdrawn from the selection process.', '選考から辞退した応募者は1人ではありません。'],
    ],
    points: [
      {
        title: 'まぎらわしい主語の一覧',
        table: [
          ['主語', '動詞'],
          ['neither A nor B / either A or B', 'B に合わせる'],
          ['more than one ＋ 単数名詞', '単数'],
          ['many a ＋ 単数名詞', '単数'],
          ['a number of ＋ 複数名詞（多くの〜）', '複数'],
          ['the number of ＋ 複数名詞（〜の数）', '単数'],
          ['割合・分数 ＋ of ＋ 名詞', 'of の後ろの名詞に合わせる'],
          ['news・mathematics', '単数（s で終わっても）'],
          ['police・people', '複数'],
        ],
        examples: [
          ['A number of objections have been raised.', '多くの反対意見が出されています。'],
          ['The number of objections has declined significantly.', '反対意見の数は大きく減っています。'],
          ['Many a promising reform has failed without local support.', '多くの有望な改革が、地元の支持がないために失敗してきました。'],
          ['Sixty percent of the water is used for agriculture.', 'その水の60パーセントは農業に使われています。'],
        ],
      },
      {
        title: 'There 構文・長い修飾',
        text: [
          'There is / are の文は後ろの本当の主語に合わせる。主語と動詞の間に長い修飾があっても、中心の名詞を見失わない。',
        ],
        examples: [
          ['There remain several questions to be answered.', '答えるべき問いがいくつか残っています。'],
          ['A number of experts have revised the proposal already.', '多くの専門家がすでに提案を修正しています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '異議が出されるは be raised／辞退するは withdraw／改革が失敗するは fail。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['A number of questions have been raised at the hearing.', '公聴会では多くの質問が出されました。'],
          ['More than one member has withdrawn from the committee.', '選考から辞退した応募者は1人ではありません。'],
          ['Many a promising plan has failed without public support.', '有望な計画の多くが、人々の支持がないまま失敗してきました。'],
        ],
      },
    ],
    mistakes: [
      ['More than one applicant have withdrawn.', 'More than one applicant has withdrawn.', 'more than one＋単数名詞は単数動詞。'],
      ['The number of objections have declined.', 'The number of objections has declined.', 'the number of は「数」なので単数。'],
      ['Many a reform have failed.', 'Many a reform has failed.', 'many a＋単数名詞は単数動詞。'],
    ],
    check: [
      'neither A nor B は B に合わせる。',
      'more than one・many a＋単数名詞は単数。',
      'a number of＝複数、the number of＝単数。割合の of は後ろの名詞に合わせる。',
    ],
  }),

  referenceUnit({
    key: 'determiners',
    level: '1',
    topic: '限定詞・数量',
    title: '限定詞・数量（each・all・both・few, if any）',
    lead: 'all・both・each・either・neither や冠詞は、名詞の範囲や数を決める。語順（all the students）と、単数・複数のどちらとして扱うかを確かめる。',
    forms: [
      ['一つ一つ', 'each of ＋ 複数名詞 ＋ 単数動詞', 'Each of the alternatives has serious drawbacks.', 'どの代案にも深刻な欠点があります。'],
      ['あるとしても少し', 'few, if any, ＋ 複数名詞', 'Few, if any, analysts anticipated the sudden reversal.', '急な逆転を予想した専門家は、いたとしてもごくわずかでした。'],
    ],
    points: [
      {
        title: '語順と数',
        table: [
          ['形', '扱い'],
          ['all / both / half ＋ the / my ＋ 名詞', '語順は all the students（the all とはしない）'],
          ['each / every ＋ 単数名詞', '単数'],
          ['each of ＋ 複数名詞', '単数（標準的な書き方）'],
          ['either / neither ＋ 単数名詞', '単数（2つのうち）'],
          ['both ＋ 複数名詞', '複数（2つとも）'],
        ],
        examples: [
          ['Both approaches have advantages, but neither is sufficient alone.', 'どちらの方法にも利点はありますが、どちらも単独では十分ではありません。'],
          ['Many a promising proposal has failed because the committee lacked resources.', '多くの有望な提案が、委員会に人手と資金が足りなかったために失敗してきました。'],
        ],
      },
      {
        title: 'if any・if ever の挿入',
        text: [
          'few, if any, 〜（あるとしてもごくわずか）、seldom, if ever, 〜（たとえあるとしてもめったにない）は、コンマではさんで数量や頻度を限定する。',
        ],
        examples: [
          ['Seldom, if ever, does one solution satisfy everyone.', '1つの解決策が全員を満足させることは、あるとしてもめったにありません。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '代案は alternative／利点があるは have advantages／anticipate は前置詞を置かない。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['Each of the alternatives carries a serious risk.', 'どの代案にも深刻な危険があります。'],
          ['Both methods have advantages, but neither is sufficient alone.', 'どちらのやり方にも利点がありますが、どちらも単独では十分ではありません。'],
          ['Few, if any, experts anticipated the sudden change.', '急な変化を予想した専門家は、いたとしてもごくわずかでした。'],
        ],
      },
    ],
    mistakes: [
      ['The all students agreed.', 'All the students agreed.', '語順は all the＋名詞。'],
      ['Each of the alternatives have drawbacks.', 'Each of the alternatives has drawbacks.', 'each of 〜 は単数動詞。'],
    ],
    check: [
      'all / both / half＋the＋名詞の語順。',
      'each・every・either・neither は単数、both は複数。',
      'few, if any・seldom, if ever。',
    ],
  }),

  referenceUnit({
    key: 'ellipsis',
    level: '1',
    topic: '省略・代用',
    title: '省略・代用（one・do so・比較の省略・並列）',
    lead: 'くり返しを避けるために、名詞は one / ones・that / those、動作は do so、文の内容は so / not で受ける。省略した部分を正しく補って読み、書くときは並べる要素の形をそろえる。',
    forms: [
      ['名詞の代用', 'the first one / the ones', 'The second proposal is more practical than the first one.', '2つ目の提案は1つ目の提案より実際的です。'],
      ['動作の代用', 'do so', 'He promised to submit the report but failed to do so.', '彼はレポートを出すと約束しましたが、出せませんでした。'],
    ],
    points: [
      {
        title: '何を受けるかで選ぶ',
        table: [
          ['代用', '受けるもの'],
          ['one / ones', '数えられる名詞（同じ種類の別の物）'],
          ['that / those', '比べる相手の名詞（the population of 〜 など）'],
          ['do so', '前の動作全体'],
          ['so / not', '前の文の内容（I think so. / I hope not.）'],
        ],
        examples: [
          ['She is far more cautious than her predecessor was.', '彼女は前任者よりはるかに慎重です。'],
        ],
      },
      {
        title: '副詞節の「主語＋be動詞」の省略',
        text: [
          'If (it is) accepted、No matter how carefully (it is) designed のように、主語と be動詞が省かれることがある。省略された主語は文の主語と同じ。',
        ],
        examples: [
          ['If accepted, the amendment will take effect immediately.', '承認されれば、その修正はすぐに効力をもちます。'],
          ['If accepted, the committee’s proposal will affect the entire process.', '承認されれば、委員会の提案は手続き全体に影響を与えます。'],
          ['No matter how carefully designed, every measure has limits.', 'どんなに注意深く作られても、どの対策にも限界があります。'],
        ],
      },
      {
        title: '並べるものの形をそろえる',
        text: [
          'and・or で並べる要素は同じ形にそろえる（to reduce 〜, (to) improve 〜, and (to) protect 〜）。形がばらばらだと読みにくくなる。',
        ],
        examples: [
          ['The program aims to reduce costs, improve access, and protect privacy.', 'その計画は費用を減らし、利用しやすくし、プライバシーを守ることを目指しています。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '比べる名詞は that / those／提出するは submit／効力を持つは take effect。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['The population of this city is larger than that of the capital.', 'この都市の人口は首都の人口より多いです。'],
          ['She promised to submit the form but failed to do so.', '彼女はその書類を提出すると約束しましたが、できませんでした。'],
          ['If approved, the rule will take effect immediately.', '承認されれば、その規則はただちに効力を持ちます。'],
        ],
      },
    ],
    mistakes: [
      ['The second proposal is better than the first it.', 'The second proposal is better than the first one.', '同じ種類の別の物は one。'],
      ['He promised to do it but failed to do such.', 'He promised to do it but failed to do so.', '動作全体を受けるのは do so。'],
      ['The program aims to reduce costs, improving access, and privacy protection.', 'The program aims to reduce costs, improve access, and protect privacy.', '並べる要素の形をそろえる。'],
    ],
    check: [
      'one / ones＝名詞、that / those＝比べる名詞、do so＝動作、so / not＝文の内容。',
      'If accepted のような「主語＋be動詞」の省略。',
      '並べる要素の形をそろえる。',
    ],
  }),

  referenceUnit({
    key: 'usage',
    level: '1',
    topic: '高度語法',
    title: '高度な語法（lest・provided・notwithstanding・慣用表現）',
    lead: '論説文や改まった文章で使う接続表現・慣用表現と、語と語の結び付き（コロケーション）をまとめて確かめる。意味だけでなく、後ろに置く形（原形・名詞・節）まで身につける。',
    forms: [
      ['〜しないように', 'lest ＋ 主語 ＋ (should) ＋ 原形', 'He spoke slowly lest he be misunderstood.', '誤解されないように、彼はゆっくり話しました。'],
      ['〜という条件で', 'provided (that) ＋ 主語 ＋ 動詞', 'You may go out provided that you come home by ten.', '10時までに帰るなら、出かけてもよいです。'],
    ],
    points: [
      {
        title: '改まった接続表現',
        table: [
          ['言い方', '後ろ', '意味'],
          ['lest', '主語＋(should)＋原形', '〜しないように'],
          ['provided / providing (that)', '主語＋動詞', '〜という条件で'],
          ['insofar as', '主語＋動詞', '〜する限りにおいて'],
          ['notwithstanding', '名詞', '〜にもかかわらず'],
          ['for all', '名詞', '〜にもかかわらず'],
          ['as though / as if', '主語＋過去形', 'まるで〜かのように'],
        ],
        examples: [
          ['Notwithstanding the objections, the board approved the proposal.', '反対があったにもかかわらず、理事会は提案を承認しました。'],
          ['Insofar as the proposal reduces costs, it deserves consideration.', 'その提案は費用を減らす限りにおいて、検討に値します。'],
          ['For all its flaws, the study offers valuable insights.', '欠点はあるものの、その研究は貴重な見方を与えてくれます。'],
          ['He spoke as though he knew everything.', '彼はまるで何でも知っているかのように話しました。'],
          ['The committee explained its decision carefully lest anyone should misunderstand.', '委員会は、だれにも誤解されないよう決定を注意深く説明しました。'],
        ],
      },
      {
        title: '決まった言い方',
        table: [
          ['言い方', '意味'],
          ['as it were', 'いわば'],
          ['It goes without saying that 〜', '〜は言うまでもない'],
          ['Suffice it to say that 〜', '〜と言えば十分だ'],
          ['Be that as it may', 'それはともかく・そうかもしれないが'],
          ['cannot be too 〜', 'いくら〜してもしすぎることはない'],
          ['the last 〜 to …', '最も…しそうにない〜'],
          ['no more than 〜', 'たった〜（＝only）'],
          ['No sooner had 〜 than … / Scarcely had 〜 when …', '〜するとすぐに…'],
        ],
        examples: [
          ['He is, as it were, a walking dictionary.', '彼はいわば歩く辞書です。'],
          ['It goes without saying that health is important.', '健康が大切なのは言うまでもありません。'],
          ['Suffice it to say that the negotiations were difficult.', '交渉は難航したとだけ言っておきましょう。'],
          ['Be that as it may, we must decide today.', 'それはともかく、私たちは今日決めなければなりません。'],
          ['She is the last person to tell a lie.', '彼女はうそを最もつきそうにない人です。'],
          ['Scarcely had the file been released when doubts appeared.', 'ファイルが公開されるとすぐに疑問が出てきました。'],
        ],
      },
      {
        title: '語と語の結び付き（コロケーション）',
        table: [
          ['言い方', '意味'],
          ['shed light on 〜', '〜を明らかにする'],
          ['withstand scrutiny / examination', '厳しい検討に耐える'],
          ['be contingent on 〜', '〜しだいである'],
          ['enhance accountability', '説明責任を高める'],
          ['be open to challenge', '異論の余地がある'],
          ['pose a risk', '危険をもたらす'],
          ['reach a conclusion', '結論に達する'],
        ],
        examples: [
          ['The article sheds light on a hidden cost.', 'その記事は隠れた費用を明らかにしています。'],
          ['The evidence does not withstand close examination.', 'その証拠は綿密な検討に耐えません。'],
          ['The decision is contingent on future funding.', 'その決定は今後の資金しだいです。'],
        ],
      },
      {
        title: '程度を強める副詞・動詞で書く',
        text: [
          'nothing・no・any などの程度を言うときは、形容詞ではなく practically・virtually・hardly などの副詞を使う（practically nothing＝ほとんど何も〜ない）。',
          'make a decision about the revision of 〜 のような名詞の重ねすぎより、decide to revise 〜 のように動詞を使うと、だれが何をしたかがはっきりする。',
        ],
        examples: [
          ['The filter removed practically nothing from the polluted water.', 'そのフィルターは汚れた水からほとんど何も取り除きませんでした。'],
          ['The committee decided to revise the rule.', '委員会はその規則を改めることを決めました。'],
        ],
      },
      {
        title: '語と語の決まった結び付き',
        text: [
          '持ちこたえるは withstand／〜次第だは be contingent on／光を当てるは shed light on／高めるは enhance／〜の余地があるは be open to。文の形といっしょに、この結び付きをまとまりで覚える。',
        ],
        examples: [
          ['The evidence does not withstand close examination.', 'その証拠は綿密な検討に耐えません。'],
          ['The decision is contingent on future funding.', 'その決定は今後の資金次第です。'],
          ['The article sheds light on a hidden cost.', 'その記事は隠れた費用を明らかにします。'],
          ['The measure is intended to enhance accountability.', 'その措置は説明責任を高めることを意図しています。'],
          ['The claim is open to challenge.', 'その主張には異議を唱える余地があります。'],
        ],
      },
    ],
    rewrites: [
      ['The committee made a decision about the revision of the rule.', 'The committee decided to revise the rule.', '名詞を重ねるより、動詞を使うほうが簡潔で、だれが何をしたかがはっきりする。'],
    ],
    mistakes: [
      ['He spoke slowly lest he was misunderstood.', 'He spoke slowly lest he be misunderstood.', 'lest の後ろは (should)＋原形。'],
      ['Although the objections, the board approved it.', 'Notwithstanding the objections, the board approved it.', '名詞の前は前置詞 notwithstanding（although の後ろは主語＋動詞）。'],
      ['You cannot be very careful when you drive.', 'You cannot be too careful when you drive.', '「いくら〜してもしすぎない」は cannot be too 〜。'],
    ],
    check: [
      'lest＋(should)＋原形、provided that＋文、notwithstanding / for all＋名詞。',
      'as it were・It goes without saying・Suffice it to say・Be that as it may。',
      'shed light on・withstand scrutiny・be contingent on。',
    ],
  }),
]
