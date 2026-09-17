import { st } from './entry.js'

export default Object.freeze([
  st('[S Societies] [M often] [V assume] [O {that節| [接 that] [S important events] [V will be remembered] [M simply {副詞節:理由| [接 because] [S they] [V are recorded] [M {前| in books, archives, or digital databases}]}]}].', {
    chunks: [
      ['Societies often assume', '社会はよく考えます（内容は次へ）'],
      ['that', '〜だと'],
      ['important events will be remembered', '重要な出来事は記憶され続けるだろう'],
      ['simply because', 'ただ〜というだけで（理由は次へ）'],
      ['they are recorded', 'それらが記録されている（というだけで）'],
      ['in books, archives, or digital databases', '本や記録保管所、デジタルデータベースに'],
    ],
    notes: {
      'simply because': 'simply は because 以下を限定して「ただ〜というだけで」。',
      'they are recorded': 'they は important events を指します。',
    },
  }),
  st('[M Yet] [S collective memory] [V is] [C a far more fragile phenomenon {副詞節:比較| [接 than] [S the existence {前| of records}] [V might suggest]}].', {
    chunks: [
      ['Yet', 'しかし'],
      ['collective memory', '集合的記憶は'],
      ['is a far more fragile phenomenon', 'はるかにもろい現象です（比べる相手は次へ）'],
      ['than the existence of records might suggest', '記録があることから想像されるよりも'],
    ],
    notes: {
      'is a far more fragile phenomenon': 'far は比較級 more fragile を強めて「はるかに」。',
      'than the existence of records might suggest': 'suggest はここでは「（〜だと）思わせる」。',
    },
    unitNotes: {
      'than the existence of records might suggest': 'suggest の後ろでは、比べる内容（集合的記憶がどれほどもろいか）が省かれています。than の後ろでは、前と重なる語句がよく省かれます。',
    },
  }),
  st('[S A document] [V can survive] [M {前| for centuries}] [接 and] [M still] [V fail] [O {to:名詞| [V to influence] [O {疑問詞節| [M how] [S later generations] [V understand] [O the past]}]}].', {
    chunks: [
      ['A document can survive', '文書は残ることができます'],
      ['for centuries', '何世紀にもわたって'],
      ['and still fail to influence', 'それでも影響を与えられないことがあります（何にかは次へ）'],
      ['how later generations understand the past', '後の世代が過去をどう理解するかに'],
    ],
    notes: {
      'and still fail to influence': 'fail to do で「〜しない・〜できない」。fail は can を共有しています。',
    },
  }),
  st('[S The reason] [V is] [C {that節| [接 that] [S memory] [V depends] [M not only {前| on preservation} but also {前| on repeated interpretation {前| within families, schools, media, and political institutions}}]}].', {
    chunks: [
      ['The reason is that', 'その理由は次のことです'],
      ['memory depends', '記憶は左右されます（何にかは次へ）'],
      ['not only on preservation', '保存だけでなく'],
      ['but also on repeated interpretation', '繰り返し解釈されることにも'],
      ['within families, schools, media, and political institutions', '家庭や学校、メディア、政治の制度の中で'],
    ],
    notes: {
      'not only on preservation': 'not only A but also B で「AだけでなくBも」。depend on が on を二度使って続きます。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S these mechanisms] [V weaken]}], [S the past] [V becomes] [C a collection {前| of isolated facts} {前| rather than a resource {前| for judgment}}].', {
    chunks: [
      ['When', '〜すると（内容は次へ）'],
      ['these mechanisms weaken', 'これらの仕組みが弱まる（と）'],
      ['the past', '過去は'],
      ['becomes a collection of isolated facts', 'ばらばらの事実の寄せ集めになります'],
      ['rather than a resource for judgment', '判断に役立つ資源ではなく'],
    ],
    notes: {
      'rather than a resource for judgment': 'A rather than B で「BではなくA」。',
    },
  }),
  st('[S This problem] [V has become] [C more urgent] [M {前| in the digital age}].', {
    chunks: [
      ['This problem', 'この問題は'],
      ['has become more urgent', 'より差し迫ったものになっています'],
      ['in the digital age', 'デジタル時代に'],
    ],
  }),
  st('[仮S It] [V is] [M now] [C possible] [真S {to:名詞| [V to store] [O enormous amounts {前| of information}] [M {前| at little cost}]}], [接 and] [S many people] [M therefore] [V believe] [O {that節| [接 that] [S forgetting] [V has become] [C less likely]}].', {
    chunks: [
      ['It is now possible', '今では可能です（何がかは次へ）'],
      ['to store enormous amounts of information', '膨大な量の情報を保存することが'],
      ['at little cost', 'わずかな費用で'],
      ['and', 'そして'],
      ['many people therefore believe', 'そのため多くの人は考えています（内容は次へ）'],
      ['that', '〜と'],
      ['forgetting', '忘れることは'],
      ['has become less likely', '起こりにくくなった（と）'],
    ],
    notes: {
      'It is now possible': '中身は後ろの to store … at little cost です。長い主語を後ろに回し、形だけの It を先に置いています。',
      'many people therefore believe': 'many people believe は、筆者ではなく多くの人の考えです。次の文の however で、筆者はこの考えに反論します。',
    },
    rules: ['author-stance', 'cause-result', 'infinitive-role'],
  }),
  st('[M {前| In practice}], [M however], [S abundance] [V can produce] [O a different kind {前| of loss}].', {
    chunks: [
      ['In practice', '実際には'],
      ['however,', 'しかし'],
      ['abundance', '豊富にあることは'],
      ['can produce a different kind of loss', '別の種類の喪失を生むことがあります'],
    ],
  }),
  st('[M {副詞節:時| [接 When] [S search results, short videos, and algorithmic recommendations] [V compete] [M {前| for attention}]}], [S materials {関係>materials| [S that] [V require] [O slow reading or moral reflection]}] [V may become] [M almost] [C invisible].', {
    chunks: [
      ['When', '〜すると（内容は次へ）'],
      ['search results, short videos,', '検索結果や短い動画'],
      ['and algorithmic recommendations compete', 'そしてアルゴリズムによるおすすめが競い合う'],
      ['for attention', '人々の注目を得ようと（競い合うと）'],
      ['materials', '資料は'],
      ['that require slow reading or moral reflection', 'ゆっくり読むことや道徳的な考察を必要とする（資料は）'],
      ['may become almost invisible', 'ほとんど見えなくなるかもしれません'],
    ],
  }),
  st('[S The integrity {前| of public memory}] [V is] [M then] [V shaped] [M less {前| by {what節| [S what] [V is] [C available]}} than {前| by {what節| [S what] [V is] [M repeatedly] [V presented] [C {前| as relevant}]}}].', {
    chunks: [
      ['The integrity of public memory', '公共的記憶の健全さは'],
      ['is then shaped', 'そうなると形づくられます（何によってかは次へ）'],
      ['less by what is available', '入手できるものによってというより'],
      ['than by what is repeatedly presented as relevant', 'むしろ、繰り返し関連のあるものとして示されるものによって'],
    ],
    notes: {
      'is then shaped': 'then はここでは「そうなると」。前の文で述べた状況を受けています。',
      'less by what is available': 'less by A than by B で「AによってというよりBによって」。二つの by what … を比べています。what は「〜するもの」という関係代名詞で、what 以下が前置詞 by の目的語です。',
    },
  }),
  st('[S Digital records] [M also] [V depend] [M {前| on technical systems {関係>technical systems| [S whose apparent permanence] [V can be] [C misleading]}}].', {
    chunks: [
      ['Digital records also depend', 'デジタルの記録はまた依存しています（何にかは次へ）'],
      ['on technical systems', '技術的な仕組みに'],
      ['whose apparent permanence can be misleading', 'そしてその仕組みの一見永続的に見える点は、誤解を招くことがあります'],
    ],
    notes: {
      'whose apparent permanence can be misleading': 'whose は technical systems を受け、「その仕組みの」という意味の関係代名詞です。',
    },
  }),
  st('[S A file] [V may] [M still] [V exist] [接 but] [V become] [C unreadable] [M {副詞節:時| [接 when] [S software] [V changes]}], [M {副詞節:対比| [接 while] [S a searchable collection] [V can] [M effectively] [V disappear] [M {副詞節:条件| [接 if] [S its indexing system] [V is neglected]}]}].', {
    chunks: [
      ['A file may still exist', 'ファイルはまだ存在しているかもしれません'],
      ['but', 'しかし'],
      ['become unreadable', '読めなくなることがあります'],
      ['when', '〜すると（内容は次へ）'],
      ['software changes', 'ソフトウェアが変わる（と）'],
      ['while', '一方で'],
      ['a searchable collection can effectively disappear', '検索できる資料の集まりは事実上消えてしまうことがあります'],
      ['if', 'もし'],
      ['its indexing system is neglected', 'その索引の仕組みが放っておかれれば'],
    ],
    notes: {
      'become unreadable': 'become は may を共有しています（may become）。',
    },
  }),
  st('[M More subtly], [S platforms] [V can revise] [O the categories and rankings {関係>the categories and rankings| [M through which] [S users] [V encounter] [O material]}] [M {前| without {動名詞| [V deleting] [O a single record]}}].', {
    chunks: [
      ['More subtly', 'さらに目立たない形では'],
      ['platforms', 'プラットフォームは'],
      ['can revise the categories and rankings', '分類や順位を変えることができます'],
      ['through which users encounter material', '利用者がそれを通して資料と出会う（分類や順位を）'],
      ['without deleting a single record', '記録を一つも削除することなく'],
    ],
    notes: {
      'through which users encounter material': 'through which は the categories and rankings を受ける前置詞＋関係代名詞です。',
    },
  }),
  st('[S Preservation], [M therefore], [V is not] [M merely] [C the retention {前| of data}]; [S it] [V includes] [O {動名詞| [V maintaining] [O the pathways {関係>the pathways| [S that] [V make] [O data] [C intelligible and discoverable]}]}].', {
    chunks: [
      ['Preservation', '保存とは'],
      ['therefore,', 'したがって'],
      ['is not merely the retention of data', '単にデータを保っておくことではありません'],
      ['it includes', 'それは含みます（何をかは次へ）'],
      ['maintaining the pathways', '道筋を保つことを'],
      ['that make data intelligible and discoverable', 'データを理解でき、見つけられるようにする（道筋を）'],
    ],
    notes: {
      'is not merely the retention of data': 'not merely は「単に〜というだけではない」。',
      'that make data intelligible and discoverable': 'make ＋ O ＋ C で「OをCにする」。',
    },
  }),
  st('[S This] [V raises] [O a difficult question {前| about institutional responsibility}].', {
    chunks: [
      ['This', 'このことは'],
      ['raises a difficult question', '難しい問いを投げかけます'],
      ['about institutional responsibility', '機関の責任についての（問いを）'],
    ],
  }),
  st('[S Libraries, museums, universities, and news organizations] [V have] [M traditionally] [V claimed] [O a degree {前| of autonomy}] [M {副詞節:目的| [接 so that] [S they] [V can protect] [O records] [M {前| from temporary political pressure}]}].', {
    chunks: [
      ['Libraries, museums, universities, and news organizations', '図書館や博物館、大学、報道機関は'],
      ['have traditionally claimed a degree of autonomy', 'これまで一定の自律性を求めてきました'],
      ['so that', '〜できるように（内容は次へ）'],
      ['they can protect records', 'それらの機関が記録を守れる（ように）'],
      ['from temporary political pressure', '一時的な政治の圧力から'],
    ],
    notes: {
      'so that': 'so that ＋ S ＋ can ＋ 動詞 で「Sが〜できるように」。',
    },
  }),
  st('[S That autonomy] [V remains] [C essential], [接 but] [S it] [V can] [M also] [V be misused] [M {副詞節:条件| [接 if] [S institutions] [V avoid] [O scrutiny] [M {前| by {動名詞| [V describing] [O all criticism] [C {前| as interference}]}}]}].', {
    chunks: [
      ['That autonomy', 'その自律性は'],
      ['remains essential', '今も欠かせません'],
      ['but', 'しかし'],
      ['it can also be misused', 'それは悪用されることもあります'],
      ['if institutions avoid scrutiny', 'もし機関が検証を避けるなら（どうやってかは次へ）'],
      ['by describing all criticism as interference', 'すべての批判を干渉だと言うことによって'],
    ],
    notes: {
      'by describing all criticism as interference': 'describe A as B で「AをBだと言う」。',
    },
    rules: ['contrast-concession', 'passive-active', 'ing-ed-role'],
  }),
  st('[S A healthy culture {前| of memory}] [M therefore] [V requires] [O both independence and accountability].', {
    chunks: [
      ['A healthy culture of memory', '健全な記憶の文化には'],
      ['therefore', 'したがって'],
      ['requires both independence and accountability', '独立性と説明責任の両方が必要です'],
    ],
  }),
  st('[S Institutions] [V must be] [C free {to:副詞(形容詞)| [V to preserve] [O uncomfortable evidence]}], [M {副詞節:対比| [接 while] [S citizens] [V must be able to ask] [O {疑問詞節| [M how] [S decisions {前| about selection, description, and access}] [V are made]}]}].', {
    chunks: [
      ['Institutions', '機関は'],
      ['must be free', '自由でなければなりません（何をする自由かは次へ）'],
      ['to preserve uncomfortable evidence', '都合の悪い証拠を保存する（自由が）'],
      ['while', '一方で'],
      ['citizens', '市民は'],
      ['must be able to ask', '問えなければなりません（何をかは次へ）'],
      ['how decisions', 'どのように決定が（内容は次へ）'],
      ['about selection, description, and access', '選ぶこと・記述すること・利用の許可についての（決定が）'],
      ['are made', '下されるのかを'],
    ],
    notes: {
      'must be free': 'be free to do で「自由に〜できる」。',
      'must be able to ask': 'be able to do は can と同じく「〜できる」。',
    },
  }),
  st('[S Calls {前| for complete neutrality}] [V do not resolve] [O the problem], [M {副詞節:理由| [接 since] [S every archive] [V must decide] [O {疑問詞to| [O what] [V to collect]}, {疑問詞to| [M how] [V to describe] [O it]}, and {疑問詞節| [S which materials] [V receive] [O scarce conservation resources]}]}].', {
    chunks: [
      ['Calls for complete neutrality', '完全な中立を求める声は'],
      ['do not resolve the problem', 'その問題を解決しません'],
      ['since', 'なぜなら'],
      ['every archive must decide', 'どの記録保管所も決めなければならないからです（何をかは次へ）'],
      ['what to collect,', '何を集めるか'],
      ['how to describe it,', 'それをどう記述するか'],
      ['and which materials', 'そして、どの資料が'],
      ['receive scarce conservation resources', '限られた保存のための資源を受け取るか（を）'],
    ],
    notes: {
      since: 'since はここでは「〜なので」と理由を表します。',
      'what to collect,': 'what to do で「何を〜すべきか」。三つの疑問詞のまとまりが decide の目的語です。',
    },
  }),
  st('[接 Nor] [V does] [S greater participation] [M automatically] [V guarantee] [O fairness].', {
    chunks: [
      ['Nor does', 'また〜というわけでもありません（否定の中身は次へ）'],
      ['greater participation', 'より多くの人が参加することが'],
      ['automatically guarantee fairness', '自動的に公平さを保証する（わけではありません）'],
    ],
    notes: {
      'Nor does': 'Nor ＋ 助動詞 ＋ 主語 ＋ 動詞 の語順（倒置）で「〜もまた…ない」。',
    },
    rules: ['negation-scope', 'logic-connectors', 'main-clause-skeleton'],
  }),
  st('[S A public consultation] [V may reproduce] [O existing inequalities] [M {副詞節:条件| [接 if] [S organized groups] [V can speak] [M more loudly {前| than communities {前| with less time, money, or trust {前| in institutions}}}]}].', {
    chunks: [
      ['A public consultation', '公開の話し合いは'],
      ['may reproduce existing inequalities', '今ある不平等を再び生み出してしまうかもしれません'],
      ['if organized groups can speak more loudly', 'もし組織された集団のほうが大きな声を上げられるなら（比べる相手は次へ）'],
      ['than communities', '共同体よりも'],
      ['with less time, money, or trust in institutions', '時間やお金、制度への信頼が少ない（共同体よりも）'],
    ],
  }),
  st('[S Accountability] [V must] [M consequently] [V include] [O transparent reasons, opportunities {前| for challenge}, and continuing efforts {to:形容詞>continuing efforts| [V to hear] [O people {関係>people| [S who] [V were] [C absent {前| from the original decision}]}]}].', {
    chunks: [
      ['Accountability must consequently include', 'そのため説明責任は含まなければなりません（何をかは次へ）'],
      ['transparent reasons,', 'はっきり示された理由'],
      ['opportunities for challenge,', '異議を唱える機会'],
      ['and continuing efforts', 'そして継続的な努力を（何をする努力かは次へ）'],
      ['to hear people', '人々の声を聞く（努力を）'],
      ['who were absent from the original decision', '最初の決定の場にいなかった（人々の）'],
    ],
  }),
  st('[S Such debates] [V are] [M rarely] [C simple] [M {副詞節:理由| [接 because] [S historical meaning] [V is] [M often] [C ambiguous]}].', {
    chunks: [
      ['Such debates', 'そうした議論は'],
      ['are rarely simple', 'めったに単純ではありません'],
      ['because', 'なぜなら'],
      ['historical meaning', '歴史的な意味は'],
      ['is often ambiguous', 'あいまいなことが多い（からです）'],
    ],
    notes: {
      'are rarely simple': 'rarely は「めったに〜ない」という否定の意味の副詞です。',
    },
  }),
  st('[S A photograph] [V may reveal] [O suffering] [M {前| to one group}] [接 and] [O national achievement] [M {前| to another}]; [S a monument] [V may be seen] [C {前| as heritage}] [M {前| by some}] [接 and] [C {前| as exclusion}] [M {前| by others}].', {
    chunks: [
      ['A photograph', '一枚の写真は'],
      ['may reveal suffering', '苦しみを示すかもしれません'],
      ['to one group', 'ある集団には'],
      ['and', 'そして'],
      ['national achievement', '国の偉業を'],
      ['to another;', '別の集団には'],
      ['a monument', 'ある記念碑は'],
      ['may be seen as heritage', '遺産とみなされるかもしれません'],
      ['by some', '一部の人々には'],
      ['and', 'そして'],
      ['as exclusion', '排除の象徴と（みなされるかもしれません）'],
      ['by others', 'ほかの人々には'],
    ],
    notes: {
      'national achievement': 'and national achievement to another は may reveal を省いた形です。another の後ろの group も省かれています。',
      'to another;': 'セミコロン（;）の後ろで、同じ考えを記念碑の例でもう一つ示しています。',
      'may be seen as heritage': 'see A as B「AをBとみなす」の受け身で、「Bとみなされる」。',
    },
  }),
  st('[S The aim] [V should not be] [C {to:名詞| [V to force] [O a single consensus {関係>a single consensus| [S that] [V erases] [O conflict]}]}].', {
    chunks: [
      ['The aim', '目指すことは'],
      ['should not be to force a single consensus', '一つの合意を押しつけることであってはなりません'],
      ['that erases conflict', '対立を消してしまう（合意を）'],
    ],
    notes: {
      'should not be to force a single consensus': 'to force 以下は「〜を押しつけること」という名詞のまとまりで、be の補語です。',
    },
  }),
  st('[M Rather], [S a mature society] [V keeps] [O multiple perspectives] [C {前| in conversation}] [M {副詞節:時| [接 while] [V refusing] [O {to:名詞| [V to treat] [O evidence] [C {前| as optional}]}]}].', {
    chunks: [
      ['Rather', 'むしろ'],
      ['a mature society', '成熟した社会は'],
      ['keeps multiple perspectives in conversation', 'いくつもの見方を対話の中に保ちます'],
      ['while refusing', '同時に拒みながら（何をかは次へ）'],
      ['to treat evidence as optional', '証拠をあってもなくてもよいものとして扱うことを'],
    ],
    notes: {
      'keeps multiple perspectives in conversation': 'keep ＋ O ＋ 状態 で「Oを〜の状態に保つ」。',
      'while refusing': 'while refusing は while (it is) refusing の形で「〜しながら」。',
    },
  }),
  st('[S Education] [V plays] [O a central role] [M {前| in {動名詞| [V sustaining] [O that discipline]}}], [接 but] [S the task] [V is] [C more demanding {前| than {動名詞| [V adding] [O a few historical dates] [M {前| to a curriculum}]}}].', {
    chunks: [
      ['Education', '教育は'],
      ['plays a central role', '中心的な役割を果たします'],
      ['in sustaining that discipline', 'その規律を保つうえで'],
      ['but', 'しかし'],
      ['the task', 'その務めは'],
      ['is more demanding', 'より骨が折れます（比べる相手は次へ）'],
      ['than adding a few historical dates', 'いくつかの歴史の年号を加えることよりも'],
      ['to a curriculum', '教育課程に（加えることよりも）'],
    ],
    notes: {
      'in sustaining that discipline': 'play a role in -ing で「〜するうえで役割を果たす」。that discipline は、前の段落の最後で述べた「いくつもの見方を対話の中に保ちながら、証拠を軽く扱わない」姿勢を指します。',
    },
    rules: ['contrast-concession', 'comparison-pairs', 'reference-chain'],
  }),
  st('[S Students] [V must learn] [O {疑問詞節| [M how] [S narratives] [V are constructed]}, {疑問詞節| [M why] [S certain voices] [V were ignored]}, and {疑問詞節| [M how] [S apparently neutral categories] [V can reflect] [O older relations {前| of power}]}].', {
    chunks: [
      ['Students must learn', '生徒は学ばなければなりません（何をかは次へ）'],
      ['how narratives are constructed,', '物語がどのように組み立てられるか'],
      ['why certain voices were ignored,', 'なぜ特定の声が無視されたのか'],
      ['and how apparently neutral categories', 'そして一見中立的な分類が'],
      ['can reflect older relations of power', 'どのように古い力関係を映し出しうるのか（を）'],
    ],
    notes: {
      'how narratives are constructed,': '三つの疑問詞のまとまりが並び、すべて learn の目的語です。',
    },
  }),
  st('[S {動名詞| [V Comparing] [O conflicting accounts]}] [V can help] [O students] [C {原形| [V see] [O {that節| [接 that] [S disagreement] [V is not] [C the same {前| as ignorance}]}]}].', {
    chunks: [
      ['Comparing conflicting accounts', '食い違う説明を比べることは'],
      ['can help students see', '生徒が分かるのを助けることができます（何をかは次へ）'],
      ['that', '〜ということを'],
      ['disagreement is not the same as ignorance', '意見が分かれることは無知と同じではない（ということを）'],
    ],
    notes: {
      'Comparing conflicting accounts': 'Comparing 以下は「〜を比べること」という動名詞のまとまりで、文の主語です。',
      'can help students see': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
    },
  }),
  st('[S Two historians] [V may accept] [O the same evidence] [接 yet] [V assign] [O different significance] [M {前| to it}] [M {副詞節:理由| [接 because] [S they] [V ask] [O different questions]}].', {
    chunks: [
      ['Two historians', '二人の歴史家が'],
      ['may accept the same evidence', '同じ証拠を受け入れるかもしれません'],
      ['yet', 'それでも'],
      ['assign different significance', '違う重要さを与えることがあります'],
      ['to it', 'その証拠に'],
      ['because', 'なぜなら'],
      ['they', '二人は'],
      ['ask different questions', '違う問いを立てるからです'],
    ],
    notes: {
      'assign different significance': 'assign は may を共有しています。assign A to B で「AをBに割り当てる」。',
    },
  }),
  st('[S The discipline] [V lies] [M {前| in {動名詞| [V explaining] [O those choices]}, {動名詞| [V confronting] [O contrary evidence]}, and {動名詞| [V stating] [O {疑問詞節| [M where] [S certainty] [V ends]}]}}].', {
    chunks: [
      ['The discipline lies', 'その規律はあります（どこにかは次へ）'],
      ['in explaining those choices,', 'そうした選択を説明することに'],
      ['confronting contrary evidence,', '反対の証拠と向き合うことに'],
      ['and stating', 'そして示すことに（何をかは次へ）'],
      ['where certainty ends', '確かだと言えるのがどこまでかを'],
    ],
    notes: {
      'The discipline lies': 'lie in 〜 で「〜にある」。',
      'in explaining those choices,': 'explaining・confronting・stating の三つの動名詞が前置詞 in の目的語として並んでいます。',
    },
  }),
  st('[M {前| At the same time}], [S they] [V need] [O intellectual habits {関係>intellectual habits| [S that] [V prevent] [O skepticism] [M {前| from {動名詞| [V turning] [M {前| into cynicism}]}}]}].', {
    chunks: [
      ['At the same time', '同時に'],
      ['they', '生徒たちは'],
      ['need intellectual habits', '知的な習慣を必要としています'],
      ['that prevent skepticism from turning into cynicism', '疑う気持ちが冷笑に変わるのを防ぐ（習慣を）'],
    ],
    notes: {
      they: 'they は、少し前の文に出てきた students（生徒たち）を指します。',
      'that prevent skepticism from turning into cynicism': 'prevent ＋ O ＋ from -ing で「Oが〜するのを防ぐ」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S every account {前| of the past}] [V is dismissed] [C {前| as merely political}]}], [S citizens] [V lose] [O the capacity {to:形容詞>the capacity| [V to distinguish] [O careful revision] [M {前| from deliberate distortion}]}].', {
    chunks: [
      ['If', 'もし'],
      ['every account of the past', '過去についてのあらゆる説明が'],
      ['is dismissed as merely political', '単に政治的なものとして退けられるなら'],
      ['citizens', '市民は'],
      ['lose the capacity', '力を失います（何の力かは次へ）'],
      ['to distinguish careful revision from deliberate distortion', '慎重な見直しと意図的なゆがみを見分ける（力を）'],
    ],
    notes: {
      'is dismissed as merely political': 'dismiss A as B「AをBとして退ける」の受け身です。',
      'to distinguish careful revision from deliberate distortion': 'distinguish A from B で「AとBを見分ける」。',
    },
  }),
  st('[S Digital platforms] [V intensify] [O this risk] [M {副詞節:理由| [接 because] [S they] [V reward] [O speed, emotional certainty, and loyalty {前| to a group}] [M more readily {前| than patient investigation}]}].', {
    chunks: [
      ['Digital platforms', 'デジタルのプラットフォームは'],
      ['intensify this risk', 'この危険を強めます'],
      ['because', 'なぜなら'],
      ['they reward speed, emotional certainty,', 'それらは速さや感情的な確信'],
      ['and loyalty to a group', 'そして集団への忠誠に報いるからです（比べる相手は次へ）'],
      ['more readily than patient investigation', '粘り強い調査よりもたやすく'],
    ],
    notes: {
      'more readily than patient investigation': 'reward A more readily than B で「BよりもAに報いやすい」。',
    },
  }),
  st('[S A rumor {関係>A rumor| [S that] [V confirms] [O a community\'s self-image]}] [V may travel] [M farther {前| than a well-documented study {関係>a well-documented study| [S that] [V complicates] [O it]}}].', {
    chunks: [
      ['A rumor', 'うわさは'],
      ["that confirms a community's self-image", '共同体の自己像を裏づける（うわさは）'],
      ['may travel farther', 'より遠くまで広がるかもしれません（比べる相手は次へ）'],
      ['than a well-documented study', '十分に裏づけられた研究よりも'],
      ['that complicates it', 'その自己像を複雑にする（研究よりも）'],
    ],
    notes: {
      'that complicates it': 'it は a community\'s self-image を指します。',
    },
  }),
  st('[S Some observers] [V respond] [M {前| by {動名詞| [V demanding] [O {that節| [接 that] [S platforms] [V remove] [O misleading historical claims] [M more aggressively]}]}}].', {
    chunks: [
      ['Some observers respond', 'これに対して一部の論者は応じます（どうやってかは次へ）'],
      ['by demanding', '求めることによって（内容は次へ）'],
      ['that platforms', 'プラットフォームが〜するように'],
      ['remove misleading historical claims', '誤解を招く歴史の主張を削除する（ように）'],
      ['more aggressively', 'もっと積極的に'],
    ],
    notes: {
      'that platforms': 'demand that ＋ S ＋ 動詞の原形 で「Sが〜するよう求める」。remove は原形です。',
    },
    rules: ['author-stance', 'that-diagnosis', 'ing-ed-role'],
  }),
  st('[M {副詞節:譲歩| [接 Although] [S such action] [V can limit] [O obvious fabrications]}], [S it] [M also] [V gives] [O1 private companies] [O2 substantial authority {前| over public memory}].', {
    chunks: [
      ['Although', '〜ではあるものの（内容は次へ）'],
      ['such action', 'そうした対応は'],
      ['can limit obvious fabrications', '明らかなでっち上げを抑えられる（ものの）'],
      ['it', 'それは'],
      ['also', 'また'],
      ['gives private companies substantial authority', '民間企業に大きな権限を与えます'],
      ['over public memory', '公共の記憶に対する（権限を）'],
    ],
  }),
  st('[S The alternative] [V is] [C not {to:名詞| [V to abandon] [O moderation]}, but {to:名詞| [V to combine] [O it] [M {前| with accessible evidence, independent review, and explanations {関係>explanations| [O that] [S users] [V can examine] [M {前| rather than merely obey}]}}]}].', {
    chunks: [
      ['The alternative', 'ほかのやり方は'],
      ['is not to abandon moderation,', '投稿の管理をやめることではありません'],
      ['but', 'そうではなく'],
      ['to combine', '組み合わせることです（何と何をかは次へ）'],
      ['it', 'その管理を'],
      ['with accessible evidence, independent review,', '手に入りやすい証拠や独立した審査'],
      ['and explanations', 'そして説明と（どんな説明かは次へ）'],
      ['that users can examine', '利用者が検討できる（説明と）'],
      ['rather than merely obey', 'ただ従うのではなく'],
    ],
    notes: {
      'is not to abandon moderation,': 'moderation はここでは、プラットフォームが投稿や主張を点検・削除する「管理」のことです。not A but B で「AではなくB」。',
      'rather than merely obey': 'examine rather than merely obey で「ただ従うのではなく検討する」。',
    },
  }),
  st('[S A warning label {前| without a visible chain {前| of reasoning}}] [V may suppress] [O circulation] [M {副詞節:対比| [接 while] [V doing] [O little] [M {to:副詞(目的)| [V to strengthen] [O citizens\' judgment]}]}].', {
    chunks: [
      ['A warning label', '警告の表示は'],
      ['without a visible chain of reasoning', '理由のつながりが見えない（表示は）'],
      ['may suppress circulation', '情報が広がるのを抑えるかもしれません'],
      ['while doing little', '一方でほとんど役立ちません（何にかは次へ）'],
      ["to strengthen citizens' judgment", '市民の判断力を強めるのに'],
    ],
    notes: {
      'while doing little': 'do little to do で「〜するのにほとんど役立たない」。while doing は while (it is) doing の形です。',
    },
  }),
  st('[M {前| For this reason}], [S public memory] [V cannot be protected] [M {前| by experts alone}].', {
    chunks: [
      ['For this reason', 'このため'],
      ['public memory cannot be protected', '公共の記憶は守ることができません（だれによってかは次へ）'],
      ['by experts alone', '専門家だけでは'],
    ],
  }),
  st('[S It] [M also] [V requires] [O citizens {関係>citizens| [S who] [V are] [C willing {to:副詞(形容詞)| [V to read] [M {前| beyond headlines}], [V tolerate] [O uncertainty], [接 and] [V revise] [O their views] [M {副詞節:時| [接 when] [S stronger evidence] [V appears]}]}]}].', {
    chunks: [
      ['It also requires citizens', 'それには市民も必要です（どんな市民かは次へ）'],
      ['who are willing', '進んで〜しようとする（市民が。何をかは次へ）'],
      ['to read beyond headlines,', '見出しの先まで読み'],
      ['tolerate uncertainty,', '不確かさに耐え'],
      ['and revise their views', '自分の見方を改めようとする'],
      ['when stronger evidence appears', 'より強い証拠が現れたときに'],
    ],
    notes: {
      'It also requires citizens': 'It は前の文の public memory（を守ること）を指します。',
      'to read beyond headlines,': 'be willing to do で「進んで〜する」。tolerate と revise も to を共有しています。',
    },
  }),
  st('[S This civic dimension] [V explains] [O {疑問詞節| [M why] [S collective memory] [V cannot be measured] [M only {前| by the number {前| of documents {過去分詞>documents| [V preserved]} or people {過去分詞>people| [V reached]}}}]}].', {
    chunks: [
      ['This civic dimension explains', 'この市民的な面は説明しています（何をかは次へ）'],
      ['why collective memory cannot be measured', 'なぜ集合的記憶は測りきれないのかを（何によってかは次へ）'],
      ['only by the number', '数だけでは（何の数かは次へ）'],
      ['of documents preserved', '保存された文書の'],
      ['or people reached', 'あるいは情報が届いた人々の（数だけでは）'],
    ],
    notes: {
      'only by the number': 'cannot … only by 〜 で「〜だけでは…できない」。測れないのではなく、数だけでは足りないという部分否定です。',
      'of documents preserved': 'preserved は documents を後ろから説明する過去分詞です。',
      'or people reached': 'reached は people を後ろから説明する過去分詞で、「（情報が）届いた人々」。',
    },
  }),
  st('[S Its quality] [V depends] [M {前| on {whether節| [接 whether] [S a society] [V can use] [O records] [M {to:副詞(目的)| [V to question] [O comfortable stories], [V recognize] [O obligations], [接 and] [V deliberate] [M {前| about future choices}]}]}}].', {
    chunks: [
      ['Its quality depends', 'その質は左右されます（何にかは次へ）'],
      ['on whether', '〜かどうかに'],
      ['a society can use records', '社会が記録を使える（かどうか）'],
      ['to question comfortable stories,', '都合のよい物語を問い直し'],
      ['recognize obligations,', '義務を認め'],
      ['and deliberate about future choices', 'そして将来の選択についてよく話し合うために'],
    ],
    notes: {
      'Its quality depends': 'Its は collective memory を指します。',
      'to question comfortable stories,': 'recognize と deliberate も to を共有し、三つとも records を使う目的です。',
    },
  }),
  st('[S Remembering], [M {前| in this sense}], [V is not] [C a passive act {前| of storage} but an active practice {前| of civic discipline}].', {
    chunks: [
      ['Remembering,', '覚えておくことは'],
      ['in this sense', 'この意味で'],
      ['is not a passive act of storage', '保存するという受け身の行いではなく'],
      ['but an active practice of civic discipline', '市民としての規律を実践する能動的な営みです'],
    ],
    notes: {
      'is not a passive act of storage': 'not A but B で「AではなくB」。A も B も is の補語です。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S that practice] [V declines]}], [M even] [S perfect archives] [V will not prevent] [O societies] [M {前| from {動名詞| [V losing] [O their ability {to:形容詞>their ability| [V to learn] [M {前| from {what節| [O what] [S they] [M once] [V knew]}}]}]}}].', {
    chunks: [
      ['If that practice declines,', 'もしその実践が衰えれば'],
      ['even perfect archives', '完璧な記録保管所でさえ'],
      ['will not prevent', '防げないでしょう（何をかは次へ）'],
      ['societies from losing their ability', '社会が自分たちの能力を失うのを'],
      ['to learn from what they once knew', 'かつて知っていたことから学ぶ（能力を）'],
    ],
    notes: {
      'If that practice declines,': 'that practice は、前の文の「市民としての規律を実践する営み」を指します。',
      'even perfect archives': 'even は perfect archives を強めて「〜でさえ」。',
      'societies from losing their ability': 'prevent ＋ O ＋ from -ing で「Oが〜するのを防ぐ」。',
      'to learn from what they once knew': 'what は「〜すること・もの」という関係代名詞で、what they once knew が前置詞 from の目的語です。they は societies を指します。',
    },
    rules: ['negation-scope', 'wh-clause', 'ing-ed-role'],
  }),
])
