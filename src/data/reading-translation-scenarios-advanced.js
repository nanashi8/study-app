// 1級長文の講師監修・語順訳シナリオ。「／」の各意味単位を英語の出現順に並べる。

const b = (en, orderedJa, tip = '') => {
  const jaSegments = Object.freeze(orderedJa.split('／').map((segment) => segment.trim()))
  return Object.freeze({
    en,
    ja: jaSegments.join(' → '),
    jaSegments,
    speechJa: jaSegments.join('。次に、'),
    tip,
  })
}
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const ADVANCED_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_1_collective_memory: passage([
    [
      b('Societies often assume', '社会は／しばしば考えます'),
      b('that important events will be remembered simply', '重要な出来事は／記憶され続けるだろうと／ただそれだけで'),
      b('because they are recorded', 'なぜなら／その出来事が／記録されているからです'),
      b('in books, archives, or digital databases', '本や記録保管所、またはデジタルデータベースに'),
    ],
    [
      b('Yet collective memory is a far more fragile phenomenon than the existence of records might suggest', 'しかし／集合的記憶は／はるかにもろい現象です／記録の存在が示すかもしれない以上に'),
    ],
    [
      b('A document can survive', '一つの文書は／残ることができます'),
      b('for centuries and still fail to influence', '何世紀にもわたって／それでも影響を与えないことがあります'),
      b('how later generations understand the past', 'どのように／後の世代が／理解するかに／過去を'),
    ],
    [
      b('The reason is', 'その理由は／〜です（内容は次へ）'),
      b('that memory depends not only on preservation but also on repeated interpretation', '記憶は／依存しているということです／保存だけでなく、繰り返される解釈にも'),
      b('within families, schools, media, and political institutions', '家庭、学校、メディア、政治制度の中で'),
    ],
    [
      b('When these mechanisms weaken', '〜すると／こうした仕組みが／弱まる'),
      b('the past becomes a collection of isolated facts rather than a resource', '過去は／なります／孤立した事実の集まりに／資源ではなく'),
      b('for judgment', '判断のための'),
    ],
    [
      b('This problem has become more urgent', 'この問題は／さらに差し迫ったものになっています'),
      b('in the digital age', 'デジタル時代に'),
    ],
    [
      b('It is now possible to store enormous amounts of information', 'それは／今では可能です／保存することが／膨大な量の情報を'),
      b('at little cost', 'わずかな費用で'),
      b('and many people therefore believe', 'そして／多くの人は／そのため考えます'),
      b('that forgetting has become less likely', '忘却は／起こりにくくなったと'),
    ],
    [
      b('In practice', '実際には'),
      b('however, abundance can produce a different kind of loss', 'しかし／情報が豊富にあることは／生むことがあります／別の種類の喪失を'),
    ],
    [
      b('When search results, short videos, and algorithmic recommendations compete', '〜すると／検索結果・短い動画・アルゴリズムによる推薦が／競い合う'),
      b('for attention', '人々の注意を得ようと'),
      b('materials that require slow reading or moral reflection may become almost invisible', '資料は／そしてその資料は必要とする／ゆっくり読むことや道徳的な考察を／ほとんど見えなくなるかもしれません'),
    ],
    [
      b('The integrity of public memory is then shaped less by', '公共的記憶の健全さは／そのとき形づくられます／次のものによることが少なく'),
      b('what is available than by', '何が／利用できるかによって／よりは'),
      b('what is repeatedly presented as relevant', '何が／繰り返し示されるかによって／関連あるものとして'),
    ],
    [
      b('Digital records also depend', 'デジタル記録は／さらに依存しています'),
      b('on technical systems', '技術的な仕組みに'),
      b('whose apparent permanence can be misleading', 'そしてその仕組みの見かけ上の永続性は／誤解を招くことがあります'),
    ],
    [
      b('A file may still exist but become unreadable', 'ファイルは／まだ存在していても／読めなくなることがあります'),
      b('when software changes', '〜すると／ソフトウェアが／変わる'),
      b('while a searchable collection can effectively disappear', '一方／検索可能な資料群は／実質的に消えることがあります'),
      b('if its indexing system is neglected', 'もし／その索引の仕組みが／放置されれば'),
    ],
    [
      b('More subtly', 'さらに見えにくい形では'),
      b('platforms can revise the categories and rankings through', 'プラットフォームは／変更できます／分類と順位を／その仕組みを通じて'),
      b('which users encounter material', 'そしてその仕組みによって／利用者は／出会います／資料に'),
      b('without deleting a single record', '削除することなく／記録を一つも'),
    ],
    [
      b('Preservation', '保存は'),
      b('therefore, is not merely the retention of data', 'したがって／単なる保持ではありません／データの'),
      b('it includes maintaining the pathways', '保存は／含みます／維持することも／経路を'),
      b('that make data intelligible and discoverable', 'そしてその経路が／します／データを／理解可能で発見可能に'),
    ],
    [
      b('This raises a difficult question', 'これは／提起します／難しい問いを'),
      b('about institutional responsibility', '制度的な責任についての'),
    ],
    [
      b('Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so', '図書館・博物館・大学・報道機関は／伝統的に主張してきました／一定の自律性を／その目的は'),
      b('that they can protect records', 'それらの機関が／守れるようにすることです／記録を'),
      b('from temporary political pressure', '一時的な政治的圧力から'),
    ],
    [
      b('That autonomy remains essential', 'その自律性は／依然として不可欠です'),
      b('but it can also be misused', 'しかし／それは／さらに悪用される可能性があります'),
      b('if institutions avoid scrutiny', 'もし／機関が／避けるなら／検証を'),
      b('by describing all criticism as interference', '表現することによって／すべての批判を／干渉だと'),
    ],
    [
      b('A healthy culture of memory therefore requires both independence and accountability', '健全な記憶の文化は／したがって必要とします／独立性と説明責任の両方を'),
    ],
    [
      b('Institutions must be free', '機関は／自由でなければなりません'),
      b('to preserve uncomfortable evidence', '保存することが／不都合な証拠を'),
      b('while citizens must be able', '一方／市民は／できなければなりません'),
      b('to ask how decisions about selection, description', '問うことが／どのように決定が／選択・記述についての'),
      b('and access are made', 'そしてアクセスについての決定が／なされるかを'),
    ],
    [
      b('Calls for complete neutrality do not resolve the problem', '完全な中立性を求める声は／解決しません／その問題を'),
      b('since every archive must decide what to collect, how to describe it', 'なぜなら／すべての記録保管所は／決めなければならないからです／何を／収集するか／どのように／記述するか／それを'),
      b('and', 'そして、決めなければなりません'),
      b('which materials receive scarce conservation resources', 'どの資料が／受け取るのかを／限られた保存資源を'),
    ],
    [
      b('Nor does greater participation automatically guarantee fairness', 'さらに／より多くの参加は／自動的に保証するわけではありません／公平さを'),
    ],
    [
      b('A public consultation may reproduce existing inequalities', '公開協議は／再生産するかもしれません／既存の不平等を'),
      b('if organized groups can speak more loudly than communities', 'もし／組織化された集団が／より大きな声で話せるなら／共同体より'),
      b('with less time, money', '時間・資金が少ない'),
      b('or trust in institutions', 'あるいは、制度への信頼が乏しい'),
    ],
    [
      b('Accountability must consequently include transparent reasons, opportunities', '説明責任は／したがって含まなければなりません／透明な理由・機会を'),
      b('for challenge', '異議を申し立てるための'),
      b('and continuing efforts to hear people', 'そして継続的な努力も／聞くための／人々の声を'),
      b('who were absent', 'そしてその人々は／不在でした'),
      b('from the original decision', '最初の決定の場から'),
    ],
    [
      b('Such debates are rarely simple', 'そのような議論は／めったに単純ではありません'),
      b('because historical meaning is often ambiguous', 'なぜなら／歴史的な意味は／しばしば曖昧だからです'),
    ],
    [
      b('A photograph may reveal suffering to one group and national achievement to another', '一枚の写真は／示すかもしれません／苦しみを／ある集団に／そして国家的な達成を／別の集団に'),
      b('a monument may be seen as heritage by some and as exclusion', 'ある記念碑は／見られるかもしれません／遺産として／一部の人々に／そして排除として'),
      b('by others', '別の人々によって'),
    ],
    [
      b('The aim should not be to force a single consensus', '目標は／〜であるべきではありません／強いること／一つの合意を'),
      b('that erases conflict', 'そしてその合意が／消し去ります／対立を'),
    ],
    [
      b('Rather', 'むしろ'),
      b('a mature society keeps multiple perspectives', '成熟した社会は／保ちます／複数の視点を'),
      b('in conversation while refusing', '対話の中に／同時に拒みながら'),
      b('to treat evidence as optional', '扱うことを／証拠を／あってもなくてもよいものとして'),
    ],
    [
      b('Education plays a central role', '教育は／果たします／中心的な役割を'),
      b('in sustaining that discipline', '維持する上で／その規律を'),
      b('but the task is more demanding than adding a few historical dates to a curriculum', 'しかし／その課題は／より難しいものです／加えることより／いくつかの歴史的な日付を／カリキュラムに'),
    ],
    [
      b('Students must learn', '生徒は／学ばなければなりません'),
      b('how narratives are constructed', 'どのように／物語が／構成されるのかを'),
      b('why certain voices were ignored', 'なぜ／特定の声が／無視されたのかを'),
      b('and how apparently neutral categories can reflect older relations of power', 'そしてどのように／一見中立的な分類が／反映し得るのかを／以前からの権力関係を'),
    ],
    [
      b('Comparing conflicting accounts', '比較することは／対立する説明を'),
      b('can help students see', '助けることができます／生徒が／理解するのを'),
      b('that disagreement is not the same as ignorance', '意見の相違は／同じではないということを／無知と'),
    ],
    [
      b('Two historians may accept the same evidence yet assign different significance to it', '二人の歴史家は／受け入れるかもしれません／同じ証拠を／それでも与えることがあります／異なる重要性を／それに'),
      b('because they ask different questions', 'なぜなら／二人は／立てるからです／異なる問いを'),
    ],
    [
      b('The discipline lies', 'その規律は／あります'),
      b('in explaining those choices, confronting contrary evidence', '説明することに／その選択を／向き合うことに／反対の証拠と'),
      b('and stating', 'そして／示すことに'),
      b('where certainty ends', 'どこで／確実に言える範囲が／終わるのかを'),
    ],
    [
      b('At the same time', '同時に'),
      b('they need intellectual habits', '人々は／必要としています／知的な習慣を'),
      b('that prevent skepticism from turning', 'そしてその習慣が／防ぎます／懐疑が変わるのを'),
      b('into cynicism', '冷笑へ'),
    ],
    [
      b('If every account of the past is dismissed as merely political', 'もし／過去についてのすべての説明が／退けられるなら／単に政治的なものとして'),
      b('citizens lose the capacity', '市民は／失います／能力を'),
      b('to distinguish careful revision from deliberate distortion', '区別するための／慎重な見直しを／意図的な歪曲から'),
    ],
    [
      b('Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation', 'デジタルプラットフォームは／強めます／この危険を／なぜなら、それらは／報いるからです／速さ・感情的な確信・集団への忠誠を／より容易に／粘り強い調査より'),
    ],
    [
      b('A rumor that confirms a community\'s self-image may travel farther than a well-documented study that complicates it', 'あるうわさは／そしてそのうわさは裏付ける／共同体の自己像を／より遠くまで広がるかもしれません／十分に裏付けられた研究より／そしてその研究は複雑にする／その自己像を'),
    ],
    [
      b('Some observers respond', '一部の人々は／それに対して対応します'),
      b('by demanding', '要求することによって'),
      b('that platforms remove misleading historical claims more aggressively', 'プラットフォームが／削除するように／誤解を招く歴史的主張を／もっと積極的に'),
    ],
    [
      b('Although such action can limit obvious fabrications', '〜ではあるものの／そのような行動は／抑えることができます／明らかな捏造を'),
      b('it also gives private companies substantial authority', 'その行動は／さらに与えます／民間企業に／大きな権限を'),
      b('over public memory', '公共的記憶に対する'),
    ],
    [
      b('The alternative is not', '代案は／次のことではありません'),
      b('to abandon moderation', '放棄すること／情報管理を'),
      b('but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey', 'そうではなく、組み合わせることです／情報管理を／入手しやすい証拠・独立した審査・説明と／そしてその説明を／利用者が／検討できる／ただ従うのではなく'),
    ],
    [
      b('A warning label without a visible chain of reasoning may suppress circulation while doing little', 'ある警告表示は／見える根拠の連鎖がない／抑えるかもしれません／情報の流通を／同時にほとんど役立たず'),
      b('to strengthen citizens\' judgment', '強めることには／市民の判断力を'),
    ],
    [
      b('For this reason', 'この理由から'),
      b('public memory cannot be protected', '公共的記憶は／守られ得ません'),
      b('by experts alone', '専門家だけでは'),
    ],
    [
      b('It also requires citizens', '公共的記憶は／さらに必要とします／市民を'),
      b('who are willing', 'そしてその市民は／進んで行います'),
      b('to read beyond headlines, tolerate uncertainty', '読むことを／見出しを越えて／受け入れることを／不確実性を'),
      b('and revise their views', 'そして改めることを／自分の見解を'),
      b('when stronger evidence appears', '〜するときに／さらに強い証拠が／現れる'),
    ],
    [
      b('This civic dimension explains', 'この市民的な側面が／説明します'),
      b('why collective memory cannot be measured only', 'なぜ／集合的記憶は／それだけでは測れないのかを'),
      b('by the number of documents preserved or people reached', 'その数によって／つまり、いくつの文書が保存されたか／または何人に情報が届いたかという'),
    ],
    [
      b('Its quality depends on', 'その質は／かかっています'),
      b('whether a society can use records to question comfortable stories, recognize obligations, and deliberate', '〜かどうかに／社会が／使える／記録を／問い直すために／都合のよい物語を／認識するために／義務を／そして熟議するために'),
      b('about future choices', '将来の選択について'),
    ],
    [
      b('Remembering, in this sense', '記憶することは／この意味では'),
      b('is not a passive act of storage but an active practice of civic discipline', '保存という受動的な行為ではなく／市民的規律の能動的な実践です'),
    ],
    [
      b('If that practice declines', 'もし／その実践が／衰えれば'),
      b(
        'even perfect archives will not prevent societies',
        '完璧な記録保管所でさえ／防げないでしょう／社会が何をするかは次へ続きます',
        'prevent A from doing の A が societies です。ここでは「社会を防ぐ」と訳さず、「社会が〜するのを防ぐ」と次へつなぎます。',
      ),
      b(
        'from losing their ability',
        '社会が／失うのを／自分たちの能力を',
        'prevent societies from losing で「社会が失うのを防ぐ」。from は日本語では「〜するのを」と受けます。',
      ),
      b(
        'to learn from',
        'その能力とは／学ぶ力です／〜から',
        'to learn が ability の内容を後ろから説明します。learn from の目的語は次の what 節です。',
      ),
      b(
        'what they',
        '何からかというと／社会が',
        'what 節全体が from の目的語です。まだ動詞 knew が残るので、ここでは結論を急がず主語 they まで取ります。',
      ),
      b(
        'once knew',
        'かつて／知っていたことからです',
        'once はここでは「いったん」ではなく「かつて」。what they once knew 全体で「社会がかつて知っていたこと」です。',
      ),
    ],
  ]),

  p_1_metric_fixation: passage([
    [
      b('Modern institutions measure almost everything they hope', '現代の制度は／測定します／ほぼすべてを／自分たちが望んでいる'),
      b('to improve in complex systems with competing public purposes', '改善することを／複雑な仕組みの中で／競合する公共目的を持つ'),
    ],
    [
      b('Schools compare test scores, hospitals track waiting times, universities count publications', '学校は／比較します／テスト得点を／病院は／追跡します／待ち時間を／大学は／数えます／出版物を'),
      b('and governments publish targets', 'そして／政府は／公表します／目標を'),
      b('for employment, safety, and environmental quality', '雇用、安全、環境の質についての'),
    ],
    [
      b('Such indicators give institutions a common language for judging performance across places and', 'そのような指標は／与えます／機関に／共通言語を／判断するための／成果を／異なる場所を通じて／そして'),
      b('over time', '時間の経過を通じても'),
    ],
    [
      b('They can expose failure', '指標は／明らかにできます／失敗を'),
      b('that would otherwise remain hidden', 'そしてその失敗は／そうでなければ隠れたままでしょう'),
      b('behind confident speeches or professional authority', '自信に満ちた演説や専門的な権威の背後に'),
    ],
    [
      b('The difficulty begins', '困難は／始まります'),
      b('when a useful measure becomes the institution’s practical definition of success', '〜するときに／役立つ測定値が／なります／制度にとって事実上の成功の定義に'),
    ],
    [
      b('An indicator is necessarily a simplified representation of a broader objective', '指標は／必然的に単純化された表現です／より広い目的の'),
    ],
    [
      b('A reading test captures some forms of comprehension', '読解テストは／捉えます／理解のいくつかの形を'),
      b('for example', '例えば'),
      b('but not every capacity that makes someone a thoughtful reader', 'しかし捉えません／すべての能力を／そしてその能力が／します／人を／思慮深い読み手に'),
    ],
    [
      b('Once rewards or penalties depend heavily', 'いったん／報酬や罰が／大きく左右されるようになると'),
      b('on the score', 'その得点によって'),
      b('people have an incentive to optimize the proxy rather than pursue the underlying mission', '人々は／持ちます／動機を／最適化する／代理指標を／根本的な使命を追うより'),
    ],
    [
      b('This response need not involve obvious cheating', 'この反応は／伴うとは限りません／明らかな不正を'),
    ],
    [
      b('A school may devote more time to easily tested skills while neglecting discussion, curiosity', '学校は／割くかもしれません／より多くの時間を／試験しやすい技能に／同時に軽視しながら／話し合い・好奇心を'),
      b('or students', 'あるいは生徒も'),
      b('whose improvement is unlikely', 'そしてその生徒の向上は／起こりそうにありません（内容は次へ）'),
      b('to change its ranking', '変えることが／学校の順位を'),
    ],
    [
      b('A hospital may transfer difficult patients or redefine', '病院は／移送するかもしれません／対応が難しい患者を／または定義し直すかもしれません'),
      b('when the waiting-time clock officially starts', 'いつ／待ち時間を測る時計が／公式に始まるかを'),
    ],
    [
      b('Each action can improve the reported number without producing an equivalent improvement', 'どちらの行動も／良くできます／報告される数字を／生み出さずに／それに相当する改善を'),
      b('in education or care', '教育や医療において'),
    ],
    [
      b('Less visible distortions arise', 'さらに見えにくい歪みが／生じます'),
      b('when workers avoid experiments', '〜するときに／職員が／避ける／実験を'),
      b('whose uncertain outcomes could damage an otherwise strong record', 'そしてその実験の不確かな結果が／損なうおそれがあります／それまでは良好だった記録を'),
    ],
    [
      b('A narrow target may consequently punish the very risk taking required', '狭い目標は／その結果、罰するかもしれません／まさにリスクを取る行為を／必要とされる'),
      b('for genuine learning', '本当の学習のために'),
    ],
    [
      b('Critics sometimes conclude', '批判する人々は／ときに結論づけます'),
      b('that quantification itself is the problem and', '数量化そのものが／問題であり／そして'),
      b(
        'that experienced professionals should simply',
        '経験豊かな専門家は／ただ（受け身は次へ）',
        'should の後ろに be trusted が続く受け身です。「専門家をただ信頼すべきだ」と次のブロックまでつなぎます。',
      ),
      b(
        'be trusted to exercise judgment',
        '信頼されるべきだと／行うように／判断を',
        'trust A to do の受け身で、「Aが〜すると信頼する」。ここでは専門家が判断を行うことを任せる、という意味です。',
      ),
    ],
    [
      b('That position underestimates', 'その立場は／過小評価しています'),
      b('why measurement became attractive', 'なぜ／測定が／魅力的になったのかを'),
      b('in the first place', 'そもそも'),
    ],
    [
      b('Judgment can remain informed and humane', '判断は／知識に基づき人道的であり続けられます'),
      b('but it can also become inconsistent, biased, and difficult', 'しかし／判断は／さらに一貫性を欠き、偏り、難しいものにもなり得ます'),
      b('for outsiders to challenge', '外部の人々が／異議を唱えるには'),
    ],
    [
      b('Without records', '記録がなければ'),
      b('leaders may celebrate a program’s intentions', '指導者は／称賛するかもしれません／ある活動の意図を'),
      b('while ignoring evidence that it repeatedly fails particular communities', '同時に無視しながら／証拠を／その活動が／繰り返し失敗している／特定の共同体で'),
    ],
    [
      b('The relevant choice is neither perfect numbers nor pure wisdom', 'ここで必要な選択肢は／完全な数字でも純粋な英知でもありません'),
      b('because neither exists', 'なぜなら／どちらも／存在しないからです'),
    ],
    [
      b('Better systems treat indicators as evidence', 'よりよい制度は／扱います／指標を／証拠として'),
      b('within a process of judgment rather than as automatic verdicts', '判断の過程の中で／自動的な判決としてではなく'),
    ],
    [
      b('This requires several forms of institutional restraint', 'これには／必要です／いくつかの形の制度的な抑制が'),
    ],
    [
      b('First, decision makers should use multiple measures', '第一に／意思決定者は／使うべきです／複数の測定値を'),
      b('that illuminate different parts of the mission', 'そしてそれぞれの測定値が／明らかにします／使命の異なる部分を'),
    ],
    [
      b('Graduation rates may be considered alongside student surveys, samples of actual work', '卒業率は／検討できます／生徒への調査・実際の成果物の標本と並べて'),
      b('and information about what graduates can do later', 'そして情報とも／次のことについて／何を／卒業生が／できるのか／後に'),
    ],
    [
      b('No collection of measures eliminates judgment', 'どの測定値の組合せも／なくしません／判断を'),
      b('but plural indicators make it harder', 'しかし／複数の指標は／より難しくします'),
      b('for one narrow target', '一つの狭い目標が'),
      b('to dominate behavior', '支配することを／行動を'),
    ],
    [
      b('Second, metrics should be interpreted with qualitative evidence from the people represented', '第二に／指標は／解釈されるべきです／質的な証拠とともに／人々からの／表されている'),
      b('by them', 'その指標によって'),
    ],
    [
      b('Missed medical appointments could indicate irresponsibility', '診療予約の欠席は／示すかもしれません／無責任さを'),
      b('but interviews might reveal', 'しかし／聞き取り調査は／明らかにするかもしれません'),
      b('that a new transport schedule', '新しい交通時刻表が'),
      b('made the clinic inaccessible', 'したということを／診療所を／利用しにくく'),
    ],
    [
      b('Context does not excuse every poor result', '背景事情は／正当化するわけではありません／すべての悪い結果を'),
      b('it helps institutions distinguish causes', '背景事情は／助けます／制度が／区別することを／原因を'),
      b('that demand different responses', 'そしてその原因は／必要とします／異なる対応を'),
    ],
    [
      b('Third, organizations must examine', '第三に／組織は／調べなければなりません'),
      b('how people adapt', 'どのように／人々が／適応するのかを'),
      b('once a measure carries consequences', 'いったん／測定値が／結果を伴うようになったら'),
    ],
    [
      b('A quiet diagnostic metric can become unreliable', '目立たない診断用の指標は／信頼できなくなることがあります'),
      b('after promotion, funding', '〜したあと／昇進・資金が（次へ続く）'),
      b('or punishment depends', 'あるいは処罰が／左右される'),
      b('on it', 'その指標によって'),
    ],
    [
      b('Regular audits should look not only for false reports but also', '定期的な監査は／探すべきです／虚偽の報告だけでなく、次のものも'),
      b('for neglected tasks, displaced risks', '軽視された仕事や、別の場所へ移された危険を'),
      b('and groups that disappear', 'そして集団も／姿を消す'),
      b('from the data', 'データから'),
    ],
    [
      b('Evaluation systems must be adaptive', '評価制度は／適応的でなければなりません'),
      b('because the behavior they observe changes', 'なぜなら／行動が／制度が観察する／変化するからです'),
      b('in response to observation', '観察されることに反応して'),
    ],
    [
      b('Transparency is important', '透明性は／重要です'),
      b('yet publishing more data is not sufficient', 'しかし／公開することは／より多くのデータを／十分ではありません'),
    ],
    [
      b('A dashboard can appear open while hiding decisions', '一覧画面は／開かれているように見えることがあります／同時に隠しながら／決定を'),
      b('about definitions, missing cases, statistical adjustments, and acceptable thresholds', '内容は／定義・欠落した事例・統計的な調整・許容される基準値について'),
    ],
    [
      b('Meaningful transparency explains', '意味のある透明性は／説明します'),
      b('why a measure was chosen', 'なぜ／その測定値が／選ばれたのかを'),
      b('what it omits', '何を／それが／除外しているのかを'),
      b('how uncertainty was handled', 'どのように／不確実性が／扱われたのかを'),
      b('and', 'そして、次のことも'),
      b('who can question its use', 'だれが／異議を唱えられるのかを／その利用に'),
    ],
    [
      b('That explanation enables public deliberation', 'その説明は／可能にします／公開での熟議を'),
      b('about goals instead of limiting debate to technical compliance', '目標について／限ることの代わりに／議論を／技術的な規則順守に'),
    ],
    [
      b('It also gives independent researchers a way to test', 'その説明は／さらに与えます／独立した研究者に／検証する方法を'),
      b('whether alternative definitions would tell a substantially different story', '〜かどうかを／別の定義が／示す／大きく異なる実態を'),
    ],
    [
      b('There is also a political question about', 'あります／さらに政治的な問いが／次のことについて'),
      b('who bears the burden of being measured', 'だれが／負うのか／測定される負担を'),
    ],
    [
      b('Frontline workers and vulnerable citizens often supply detailed data', '現場の労働者や弱い立場の市民は／しばしば提供します／詳しいデータを'),
      b('while senior institutions retain discretion over', '一方／上位の機関は／保ちます／裁量を／次のことについて'),
      b('how the numbers are interpreted', 'どのように／数字が／解釈されるのか'),
    ],
    [
      b('If measurement increases surveillance below but accountability does not increase above', 'もし／測定が／強めるなら／下位への監視を／しかし説明責任が／上位で強まらないなら'),
      b('the system may weaken rather than strengthen legitimacy', 'その制度は／弱めるかもしれません／正当性を／強めるのではなく'),
    ],
    [
      b('Those', 'その人々は（説明は次へ）'),
      b('who design indicators should therefore', 'つまり設計する／指標を／したがって（述語は次へ）'),
      b('be answerable', '説明責任を負うべきです'),
      b('for their consequences, including the administrative labor they create', 'その結果について／そこには含まれます／事務作業も／そしてその事務作業を／指標が／生み出します'),
    ],
    [
      b('A mature culture of evaluation recognizes', '成熟した評価文化は／認識します'),
      b('that important purposes cannot always', '重要な目的は／必ずしもできるわけではないと（内容は次へ）'),
      b('be fully quantified', '完全に数量化することが'),
    ],
    [
      b('Institutions cannot precisely measure trust, intellectual courage, dignity', '機関は／正確には測定できません／信頼・知的な勇気・尊厳を'),
      b('and social repair', 'そして、社会的な修復も'),
      b('yet they cannot responsibly ignore these values', 'しかし／機関は／責任ある形で無視することもできません／こうした価値を'),
    ],
    [
      b('The inability to assign a clean number is not evidence', '割り当てられないことは／明快な数字を／証拠ではありません'),
      b('that a value is unreal', 'つまり／その価値が／実在しないという'),
      b('it is a warning', 'それは／警告です'),
      b('that judgment must remain visible and contestable', 'つまり／判断は／見える形で、異議を申し立てられる状態に保たれなければならないという'),
    ],
    [
      b('Institutions can strengthen trust', '機関は／強められます／信頼を'),
      b('by publicly stating', '公に示すことによって'),
      b('that limit', 'その限界を'),
      b('because this prevents precision from being mistaken', 'なぜなら／このことは／防ぐからです／正確さが取り違えられるのを'),
      b('for certainty', '確実さと'),
    ],
    [
      b('Metrics are most valuable', '指標は／最も価値を持ちます'),
      b('when they create questions rather than close them', '〜するときに／指標が／生み出す／問いを／閉じるのではなく／それらを'),
    ],
    [
      b('They should direct attention toward patterns', '指標は／向けるべきです／注意を／傾向へ'),
      b('that require explanation, provide feedback', 'そしてその傾向は／必要とします／説明を／指標は提供するべきです／改善の手がかりを'),
      b('for revision', '見直しのための'),
      b('and reveal', 'そして、明らかにするべきです'),
      b('whether policies serve their stated mission', '〜かどうかを／政策が／役立っている／掲げた使命に'),
    ],
    [
      b('When a measure becomes a substitute', '〜すると／測定値が／置き換えるものになる（対象は次へ）'),
      b('for that mission', 'その使命を'),
      b('apparent precision can conceal institutional drift', '見かけ上の正確さが／隠す可能性があります／制度が使命からずれていくことを'),
    ],
    [
      b('When it remains one disciplined source of evidence', '〜するとき／測定が／規律ある一つの証拠源であり続ける'),
      b('among others', 'ほかの証拠源と並ぶ'),
      b('measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value', '測定は／支えることができます／学習と民主的な説明責任の両方を／変化する状況と、公共的価値をめぐる競合する解釈を越えて'),
      b('over time', '時間の経過を通じて'),
    ],
  ]),
})
