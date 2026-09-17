import { st } from './entry.js'

export default Object.freeze([
  st('[S A short video] [V claims] [O {that節| [接 that] [S a certain drink] [V improves] [O memory]}], [接 and] [S thousands of users] [V share] [O it] [M within a day].', {
    chunks: [
      ['A short video claims that', '短い動画が〜と主張しています（内容は次へ）'],
      ['a certain drink improves memory,', 'ある飲み物が記憶力を高める（と）'],
      ['and thousands of users share it', 'そして何千人もの利用者がそれを共有します'],
      ['within a day', '1日のうちに'],
    ],
    notes: {
      'a certain drink improves memory,': 'a certain 〜 は「ある〜」。名前をはっきり言わない言い方です。',
      'and thousands of users share it': 'it は A short video を指します。',
    },
  }),
  st('[S The speaker] [V may sound] [C confident] [接 and] [V may] [M even] [V mention] [O a scientific study].', {
    chunks: [
      ['The speaker may sound confident', '話し手は自信があるように聞こえるかもしれません'],
      ['and may even mention a scientific study', 'そして科学的な研究に触れることさえあるかもしれません'],
    ],
    notes: {
      'The speaker may sound confident': 'sound ＋ 形容詞 で「〜のように聞こえる」。',
      'and may even mention a scientific study': 'even は「〜さえ」。mention は「〜に触れる・〜について言う」。',
    },
  }),
  st('[M Yet] [S these details alone] [V do not show] [O {whether節| [接 whether] [S the health claim] [V is] [C reliable]}].', {
    chunks: [
      ['Yet these details alone do not show', 'しかし、こうした詳細だけでは分かりません（何がかは次へ）'],
      ['whether the health claim is reliable', 'その健康情報が信頼できるかどうかは'],
    ],
    notes: {
      'Yet these details alone do not show': 'Yet は「しかし」。名詞の後ろの alone は「それだけで」。these details は、自信ありげな話し方や研究に触れることを指します。',
    },
  }),
  st('[S A careful reader] [M first] [V asks] [O {疑問詞節| [S who] [V produced] [O the message]} and {疑問詞節| [S what evidence] [V is] [M actually] [C available]}].', {
    chunks: [
      ['A careful reader first asks', '注意深い読み手は、まず問います（何をかは次へ）'],
      ['who produced the message', 'だれがその情報を作ったのか'],
      ['and what evidence is actually available', 'そして実際にどんな証拠が手に入るのかを'],
    ],
    notes: {
      'who produced the message': 'who は疑問詞で、節の中では主語です。who 以下と what 以下の二つが asks の目的語です。',
    },
  }),
  st('[S Readers] [V can check] [O a university report {関係>a university report| [S that] [V describes] [O its methods]}] [M more easily than a video with no named source].', {
    chunks: [
      ['Readers can check a university report', '読み手は大学の報告書を確かめることができます（どんな報告書かは次へ）'],
      ['that describes its methods', 'その研究方法を説明している（報告書を）'],
      ['more easily', 'より簡単に（確かめられます）'],
      ['than a video with no named source', '名前の示された情報源がない動画よりも'],
    ],
    notes: {
      'that describes its methods': 'that は a university report を受ける関係代名詞で、its は a university report を指します。',
      'than a video with no named source': 'than の後ろは、報告書と比べる相手です。with no named source は a video を後ろから説明します。',
    },
    rules: ['comparison-pairs', 'relative-clause', 'postmodifier'],
  }),
  st('[M However], [S the name of an expert or institution] [V should not end] [O the investigation].', {
    chunks: [
      ['However,', 'しかし'],
      ['the name of an expert or institution', '専門家や機関の名前があっても'],
      ['should not end the investigation', 'それで調べるのを終わりにしてはいけません'],
    ],
    notes: {
      'should not end the investigation': 'should not は「〜するべきではない」。名前があることで調査を終わらせてはいけない、という意味です。',
    },
  }),
  st('[S Readers] [M still] [V need] [O {to:名詞| [V to examine] [O {疑問詞節| [M how] [S the study] [V was designed]} and {whether節| [接 whether] [S other researchers] [V found] [O similar results]}]}].', {
    chunks: [
      ['Readers still need to examine', 'それでも読み手は調べる必要があります（何をかは次へ）'],
      ['how the study was designed', 'その研究がどのように設計されたか'],
      ['and whether other researchers found similar results', 'そしてほかの研究者も同じような結果を得たかどうかを'],
    ],
    notes: {
      'Readers still need to examine': 'still は「それでも」。名前が分かっても、という前の文を受けています。',
      'and whether other researchers found similar results': 'how 以下と whether 以下の二つが examine の目的語です。',
    },
  }),
  st('[S Sample size] [V is] [C one important clue].', {
    chunks: [
      ['Sample size is one important clue', '標本の大きさは、重要な手がかりの一つです'],
    ],
    notes: {
      'Sample size is one important clue': 'sample size は、調べた人数などの「標本の大きさ」です。',
    },
  }),
  st('[S A result from twelve volunteers] [V may be] [C interesting], [接 but] [S it] [V may not apply] [M to people of different ages or health conditions].', {
    chunks: [
      ['A result from twelve volunteers', '12人のボランティアから得た結果は'],
      ['may be interesting,', '興味深いかもしれません'],
      ['but it may not apply', 'しかし、それは当てはまらないかもしれません（だれにかは次へ）'],
      ['to people of different ages or health conditions', '年齢や健康状態の違う人々には'],
    ],
    notes: {
      'but it may not apply': 'apply to 〜 で「〜に当てはまる」。it は A result を指します。',
    },
  }),
  st('[S A useful study] [M also] [V compares] [O groups] [M {副詞節:目的| [接 so that] [S researchers] [V can separate] [O the treatment] [M from other possible factors]}].', {
    chunks: [
      ['A useful study also compares groups', 'また、役に立つ研究はグループどうしを比べます'],
      ['so that researchers can separate the treatment', '研究者が治療を切り分けられるように（何からかは次へ）'],
      ['from other possible factors', 'ほかに考えられる要因から'],
    ],
    notes: {
      'so that researchers can separate the treatment': 'so that ＋ 主語 ＋ can 〜 で「〜できるように」。separate A from B で「AをBから切り分ける」。',
    },
  }),
  st('[M Without such a comparison], [S improvement] [V may come] [M from sleep, diet, expectation, or simple chance].', {
    chunks: [
      ['Without such a comparison,', 'そのような比較がなければ'],
      ['improvement may come', '改善は生じているのかもしれません（何からかは次へ）'],
      ['from sleep, diet, expectation, or simple chance', '睡眠や食事、期待、あるいは単なる偶然から'],
    ],
    notes: {
      'Without such a comparison,': 'without 〜 は、ここでは「〜がなければ」という条件の意味です。',
    },
  }),
  st('[S Another common mistake] [V is] [C {to:名詞| [V to treat] [O correlation] [C as proof of cause]}].', {
    chunks: [
      ['Another common mistake', 'もう一つのよくある誤りは'],
      ['is to treat correlation as proof of cause', '相関を原因の証明として扱うことです'],
    ],
    notes: {
      'is to treat correlation as proof of cause': 'to treat 以下は「〜を扱うこと」という名詞のまとまりで、補語です。treat A as B で「AをBとして扱う」。correlation は「相関（二つが一緒に変わること）」。',
    },
  }),
  st('[V Suppose] [O {that省略| [S a survey] [V finds] [O {that節| [接 that] [S people {関係>people| [S who] [V drink] [O more tea]}] [V report] [O less stress]}]}].', {
    chunks: [
      ['Suppose a survey finds that', 'ある調査で〜ことが分かったとしましょう（内容は次へ）'],
      ['people who drink more tea', 'お茶を多く飲む人は'],
      ['report less stress', 'ストレスが少ないと答える（ことが）'],
    ],
    notes: {
      'Suppose a survey finds that': 'Suppose (that) 〜 で「〜だと仮定してみよう」。主語 you を省いた命令文の形です。',
      'report less stress': 'report はここでは「（調査で）答える・申告する」。',
    },
  }),
  st('[S Tea] [V might reduce] [O stress], [接 but] [M perhaps] [S relaxed people] [M simply] [V choose] [O {to:名詞| [V to drink] [O more tea]}].', {
    chunks: [
      ['Tea might reduce stress,', 'お茶がストレスを減らすのかもしれません'],
      ['but perhaps relaxed people', 'しかし、もしかするとリラックスしている人が（内容は次へ）'],
      ['simply choose to drink more tea', '単にお茶を多く飲むことを選んでいるだけかもしれません'],
    ],
    notes: {
      'but perhaps relaxed people': 'perhaps は「もしかすると」。お茶がストレスを減らすのではなく、逆の向きの説明を出しています。',
    },
  }),
  st('[S Income, working hours, and social habits] [V might influence] [O both tea drinking and stress] [M as well].', {
    chunks: [
      ['Income, working hours, and social habits', '収入や労働時間、社会的な習慣が'],
      ['might influence both tea drinking and stress', 'お茶をどれだけ飲むかと、ストレスの両方に影響しているかもしれません'],
      ['as well', '〜ということも考えられます'],
    ],
    notes: {
      'might influence both tea drinking and stress': 'both A and B で「AとBの両方」。',
      'as well': 'as well は「〜も」。三つ目の説明を付け足しています。',
    },
  }),
  st('[S Readers] [V should] [M also] [V distinguish] [O an early report] [M from a review {関係>a review| [S that] [V considers] [O many studies]}].', {
    chunks: [
      ['Readers should also distinguish an early report', 'また、読み手は初期の報告を区別するべきです（何とかは次へ）'],
      ['from a review', 'レビューと'],
      ['that considers many studies', '多くの研究を検討した（レビューと）'],
    ],
    notes: {
      'Readers should also distinguish an early report': 'distinguish A from B で「AとBを区別する」。',
      'from a review': 'review はここでは、多くの研究をまとめて検討した論文（総説）のことです。',
    },
  }),
  st('[S One experiment] [V can suggest] [O a possibility], [M {副詞節:対比| [接 whereas] [S repeated studies] [V help] [O {原形| [V show] [O {whether節| [接 whether] [S an effect] [V appears] [M under different conditions]}]}]}].', {
    chunks: [
      ['One experiment can suggest a possibility,', '一つの実験は、可能性を示すことができます'],
      ['whereas', '一方で'],
      ['repeated studies help show', '繰り返し行われた研究は、示すのに役立ちます（何をかは次へ）'],
      ['whether an effect appears under different conditions', '条件が違っても効果が現れるかどうかを'],
    ],
    notes: {
      whereas: 'whereas は「〜である一方で」と、二つを対比します。',
      'repeated studies help show': 'help ＋ 動詞の原形 で「〜するのに役立つ」。',
    },
  }),
  st('[S Financial interests behind a study] [V provide] [O useful context] [M for readers].', {
    chunks: [
      ['Financial interests behind a study', '研究の背後にあるお金の利害は'],
      ['provide useful context', '役に立つ背景を与えます'],
      ['for readers', '読み手に'],
    ],
    notes: {
      'Financial interests behind a study': 'financial interests は、研究でだれがお金の得をするかという「金銭的な利害」です。behind a study は Financial interests を後ろから説明します。',
    },
    rules: ['postmodifier', 'paragraph-map', 'svoc-core'],
  }),
  st('[S Company funding] [V does not] [M automatically] [V make] [O research] [C false], [接 but] [S readers] [V should check] [O {whether節| [接 whether] [S the company] [V sells] [O the product {現在分詞>the product| [V being tested]}]}].', {
    chunks: [
      ['Company funding does not automatically make research false,', '企業からの資金提供が、研究を自動的に誤りにするわけではありません'],
      ['but readers should check', 'しかし読み手は確かめるべきです（何をかは次へ）'],
      ['whether the company sells the product', 'その企業が製品を売っているかどうかを（どんな製品かは次へ）'],
      ['being tested', '試験されている（製品を）'],
    ],
    notes: {
      'Company funding does not automatically make research false,': 'make ＋ O ＋ C で「OをCにする」。not automatically は「自動的に〜とは限らない」という部分否定です。',
      'being tested': 'being tested は「試験されている」という受け身の進行の形で、the product を後ろから説明します。',
    },
  }),
  st('[S Independent review and a clear statement of possible conflicts] [V make] [O the evidence] [C easier {to:副詞(形容詞)| [V to evaluate]}].', {
    chunks: [
      ['Independent review and a clear statement', '独立した審査と、はっきりした説明が（何の説明かは次へ）'],
      ['of possible conflicts', '起こり得る利益相反についての（説明が）'],
      ['make the evidence easier to evaluate', '証拠を評価しやすくします'],
    ],
    notes: {
      'of possible conflicts': 'conflicts はここでは conflicts of interest（利益相反）のことで、研究者が得をする立場にあることです。',
      'make the evidence easier to evaluate': 'make ＋ O ＋ C で「OをCにする」。easy to 〜 は「〜しやすい」で、easier はその比較級です。',
    },
  }),
  st('[S None of these questions] [V gives] [O a quick promise {同格that>a quick promise| [接 that] [S a claim] [V is] [C true or false]}].', {
    chunks: [
      ['None of these questions gives a quick promise', 'こうした問いのどれも、すぐに保証してくれるわけではありません（何をかは次へ）'],
      ['that a claim is true or false', '主張が正しいか誤りかを'],
    ],
    notes: {
      'None of these questions gives a quick promise': 'none of 〜 で「〜のどれも…ない」。none は単数として扱うので gives です。',
      'that a claim is true or false': 'that 以下は a quick promise の中身を説明する同格の that節です。',
    },
  }),
  st('[M Instead], [S they] [V help] [O readers] [C {to:補語| [V to judge] [O {疑問詞節| [C how strong] [S a conclusion] [V can] [M reasonably] [V be]}]}].', {
    chunks: [
      ['Instead,', 'その代わりに'],
      ['they help readers', 'こうした問いは読み手を助けます（何をするのをかは次へ）'],
      ['to judge', '判断するのを（何をかは次へ）'],
      ['how strong a conclusion can reasonably be', '結論をどのくらい強く言うのが妥当かを'],
    ],
    notes: {
      'they help readers': 'help ＋ 人 ＋ to 〜 で「人が〜するのを助ける」。they は these questions を指します。',
      'how strong a conclusion can reasonably be': 'how ＋ 形容詞 ＋ 主語 ＋ 動詞 で「どのくらい〜か」。how strong は be の補語です。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a decision] [V involves] [O serious health risks]}], [S online reading] [V should support, not replace,] [O advice from a qualified professional].', {
    chunks: [
      ['When a decision involves serious health risks,', '決定が重大な健康上の危険を伴うときには'],
      ['online reading should support, not replace,', 'オンラインで読むことは、置き換えるのではなく支えとなるべきです（何をかは次へ）', 'online reading should support, not replace,'],
      ['advice from a qualified professional', '資格を持つ専門家の助言を'],
    ],
    notes: {
      'online reading should support, not replace,': 'support, not replace は「A, not B（BではなくA）」の形で、二つの動詞が後ろの advice を共有しています。オンラインで読んだことを、専門家の助言の代わりにしてはいけない、という意味です。',
    },
  }),
  st('[S Responsible readers] [V are not] [C people {関係>people| [S who] [V doubt] [O everything]}]; [S they] [V are] [C people {関係>people| [S who] [V match] [O their confidence] [M to the quality of the evidence]}].', {
    chunks: [
      ['Responsible readers are not people', '責任ある読み手とは、〜人ではありません（どんな人かは次へ）'],
      ['who doubt everything;', 'すべてを疑う（人では）'],
      ['they are people', 'その人たちは、〜人です（どんな人かは次へ）'],
      ['who match their confidence', '自分の確信の強さを合わせる（人です）'],
      ['to the quality of the evidence', '証拠の質に'],
    ],
    notes: {
      'who doubt everything;': 'セミコロン（;）の前が「〜ではない」、後ろが「〜だ」と、二つを並べて比べています。',
      'who match their confidence': 'match A to B で「AをBに合わせる」。',
    },
  }),
])
