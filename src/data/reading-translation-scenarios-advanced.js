// 1級長文の講師監修・語順訳シナリオ。

const b = (en, ja, tip = '') => Object.freeze({ en, ja, tip })
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const ADVANCED_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_1_collective_memory: passage([
    [
      b('Societies often assume', '社会はしばしば考えます'),
      b('that important events will be remembered simply', '重要な出来事は、それだけで記憶され続けるだろうと'),
      b('because they are recorded', 'なぜなら、その出来事が記録されているからです'),
      b('in books, archives, or digital databases', '本や記録保管所、またはデジタルデータベースに'),
    ],
    [
      b('Yet collective memory is a far more fragile phenomenon than the existence of records might suggest', 'しかし集合的記憶は、記録が存在することから想像されるより、はるかにもろい現象です'),
    ],
    [
      b('A document can survive', '一つの文書は残ることができます'),
      b('for centuries and still fail to influence', '何世紀にもわたって、それでも影響を与えないことがあります'),
      b('how later generations understand the past', '後の世代が過去をどのように理解するかに'),
    ],
    [
      b('The reason is', 'その理由は、次のことです'),
      b('that memory depends not only on preservation but also on repeated interpretation', '記憶は保存だけでなく、繰り返し解釈されることにも依存しているということです'),
      b('within families, schools, media, and political institutions', '家庭、学校、メディア、政治制度の中で'),
    ],
    [
      b('When these mechanisms weaken', 'こうした仕組みが弱まると'),
      b('the past becomes a collection of isolated facts rather than a resource', '過去は、判断のための資源ではなく、孤立した事実の集まりになります'),
      b('for judgment', '判断のための'),
    ],
    [
      b('This problem has become more urgent', 'この問題は、さらに差し迫ったものになっています'),
      b('in the digital age', 'デジタル時代に'),
    ],
    [
      b('It is now possible to store enormous amounts of information', '今では、膨大な量の情報を保存することができます'),
      b('at little cost', 'わずかな費用で'),
      b('and many people therefore believe', 'そのため、多くの人は考えます'),
      b('that forgetting has become less likely', '忘却が起こりにくくなったと'),
    ],
    [
      b('In practice', '実際には'),
      b('however, abundance can produce a different kind of loss', 'しかし、情報が豊富にあることが、別の種類の喪失を生むことがあります'),
    ],
    [
      b('When search results, short videos, and algorithmic recommendations compete', '検索結果、短い動画、アルゴリズムによる推薦が競い合うと'),
      b('for attention', '人々の注意を得ようと'),
      b('materials that require slow reading or moral reflection may become almost invisible', 'ゆっくり読むことや道徳的な考察を必要とする資料は、ほとんど見えなくなるかもしれません'),
    ],
    [
      b('The integrity of public memory is then shaped less by', 'そのとき、公共的記憶の健全さを形づくるのは、次のことよりも'),
      b('what is available than by', '何を利用できるかよりも、次のことです'),
      b('what is repeatedly presented as relevant', '何が関連あるものとして繰り返し示されるかです'),
    ],
    [
      b('Digital records also depend', 'デジタル記録も依存しています'),
      b('on technical systems', '技術的な仕組みに'),
      b('whose apparent permanence can be misleading', 'その見かけ上の永続性は、誤解を招くことがあります'),
    ],
    [
      b('A file may still exist but become unreadable', 'ファイルは残っていても、読めなくなることがあります'),
      b('when software changes', 'ソフトウェアが変わると'),
      b('while a searchable collection can effectively disappear', '一方、検索可能な資料群も、実質的に消えることがあります'),
      b('if its indexing system is neglected', '索引の仕組みが放置されれば'),
    ],
    [
      b('More subtly', 'さらに見えにくい形では'),
      b('platforms can revise the categories and rankings through', 'プラットフォームは、分類や順位を変更できます、その仕組みを通じて'),
      b('which users encounter material', '利用者は資料と出会います'),
      b('without deleting a single record', '記録を一つも削除することなく'),
    ],
    [
      b('Preservation', '保存とは'),
      b('therefore, is not merely the retention of data', 'したがって、単にデータを保持することではありません'),
      b('it includes maintaining the pathways', '保存には、経路を維持することも含まれます'),
      b('that make data intelligible and discoverable', 'その経路が、データを理解可能で発見可能にします'),
    ],
    [
      b('This raises a difficult question', 'これは難しい問いを提起します'),
      b('about institutional responsibility', '制度的な責任についての'),
    ],
    [
      b('Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so', '図書館、博物館、大学、報道機関は伝統的に、一定の自律性を主張してきました、その目的は'),
      b('that they can protect records', '記録を守れるようにすることです'),
      b('from temporary political pressure', '一時的な政治的圧力から'),
    ],
    [
      b('That autonomy remains essential', 'その自律性は依然として不可欠です'),
      b('but it can also be misused', 'しかし、それは悪用される可能性もあります'),
      b('if institutions avoid scrutiny', 'もし制度が検証を避けるなら'),
      b('by describing all criticism as interference', 'すべての批判を干渉だと表現することによって'),
    ],
    [
      b('A healthy culture of memory therefore requires both independence and accountability', 'したがって、健全な記憶の文化には、独立性と説明責任の両方が必要です'),
    ],
    [
      b('Institutions must be free', '制度には自由がなければなりません'),
      b('to preserve uncomfortable evidence', '不都合な証拠を保存する自由が'),
      b('while citizens must be able', '一方、市民はできなければなりません'),
      b('to ask how decisions about selection, description', '選択や記述についての決定が、どのようになされるのかを問うことが'),
      b('and access are made', 'そして、アクセスについての決定も'),
    ],
    [
      b('Calls for complete neutrality do not resolve the problem', '完全な中立性を求めても、問題は解決しません'),
      b('since every archive must decide what to collect, how to describe it', 'なぜなら、どの記録保管所も、何を収集し、それをどう記述するか決めなければならないからです'),
      b('and', 'そして、決めなければなりません'),
      b('which materials receive scarce conservation resources', 'どの資料に、限られた保存資源を配分するのかを'),
    ],
    [
      b('Nor does greater participation automatically guarantee fairness', 'さらに、参加を増やしても、自動的に公平さが保証されるわけではありません'),
    ],
    [
      b('A public consultation may reproduce existing inequalities', '公開協議は、既存の不平等を再生産するかもしれません'),
      b('if organized groups can speak more loudly than communities', 'もし組織化された集団が、別の共同体より大きな声を上げられるなら'),
      b('with less time, money', '時間や資金が乏しい'),
      b('or trust in institutions', 'あるいは、制度への信頼が乏しい'),
    ],
    [
      b('Accountability must consequently include transparent reasons, opportunities', 'したがって説明責任には、透明な理由や機会が含まれなければなりません'),
      b('for challenge', '異議を申し立てるための'),
      b('and continuing efforts to hear people', 'そして、人々の声を聞き続ける努力も'),
      b('who were absent', 'その人々は参加できませんでした'),
      b('from the original decision', '最初の決定の場から'),
    ],
    [
      b('Such debates are rarely simple', 'そのような議論が単純であることは、ほとんどありません'),
      b('because historical meaning is often ambiguous', 'なぜなら、歴史的な意味はしばしば曖昧だからです'),
    ],
    [
      b('A photograph may reveal suffering to one group and national achievement to another', '一枚の写真が、ある集団には苦しみを、別の集団には国家的な達成を示すかもしれません'),
      b('a monument may be seen as heritage by some and as exclusion', 'ある記念碑は、一部の人には遺産として、別の人には排除として見られるかもしれません'),
      b('by others', '別の人々によって'),
    ],
    [
      b('The aim should not be to force a single consensus', '目標は、一つの合意を強制することであってはなりません'),
      b('that erases conflict', 'その合意は対立を消し去ります'),
    ],
    [
      b('Rather', 'むしろ'),
      b('a mature society keeps multiple perspectives', '成熟した社会は、複数の視点を保ちます'),
      b('in conversation while refusing', '対話の中に保ちながら、同時に拒みます'),
      b('to treat evidence as optional', '証拠を、あってもなくてもよいものとして扱うことを'),
    ],
    [
      b('Education plays a central role', '教育は中心的な役割を果たします'),
      b('in sustaining that discipline', 'その規律を維持する上で'),
      b('but the task is more demanding than adding a few historical dates to a curriculum', 'しかし、その課題は、カリキュラムにいくつかの歴史的な日付を加えるより難しいものです'),
    ],
    [
      b('Students must learn', '生徒は学ばなければなりません'),
      b('how narratives are constructed', '物語がどのように構成されるのかを'),
      b('why certain voices were ignored', 'なぜ特定の声が無視されたのかを'),
      b('and how apparently neutral categories can reflect older relations of power', 'そして、一見中立的な分類が、以前からの権力関係をどのように反映し得るのかを'),
    ],
    [
      b('Comparing conflicting accounts', '対立する説明を比較することは'),
      b('can help students see', '生徒が理解する助けになります'),
      b('that disagreement is not the same as ignorance', '意見の相違は、無知と同じではないということを'),
    ],
    [
      b('Two historians may accept the same evidence yet assign different significance to it', '二人の歴史家が同じ証拠を受け入れながら、それに異なる重要性を与えることがあります'),
      b('because they ask different questions', 'なぜなら、二人は異なる問いを立てるからです'),
    ],
    [
      b('The discipline lies', 'その規律は、次のことにあります'),
      b('in explaining those choices, confronting contrary evidence', 'その選択を説明し、反対の証拠と向き合うことに'),
      b('and stating', 'そして、示すことに'),
      b('where certainty ends', '確実に言える範囲がどこで終わるのかを'),
    ],
    [
      b('At the same time', '同時に'),
      b('they need intellectual habits', '人々には知的な習慣が必要です'),
      b('that prevent skepticism from turning', 'その習慣が、懐疑が変わるのを防ぎます'),
      b('into cynicism', '冷笑へ'),
    ],
    [
      b('If every account of the past is dismissed as merely political', 'もし、過去についてのすべての説明が、単に政治的なものとして退けられるなら'),
      b('citizens lose the capacity', '市民は能力を失います'),
      b('to distinguish careful revision from deliberate distortion', '慎重な見直しと意図的な歪曲を区別する能力を'),
    ],
    [
      b('Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation', 'デジタルプラットフォームはこの危険を強めます。粘り強い調査より、速さ、感情的な確信、集団への忠誠を報いやすいからです'),
    ],
    [
      b('A rumor that confirms a community\'s self-image may travel farther than a well-documented study that complicates it', '共同体の自己イメージを裏づけるうわさは、そのイメージを複雑にする、十分に文書化された研究より遠くまで広がるかもしれません'),
    ],
    [
      b('Some observers respond', 'それに対して、一部の人々は対応します'),
      b('by demanding', '要求することによって'),
      b('that platforms remove misleading historical claims more aggressively', 'プラットフォームが、誤解を招く歴史的主張をもっと積極的に削除するように'),
    ],
    [
      b('Although such action can limit obvious fabrications', 'そのような行動は、明らかな捏造を抑えられるものの'),
      b('it also gives private companies substantial authority', '民間企業に大きな権限も与えます'),
      b('over public memory', '公共的記憶に対する'),
    ],
    [
      b('The alternative is not', '代案は、そのことではありません'),
      b('to abandon moderation', '情報管理を放棄すること'),
      b('but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey', 'そうではなく、情報管理を、入手しやすい証拠、独立した審査、利用者がただ従うのではなく検討できる説明と組み合わせることです'),
    ],
    [
      b('A warning label without a visible chain of reasoning may suppress circulation while doing little', '根拠の流れが見えない警告表示は、情報の流通を抑える一方で、ほとんど役立たないかもしれません'),
      b('to strengthen citizens\' judgment', '市民の判断力を強めることには'),
    ],
    [
      b('For this reason', 'この理由から'),
      b('public memory cannot be protected', '公共的記憶を守ることはできません'),
      b('by experts alone', '専門家だけでは'),
    ],
    [
      b('It also requires citizens', '公共的記憶には市民も必要です'),
      b('who are willing', 'その市民には意思があります'),
      b('to read beyond headlines, tolerate uncertainty', '見出しを越えて読み、不確実性を受け入れる意思が'),
      b('and revise their views', 'そして、自分の見解を改める意思も'),
      b('when stronger evidence appears', 'さらに強い証拠が現れたときに'),
    ],
    [
      b('This civic dimension explains', 'この市民的な側面が説明します'),
      b('why collective memory cannot be measured only', 'なぜ集合的記憶は、それだけでは測れないのかを'),
      b('by the number of documents preserved or people reached', '保存された文書の数や、情報が届いた人の数だけでは'),
    ],
    [
      b('Its quality depends on', 'その質は、次のことにかかっています'),
      b('whether a society can use records to question comfortable stories, recognize obligations, and deliberate', '社会が記録を使って、都合のよい物語を問い、義務を認識し、熟議できるかどうかに'),
      b('about future choices', '将来の選択について'),
    ],
    [
      b('Remembering, in this sense', 'この意味で、記憶することは'),
      b('is not a passive act of storage but an active practice of civic discipline', '保存という受動的な行為ではなく、市民的な規律を実践する能動的な行為です'),
    ],
    [
      b('If that practice declines', 'もし、その実践が衰えれば'),
      b(
        'even perfect archives will not prevent societies',
        '完璧な記録保管所でさえ、防げないでしょう。社会が何をするのかは次へ続きます',
        'prevent A from doing の A が societies です。ここでは「社会を防ぐ」と訳さず、「社会が〜するのを防ぐ」と次へつなぎます。',
      ),
      b(
        'from losing their ability',
        '社会が、自分たちの能力を失うのを',
        'prevent societies from losing で「社会が失うのを防ぐ」。from は日本語では「〜するのを」と受けます。',
      ),
      b(
        'to learn from',
        'その能力とは、〜から学ぶ力です',
        'to learn が ability の内容を後ろから説明します。learn from の目的語は次の what 節です。',
      ),
      b(
        'what they',
        '何からかというと、社会が',
        'what 節全体が from の目的語です。まだ動詞 knew が残るので、ここでは結論を急がず主語 they まで取ります。',
      ),
      b(
        'once knew',
        'かつて知っていたことからです',
        'once はここでは「いったん」ではなく「かつて」。what they once knew 全体で「社会がかつて知っていたこと」です。',
      ),
    ],
  ]),

  p_1_metric_fixation: passage([
    [
      b('Modern institutions measure almost everything they hope', '現代の制度は、望んでいるほとんどすべてのものを測定します'),
      b('to improve in complex systems with competing public purposes', '競合する公共目的を持つ複雑な仕組みの中で、改善したいと'),
    ],
    [
      b('Schools compare test scores, hospitals track waiting times, universities count publications', '学校はテスト得点を比べ、病院は待ち時間を追跡し、大学は出版物を数えます'),
      b('and governments publish targets', 'そして、政府は目標を公表します'),
      b('for employment, safety, and environmental quality', '雇用、安全、環境の質についての'),
    ],
    [
      b('Such indicators give institutions a common language for judging performance across places and', 'そのような指標は制度に、異なる場所で成果を判断するための共通言語を与えます、そして'),
      b('over time', '時間の経過を通じても'),
    ],
    [
      b('They can expose failure', '指標は失敗を明らかにできます'),
      b('that would otherwise remain hidden', 'その失敗は、そうでなければ隠れたままでしょう'),
      b('behind confident speeches or professional authority', '自信に満ちた演説や専門的な権威の背後に'),
    ],
    [
      b('The difficulty begins', '困難は始まります'),
      b('when a useful measure becomes the institution’s practical definition of success', '役立つ測定値が、制度にとって事実上の成功の定義になったときに'),
    ],
    [
      b('An indicator is necessarily a simplified representation of a broader objective', '指標は必然的に、より広い目的を単純化して表したものです'),
    ],
    [
      b('A reading test captures some forms of comprehension', '読解テストは、理解のいくつかの形を捉えます'),
      b('for example', '例えば'),
      b('but not every capacity that makes someone a thoughtful reader', 'しかし、人を思慮深い読み手にするすべての能力を捉えるわけではありません'),
    ],
    [
      b('Once rewards or penalties depend heavily', '報酬や罰が大きく左右されるようになると'),
      b('on the score', 'その得点によって'),
      b('people have an incentive to optimize the proxy rather than pursue the underlying mission', '人々は、根本的な使命を追うよりも、その代理指標を最適化しようとする動機を持ちます'),
    ],
    [
      b('This response need not involve obvious cheating', 'この反応が、明らかな不正を伴うとは限りません'),
    ],
    [
      b('A school may devote more time to easily tested skills while neglecting discussion, curiosity', '学校は、話し合いや好奇心を軽視しながら、試験しやすい技能にもっと時間を使うかもしれません'),
      b('or students', 'あるいは、生徒を軽視するかもしれません'),
      b('whose improvement is unlikely', 'その生徒の向上は、しそうにありません'),
      b('to change its ranking', '学校の順位を変えることが'),
    ],
    [
      b('A hospital may transfer difficult patients or redefine', '病院は、対応が難しい患者を移送したり、定義し直したりするかもしれません'),
      b('when the waiting-time clock officially starts', '待ち時間を測る時計が、公式にはいつ始まるのかを'),
    ],
    [
      b('Each action can improve the reported number without producing an equivalent improvement', 'どちらの行動も、それに相当する改善を生み出さずに、報告される数字を良くできます'),
      b('in education or care', '教育や医療において'),
    ],
    [
      b('Less visible distortions arise', 'さらに見えにくい歪みが生じます'),
      b('when workers avoid experiments', '職員が実験を避けるときに'),
      b('whose uncertain outcomes could damage an otherwise strong record', 'その不確かな結果が、それまでは良好だった記録を損なうおそれがあります'),
    ],
    [
      b('A narrow target may consequently punish the very risk taking required', 'その結果、狭い目標は、まさに必要とされるリスクを取る行為を罰するかもしれません'),
      b('for genuine learning', '本当の学習のために'),
    ],
    [
      b('Critics sometimes conclude', '批判する人々は、ときに結論づけます'),
      b('that quantification itself is the problem and', '数量化そのものが問題であり、そして'),
      b(
        'that experienced professionals should simply',
        '経験豊かな専門家は、ただ信頼されるべきだと',
        'should の後ろに be trusted が続く受け身です。「専門家をただ信頼すべきだ」と次のブロックまでつなぎます。',
      ),
      b(
        'be trusted to exercise judgment',
        '判断を行う者として、信頼されるべきだと',
        'trust A to do の受け身で、「Aが〜すると信頼する」。ここでは専門家が判断を行うことを任せる、という意味です。',
      ),
    ],
    [
      b('That position underestimates', 'その立場は過小評価しています'),
      b('why measurement became attractive', 'なぜ測定が魅力的になったのかを'),
      b('in the first place', 'そもそも'),
    ],
    [
      b('Judgment can remain informed and humane', '判断は、知識に基づき人道的であり続けることができます'),
      b('but it can also become inconsistent, biased, and difficult', 'しかし、一貫性を欠き、偏り、難しいものにもなり得ます'),
      b('for outsiders to challenge', '外部の人々が異議を唱えるには'),
    ],
    [
      b('Without records', '記録がなければ'),
      b('leaders may celebrate a program’s intentions', '指導者は、ある活動の意図を称賛するかもしれません'),
      b('while ignoring evidence that it repeatedly fails particular communities', 'その活動が特定の共同体で繰り返し失敗している証拠を無視しながら'),
    ],
    [
      b('The relevant choice is neither perfect numbers nor pure wisdom', 'ここで必要な選択肢は、完全な数字でも純粋な英知でもありません'),
      b('because neither exists', 'なぜなら、どちらも存在しないからです'),
    ],
    [
      b('Better systems treat indicators as evidence', 'よりよい制度は、指標を証拠として扱います'),
      b('within a process of judgment rather than as automatic verdicts', '自動的な判決としてではなく、判断の過程の中で'),
    ],
    [
      b('This requires several forms of institutional restraint', 'これには、いくつかの形の制度的な抑制が必要です'),
    ],
    [
      b('First, decision makers should use multiple measures', '第一に、意思決定者は複数の測定値を使うべきです'),
      b('that illuminate different parts of the mission', 'それぞれの測定値が、使命の異なる部分を明らかにします'),
    ],
    [
      b('Graduation rates may be considered alongside student surveys, samples of actual work', '卒業率は、生徒への調査や実際の成果物の標本と並べて検討できます'),
      b('and information about what graduates can do later', 'そして、卒業生が後に何をできるかという情報とも'),
    ],
    [
      b('No collection of measures eliminates judgment', 'どれほど測定値を集めても、判断はなくなりません'),
      b('but plural indicators make it harder', 'しかし、複数の指標があれば、難しくなります'),
      b('for one narrow target', '一つの狭い目標が'),
      b('to dominate behavior', '行動を支配することが'),
    ],
    [
      b('Second, metrics should be interpreted with qualitative evidence from the people represented', '第二に、指標は、それによって表される人々から得た質的な証拠と一緒に解釈されるべきです'),
      b('by them', 'その指標によって'),
    ],
    [
      b('Missed medical appointments could indicate irresponsibility', '診療予約の欠席は、無責任さを示すかもしれません'),
      b('but interviews might reveal', 'しかし、聞き取り調査によって明らかになるかもしれません'),
      b('that a new transport schedule', '新しい交通時刻表が'),
      b('made the clinic inaccessible', '診療所を利用しにくくしたということが'),
    ],
    [
      b('Context does not excuse every poor result', '背景事情が、すべての悪い結果を正当化するわけではありません'),
      b('it helps institutions distinguish causes', '背景事情は、制度が原因を区別する助けになります'),
      b('that demand different responses', 'その原因は、異なる対応を必要とします'),
    ],
    [
      b('Third, organizations must examine', '第三に、組織は調べなければなりません'),
      b('how people adapt', '人々がどのように適応するのかを'),
      b('once a measure carries consequences', 'いったん測定値が結果を左右するようになったら'),
    ],
    [
      b('A quiet diagnostic metric can become unreliable', '目立たない診断用の指標も、信頼できなくなることがあります'),
      b('after promotion, funding', '昇進や資金が左右されるようになったあとで'),
      b('or punishment depends', 'あるいは、処罰が左右されると'),
      b('on it', 'その指標によって'),
    ],
    [
      b('Regular audits should look not only for false reports but also', '定期的な監査は、虚偽の報告だけでなく、次のものも探すべきです'),
      b('for neglected tasks, displaced risks', '軽視された仕事や、別の場所へ移された危険を'),
      b('and groups that disappear', 'そして、姿を消した集団も'),
      b('from the data', 'データから'),
    ],
    [
      b('Evaluation systems must be adaptive', '評価制度は、適応的でなければなりません'),
      b('because the behavior they observe changes', 'なぜなら、制度が観察する行動そのものが変化するからです'),
      b('in response to observation', '観察されることに反応して'),
    ],
    [
      b('Transparency is important', '透明性は重要です'),
      b('yet publishing more data is not sufficient', 'しかし、より多くのデータを公開するだけでは十分ではありません'),
    ],
    [
      b('A dashboard can appear open while hiding decisions', '一覧画面は、決定を隠しながら、開かれているように見えることがあります'),
      b('about definitions, missing cases, statistical adjustments, and acceptable thresholds', '定義、欠落した事例、統計的な調整、許容される基準値についての決定を'),
    ],
    [
      b('Meaningful transparency explains', '意味のある透明性は説明します'),
      b('why a measure was chosen', 'なぜ、その測定値が選ばれたのかを'),
      b('what it omits', 'それが何を除外しているのかを'),
      b('how uncertainty was handled', '不確実性がどのように扱われたのかを'),
      b('and', 'そして、次のことも'),
      b('who can question its use', 'だれがその利用に異議を唱えられるのかを'),
    ],
    [
      b('That explanation enables public deliberation', 'その説明によって、公開での熟議ができるようになります'),
      b('about goals instead of limiting debate to technical compliance', '議論を技術的な規則順守に限るのではなく、目標について'),
    ],
    [
      b('It also gives independent researchers a way to test', 'その説明は、独立した研究者に検証する方法も与えます'),
      b('whether alternative definitions would tell a substantially different story', '別の定義なら、大きく異なる実態を示すのかどうかを'),
    ],
    [
      b('There is also a political question about', '政治的な問いもあります、それは'),
      b('who bears the burden of being measured', 'だれが測定される負担を負うのかという問いです'),
    ],
    [
      b('Frontline workers and vulnerable citizens often supply detailed data', '現場の労働者や弱い立場の市民は、詳しいデータを提供することがよくあります'),
      b('while senior institutions retain discretion over', '一方、上位の制度は、あることについての裁量を保ちます'),
      b('how the numbers are interpreted', '数字がどのように解釈されるのかについて'),
    ],
    [
      b('If measurement increases surveillance below but accountability does not increase above', 'もし、測定によって下位への監視が強まっても、上位の説明責任が強まらないなら'),
      b('the system may weaken rather than strengthen legitimacy', 'その制度は、正当性を強めるどころか、弱めるかもしれません'),
    ],
    [
      b('Those', 'その人々は'),
      b('who design indicators should therefore', '指標を設計する人々であり、したがって'),
      b('be answerable', '説明責任を負うべきです'),
      b('for their consequences, including the administrative labor they create', 'その結果について、指標が生み出す事務作業も含めて'),
    ],
    [
      b('A mature culture of evaluation recognizes', '成熟した評価文化は認識します'),
      b('that important purposes cannot always', '重要な目的は、必ずしもできるわけではないと'),
      b('be fully quantified', '完全に数量化することが'),
    ],
    [
      b('Institutions cannot precisely measure trust, intellectual courage, dignity', '制度は、信頼、知的な勇気、尊厳を正確に測定できません'),
      b('and social repair', 'そして、社会的な修復も'),
      b('yet they cannot responsibly ignore these values', 'しかし、責任を持って、こうした価値を無視することもできません'),
    ],
    [
      b('The inability to assign a clean number is not evidence', '明快な数字を割り当てられないことは、証拠ではありません'),
      b('that a value is unreal', 'その価値が実在しないという'),
      b('it is a warning', 'それは警告です'),
      b('that judgment must remain visible and contestable', '判断は見える形で、異議を申し立てられる状態に保たれなければならないという'),
    ],
    [
      b('Institutions can strengthen trust', '制度は信頼を強められます'),
      b('by publicly stating', '公に示すことによって'),
      b('that limit', 'その限界を'),
      b('because this prevents precision from being mistaken', 'なぜなら、それによって正確さが取り違えられるのを防げるからです'),
      b('for certainty', '確実さと'),
    ],
    [
      b('Metrics are most valuable', '指標は最も価値を持ちます'),
      b('when they create questions rather than close them', '問いを閉じるのではなく、新しい問いを生み出すときに'),
    ],
    [
      b('They should direct attention toward patterns', '指標は、傾向へ注意を向けるべきです'),
      b('that require explanation, provide feedback', 'その傾向は説明を必要とし、指標は反応を与えるべきです'),
      b('for revision', '見直しのための'),
      b('and reveal', 'そして、明らかにするべきです'),
      b('whether policies serve their stated mission', '政策が掲げた使命に役立っているかどうかを'),
    ],
    [
      b('When a measure becomes a substitute', '測定値が代わりのものになると'),
      b('for that mission', 'その使命の'),
      b('apparent precision can conceal institutional drift', '見かけ上の正確さが、制度が使命からずれていくことを隠す可能性があります'),
    ],
    [
      b('When it remains one disciplined source of evidence', '測定が、規律ある一つの証拠源であり続けるなら'),
      b('among others', 'ほかの証拠源と並ぶ'),
      b('measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value', '測定は、変化する状況や、公共的価値をめぐる異なる解釈を越えて、学習と民主的な説明責任の両方を支えられます'),
      b('over time', '時間の経過を通じて'),
    ],
  ]),
})
