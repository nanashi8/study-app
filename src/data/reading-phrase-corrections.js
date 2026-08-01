// 自動のSVOCM推定だけでは決められない箇所を、本文を読んで確定した訂正台帳。
// match は現在の連続フレーズ、parts は英語順を保った訂正後の役割・隣接訳。
// 日本語は他の役割の意味を先取りせず、必要なら括弧で係り先を受け直す。

const correction = (match, parts, note, occurrence = 1) => Object.freeze({
  match: Object.freeze(match),
  parts: Object.freeze(parts.map((part) => Object.freeze(part))),
  note,
  occurrence,
})

const closure = (type, opener, governor, clause) => Object.freeze({
  type,
  opener,
  governor,
  clause,
})

const BASE_READING_PHRASE_CORRECTIONS = Object.freeze({
  'On Monday, she has English, music, and science classes.': Object.freeze([
    correction(['she'], [
      { role: 'S', en: 'she', ja: '彼女は' },
    ], '主語Sを「彼女は」と置き、存在構文への言い換えは最後の自然訳で示します。'),
    correction(['has'], [
      { role: 'V', en: 'has', ja: '受けます' },
    ], '授業予定の文脈なので、has を「受けます」と取って対象を次へ保留します。'),
    correction(['English, music, and science classes'], [
      { role: 'O', en: 'English, music, and science classes', ja: '英語・音楽・理科の授業を' },
    ], '三教科の classes 全体が has の目的語Oです。'),
  ]),
  'After lunch, Rina cannot find her blue notebook.': Object.freeze([
    correction(['her blue notebook'], [
      { role: 'O', en: 'her blue notebook', ja: '彼女の青いノートを' },
    ], 'her と blue はともに目的語 notebook を限定します。'),
  ]),
  'Parents may help, but each child should write a name on the model and take it home at noon.': Object.freeze([
    correction(['it'], [
      { role: 'O', en: 'it', ja: 'その模型を' },
    ], 'it は前に出た the model を受ける普通の代名詞Oです。形式目的語ではありません。'),
  ]),
  'Many families come early because the room is not very large.': Object.freeze([
    correction(['is not'], [
      { role: 'V', en: 'is not', ja: '〜ではありません（状態は次へ）' },
    ], '否定は is not で一度だけ示し、補語 large では重ねません。'),
    correction(['very large'], [
      { role: 'C', en: 'very large', ja: 'とても広い状態' },
    ], 'very large は room の状態Cです。否定は前の is not が担います。'),
  ]),
  'It is now possible to store enormous amounts of information at little cost, and many people therefore believe that forgetting has become less likely.': Object.freeze([
    correction(['It'], [
      { role: 'S', en: 'It', ja: 'それは（実際の内容は後ろへ）' },
    ], 'It は形式主語Sです。英語は短い It を先に置き、実際の内容 to store ... を後ろへ送ります。'),
  ]),
  'Children can listen to stories, make small cards, and borrow books about the month\'s topic.': Object.freeze([
    correction(['can', 'listen'], [
      { role: 'V', en: 'can listen', ja: '聞くことができます' },
    ], '助動詞 can と本動詞 listen は一つのVとして読みます。'),
    correction(['make'], [
      { role: 'V', en: 'make', ja: '作ることができます' },
    ], 'make は can を共有する二つ目の本動詞Vです。'),
  ]),
  'This month, the topic is local history.': Object.freeze([
    correction(['This month'], [
      { role: 'M', en: 'This month', ja: '今月は' },
    ], 'This month は文全体の時を示すMで、主語ではありません。'),
  ]),
  'After the talk, children will work in small groups to build a paper model of the station.': Object.freeze([
    correction(['a paper model', 'of the station'], [
      { role: 'O', en: 'a paper model', ja: '紙模型を（内容は次へ）' },
      { role: 'M', en: 'of the station', ja: 'その駅の（紙模型を）' },
    ], '六語を一息にせず、目的語Oの中心語と、それを後ろから限定するMへ分けます。'),
  ]),
  'The library will provide paper and glue, so families do not need to bring craft materials.': Object.freeze([
    correction(['do not need', 'to bring'], [
      { role: 'V', en: 'do not need to bring', ja: '持ってくる必要はありません' },
    ], 'do not need to bring は否定と不定詞までを含む一つの述語Vです。'),
  ]),
  'At first, many students thought the work would be simple, but they soon learned that plants need careful attention.': Object.freeze([
    correction(['the work'], [
      { role: 'S', en: 'the work', ja: 'その作業は' },
    ], 'the work は省略された that が導く内容節の主語Sです。'),
    correction(['simple'], [
      { role: 'C', en: 'simple', ja: '簡単なものだと（考えました）' },
    ], 'simple は the work の状態Cです。括弧で thought の内容へ受け直します。'),
  ]),
  'The students began to understand how temperature, rain, and insects affected the vegetables.': Object.freeze([
    correction(['began'], [
      { role: 'V', en: 'began', ja: '始めました（何を始めたかは次へ）' },
    ], 'began は主節の動詞Vです。始めた内容は、後ろの to understand 以下で示します。'),
    correction(['to understand'], [
      { role: 'V', en: 'to understand', ja: '理解することを（内容は次へ）' },
    ], 'to understand は began の内容となる不定詞Vで、理解する内容は後ろの間接疑問 how ... です。'),
    correction(['how'], [
      { role: 'M', en: 'how', ja: 'どのように' },
    ], 'how は方法を尋ねる疑問副詞Mです。後ろの S→V→O をまとめた間接疑問全体が understand の内容になります。'),
    correction(['temperature, rain'], [
      { role: 'S', en: 'temperature, rain', ja: '気温や雨が' },
    ], 'temperature と rain は insects と並び、affected の複合主語Sを作ります。'),
    correction(['affected'], [
      { role: 'V', en: 'affected', ja: '影響を与えたのか' },
    ], 'affected は間接疑問内の動詞Vです。英語では後ろの the vegetables を目的語Oに取ります。'),
    correction(['the vegetables'], [
      { role: 'O', en: 'the vegetables', ja: '野菜に（どのように影響を与えたのかを）' },
    ], 'the vegetables は affected の目的語Oです。日本語では「野菜に影響を与える」となるため、格は「に」で受け直します。'),
  ]),
  'Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.': Object.freeze([
    correction(['to research'], [
      { role: 'V', en: 'to research', ja: '調べるように' },
    ], 'ask O to do の to research は、them が行うよう求められた動作Vです。'),
  ]),
  'In June, the students noticed that insects were eating the leaves of several plants.': Object.freeze([
    correction(['were eating'], [
      { role: 'V', en: 'were eating', ja: '食べていました（何をかは次へ）' },
    ], '内容節の格助詞を重ねず、進行中の動作Vと目的語の保留を示します。'),
    correction(['the leaves', 'of several plants'], [
      { role: 'O', en: 'the leaves of several plants', ja: 'いくつかの植物の葉を（食べていることに気づきました）' },
    ], 'of several plants は leaves を限定し、括弧で eating と noticed へのつながりを受け直します。'),
  ]),
  'It also gave them a chance to talk with older people who knew many useful farming tips.': Object.freeze([
    correction(['knew'], [
      { role: 'V', en: 'knew', ja: '知っていました' },
    ], 'knew はこの関係詞節の述語Vで、from what の受け直しは不要です。'),
    correction(['many useful farming tips'], [
      { role: 'O', en: 'many useful farming tips', ja: '多くの役立つ農業の知恵を' },
    ], 'many は tips の数量を示し、全体で knew の目的語Oです。'),
  ]),
  'Many museums are trying to become places where teenagers can do more than simply look at objects behind glass.': Object.freeze([
    correction(['are trying', 'to become'], [
      { role: 'V', en: 'are trying to become', ja: '〜になろうとしています（何にかは次へ）' },
    ], 'try to become は一つの述語Vとして読み、変化後の補語 places を次へ保留します。'),
    correction(['can do', 'more than simply look', 'at objects'], [
      { role: 'V', en: 'can do', ja: 'することができます' },
      { role: 'M', en: 'more than simply', ja: '単に〜するだけでなく' },
      { role: 'V', en: 'look at', ja: '見ることも' },
      { role: 'O', en: 'objects', ja: '展示物を' },
    ], 'more than は比較を示し、look at objects は前置詞を含む動詞と目的語に分けます。'),
  ]),
  'During the afternoon, they help families who have small children or visitors who are not used to museums.': Object.freeze([
    correction(['visitors'], [
      { role: 'O', en: 'visitors', ja: '来館者を' },
    ], 'visitors は families と並列された主節 help の目的語Oです。'),
    correction(['are not'], [
      { role: 'V', en: 'are not', ja: '〜ではありません（状態は次へ）' },
    ], 'are not が否定のbe動詞Vで、used の意味は後ろの補語へ残します。'),
    correction(['used to museums'], [
      { role: 'C', en: 'used to museums', ja: '博物館に慣れた状態' },
    ], 'be used to ... で「〜に慣れている」。全体が visitors の状態Cです。'),
  ]),
  'This approach is more useful than giving visitors information that may be incorrect.': Object.freeze([
    correction(['than giving'], [
      { role: 'LINK', en: 'than', ja: '〜するよりも（動作は次へ）' },
      { role: 'V', en: 'giving', ja: '与えます（誰に・何を、は次へ）' },
    ], 'than は比較の合図、giving は比較対象となる動作Vです。'),
    correction(['visitors'], [
      { role: 'O1', en: 'visitors', ja: '来館者に' },
    ], 'giving O1 O2 の受け手に当たる間接目的語O1です。'),
    correction(['information'], [
      { role: 'O2', en: 'information', ja: '情報を' },
    ], 'giving O1 O2 の与える物に当たる直接目的語O2です。'),
  ]),
  'However, many students say the program gives them a useful sense of responsibility.': Object.freeze([
    correction(['the program'], [
      { role: 'S', en: 'the program', ja: 'そのプログラムが' },
    ], 'the program は say の後ろに置かれた内容節の主語Sです。'),
  ]),
  'They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.': Object.freeze([
    correction(['They also'], [
      { role: 'S', en: 'They', ja: '生徒たちは' },
      { role: 'M', en: 'also', ja: 'さらに' },
    ], 'They がS、also が discover を加算するMです。'),
    correction(['discover'], [
      { role: 'V', en: 'discover', ja: '気づきます' },
    ], '加算の意味は前の also で示したため、ここは動作Vだけを訳します。'),
  ]),
  'One student said she had become more confident after answering questions from foreign visitors.': Object.freeze([
    correction(['she'], [
      { role: 'S', en: 'she', ja: '自分は' },
    ], 'she は said の後ろに省略された that節の主語Sです。'),
    correction(['had become'], [
      { role: 'V', en: 'had become', ja: '〜になっていたと（状態は次へ）' },
    ], 'had become は said より前までの変化を示す過去完了Vです。'),
    correction(['questions', 'from foreign visitors'], [
      { role: 'O', en: 'questions from foreign visitors', ja: '外国人来館者からの質問に' },
    ], 'from foreign visitors は questions を限定し、全体が answering の対象です。'),
  ]),
  'If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.': Object.freeze([
    correction(['try', 'to make'], [
      { role: 'V', en: 'try to make', ja: '〜にしようと努めます（何をどんな状態に、は次へ）' },
    ], 'try to make は一つの述語Vとして読み、後ろのOとCへつなぎます。'),
    correction(['clearer'], [
      { role: 'C', en: 'clearer', ja: 'より明確なものに' },
    ], 'make O C のCで、the language の変化後の状態を示します。'),
    correction(['without removing'], [
      { role: 'M', en: 'without removing', ja: '取り除くことなく（対象は次へ）' },
    ], 'without removing 以下は make の仕方を限定するMです。'),
  ]),
  'When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.': Object.freeze([
    correction(['feel'], [
      { role: 'V', en: 'feel', ja: '〜に感じられます（状態は次へ）' },
    ], '主語は exhibitions なので、feel は「展示が感じる」ではなく連結動詞「〜に感じられる」です。'),
  ]),
  'At these events, local volunteers help visitors examine broken things and, when possible, repair them.': Object.freeze([
    correction(['examine'], [
      { role: 'V', en: 'examine', ja: '調べるのを' },
    ], 'help O do の原形動詞 examine は埋め込みのVです。'),
  ]),
  'Supporters say repair cafes offer both environmental and social benefits.': Object.freeze([
    correction(['repair cafes'], [
      { role: 'S', en: 'repair cafes', ja: 'リペアカフェは' },
    ], 'repair cafes は say の後ろに省略された that節の主語Sです。'),
  ]),
  'Families may also save money, which is especially valuable when prices are rising.': Object.freeze([
    correction(['is especially'], [
      { role: 'V', en: 'is', ja: '〜です（状態は次へ）' },
      { role: 'M', en: 'especially', ja: '特に' },
    ], 'is がV、especially が補語 valuable の程度を示すMです。'),
    correction(['valuable'], [
      { role: 'C', en: 'valuable', ja: '価値がある状態' },
    ], 'which の内容を説明する補語Cです。'),
  ]),
  'Some modern products are also designed so that they are difficult to open without special tools.': Object.freeze([
    correction(['so', 'that'], [
      { role: 'LINK', en: 'so that', ja: '〜するように' },
    ], 'so that は結果となる節を一まとまりで導く接続表現です。'),
  ]),
  'For example, several train stations have introduced sensors that measure how crowded each platform is.': Object.freeze([
    correction(['how'], [
      { role: 'M', en: 'how', ja: 'どれほど（状態は次へ）' },
    ], 'how は方法ではなく、crowded の程度を尋ねるM「どれほど」です。'),
    correction(['crowded'], [
      { role: 'C', en: 'crowded', ja: '混雑した状態かというと' },
    ], 'crowded は each platform の混雑度を示す補語Cです。'),
    correction(['each platform'], [
      { role: 'S', en: 'each platform', ja: 'それぞれのホームが' },
    ], 'each platform は間接疑問 how crowded ... is の主語Sです。'),
  ]),
  'Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.': Object.freeze([
    correction(['comfortable'], [
      { role: 'C', en: 'comfortable', ja: '快適な状態に' },
    ], 'keep O C のCで、rooms の状態を示します。'),
    correction(['while using'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      { role: 'V', en: 'using', ja: '使います（何をかは次へ）' },
    ], 'while は同時進行を導く接続、using はその節の動作Vです。'),
    correction(['less energy than', 'older equipment'], [
      { role: 'O', en: 'less energy', ja: 'より少ないエネルギーを' },
      { role: 'LINK', en: 'than', ja: '〜よりも' },
      { role: 'M', en: 'older equipment', ja: '古い設備と比べて' },
    ], 'less A than B の比較を、対象A・比較の合図・比較対象Bへ分けます。'),
  ]),
  'There is also a social problem that is easy to overlook.': Object.freeze([
    correction(['There', 'is'], [
      { role: 'V', en: 'There is', ja: 'あります（何があるかは次へ）' },
    ], 'There is は存在構文の入口です。there を場所の「そこ」と訳さず、実質主語を後ろへ置く英語の形を説明します。'),
    correction(['also a social problem'], [
      { role: 'M', en: 'also', ja: 'さらに' },
      { role: 'S', en: 'a social problem', ja: '社会的な問題が' },
    ], '存在構文で also は追加M、a social problem が実質主語Sです。'),
    correction(['easy', 'to overlook'], [
      { role: 'C', en: 'easy to overlook', ja: '見落としやすい状態' },
    ], 'easy to do 全体が that の指す問題の状態Cで、「見落としやすい」と読みます。'),
  ]),
  'City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.': Object.freeze([
    correction(['need', 'to ask'], [
      { role: 'V', en: 'need to ask', ja: '問う必要があります' },
    ], 'need to ask は「問う必要がある」という一つの述語Vです。'),
    correction(['might be', 'left out'], [
      { role: 'V', en: 'might be left out', ja: '取り残されるかもしれないのか' },
    ], 'might be left out は受動態の助動詞群を含む一つのVです。'),
  ]),
  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': Object.freeze([
    correction(['it'], [
      { role: 'O', en: 'it', ja: 'それを' },
    ], 'make O C の it は形式目的語Oです。実際の長い内容は後ろの to improve ... / decide ... に置かれています。'),
    correction(['decide'], [
      { role: 'V', en: 'decide', structureEn: '(to) decide', ja: '判断することを（内容は次へ）' },
    ], 'to improve a design と (to) decide that ... が or で並列します。二つ目の to は共通なので省略され、decide も不定詞の内容です。'),
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '次の内容だと（中身は次へ）' },
    ], 'that は decide の目的語となる内容節を導く接続詞です。'),
    correction(['better'], [
      { role: 'M', en: 'better', ja: 'よりうまく（機能するだろう）' },
    ], 'better は would work を修飾し、括弧では「よりうまく機能するだろう」までだけを受け直します。decide の意味は前のフレーズで示します。'),
  ]),
  'In the past, local governments often treated floods, heat waves, and water shortages as separate problems.': Object.freeze([
    correction(['water shortages'], [
      { role: 'O', en: 'water shortages', ja: '水不足も' },
    ], 'water shortages は floods, heat waves と並列された treated の目的語Oです。'),
    correction(['as separate problems'], [
      { role: 'C', en: 'as separate problems', ja: '互いに別の問題として' },
    ], 'treat O as C の目的格補語Cで、列挙された災害を何として扱ったか示します。'),
  ]),
  'Similarly, installing powerful air conditioners in public buildings may protect residents during heat waves, yet it can increase energy demand when the power supply is already under pressure.': Object.freeze([
    correction(['powerful', 'air conditioners'], [
      { role: 'O', en: 'powerful air conditioners', ja: '強力なエアコンを' },
    ], 'powerful は air conditioners を限定し、全体が installing の目的語Oです。'),
    correction(['under pressure'], [
      { role: 'C', en: 'under pressure', ja: '大きな負担を受けている状態' },
    ], 'be under pressure で主語の状態を示す補語Cです。'),
  ]),
  'They provide shade, absorb rainwater, improve air quality, and make streets more pleasant for walking.': Object.freeze([
    correction(['more pleasant'], [
      { role: 'C', en: 'more pleasant', ja: 'もっと快適な状態に' },
    ], 'make O C のCで streets の変化後の状態を示します。'),
  ]),
  'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.': Object.freeze([
    correction(['maladaptation'], [
      { role: 'C', en: 'maladaptation', ja: '「不適応」と' },
    ], 'call O C のCで、a problem に与える名称です。'),
  ]),
  'Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.': Object.freeze([
    correction(['places'], [
      { role: 'O', en: 'places', ja: '場所も' },
    ], 'places は dangerous intersections, hot streets と並列された map の目的語Oです。'),
    correction(['to map'], [
      { role: 'V', en: 'to map', ja: '地図に記すように' },
    ], 'invite O to do の to map は residents が行うよう呼びかけられる動作Vです。'),
  ]),
  'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
    ], 'that は see の目的語となる内容節を導きます。'),
  ]),
  'Local knowledge also helps officials identify failures that computer models miss.': Object.freeze([
    correction(['identify'], [
      { role: 'V', en: 'identify', ja: '見つけるのを' },
    ], 'help O do の原形動詞 identify は埋め込みのVです。'),
  ]),
  'The financial side of adaptation is equally difficult.': Object.freeze([
    correction(['The financial side', 'of adaptation'], [
      { role: 'S', en: 'The financial side', ja: '財政面は' },
      { role: 'M', en: 'of adaptation', ja: '適応についての（財政面は）' },
    ], '主語Sの中心 side と、それを後ろから限定する of adaptation のMへ分けます。'),
    correction(['is equally'], [
      { role: 'V', en: 'is', ja: '〜です（状態は次へ）' },
      { role: 'M', en: 'equally', ja: '同じように' },
    ], 'is がV、equally が difficult の程度を示すMです。'),
    correction(['difficult'], [
      { role: 'C', en: 'difficult', ja: '難しい状態' },
    ], 'difficult は状態Cだけを訳し、equally の意味を重ねません。'),
  ]),
  'A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.': Object.freeze([
    correction(['resilience seriously'], [
      { role: 'O', en: 'resilience', ja: '回復力を' },
      { role: 'M', en: 'seriously', ja: '真剣に' },
    ], 'takes の対象 resilience と、その程度 seriously を役割別に分けます。'),
    correction(['rather than only', 'during the year'], [
      { role: 'LINK', en: 'rather than', ja: '〜という期間ではなく（期間は次へ）' },
      { role: 'M', en: 'only during the year', ja: 'その年の間だけ（ではなく、長期間にわたって）' },
    ], 'rather than は動作でなく期間を対比します。over a long period と only during the year を対応させ、「導入年だけではなく長期間にわたり評価する」と読みます。'),
  ]),
  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': Object.freeze([
    correction(['less'], [
      { role: 'M', en: 'less', ja: 'より少なく（比較は続く）' },
    ], 'less ... than ... の比較前半を予告し、比較対象を後ろへ保留します。'),
    correction(['as relevant'], [
      { role: 'C', en: 'as relevant', ja: '関連があるものとして' },
    ], 'present A as C の as relevant は、提示されるものをどう位置づけるか示す補語Cです。what節全体は by の対象を含むMです。'),
  ]),
  'Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.': Object.freeze([
    correction(['is not merely'], [
      { role: 'V', en: 'is not', ja: '〜ではありません（内容は次へ）' },
      { role: 'M', en: 'merely', ja: '単に' },
    ], 'is not が否定のV、merely が範囲を「単に」と限定するMです。'),
    correction(['the retention'], [
      { role: 'C', en: 'the retention', ja: '保持' },
    ], 'the retention は主語を説明する補語Cで、merely の意味を重ねません。'),
    correction(['intelligible and discoverable'], [
      { role: 'C', en: 'intelligible and discoverable', ja: '理解でき、見つけられる状態に' },
    ], 'make O C のCで data の状態を二つ並列します。'),
  ]),
  'Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so that they can protect records from temporary political pressure.': Object.freeze([
    correction(['so', 'that'], [
      { role: 'LINK', en: 'so that', ja: '〜するために（内容は次へ）' },
    ], 'so that は目的節を一まとまりで導きます。'),
    correction(['can protect'], [
      { role: 'V', en: 'can protect', ja: '守ることができます（何をかは次へ）' },
    ], 'can protect は目的節内の可能を表すVで、so that の目的を重ねません。'),
  ]),
  'Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.': Object.freeze([
    correction(['decisions', 'about selection, description', 'and', 'access'], [
      { role: 'S', en: 'decisions', ja: '決定が（内容は次へ）' },
      { role: 'M', en: 'about selection, description, and access', ja: '選択・記述・アクセスについての（決定が）' },
    ], '六語を一息にせず、主語Sの中心語と、それを後ろから限定するMへ分けます。'),
  ]),
  'Nor does greater participation automatically guarantee fairness.': Object.freeze([
    correction(['Nor'], [
      { role: 'LINK', en: 'Nor', ja: 'また〜でもありません' },
    ], 'Nor は前文の否定に追加し、後ろで助動詞倒置を起こします。'),
    correction(['does'], [
      { role: 'V', en: 'does', ja: '〜することも（内容は次へ）' },
    ], 'does は疑問ではなく、Nor による倒置で前置された助動詞Vです。'),
    correction(['guarantee'], [
      { role: 'V', en: 'guarantee', ja: '保証します' },
    ], '否定は Nor で示したため、ここでは本動詞の意味だけを取ります。'),
  ]),
  'Comparing conflicting accounts can help students see that disagreement is not the same as ignorance.': Object.freeze([
    correction(['see'], [
      { role: 'V', en: 'see', ja: '理解するのを' },
    ], 'help O do の原形動詞 see は埋め込みのVです。'),
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
    ], 'that は see の目的語となる内容節を導きます。'),
    correction(['as ignorance'], [
      { role: 'M', en: 'as ignorance', ja: '無知と同じものとして' },
    ], 'the same as ... の比較対象を示すMで、OをCとして扱う as ではありません。'),
  ]),
  'Some observers respond by demanding that platforms remove misleading historical claims more aggressively.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜するように（要求内容は次へ）' },
    ], 'that は demanding の要求内容を示す内容節を導きます。'),
    correction(['remove'], [
      { role: 'V', en: 'remove', ja: '削除することを' },
    ], 'remove は that節内の述語Vです。'),
  ]),
  'The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.': Object.freeze([
    correction(['is not', 'to abandon', 'moderation'], [
      { role: 'V', en: 'is not', ja: '〜ではありません（内容は次へ）' },
      { role: 'C', en: 'to abandon', ja: '放棄することでは（何をかは次へ）' },
      { role: 'O', en: 'moderation', ja: '節度を（放棄することではなく）' },
    ], 'be動詞 is not の主格補語は to abandon ... という不定詞内容です。to abandon を主節の本動詞とは扱いません。'),
    correction(['but', 'to combine'], [
      { role: 'LINK', en: 'but', ja: 'そうではなく' },
      { role: 'C', en: 'to combine', ja: '組み合わせることです（何をかは次へ）' },
    ], 'not to abandon A but to combine A with B の対比で、二つの不定詞内容が補語Cとして並列されます。'),
    correction(['it'], [
      { role: 'O', en: 'it', ja: 'それを' },
    ], 'it は前に出た moderation（節度）を受ける普通の代名詞Oです。形式目的語ではありません。'),
    correction(['explanations that'], [
      { role: 'M', en: 'explanations', ja: '説明とも' },
      { role: 'O', en: 'that', ja: 'そしてその説明を' },
    ], 'explanations は共通する with の並列対象M、that は can examine の目的語を兼ねる関係代名詞Oです。'),
  ]),
  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': Object.freeze([
    correction(['to learn'], [
      { role: 'V', en: 'to learn', ja: '学ぶための（能力を）' },
    ], 'to learn は ability の内容を後ろから示す不定詞です。係り先の「能力」を括弧で受け直します。'),
    correction(['they'], [
      { role: 'S', en: 'they', ja: '社会が' },
    ], 'they は what 節内の主語Sで、what 節全体は前置詞 from の対象です。'),
    correction(['once'], [
      { role: 'M', en: 'once', ja: 'かつて' },
    ], 'once は条件の「いったん」ではなく、過去の時を表すM「かつて」です。'),
    correction(['knew'], [
      { role: 'V', en: 'knew', ja: '知っていた（ことから）' },
    ], 'knew は what they once knew の述語Vです。what 節全体で「社会がかつて知っていたこと」となり、from へつながります。'),
  ]),
  'It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.': Object.freeze([
    correction(['are willing'], [
      { role: 'V', en: 'are', ja: '〜です（状態は次へ）' },
      { role: 'C', en: 'willing', ja: '進んで行う姿勢のある' },
    ], 'are がV、willing が citizens の状態を説明するCです。'),
  ]),
  'A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.': Object.freeze([
    correction(['unreadable'], [
      { role: 'C', en: 'unreadable', ja: '読めない状態' },
    ], 'unreadable は become の補語Cだけを訳し、変化や可能性は前のVへ重ねません。'),
  ]),
  'More subtly, platforms can revise the categories and rankings through which users encounter material without deleting a single record.': Object.freeze([
    correction(['a single record'], [
      { role: 'O', en: 'a single record', ja: '一つの記録さえ（削除せずに）' },
    ], 'a single record は deleting の目的語Oです。without の否定を括弧で受け直します。'),
  ]),
  'That autonomy remains essential, but it can also be misused if institutions avoid scrutiny by describing all criticism as interference.': Object.freeze([
    correction(['remains'], [
      { role: 'V', en: 'remains', ja: '〜のままです（状態は次へ）' },
    ], 'remains は物理的な「残る」ではなく、状態が続く連結動詞Vです。'),
    correction(['essential'], [
      { role: 'C', en: 'essential', ja: '不可欠な状態' },
    ], 'essential は That autonomy の状態Cです。'),
    correction(['as interference'], [
      { role: 'C', en: 'as interference', ja: '干渉として' },
    ], 'describe O as C の目的格補語Cで、all criticism を何と説明するか示します。'),
  ]),
  'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.': Object.freeze([
    correction(['and'], [
      { role: 'LINK', en: 'and', ja: 'そして' },
    ], 'and は三つ目の決定内容を加える接続だけを訳します。共有される must decide は解説で示します。'),
  ]),
  'Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.': Object.freeze([
    correction(['transparent reasons, opportunities'], [
      { role: 'O', en: 'transparent reasons', ja: '透明性のある理由を' },
      { role: 'O', en: 'opportunities', ja: '機会も' },
    ], 'transparent は reasons だけを限定します。reasons と opportunities は include の並列目的語Oです。'),
    correction(['to hear'], [
      { role: 'V', en: 'to hear', ja: '聞くための（努力も）' },
    ], 'to hear は efforts の内容を示す不定詞Vです。people の意味を先取りしません。'),
    correction(['people'], [
      { role: 'O', en: 'people', ja: '人々を' },
    ], 'people は hear の目的語Oで、「声」を重ねません。'),
  ]),
  'At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.': Object.freeze([
    correction(['skepticism from turning'], [
      { role: 'O', en: 'skepticism', ja: '懐疑が' },
      { role: 'M', en: 'from turning', ja: '変わるのを' },
    ], 'prevent O from doing のOとfrom動名詞を役割単位へ分けます。'),
    correction(['into cynicism'], [
      { role: 'C', en: 'into cynicism', ja: '冷笑へと' },
    ], 'turn O into C の変化後の状態Cです。'),
  ]),
  'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.': Object.freeze([
    correction(['they'], [
      { role: 'S', en: 'they', ja: 'それらは' },
    ], 'they は because 節の主語Sです。理由の意味は前の because が担います。'),
  ]),
  'A rumor that confirms a community\'s self-image may travel farther than a well-documented study that complicates it.': Object.freeze([
    correction(['may travel'], [
      { role: 'V', en: 'may travel', ja: '広がるかもしれません' },
    ], 'travel はここではうわさが「広がる・伝わる」という動作Vで、省略しません。'),
  ]),
  'Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.': Object.freeze([
    correction(['depends'], [
      { role: 'V', en: 'depends', ja: '決まります（条件は次へ）' },
    ], 'depends は「頼る」ではなく、質が後ろの条件によって決まるというVです。'),
    correction(['on whether'], [
      { role: 'M', en: 'on whether', ja: '〜かどうかで' },
    ], 'on whether は depends の条件を示すMで、「〜かどうかで決まる」とつなぎます。'),
    correction(['recognize'], [
      { role: 'V', en: 'recognize', ja: '認識することができ' },
    ], 'recognize は can use と並列された目的内容の動詞Vです。'),
    correction(['deliberate'], [
      { role: 'V', en: 'deliberate', ja: '熟議することができるか' },
    ], 'deliberate も並列された動詞Vです。'),
  ]),
  'Please ask a teacher near the front door if you have any questions.': Object.freeze([
    correction(['you'], [
      { role: 'S', en: 'you', ja: 'あなたが' },
    ], 'you は if節の主語Sです。'),
    correction(['have'], [
      { role: 'V', en: 'have', ja: '持っているなら（何をかは次へ）' },
    ], 'have を英語のVとして先に仮置きし、目的語 questions を次へ保留します。'),
    correction(['any questions'], [
      { role: 'O', en: 'any questions', ja: '何か質問を' },
    ], 'any questions は have の目的語Oです。自然訳では「質問があれば」とまとめます。'),
  ]),
  'They can repair small problems, but they cannot replace expensive parts.': Object.freeze([
    correction(['small problems'], [
      { role: 'O', en: 'small problems', ja: '小さな不具合を' },
    ], 'small problems は repair の目的語Oです。'),
  ]),
  'Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.': Object.freeze([
    correction(['instead of simply leaving'], [
      { role: 'LINK', en: 'instead of', ja: '〜する代わりに（動作は次へ）' },
      { role: 'M', en: 'simply', ja: '単に' },
      { role: 'V', en: 'leaving', ja: '置いていきます（何を・どこに、は次へ）' },
    ], 'instead of は対照の入口、simply は程度M、leaving は動作Vです。'),
  ]),
  'For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.': Object.freeze([
    correction(['while pushing water toward', 'a poorer neighborhood'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      { role: 'V', en: 'pushing', ja: '押しやります（何をかは次へ）' },
      { role: 'O', en: 'water', ja: '水を' },
      { role: 'M', en: 'toward a poorer neighborhood', ja: 'より貧しい地域へ' },
    ], 'while が対比節を導き、pushing・water・toward ... をV・O・Mに分けます。'),
    correction(['downstream'], [
      { role: 'M', en: 'downstream', ja: 'さらに下流へ' },
    ], 'downstream は方向を足すMだけを訳し、主語やbe動詞を補いません。'),
  ]),
  'Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.': Object.freeze([
    correction(['not only'], [
      { role: 'LINK', en: 'not only', ja: '一つ目だけでなく' },
    ], 'not only は検討する一つ目の内容を導きます。'),
    correction(['but also'], [
      { role: 'LINK', en: 'but also', ja: 'さらに二つ目として' },
    ], 'but also は二つ目の how 節を追加し、not only の意味を重ねません。'),
  ]),
  'A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens\' judgment.': Object.freeze([
    correction(['while doing little'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（内容は次へ）' },
      { role: 'V', en: 'doing little', ja: 'ほとんど役立ちません（何にかは次へ）' },
    ], 'while は対比を導き、doing little は「ほとんど効果がない」という述語Vです。'),
    correction(['doing little', 'to strengthen'], [
      { role: 'V', en: 'doing little to strengthen', ja: 'ほとんど強めません（何をかは次へ）' },
    ], 'do little to strengthen を四語の述語Vとして読み、後ろの目的語へ直接つなぎます。'),
  ]),
  'The cooking staff had to throw the leftovers away, even though most of the food was still fresh.': Object.freeze([
    correction(['had to throw'], [
      { role: 'V', en: 'had to throw', ja: '〜しなければなりませんでした（動作はawayで完成）' },
    ], 'throw は後置された away と組んで「捨てる」になるため、ここでは動作を保留します。'),
    correction(['the leftovers away'], [
      { role: 'O', en: 'the leftovers', ja: '残り物を' },
      {
        role: 'M',
        en: 'away',
        ja: '捨てなければなりませんでした',
        particleBinding: {
          type: 'separable-phrasal-verb',
          verb: 'had to throw',
          particle: 'away',
          object: 'the leftovers',
          meaning: 'throw away',
        },
        specialGrammar: ['phrasal-particle'],
      },
    ], 'away は独立動詞ではなく、目的語 the leftovers を挟んで throw away「捨てる」を完成する句動詞の小辞Mです。'),
    correction(['was still'], [
      { role: 'V', en: 'was', ja: '〜でした（状態は次へ）' },
      { role: 'M', en: 'still', ja: 'まだ' },
    ], 'was がV、still が継続を示すMです。'),
    correction(['fresh'], [
      { role: 'C', en: 'fresh', ja: '新鮮な状態' },
    ], 'still の意味を重ねず、food の状態Cだけを訳します。'),
  ]),
  'Many younger students said the usual portions were too large, while some older students wanted more food after sports practice.': Object.freeze([
    correction(['the usual portions'], [
      { role: 'S', en: 'the usual portions', ja: 'いつもの量は' },
    ], 'the usual portions は said の後ろに省略された that節の主語Sです。'),
  ]),
  'The class then measured the amount of rice, vegetables, and bread left each day for two weeks.': Object.freeze([
    correction(['of rice, vegetables'], [
      { role: 'M', en: 'of rice, vegetables', ja: 'ご飯と野菜の（量を）' },
    ], 'of rice, vegetables は amount の内容を後ろから限定するMです。'),
    correction(['bread'], [
      { role: 'M', en: 'bread', ja: 'パンの（量も）' },
    ], 'bread は rice, vegetables と並列され、amount を限定する of の対象です。'),
    correction(['left each day'], [
      { role: 'M', en: 'left each day', ja: '毎日残された（ご飯・野菜・パンの量を）' },
    ], 'left each day は amount 全体を後ろから限定する分詞Mで、別の目的語ではありません。'),
  ]),
  'A science class decided to study the problem instead of simply asking everyone to eat more.': Object.freeze([
    correction(['instead of simply asking'], [
      { role: 'LINK', en: 'instead of', ja: '〜する代わりに（動作は次へ）' },
      { role: 'M', en: 'simply', ja: '単に' },
      { role: 'V', en: 'asking', ja: '求めます（誰に何をするように、は次へ）' },
    ], 'instead of・simply・asking を接続・修飾・動作の役割単位へ分けます。'),
  ]),
  'They discovered that waste was greatest on days when every student received the same large portion.': Object.freeze([
    correction(['greatest'], [
      { role: 'C', en: 'greatest', ja: '最も多い状態' },
    ], 'greatest は waste の量が最大だったことを示すCです。'),
  ]),
  'The cafeteria also put pictures of both portions near the entrance so students could choose before reaching the counter.': Object.freeze([
    correction(['so'], [
      { role: 'LINK', en: 'so', ja: 'その目的で' },
    ], 'so はここでは結果の「そのため」ではなく、that を省略した目的節 so (that) S could V の入口です。目的の意味は could choose で完成します。'),
    correction(['students'], [
      { role: 'S', en: 'students', ja: '生徒が' },
    ], 'students は目的を表す so (that) 節の主語Sです。省略された that の後ろに置かれています。'),
    correction(['could choose'], [
      { role: 'V', en: 'could choose', ja: '選べるように' },
    ], 'could choose は目的節の動詞Vで、前の so と合わせて「生徒が選べるように」と目的を完成します。'),
    correction(['the counter'], [
      { role: 'M', en: 'the counter', ja: '配膳台に' },
    ], 'the counter は reaching の到達先を示します。'),
  ]),
  'After one month, food waste was almost half of the earlier amount.': Object.freeze([
    correction(['almost', 'half'], [
      { role: 'C', en: 'almost half', ja: 'ほぼ半分の量' },
    ], 'almost は half の程度を示し、全体で food waste の量を説明するCです。'),
  ]),
  'It can begin by giving people clear information and a useful choice.': Object.freeze([
    correction(['can begin'], [
      { role: 'V', en: 'can begin', ja: '始まり得ます（どのようにかは次へ）' },
    ], 'begin は自動詞で、食品ロス削減が「始められる」ではなく「始まり得る」です。'),
    correction(['by giving'], [
      { role: 'M', en: 'by', ja: '〜することによって（動作は次へ）' },
      { role: 'V', en: 'giving', ja: '与えます（誰に・何を、は次へ）' },
    ], 'by は手段Mの入口、giving はその中の動作Vです。'),
    correction(['people'], [
      { role: 'O1', en: 'people', ja: '人々に' },
    ], 'giving O1 O2 の受け手を示す間接目的語O1です。'),
  ]),
  'The students now share their results with nearby schools and encourage them to measure their own waste.': Object.freeze([
    correction(['share'], [
      { role: 'V', en: 'share', ja: '共有しています' },
    ], 'share は主節の動詞Vです。'),
  ]),
  'They explain that every meal uses water, energy, and work before it reaches a plate, so even a small improvement can protect valuable resources.': Object.freeze([
    correction(['work'], [
      { role: 'O', en: 'work', ja: '人の労力も' },
    ], 'work は water, energy と並列された uses の目的語Oです。'),
  ]),
  'Sleep researchers explain that the body clock often changes during the teenage years.': Object.freeze([
    correction(['changes'], [
      { role: 'V', en: 'changes', ja: '変化します' },
    ], 'changes はここでは自動詞で「変化する」です。'),
  ]),
  'Some parents also depend on older children to care for younger family members after school.': Object.freeze([
    correction(['to care', 'for younger family members'], [
      { role: 'V', en: 'to care for', ja: '世話をすることを（誰をかは次へ）' },
      { role: 'O', en: 'younger family members', ja: '年下の家族を（世話することを、年上の子どもに頼ります）' },
    ], 'care for を一つの動詞Vとして保ちます。この不定詞では older children が意味上の主語となり、年下の家族を世話する内容を depend on へつなぎます。'),
  ]),
  'Many teenagers arrive at school feeling tired, even when they try to go to bed at a reasonable time.': Object.freeze([
    correction(['try', 'to go to bed'], [
      { role: 'V', en: 'try to go to bed', ja: '寝ようとします' },
    ], 'try to go to bed は「寝ようとする」という一つの述語Vです。'),
  ]),
  'At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.': Object.freeze([
    correction(['design'], [
      { role: 'V', en: 'design', ja: '設計するのを' },
    ], 'help do の原形動詞 design は埋め込みVです。'),
  ]),
  'Schools need to examine bus routes, club times, and family needs before choosing a new schedule.': Object.freeze([
    correction(['family needs'], [
      { role: 'O', en: 'family needs', ja: '家庭の必要も' },
    ], 'family needs は bus routes, club times と並列された examine の目的語Oです。'),
  ]),
  'They should also teach students that a later start is not an invitation to stay online longer at night.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
    ], 'that は teach の内容を示す内容節を導きます。'),
    correction(['is not'], [
      { role: 'V', en: 'is not', ja: '〜ではありません（内容は次へ）' },
    ], 'is not は否定のbe動詞Vだけを訳し、invitation の意味を先取りしません。'),
    correction(['an invitation'], [
      { role: 'C', en: 'an invitation', ja: '許可（内容は次へ）' },
    ], 'an invitation はここでは「してよいという許可」を表す補語Cです。'),
    correction(['to stay'], [
      { role: 'V', en: 'to stay', ja: 'いてよいという（許可）' },
    ], 'to stay は invitation の具体的内容を示す不定詞Vで、online を先取りしません。'),
    correction(['online longer'], [
      { role: 'M', en: 'online longer', ja: 'オンラインでより長く' },
    ], 'online longer は stay の場所・長さを示すMです。'),
    correction(['at night'], [
      { role: 'M', en: 'at night', ja: '夜に（いてよいという許可ではない）' },
    ], 'at night は時を示し、括弧で内容節全体の否定へ受け直します。'),
  ]),
  'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.': Object.freeze([
    correction(['especially when'], [
      { role: 'LINK', en: 'especially when', ja: '特に〜するときには' },
    ], 'especially when は時の節を強調して導く接続表現です。'),
    correction(['review'], [
      { role: 'V', en: 'review', ja: '見直す' },
    ], 'review はここでは「見直す」という動詞Vです。'),
    correction(['them'], [
      { role: 'O', en: 'them', ja: 'その変更を' },
    ], 'them は careful changes を受ける目的語Oです。'),
  ]),
  'Volunteers record each species they see, the number of birds, the location, and the time.': Object.freeze([
    correction(['they see'], [
      { role: 'S', en: 'they', ja: 'ボランティアが' },
      { role: 'V', en: 'see', ja: '見た' },
    ], '目的格関係代名詞が省略され、they がS、see がVです。'),
  ]),
  'Professional scientists cannot be everywhere at once, especially when they study animals that move across wide areas.': Object.freeze([
    correction(['at once, especially', 'when'], [
      { role: 'M', en: 'at once', ja: '同時には' },
      { role: 'LINK', en: 'especially when', ja: '特に〜するときには' },
    ], 'at once は時のM、especially when は後続節を強調して導く接続表現です。'),
  ]),
  'Many research groups need more information, so they invite ordinary people to join projects known as citizen science.': Object.freeze([
    correction(['known as citizen science'], [
      { role: 'M', en: 'known as citizen science', ja: '市民科学として知られる（活動へ）' },
    ], 'known as citizen science は projects を後ろから限定するMで、invite O C のCではありません。'),
  ]),
  'People also visit places that are easy to reach more often than distant or unsafe locations.': Object.freeze([
    correction(['easy', 'to reach'], [
      { role: 'C', en: 'easy to reach', ja: '到達しやすい状態' },
    ], 'easy to reach 全体が places の状態Cで、「到達しやすい」と一度だけ訳します。'),
  ]),
  'They provide pictures and recordings that help volunteers identify species correctly.': Object.freeze([
    correction(['volunteers'], [
      { role: 'O', en: 'volunteers', ja: 'ボランティアが' },
    ], 'volunteers は help の目的語Oで、後続 identify の意味上の主語です。'),
    correction(['identify'], [
      { role: 'V', en: 'identify', ja: '特定するのを' },
    ], 'help O do の原形動詞 identify は埋め込みVです。'),
  ]),
  'Experts often check unusual reports before the records enter the main database.': Object.freeze([
    correction(['the main database'], [
      { role: 'O', en: 'the main database', ja: '主要なデータベースに' },
    ], 'enter はここでは他動詞で、the main database が英語構造上の目的語Oです。'),
  ]),
  'Scientists contribute research methods that turn those observations into careful conclusions.': Object.freeze([
    correction(['into careful conclusions'], [
      { role: 'C', en: 'into careful conclusions', ja: '慎重な結論へと' },
    ], 'turn O into C の変化後の状態Cです。'),
  ]),
  'Together, they can follow changes in biodiversity and identify places that may need conservation.': Object.freeze([
    correction(['Together, they'], [
      { role: 'M', en: 'Together', ja: '力を合わせて' },
      { role: 'S', en: 'they', ja: '両者は' },
    ], 'Together が方法M、they が主語Sです。協力の意味をcan followへ移しません。'),
    correction(['can follow'], [
      { role: 'V', en: 'can follow', ja: '追うことができます' },
    ], 'can follow は可能を表すVだけを訳します。'),
  ]),
  'This creates a bias because some habitats receive many reports and others receive few.': Object.freeze([
    correction(['receive'], [
      { role: 'V', en: 'receive', ja: '受け取ります（量は次へ）' },
    ], '二つ目の receive も肯定の動詞Vです。少なさは後ろの few が示します。', 2),
    correction(['few'], [
      { role: 'O', en: 'few', ja: 'ごく少数の報告しか（受け取りません）' },
    ], 'few は reports を省略した目的語Oで、括弧の受け直しで少なさを完成させます。'),
  ]),
  'Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.': Object.freeze([
    correction(['replace'], [
      { role: 'V', en: 'replace', ja: '取って代わる' },
    ], '否定は前の not because で示されるため、本動詞だけを直訳します。'),
  ]),
  'The speaker may sound confident and may even mention a scientific study.': Object.freeze([
    correction(['may sound'], [
      { role: 'V', en: 'may sound', ja: '〜に聞こえるかもしれません（状態は次へ）' },
    ], 'sound は連結動詞「〜に聞こえる」で、may が可能性を添えます。'),
    correction(['confident'], [
      { role: 'C', en: 'confident', ja: '自信ありげな状態' },
    ], 'sound の意味を重ねず、話し手の状態を示すCだけを訳します。'),
  ]),
  'Readers can check a university report that describes its methods more easily than a video with no named source.': Object.freeze([
    correction(['more easily than'], [
      { role: 'M', en: 'more easily', ja: 'より容易に（読み手は確認できます）', scope: '' },
      { role: 'LINK', en: 'than', ja: '〜よりも', scope: '' },
    ], 'more easily は関係詞節 describes ではなく主節 can check へ戻ってかかります。than は比較後項を導き、右側では Readers can check が省略されています。'),
    correction(['a video'], [
      { role: 'M', en: 'a video', ja: '一本の動画を確認するよりも', scope: '' },
    ], 'a video は主節 can check の比較対象です。後項を補うと Readers can check a video となり、同じ述語を繰り返さず省略しています。'),
  ]),

  'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.': Object.freeze([
    correction(['not'], [
      { role: 'M', en: 'not', ja: 'すべてを捉えるわけではありません（対象は次へ）' },
    ], 'not every は「すべてではない」という部分否定です。some forms of comprehension は捉える一方、あらゆる能力まで捉えるわけではない、という対比を作ります。'),
    correction(['every capacity'], [
      { role: 'O', en: 'every capacity', ja: 'あらゆる能力を' },
    ], 'every capacity は部分否定 not every の作用域となる captures の目的語Oです。「どの能力も捉えない」という全否定ではありません。'),
  ]),
  'A useful study also compares groups so that researchers can separate the treatment from other possible factors.': Object.freeze([
    correction(['so', 'that'], [
      { role: 'LINK', en: 'so that', ja: '〜するために（内容は次へ）' },
    ], 'so that は目的節を一まとまりで導きます。'),
    correction(['can separate'], [
      { role: 'V', en: 'can separate', ja: '区別できます（何を何からかは次へ）' },
    ], 'can separate は目的節内の可能を表すVで、so that の目的を重ねません。'),
  ]),
  'Without such a comparison, improvement may come from sleep, diet, expectation, or simple chance.': Object.freeze([
    correction(['may come'], [
      { role: 'V', en: 'may come', ja: '生じるのかもしれません' },
    ], 'may come は一般的な可能性を表す現在形で、過去の「生じた」にはしません。'),
  ]),
  'Another common mistake is to treat correlation as proof of cause.': Object.freeze([
    correction(['to treat'], [
      { role: 'C', en: 'to treat', ja: '扱うこと' },
    ], 'to treat ... は be の後ろで主語 Another common mistake の内容を説明する主格補語Cです。'),
    correction(['as proof of cause'], [
      { role: 'C', en: 'as proof of cause', ja: '原因の証明として' },
    ], 'treat O as C のCで、correlation を何として扱うか示します。'),
  ]),
  'Readers should also distinguish an early report from a review that considers many studies.': Object.freeze([
    correction(['from a review'], [
      { role: 'M', en: 'from a review', ja: '総説・レビューと区別して' },
    ], 'review は多数の研究を検討する「総説・レビュー」で、単なる再評価ではありません。'),
  ]),
  'Independent review and a clear statement of possible conflicts make the evidence easier to evaluate.': Object.freeze([
    correction(['make'], [
      { role: 'V', en: 'make', ja: '〜にします（何をどんな状態に、は次へ）' },
    ], 'make O C の動詞Vで、evidence と補語を次へ保留します。'),
    correction(['easier', 'to evaluate'], [
      { role: 'C', en: 'easier to evaluate', ja: '評価しやすい状態に' },
    ], 'easier to evaluate 全体が make O C の補語Cです。'),
  ]),
  'When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.': Object.freeze([
    correction(['should support, not replace,'], [
      { role: 'V', en: 'should support', ja: '支えるべきであり（何をかは次へ）' },
      { role: 'LINK', en: 'not', ja: '〜するのではなく' },
      { role: 'V', en: 'replace', ja: '置き換えます（何をかは次へ）' },
    ], 'support と replace を並列V、not を対照の合図へ分けます。advice は両方が共有する目的語です。'),
  ]),
  'Suppose a survey finds that people who drink more tea report less stress.': Object.freeze([
    correction(['a survey'], [
      { role: 'S', en: 'a survey', ja: 'ある調査が' },
    ], 'a survey は命令文 Suppose の目的語となる内容節の主語Sです。'),
    correction(['people'], [
      { role: 'S', en: 'people', ja: '人々が' },
    ], 'people は that節内の主語Sで、who節に修飾されます。'),
  ]),
  'Income, working hours, and social habits might influence both tea drinking and stress as well.': Object.freeze([
    correction(['both', 'tea drinking', 'and', 'stress'], [
      { role: 'LINK', en: 'both', ja: '次の二つの両方に' },
      { role: 'O', en: 'tea drinking', ja: 'お茶を飲むことに' },
      { role: 'LINK', en: 'and', ja: 'そして' },
      { role: 'O', en: 'stress', ja: 'ストレスにも' },
    ], 'both A and B の枠と二つの目的語Oを英語順に分けます。'),
    correction(['as well'], [
      { role: 'M', en: 'as well', ja: '同じく' },
    ], 'as well は「〜もまた」を加える熟語Mで、as ... as の比較やOをCとするasではありません。'),
  ]),
  'None of these questions gives a quick promise that a claim is true or false.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜という（保証内容は次へ）' },
    ], 'that は promise の内容を示す同格節を導きます。'),
  ]),
  'Instead, they help readers to judge how strong a conclusion can reasonably be.': Object.freeze([
    correction(['to judge'], [
      { role: 'V', en: 'to judge', ja: '判断するのを' },
    ], 'help O to do の不定詞 to judge は埋め込みVです。'),
    correction(['how'], [
      { role: 'M', en: 'how', ja: 'どれほど（状態は次へ）' },
    ], 'how は方法ではなく strong の程度を尋ねるM「どれほど」です。'),
  ]),
  'Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.': Object.freeze([
    correction(['a suitable phone'], [
      { role: 'O', en: 'a suitable phone', ja: '適した電話も' },
    ], 'a bank account と並列された have の目的語Oです。'),
    correction(['reliable internet access'], [
      { role: 'O', en: 'reliable internet access', ja: '信頼できるインターネット接続も' },
    ], 'a bank account と並列された have の目的語Oです。'),
    correction(['the identity documents'], [
      { role: 'O', en: 'the identity documents', ja: '身分証明書も' },
    ], 'or で並列された have の目的語Oです。'),
  ]),
  'Digital records can also help consumers follow their spending and allow small businesses to sell goods online.': Object.freeze([
    correction(['follow'], [
      { role: 'V', en: 'follow', ja: '追うのを' },
    ], 'help O do の原形動詞 follow は consumers が行う埋め込みVです。'),
  ]),
  'A common response is to teach digital skills and provide low-cost accounts.': Object.freeze([
    correction(['to teach'], [
      { role: 'V', en: 'to teach', ja: '教えることであり（対象は次へ）' },
    ], 'to teach は主格補語となる不定詞列の一つ目の動作Vです。provide と共有toで同格に並びます。'),
  ]),
  'For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.': Object.freeze([
    correction(['does', 'more than', 'remove'], [
      { role: 'V', en: 'does more than remove', ja: '取り除くだけにとどまりません（何をかは次へ）' },
    ], 'does more than do は「〜する以上のことをする／〜だけにとどまらない」という一つの述語Vです。'),
  ]),
  'Others can use digital services but struggle with small fees, complex passwords, or interfaces that were not designed for disabilities.': Object.freeze([
    correction(['interfaces that'], [
      { role: 'M', en: 'interfaces', ja: '画面にも' },
      { role: 'S', en: 'that', ja: 'そしてその画面は' },
    ], 'interfaces は with の三つ目の対象、that は関係詞節の主語Sです。'),
  ]),
  'Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.': Object.freeze([
    correction(['leaves'], [
      { role: 'V', en: 'leaves', ja: '残しません（何をかは次へ）' },
    ], 'leave はここでは「去る」ではなく「記録を残す」。no と呼応する否定をVで示します。'),
    correction(['no detailed record'], [
      { role: 'O', en: 'no detailed record', ja: '詳しい記録を何も' },
    ], 'no detailed record は leaves の目的語Oで、否定は leaves と組んで完成します。'),
    correction(['linking'], [
      {
        role: 'M',
        en: 'linking',
        ja: '結び付ける（詳しい記録を。対象は次へ）',
        ingBinding: {
          type: 'postpositive-participle',
          governor: 'no detailed record',
          semanticSubject: 'no detailed record',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'linking は record を後ろから限定する現在分詞Mで、新しい主節や主語を作りません。'),
    correction(['combined'], [
      { role: 'V', en: 'combined', ja: '結合されるかもしれず' },
    ], 'may be を共有する受動態の過去分詞です。'),
    correction(['sold'], [
      { role: 'V', en: 'sold', ja: '売られるかもしれません' },
    ], 'may be を共有する受動態の過去分詞です。'),
  ]),
  'Training provides only limited value in rural areas with weak mobile service or during payment system failures after serious natural disasters and emergencies.': Object.freeze([
    correction(['only', 'limited value'], [
      { role: 'O', en: 'only limited value', ja: '限られた価値しか' },
    ], 'only と呼応し、provides の目的語Oを「限られた価値しか」と取ります。'),
  ]),
  'Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.': Object.freeze([
    correction(['Nor'], [
      { role: 'LINK', en: 'Nor', ja: 'また〜でもありません' },
    ], 'Nor は前文の否定に追加し、後ろで助動詞倒置を起こします。'),
    correction(['should'], [
      { role: 'V', en: 'should', ja: '〜すべきことでも（内容は次へ）' },
    ], 'should は疑問ではなく、Nor による倒置で前置された助動詞Vです。'),
    correction(['mean'], [
      { role: 'V', en: 'mean', ja: '意味します' },
    ], 'mean は inclusion を主語とする本動詞Vです。否定は Nor が担います。'),
    correction(['into a system simply'], [
      { role: 'M', en: 'into a system', ja: '一つの仕組みの中へ' },
      { role: 'M', en: 'simply', ja: '単に' },
    ], 'simply は into a system の一部ではなく、後ろの because が示す理由を「単に」と限定します。'),
    correction(['it'], [
      { role: 'O', en: 'it', ja: 'その仕組みを' },
    ], 'it は前に出た a system を受ける普通の代名詞Oです。形式目的語ではありません。'),
    correction(['efficient'], [
      { role: 'C', en: 'efficient', ja: '効率的だと' },
    ], 'find O C の補語Cで、institutions がその仕組みをどう評価するか示します。'),
  ]),
  'This does not make cash universally superior, but it shows why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone.': Object.freeze([
    correction(['universally superior'], [
      { role: 'C', en: 'universally superior', ja: 'あらゆる場合に優れたものに' },
    ], 'make O C のCで cash の状態を示します。'),
    correction(['rather than technical knowledge alone'], [
      { role: 'M', en: 'rather than technical knowledge alone', ja: '技術知識だけによるのではなく' },
    ], 'rather than は、事情と技術知識の両方ではなく「技術知識だけではない」という対照を示します。'),
  ]),
  'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.': Object.freeze([
    correction(['while encouraging'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      { role: 'V', en: 'encouraging', ja: '促します（何をかは次へ）' },
    ], 'while が同時進行を導き、encouraging がその節の動作Vです。'),
  ]),
  'It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.': Object.freeze([
    correction(['to preserve'], [
      { role: 'C', en: 'to preserve', ja: '保つこと' },
    ], 'to preserve ... は should be の後ろで主語 It の内容を説明する主格補語Cです。It は直前文の The goal を受ける普通の指示代名詞で、形式主語ではありません。'),
    correction(['while removing'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      { role: 'V', en: 'removing', ja: '取り除きます（何をかは次へ）' },
    ], 'while が同時進行を導き、removing がその節の動作Vです。'),
  ]),
  'Critics argue that such rules create costs for merchants who must maintain two payment systems.': Object.freeze([
    correction(['that such rules'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
      { role: 'S', en: 'such rules', ja: 'そのような規則が' },
    ], 'that は内容節の入口、such rules はその節の主語Sです。'),
  ]),
  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': Object.freeze([
    correction(['who'], [
      { role: 'S', en: 'who', ja: 'そしてその人々が' },
    ], 'who は people を受ける人を表す関係代名詞Sです。'),
    correction(['it,'], [
      { role: 'O', en: 'it', ja: 'その革新を' },
    ], 'it は前に出た innovation を受ける普通の代名詞Oです。形式目的語ではありません。'),
  ]),
  'Cash may sometimes appear inefficient as an option, just as backup power can appear wasteful on an ordinary day.': Object.freeze([
    correction(['inefficient'], [
      { role: 'C', en: 'inefficient', ja: '非効率な状態に' },
    ], 'sometimes と appear の意味を重ねず、状態Cだけを訳します。'),
    correction(['as an option,'], [
      { role: 'M', en: 'as an option', ja: '選択肢としては' },
    ], 'as an option は cash を「選択肢という観点で」評価するMで、appear の補語 inefficient と分けます。'),
    correction(['just', 'as'], [
      { role: 'LINK', en: 'just as', ja: 'ちょうど〜と同じように' },
    ], 'just as は比較節を導く一つの接続表現として読みます。'),
  ]),
  'A fixed amount in an envelope stays visible, while digital balances may be divided across several apps and delayed transactions.': Object.freeze([
    correction(['stays'], [
      { role: 'V', en: 'stays', ja: '〜のままです（状態は次へ）' },
    ], 'stays は状態の継続を示す連結動詞Vです。'),
    correction(['visible'], [
      { role: 'C', en: 'visible', ja: '目に見える状態' },
    ], 'visible は金額の状態Cで、stay の意味を重ねません。'),
  ]),
  'A payment system is part of social infrastructure, and infrastructure must remain usable under varied human and technical conditions.': Object.freeze([
    correction(['must remain'], [
      { role: 'V', en: 'must remain', ja: '〜のままでなければなりません（状態は次へ）' },
    ], 'must の義務と remain の状態維持をともに示すVです。'),
    correction(['usable'], [
      { role: 'C', en: 'usable', ja: '使用可能な状態' },
    ], 'usable は infrastructure の状態Cです。'),
  ]),
  'The goal need not be to stop the transition toward digital payment.': Object.freeze([
    correction(['to stop'], [
      { role: 'C', en: 'to stop', ja: '止めること' },
    ], 'to stop ... は need not be の後ろで主語 The goal の内容を説明する主格補語Cです。'),
    correction(['the transition toward', 'digital payment'], [
      { role: 'O', en: 'the transition', ja: '移行を' },
      { role: 'M', en: 'toward digital payment', ja: 'デジタル決済への（移行を）' },
    ], 'transition が目的語Oの中心、toward digital payment が方向を後ろから限定するMです。'),
  ]),
  'A genuinely modern system is not one that eliminates older tools as quickly as possible, but one that combines convenience, privacy, inclusion, and flexibility in practice.': Object.freeze([
    correction(['one'], [
      { role: 'C', en: 'one', ja: '次のようなもの（ではありません）' },
    ], 'one は system を受ける補語Cです。主節の否定は括弧で受け直し、関係詞節を次へ保留します。', 1),
    correction(['that'], [
      { role: 'S', en: 'that', ja: 'そしてそのものが' },
    ], '一つ目の that は one を受け、関係詞節内で eliminates の主語Sになります。', 1),
    correction(['eliminates'], [
      { role: 'V', en: 'eliminates', ja: 'なくします（何をかは次へ）' },
    ], 'eliminates は関係詞節内の肯定の動詞Vです。主節 is not の否定をここへ重ねません。'),
    correction(['older tools as quickly', 'as possible'], [
      { role: 'O', en: 'older tools', ja: '古い道具を' },
      { role: 'M', en: 'as quickly as possible', ja: 'できるだけ早く' },
    ], '目的語 older tools と、as ... as possible の定型Mを役割別に分けます。'),
    correction(['one'], [
      { role: 'C', en: 'one', ja: '別のものです（内容は次へ）' },
    ], '二つ目の one は but の後ろで対照となる補語Cです。', 2),
    correction(['that'], [
      { role: 'S', en: 'that', ja: 'そしてそのものが' },
    ], '二つ目の that も one を受け、関係詞節内で combines の主語Sになります。', 2),
    correction(['convenience,'], [
      { role: 'O', en: 'convenience', ja: '利便性を' },
    ], 'convenience は combines の一つ目の目的語Oです。'),
    correction(['privacy, inclusion'], [
      { role: 'O', en: 'privacy, inclusion', ja: 'プライバシーと包摂を' },
    ], 'privacy と inclusion は convenience に続く並列目的語Oです。'),
  ]),
  'Such indicators give institutions a common language for judging performance across places and over time.': Object.freeze([
    correction(['institutions'], [
      { role: 'O1', en: 'institutions', ja: '機関に' },
    ], 'give O1 O2 の受け手に当たる間接目的語O1です。'),
    correction(['a common language'], [
      { role: 'O2', en: 'a common language', ja: '共通言語を' },
    ], 'give O1 O2 の与える物に当たる直接目的語O2です。'),
    correction(['for judging'], [
      { role: 'M', en: 'for judging', ja: '判断するための（共通言語を）' },
    ], 'for judging は language の用途を示すMで、performance の意味を先取りしません。'),
    correction(['performance'], [
      { role: 'O', en: 'performance', ja: '成果を' },
    ], 'performance は judging の目的語Oです。'),
  ]),
  'They can expose failure that would otherwise remain hidden behind confident speeches or professional authority.': Object.freeze([
    correction(['would otherwise remain'], [
      { role: 'V', en: 'would', ja: '〜でしょう（述語は次へ）' },
      { role: 'M', en: 'otherwise', ja: 'そうでなければ' },
      { role: 'V', en: 'remain', ja: '〜のままです（状態は次へ）' },
    ], 'would・otherwise・remain を助動詞V・条件M・連結動詞Vへ分けます。'),
    correction(['hidden'], [
      { role: 'C', en: 'hidden', ja: '隠れた状態' },
    ], 'hidden は failure の状態Cだけを訳し、remain の「まま」を重ねません。'),
  ]),
  'A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.': Object.freeze([
    correction(['starts'], [
      { role: 'V', en: 'starts', ja: '始まるのかを' },
    ], 'starts は自動詞で、待ち時間の計測が「始まる」ことを示します。'),
  ]),
  'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
    ], '二つ目の that も conclude の内容節を導きます。', 2),
    correction(['should simply', 'be trusted'], [
      { role: 'V', en: 'should simply be trusted', ja: 'ただ信頼されるべきだと' },
    ], '助動詞・副詞・受動態の本動詞を一つのVとして読みます。'),
    correction(['to exercise'], [
      { role: 'V', en: 'to exercise', ja: '行使するように' },
    ], 'be trusted to do の to exercise は、専門家が行うことを信任される動作Vです。'),
  ]),
  'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.': Object.freeze([
    correction(['that it'], [
      { role: 'LINK', en: 'that', ja: '次の内容を示す（証拠を）' },
      { role: 'S', en: 'it', ja: 'その活動が' },
    ], 'that は evidence の内容を導く接続、it は内容節の主語Sです。'),
    correction(['fails'], [
      { role: 'V', en: 'fails', ja: '十分に支えられない' },
    ], 'fail はここでは他動詞で、特定の共同体に十分応えられないことを示します。'),
    correction(['particular communities'], [
      { role: 'O', en: 'particular communities', ja: '特定の共同体を' },
    ], 'particular communities は他動詞 fails の目的語Oです。'),
  ]),
  'Better systems treat indicators as evidence within a process of judgment rather than as automatic verdicts.': Object.freeze([
    correction(['as evidence'], [
      { role: 'C', en: 'as evidence', ja: '証拠として' },
    ], 'treat O as C の一つ目の補語Cです。'),
    correction(['rather than as automatic verdicts'], [
      { role: 'C', en: 'rather than as automatic verdicts', ja: '自動的な判決としてではなく' },
    ], 'rather than が対照する二つ目の as補語Cです。'),
  ]),
  'Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.': Object.freeze([
    correction(['rather than pursue the underlying mission'], [
      { role: 'LINK', en: 'rather than', ja: '〜するよりも（動作は次へ）' },
      { role: 'V', en: 'pursue', ja: '追います（何をかは次へ）' },
      { role: 'O', en: 'the underlying mission', ja: '根本的な使命を' },
    ], 'rather than が比較対照を導き、pursue と目的語をV・Oに分けます。'),
  ]),
  'No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.': Object.freeze([
    correction(['make'], [
      { role: 'V', en: 'make', ja: '〜にします' },
    ], 'make O C のVで、「作る」ではなくOをCの状態にする働きです。'),
    correction(['it'], [
      { role: 'O', en: 'it', ja: 'それを' },
    ], 'make O C の it は形式目的語Oです。実際の内容は後ろの for ... to dominate ... に置かれています。'),
    correction(['harder'], [
      { role: 'C', en: 'harder', ja: 'より難しい状態に' },
    ], 'harder は形式目的語 it の状態を示す目的格補語Cです。'),
  ]),
  'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.': Object.freeze([
    correction(['while hiding'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      { role: 'V', en: 'hiding', ja: '隠します（何をかは次へ）' },
    ], 'while が対比を導き、hiding がその節の動作Vです。'),
  ]),
  'That explanation enables public deliberation about goals instead of limiting debate to technical compliance.': Object.freeze([
    correction(['instead of limiting'], [
      { role: 'LINK', en: 'instead of', ja: '〜する代わりに（動作は次へ）' },
      { role: 'V', en: 'limiting', ja: '限ります（何を・どこまで、は次へ）' },
    ], 'instead of が対照を導き、limiting がその中の動作Vです。'),
  ]),
  'There is also a political question about who bears the burden of being measured.': Object.freeze([
    correction(['There', 'is'], [
      { role: 'V', en: 'There is', ja: 'あります（何があるかは次へ）' },
    ], 'There is は存在構文です。there を場所の「そこ」と訳さず、実質主語を後ろへ置く形を説明します。'),
    correction(['also a political question'], [
      { role: 'M', en: 'also', ja: 'さらに' },
      { role: 'S', en: 'a political question', ja: '政治的な問いが' },
    ], '存在構文で also は追加M、a political question が実質主語Sです。'),
    correction(['about who'], [
      { role: 'M', en: 'about', ja: '〜について（内容は次へ）' },
      { role: 'S', en: 'who', ja: '誰が' },
    ], 'about が問いの対象を導くM、who が bears の主語Sです。'),
  ]),
  'If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.': Object.freeze([
    correction(['rather than strengthen'], [
      { role: 'LINK', en: 'rather than', ja: '〜するのではなく（動作は次へ）' },
      { role: 'V', en: 'strengthen', ja: '強めます（何をかは次へ）' },
    ], 'rather than が対照を導き、strengthen がその動作Vです。'),
  ]),
  'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.': Object.freeze([
    correction(['students'], [
      { role: 'O', en: 'students', ja: '生徒も' },
    ], 'students は discussion, curiosity と並列された neglecting の目的語Oです。'),
  ]),
  'Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.': Object.freeze([
    correction(['informed and humane'], [
      { role: 'C', en: 'informed and humane', ja: '十分な情報に基づき人間的な状態' },
    ], 'remain の補語Cで二つの性質を並列します。'),
    correction(['biased'], [
      { role: 'C', en: 'biased', ja: '偏ったものに' },
    ], 'inconsistent, difficult と並列された become の補語Cです。'),
  ]),
  'The relevant choice is neither perfect numbers nor pure wisdom, because neither exists.': Object.freeze([
    correction(['is'], [
      { role: 'V', en: 'is', ja: '〜です（選択肢は次へ）' },
    ], 'is 自体は肯定のbe動詞Vです。否定は neither ... nor ... の枠で示します。'),
    correction(['neither perfect numbers'], [
      { role: 'LINK', en: 'neither', ja: '一つ目の〜でもなく（内容は次へ）' },
      { role: 'C', en: 'perfect numbers', ja: '完全な数字' },
    ], 'neither が否定並列の一つ目を導き、perfect numbers が補語Cです。'),
    correction(['nor'], [
      { role: 'LINK', en: 'nor', ja: '二つ目の〜でもなく（内容は次へ）' },
    ], 'nor は neither と呼応して二つ目の補語を導きます。'),
    correction(['pure wisdom'], [
      { role: 'C', en: 'pure wisdom', ja: '純粋な英知（でもありません）' },
    ], 'perfect numbers と並列された主格補語Cです。'),
  ]),
  'Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.': Object.freeze([
    correction(['information'], [
      { role: 'M', en: 'information', ja: '情報とも' },
    ], 'information は alongside の三つ目の並列対象Mです。'),
  ]),
  'Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.': Object.freeze([
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '〜ということを（内容は次へ）' },
    ], 'that は reveal の目的語となる内容節を導きます。'),
  ]),
  'Context does not excuse every poor result; it helps institutions distinguish causes that demand different responses.': Object.freeze([
    correction(['distinguish'], [
      { role: 'V', en: 'distinguish', ja: '区別するのを' },
    ], 'help O do の原形動詞 distinguish は埋め込みVです。'),
  ]),
  'Third, organizations must examine how people adapt once a measure carries consequences.': Object.freeze([
    correction(['carries'], [
      { role: 'V', en: 'carries', ja: '伴うようになれば（何をかは次へ）' },
    ], 'carries は「結果を伴う」という他動詞Vで、その語義を落としません。'),
    correction(['consequences'], [
      { role: 'O', en: 'consequences', ja: '結果を' },
    ], 'consequences は carries の目的語Oだけを訳します。'),
  ]),
  'A quiet diagnostic metric can become unreliable after promotion, funding, or punishment depends on it.': Object.freeze([
    correction(['can become'], [
      { role: 'V', en: 'can become', ja: '〜になる可能性があります（状態は次へ）' },
    ], 'can become が状態変化の可能性を示すVです。'),
    correction(['unreliable'], [
      { role: 'C', en: 'unreliable', ja: '信頼できない状態' },
    ], 'unreliable は状態Cだけを訳し、become の変化を重ねません。'),
    correction(['promotion, funding', 'or', 'punishment'], [
      { role: 'S', en: 'promotion, funding, or punishment', ja: '昇進・資金・処罰が' },
    ], '三つの名詞全体が depends の並列主語Sです。'),
  ]),
  'Regular audits should look not only for false reports but also for neglected tasks, displaced risks, and groups that disappear from the data.': Object.freeze([
    correction(['not only for false reports but also'], [
      { role: 'LINK', en: 'not only', ja: '一つ目だけでなく' },
      { role: 'M', en: 'for false reports', ja: '虚偽の報告を対象に' },
      { role: 'LINK', en: 'but also', ja: 'さらに二つ目として' },
    ], 'not only・for句・but also を接続と対象Mの役割単位へ分けます。'),
    correction(['groups that'], [
      { role: 'M', en: 'groups', ja: '集団も' },
      { role: 'S', en: 'that', ja: 'そしてその集団が' },
    ], 'groups は for の並列対象、that は関係詞節の主語Sです。'),
  ]),
  'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.': Object.freeze([
    correction(['changes'], [
      { role: 'V', en: 'changes', ja: '変化するからです' },
    ], 'changes は the behavior を主語とする主節の動詞Vです。'),
  ]),
  'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.': Object.freeze([
    correction(['was', 'chosen'], [
      { role: 'V', en: 'was chosen', ja: '選ばれたのかを' },
    ], 'was chosen は受動態の一つの動詞群Vです。'),
  ]),
  'Frontline workers and vulnerable citizens often supply detailed data, while senior institutions retain discretion over how the numbers are interpreted.': Object.freeze([
    correction(['often supply'], [
      { role: 'M', en: 'often', ja: 'しばしば' },
      { role: 'V', en: 'supply', ja: '提供します' },
    ], 'often が頻度M、supply が本動詞Vです。'),
  ]),
  'Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.': Object.freeze([
    correction(['who'], [
      { role: 'S', en: 'who', ja: 'そしてその人々が' },
    ], 'who は Those を受ける人を表す関係代名詞Sです。'),
    correction(['should therefore', 'be'], [
      { role: 'V', en: 'should therefore be', ja: 'したがって〜であるべきです（状態は次へ）' },
    ], 'should ... be は副詞 therefore を挟む一つの助動詞群Vです。'),
    correction(['including'], [
      { role: 'LINK', en: 'including', ja: '次のものも含めて' },
    ], 'including は追加説明を導く合図で、文の述語Vではありません。'),
  ]),
  'A mature culture of evaluation recognizes that important purposes cannot always be fully quantified.': Object.freeze([
    correction(['cannot always', 'be fully quantified'], [
      { role: 'V', en: 'cannot always be fully quantified', ja: '必ずしも完全には数量化できないと' },
    ], '助動詞の否定から受動態の本動詞までを一つのVとして読みます。'),
  ]),
  'The inability to assign a clean number is not evidence that a value is unreal; it is a warning that judgment must remain visible and contestable.': Object.freeze([
    correction(['must remain'], [
      { role: 'V', en: 'must remain', ja: '〜のままでなければなりません（状態は次へ）' },
    ], 'must の義務と remain の状態維持を示す一つのVです。'),
    correction(['visible and contestable'], [
      { role: 'C', en: 'visible and contestable', ja: '見える形で異議を申し立てられる状態' },
    ], '二つの性質が judgment の補語Cです。'),
  ]),
  'Metrics are most valuable when they create questions rather than close them.': Object.freeze([
    correction(['rather than close'], [
      { role: 'LINK', en: 'rather than', ja: '〜するのではなく（動作は次へ）' },
      { role: 'V', en: 'close', ja: '閉じます（何をかは次へ）' },
    ], 'rather than が対照を導き、close が二つ目の動作Vです。'),
  ]),
  'They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.': Object.freeze([
    correction(['toward patterns'], [
      { role: 'M', en: 'toward patterns', ja: '傾向へ' },
    ], 'toward patterns は attention の向かう先を示すMで、direct の目的語ではありません。'),
  ]),
  'When a measure becomes a substitute for that mission, apparent precision can conceal institutional drift.': Object.freeze([
    correction(['for that mission'], [
      { role: 'M', en: 'for that mission', ja: 'その使命の（代わりとなるもの）' },
    ], 'a substitute for ... で「〜の代わり」。括弧で補語 substitute へ受け直します。'),
  ]),
  'Institutions cannot precisely measure trust, intellectual courage, dignity, and social repair, yet they cannot responsibly ignore these values.': Object.freeze([
    correction(['social repair'], [
      { role: 'O', en: 'social repair', ja: '社会的な修復も' },
    ], 'social repair は trust, courage, dignity と並列された measure の目的語Oです。'),
  ]),
  'Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.': Object.freeze([
    correction(['by publicly stating'], [
      { role: 'M', en: 'by', ja: '〜することによって（動作は次へ）' },
      { role: 'M', en: 'publicly', ja: '公に' },
      { role: 'V', en: 'stating', ja: '示します（何をかは次へ）' },
    ], 'by が手段Mを導き、publicly が方法M、stating が動作Vです。'),
    correction(['from being', 'mistaken', 'for certainty'], [
      { role: 'M', en: 'from being mistaken for certainty', ja: '確実さと取り違えられることを' },
    ], 'prevent O from being mistaken for C を、from以下の受動動名詞句Mとして一息で読みます。'),
  ]),
  'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.': Object.freeze([
    correction(['competing interpretations'], [
      { role: 'M', en: 'competing interpretations', ja: '競合する解釈を越えて' },
    ], 'competing interpretations は across の二つ目の並列対象Mです。'),
  ]),
  'Green Town Library has a special event on the first Saturday of every month.': Object.freeze([
    correction(['Green Town Library'], [
      { role: 'S', en: 'Green Town Library', ja: 'グリーンタウン図書館は' },
    ], '主語Sをそのまま「〜は」と置きます。'),
    correction(['has'], [
      { role: 'V', en: 'has', ja: '開催します' },
    ], '催しの文脈に合わせ、has を「開催します」と前から取ります。'),
    correction(['a special event'], [
      { role: 'O', en: 'a special event', ja: '特別な催しを' },
    ], 'a special event は has の目的語Oです。'),
  ]),
  'They learned that certain flowers attract insects that eat garden pests without harming the vegetables.': Object.freeze([
    correction(['attract'], [
      { role: 'V', en: 'attract', ja: '引き寄せます（何をかは次へ）' },
    ], '内容節の印を重ねず、attract の動作と目的語の保留を示します。'),
    correction(['insects'], [
      { role: 'O', en: 'insects', ja: '昆虫を（ということを学びました）' },
    ], 'attract の目的語を置き、括弧で learned の内容節へ受け直します。'),
  ]),
  'Instead of simply giving the food away, the students visited the center and explained how they had grown it.': Object.freeze([
    correction(['giving'], [
      { role: 'V', en: 'giving', ja: '渡すとして（対象と結果は次へ）' },
    ], 'giving は句動詞 give away の動詞部分Vです。目的語を挟んだ後の away まで意味を保留します。'),
    correction(['the food away'], [
      { role: 'O', en: 'the food', ja: '食べ物を' },
      {
        role: 'M',
        en: 'away',
        ja: 'そのまま譲ってしまう（代わりに）',
        particleBinding: {
          type: 'separable-phrasal-verb',
          verb: 'giving',
          particle: 'away',
          object: 'the food',
          meaning: 'give away',
        },
        specialGrammar: ['phrasal-particle'],
      },
    ], 'away は独立動詞ではなく、目的語 the food を挟んで give away「譲る・手放す」を完成する句動詞の小辞Mです。'),
  ]),
  'The experience taught them that protecting the environment can begin with small daily actions.': Object.freeze([
    correction(['protecting', 'the environment'], [
      { role: 'S', en: 'protecting the environment', ja: '環境を守ることは' },
    ], '三語の動名詞句全体が that節内の主語Sです。'),
    correction(['can begin'], [
      { role: 'V', en: 'can begin', ja: '始まり得ます（どこからかは次へ）' },
    ], 'begin はここでは自動詞で、「始められる」ではなく「始まり得る」です。'),
    correction(['with small daily actions'], [
      { role: 'M', en: 'with small daily actions', ja: '日々の小さな行動から（始まると教えました）' },
    ], 'with は始まりの足掛かりを示し、括弧で begin と taught の内容へ受け直します。'),
  ]),
  'By the end of the project, even the students who had disliked gardening were proud of the result.': Object.freeze([
    correction(['proud', 'of the result'], [
      { role: 'C', en: 'proud of the result', ja: 'その結果を誇りに思っている状態' },
    ], 'proud of ... を切り離さず、were の補語Cとして一つの自然単位にします。'),
  ]),
  'Critics therefore argue that manufacturers should make parts and instructions easier to obtain.': Object.freeze([
    correction(['easier', 'to obtain'], [
      { role: 'C', en: 'easier to obtain', ja: 'より入手しやすい状態に' },
    ], 'easier to obtain 全体が make O C の補語Cです。'),
  ]),
  'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.': Object.freeze([
    correction(['may be'], [
      { role: 'V', en: 'may be', ja: '次の内容である可能性があります' },
    ], 'may be は「最大の価値」の内容に可能性を添えるVで、that節を次へ導きます。'),
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: 'その内容とは（中身は次へ）' },
    ], 'that節全体が may be の補語内容であり、目的格の「ことを」にはしません。'),
    correction(['turn'], [
      { role: 'V', en: 'turn', ja: '変えます（何を何に、は次へ）' },
    ], 'turn O into C の動詞Vとして、名詞化せずOとCへつなぎます。'),
    correction(['into a public lesson'], [
      { role: 'C', en: 'into a public lesson', ja: '社会全体の学びへと' },
    ], 'turn O into C の変化後の状態Cです。'),
  ]),
  'In response, communities in several countries have started events called repair cafes.': Object.freeze([
    correction(['called repair cafes'], [
      { role: 'M', en: 'called repair cafes', ja: 'リペアカフェと呼ばれる（催しを）' },
    ], 'called repair cafes は前の events を後ろから限定するMで、括弧で係り先を受け直します。'),
  ]),
  'Volunteers must refuse jobs that could be dangerous, and replacement parts are sometimes unavailable or too expensive.': Object.freeze([
    correction(['could be'], [
      { role: 'V', en: 'could be', ja: '〜かもしれません（状態は次へ）' },
    ], 'could be が可能性を示すVで、その意味を補語へ重ねません。'),
    correction(['dangerous'], [
      { role: 'C', en: 'dangerous', ja: '危険な状態' },
    ], 'dangerous は jobs の状態Cだけを表します。可能性は前の could が担います。'),
  ]),
  'Cost is still an important factor, and cities must consider whether new systems can be maintained for many years.': Object.freeze([
    correction(['is still'], [
      { role: 'V', en: 'is', ja: '〜です（状態は次へ）' },
      { role: 'M', en: 'still', ja: '依然として' },
    ], 'is がV、still が状態の継続を示すMです。'),
    correction(['an important factor'], [
      { role: 'C', en: 'an important factor', ja: '重要な要因' },
    ], 'still の意味を重ねず、主語を説明するCだけを訳します。'),
  ]),
  'They compare energy use, waiting times, and complaints in different neighborhoods, then publish the results.': Object.freeze([
    correction(['in different neighborhoods,'], [
      { role: 'M', en: 'in different neighborhoods', ja: '異なる地域ごとに（エネルギー使用量・待ち時間・苦情を）' },
    ], 'in different neighborhoods は complaints だけでなく、比較する三項全体の地域差を示すMです。'),
  ]),
  'Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.': Object.freeze([
    correction(['how'], [
      { role: 'M', en: 'how', ja: 'どれほど（状態は次へ）' },
    ], 'how は方法ではなく、modern の程度を示すM「どれほど」です。'),
    correction(['modern'], [
      { role: 'C', en: 'modern', ja: '現代的な状態かというと' },
    ], 'modern は it の見かけの状態Cです。'),
    correction(['appears'], [
      { role: 'V', en: 'appears', ja: '〜に見えるかによって' },
    ], 'appears は連結動詞Vで、how節全体を前の not by へつなぎます。'),
  ]),
  'If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.': Object.freeze([
    correction(['without making people feel'], [
      { role: 'M', en: 'without', ja: '〜することなく（内容は次へ）' },
      { role: 'V', en: 'making', ja: '〜させます（誰に何を感じるかは次へ）' },
      { role: 'O', en: 'people', ja: '人々に' },
      { role: 'V', en: 'feel', ja: '感じることを' },
    ], 'without、making、people、feel をM・V・O・Vの役割境界で分けます。'),
  ]),
  'This process takes time, and it may reveal disagreements about which projects should come first.': Object.freeze([
    correction(['about which projects'], [
      { role: 'M', en: 'about', ja: '〜について（問いは次へ）' },
      { role: 'S', en: 'which projects', ja: 'どの事業が' },
    ], 'about は後続の間接疑問全体を目的語に取る前置詞です。which は projects を限定する疑問限定詞なので、which projects を一つの主語Sとして読み、両語を切り離しません。'),
    correction(['should come', 'first'], [
      { role: 'V', en: 'should come first', ja: '優先されるべきか' },
    ], 'come first は「最初に来る」ではなく「優先される」という一つの述語Vです。'),
  ]),
  'A drainage map may look complete, yet residents may know that blocked street drains regularly send water into a particular apartment building.': Object.freeze([
    correction(['may look'], [
      { role: 'V', en: 'may look', ja: '〜に見えるかもしれません（状態は次へ）' },
    ], 'may が可能性、look が見かけを表す連結動詞Vです。'),
    correction(['complete'], [
      { role: 'C', en: 'complete', ja: '完全な状態' },
    ], 'complete は地図の状態Cだけを訳し、look の意味を重ねません。'),
  ]),
  'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.': Object.freeze([
    correction(['such as training'], [
      { role: 'LINK', en: 'such as', ja: '例えば' },
      { role: 'V', en: 'training', ja: '訓練すること' },
    ], 'such as は例示の入口、training は例の中の動作Vです。'),
  ]),
  'Finally, adaptation plans must remain flexible.': Object.freeze([
    correction(['must remain'], [
      { role: 'V', en: 'must remain', ja: '〜のままでなければなりません（状態は次へ）' },
    ], 'must の必要性と remain の継続を落とさず一つのVとして訳します。'),
    correction(['flexible'], [
      { role: 'C', en: 'flexible', ja: '柔軟な状態（のままで）' },
    ], 'flexible は adaptation plans の状態Cで、括弧で remain へ受け直します。'),
  ]),
  'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.': Object.freeze([
    correction(['Setting', 'review dates'], [
      { role: 'S', en: 'Setting review dates', ja: '見直しの日程を定めること' },
    ], 'Setting review dates は動名詞句全体で、主節 allows の一つ目の主語Sです。内部の目的語を分けて日本語を逆転させず、一つの自然な意味単位にします。'),
    correction(['publishing', 'results'], [
      { role: 'S', en: 'publishing results', ja: '結果を公表することは' },
    ], 'publishing results は一つ目の動名詞句と並列された二つ目の主語Sです。二項全体が allows の複合主語になります。'),
    correction(['without treating revision as failure'], [
      { role: 'M', en: 'without', ja: '〜することなく（内容は次へ）' },
      { role: 'V', en: 'treating', ja: 'みなします（何を何と、は次へ）' },
      { role: 'O', en: 'revision', ja: '見直しを' },
      { role: 'C', en: 'as failure', ja: '失敗として' },
    ], 'without・treating・revision・as failure をM・V・O・Cへ分け、treat O as C を示します。'),
  ]),
  'It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.': Object.freeze([
    correction(['a way to test'], [
      { role: 'O2', en: 'a way', ja: '一つの方法を（内容は次へ）' },
      { role: 'M', en: 'to test', ja: '検証するための（方法を）' },
    ], 'a way が gives の直接目的語O2で、to test は way の内容・用途を後ろから説明する不定詞Mです。名詞と不定詞の役割を一つに隠しません。'),
  ]),
  'As climate conditions remain uncertain, the cities that adapt most successfully will probably be those that combine technical knowledge with public participation.': Object.freeze([
    correction(['remain'], [
      { role: 'V', en: 'remain', ja: '〜のままです（状態は次へ）' },
    ], 'remain は物理的に「残る」ではなく、状態が続くことを示す連結動詞Vです。'),
    correction(['uncertain'], [
      { role: 'C', en: 'uncertain', ja: '不確かな状態' },
    ], 'uncertain は climate conditions の状態Cです。'),
    correction(['those'], [
      { role: 'C', en: 'those', ja: 'そのような都市' },
    ], 'those は the cities を受ける補語Cです。probably の意味は前のV側で一度だけ示します。'),
    correction(['that'], [
      { role: 'S', en: 'that', ja: 'そしてその都市が' },
    ], '一つ目の that は the cities を受ける関係代名詞Sです。', 1),
    correction(['that'], [
      { role: 'S', en: 'that', ja: 'そしてそのような都市が' },
    ], '二つ目の that は those を受ける関係代名詞Sです。', 2),
  ]),
  'Our school has an open day next Saturday.': Object.freeze([
    correction(['Our school'], [
      { role: 'S', en: 'Our school', ja: '私たちの学校は' },
    ], '主語Sをそのまま「〜は」と置きます。'),
    correction(['has'], [
      { role: 'V', en: 'has', ja: '開きます' },
    ], '公開日の文脈に合わせ、has を「開きます」と前から取ります。'),
    correction(['an open day'], [
      { role: 'O', en: 'an open day', ja: '学校公開日を' },
    ], 'an open day は has の目的語Oです。'),
  ]),
  'The program will teach simple traffic rules and show people how to prevent common bicycle accidents.': Object.freeze([
    correction(['to prevent'], [
      { role: 'V', en: 'to prevent', ja: '防ぐことを（何をかは次へ）' },
    ], '疑問の「〜か」を先に閉じず、prevent の動作と目的語の保留を示します。'),
    correction(['common bicycle accidents'], [
      { role: 'O', en: 'common bicycle accidents', ja: 'よくある自転車事故を（どう防ぐか）' },
    ], '目的語を置いた後、括弧で how節の問いへ受け直します。'),
  ]),
  'A police officer will explain why every rider should wear a helmet.': Object.freeze([
    correction(['should wear'], [
      { role: 'V', en: 'should wear', ja: '着けるべきです（何をかは次へ）' },
    ], 'why節の「なぜ」を先に閉じず、動作Vと目的語の保留を示します。'),
    correction(['a helmet'], [
      { role: 'O', en: 'a helmet', ja: 'ヘルメットを（なぜ着けるべきか）' },
    ], '目的語を置いた後、括弧で why節の問いへ受け直します。'),
  ]),
  'Children will also learn the correct place to stop before they cross a busy road.': Object.freeze([
    correction(['the correct place', 'to stop'], [
      { role: 'O', en: 'the correct place to stop', ja: '止まるべき正しい場所を' },
    ], 'to stop は place を限定し、五語全体で learn の目的語Oです。'),
  ]),
  'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.': Object.freeze([
    correction(['as valuable information'], [
      { role: 'C', en: 'as valuable information', ja: '価値ある情報として' },
    ], '受動態 be treated as C の補語Cで、daily experience が何として扱われるか示します。'),
  ]),
  'Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.': Object.freeze([
    correction(['as decisive action'], [
      { role: 'C', en: 'as decisive action', ja: '決定的な行動として' },
    ], '受動態 announce O as C の補語Cで、projects が何として発表されるか示します。'),
  ]),
  'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.': Object.freeze([
    correction(['as heritage'], [
      { role: 'C', en: 'as heritage', ja: '遺産として' },
    ], 'be seen as C の一つ目の補語Cで、monument が何に見えるか示します。'),
    correction(['as exclusion'], [
      { role: 'C', en: 'as exclusion', ja: '排除の象徴として' },
    ], 'and で並ぶ be seen as C の二つ目の補語Cで、別の見方を示します。'),
  ]),
  'Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.': Object.freeze([
    correction(['as optional'], [
      { role: 'C', en: 'as optional', ja: 'あってもなくてもよいものとして' },
    ], 'treat O as C の目的格補語Cで、evidence をどう扱うか示します。'),
  ]),
  'If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.': Object.freeze([
    correction(['as merely political'], [
      { role: 'C', en: 'as merely political', ja: '単に政治的なものとして' },
    ], '受動態 dismiss O as C の補語Cで、every account が何として退けられるか示します。'),
  ]),
  'The partnership also shows that useful science depends on recording uncertainty as honestly as discovery.': Object.freeze([
    correction(['as honestly as discovery'], [
      { role: 'M', en: 'as honestly as discovery', ja: '発見を記録するのと同じくらい正直に' },
    ], 'as ... as の同等比較Mで、uncertainty の記録の仕方を discovery と比べます。'),
  ]),
})

// 全件読解後の横断監査で見つかった、既存の本文別訂正に重ねる精密化。
// 同じ英文の台帳を二重定義せず、下で一つの配列へ結合する。
const ADDITIONAL_READING_PHRASE_CORRECTIONS = Object.freeze({
  'If it becomes full, the library will put a message on its website.': Object.freeze([
    correction(['full'], [
      {
        role: 'C',
        en: 'full',
        ja: '満員に（なったら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'it becomes full',
          governor: 'the library will put a message on its website',
        },
      },
    ], 'full は becomes の状態Cです。ここで「満員になったら」とif条件を完成し、後ろの主節へ渡します。'),
  ]),
  'If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.': Object.freeze([
    correction(['cannot understand'], [
      { role: 'V', en: 'cannot understand', ja: '理解できない（対象は次へ）' },
    ], 'cannot understand では条件を早く閉じず、理解できない対象を後ろへ保留します。'),
    correction(['an important point'], [
      {
        role: 'O',
        en: 'an important point',
        ja: '重要な点を（理解できなければ）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'the students cannot understand an important point',
          governor: 'the staff try to make the language clearer',
        },
      },
    ], 'an important point は understand の目的語Oです。最後に「重要な点を理解できなければ」と条件を受け直します。'),
  ]),
  'If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.': Object.freeze([
    correction(['receive'], [
      { role: 'V', en: 'receive', ja: '受け取ります（対象は次へ）' },
    ], 'receive ではif条件を早く閉じず、受け取る対象を次へ保留します。'),
    correction(['the newest systems'], [
      {
        role: 'O',
        en: 'the newest systems',
        ja: '最新のシステムを（受け取るなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'only wealthy areas receive the newest systems',
          governor: 'technology may make public services more unequal',
        },
      },
    ], 'the newest systems は receive の目的語Oです。ここで「裕福な地域だけが受け取るなら」と条件を完成します。'),
  ]),
  'If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.': Object.freeze([
    correction(['are handled'], [
      { role: 'V', en: 'are handled', ja: '扱われます（方法は次へ）' },
    ], 'are handled ではif条件を早く閉じず、扱われ方を次へ保留します。'),
    correction(['carefully'], [
      {
        role: 'M',
        en: 'carefully',
        ja: '慎重に（扱われれば）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'these issues are handled carefully',
          governor: 'quiet technology can improve public spaces',
        },
      },
    ], 'carefully は handled の仕方Mです。節末で「慎重に扱われれば」とif条件を完成します。'),
  ]),
  'However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.': Object.freeze([
    correction(['safely'], [
      {
        role: 'M',
        en: 'safely',
        ja: '安全に（根を伸ばすには歩道が狭すぎるなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'sidewalks are too narrow for roots to grow safely',
          governor: 'planting trees is not a simple solution',
        },
      },
    ], 'safely は grow の仕方Mです。二つ目のif節の末尾で、歩道が根の成長には狭すぎるという条件を受け直します。'),
  ]),
  'That autonomy remains essential, but it can also be misused if institutions avoid scrutiny by describing all criticism as interference.': Object.freeze([
    correction(['avoid'], [
      { role: 'V', en: 'avoid', ja: '避けます（対象・方法は次へ）' },
    ], 'avoid ではif条件を早く閉じず、対象と方法を後ろへ保留します。'),
    correction(['as interference'], [
      {
        role: 'C',
        en: 'as interference',
        ja: '干渉として（表現して検証を避けるなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'institutions avoid scrutiny by describing all criticism as interference',
          governor: 'it can also be misused',
        },
      },
    ], 'as interference は describe O as C の補語Cです。節末で批判を干渉と表現して検証を避ける条件を完成します。'),
  ]),
  'A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.': Object.freeze([
    correction(['can speak'], [
      { role: 'V', en: 'can speak', ja: '話せます（程度・比較対象は次へ）' },
    ], 'can speak ではif条件を早く閉じず、声の程度と比較対象を後ろへ保留します。'),
    correction(['trust in institutions'], [
      {
        role: 'M',
        en: 'trust in institutions',
        ja: '制度への信頼が乏しい（共同体より大きな声で話せるなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'organized groups can speak more loudly than communities with less time, money, or trust in institutions',
          governor: 'a public consultation may reproduce existing inequalities',
        },
      },
    ], 'trust in institutions は less が及ぶ列挙の最後です。ここで比較全体とif条件を受け直します。'),
  ]),
  'If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.': Object.freeze([
    correction(['is dismissed'], [
      { role: 'V', en: 'is dismissed', ja: '退けられます（何としてかは次へ）' },
    ], 'is dismissed ではif条件を早く閉じず、as以下の補語Cを後ろへ保留します。'),
    correction(['as merely political'], [
      {
        role: 'C',
        en: 'as merely political',
        ja: '単に政治的なものとして（退けられるなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'every account of the past is dismissed as merely political',
          governor: 'citizens lose the capacity to distinguish',
        },
      },
    ], 'as merely political は dismiss O as C の補語Cです。節末で「政治的なものとして退けられるなら」と条件を完成します。'),
  ]),
  'Please ask a teacher near the front door if you have any questions.': Object.freeze([
    correction(['have'], [
      { role: 'V', en: 'have', ja: '持っています（対象は次へ）' },
    ], 'have ではif条件を早く閉じず、持っている対象を後ろへ保留します。'),
    correction(['any questions'], [
      {
        role: 'O',
        en: 'any questions',
        ja: '何か質問を（お持ちなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'you have any questions',
          governor: 'Please ask a teacher near the front door',
        },
      },
    ], 'any questions は have の目的語Oです。節末で「質問をお持ちなら」と条件を完成します。'),
  ]),
  'They had to choose a sunny place, remove stones from the soil, and water the young plants every day.': Object.freeze([
    correction(['remove'], [
      { role: 'V', en: 'remove', ja: '取り除く必要もありました（対象は次へ）' },
    ], 'remove は had to choose と had to を共有します。構造表示だけでなく、日本語でも必要性を回収し、目的語を次へ保留します。'),
    correction(['from the soil'], [
      { role: 'M', en: 'from the soil', ja: '土の中から（石を取り除く必要もありました）' },
    ], 'from the soil は remove の起点Mで、括弧で共有had toを含む二つ目の動作を完成します。'),
    correction(['water'], [
      { role: 'V', en: 'water', ja: '水をやる必要もありました（対象は次へ）' },
    ], 'water は had to choose と had to を共有します。日本語でも必要性を示し、対象を次へ保留します。'),
    correction(['every day'], [
      { role: 'M', en: 'every day', ja: '毎日（水をやる必要もありました）' },
    ], 'every day は water の時Mで、括弧で共有had toを含む三つ目の動作を完成します。'),
  ]),
  'For the museum, the benefit is clear as well.': Object.freeze([
    correction(['clear as well'], [
      { role: 'C', en: 'clear', ja: '明らかです（その利点は）' },
      { role: 'M', en: 'as well', ja: '同じく（博物館にも）' },
    ], 'clear は benefit の状態C、as well は「〜もまた」を文末で加える添加Mです。異なる役割を一フレーズにしません。'),
  ]),
  'Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.': Object.freeze([
    correction(['study'], [
      { role: 'V', en: 'study', ja: '勉強も続けられる' },
    ], 'study は can read と助動詞canを共有する二つ目の動詞Vです。構造表示だけ (can) を補い、日本語では「続けられる」を回収します。英語音声は study のままです。'),
  ]),
  'For example, several train stations have introduced sensors that measure how crowded each platform is.': Object.freeze([
    correction(['how'], [
      { role: 'M', en: 'how', ja: 'どれほど（程度は次へ）' },
    ], 'how は方法ではなく crowded の程度を示す疑問副詞Mです。埋込み疑問の倒置語順を前から保留します。'),
    correction(['crowded'], [
      { role: 'C', en: 'crowded', ja: '混雑している状態かを（主語は次へ）' },
    ], 'crowded は埋込み疑問内の補語Cです。英語では how に引かれて主語より前へ出ています。'),
    correction(['each platform'], [
      { role: 'S', en: 'each platform', ja: '各ホームが（どれほど混雑しているか）' },
    ], 'each platform は埋込み疑問内の主語Sです。到着した時点で how crowded を括弧内に受け直します。'),
    correction(['is'], [
      { role: 'V', en: 'is', ja: '〜であるのかを（測ります）' },
    ], 'is は埋込み疑問内のbe動詞Vです。ここで how crowded each platform is 全体を measure の目的内容として完成します。'),
  ]),
  'A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.': Object.freeze([
    correction(['can serve'], [
      { role: 'V', en: 'can serve', ja: '応えられるのか（対象は次へ）' },
    ], 'serve needs は「ニーズに応える」。can serve は間接疑問内のVで、対象を次へ保留します。'),
    correction(['several needs'], [
      { role: 'O', en: 'several needs', ja: '複数のニーズに' },
    ], 'several needs は serve の目的語Oです。日本語では「複数のニーズに応える」と取ります。'),
    correction(['at once'], [
      { role: 'M', en: 'at once', ja: '同時に（応えられるのかを評価します）' },
    ], 'at once は serve の仕方Mです。節末で which resources ... 全体を assessing の並列内容へ受け直します。'),
  ]),
  'Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.': Object.freeze([
    correction(['works physically'], [
      { role: 'V', en: 'works', ja: '機能するか（どの面でかは次へ）' },
      { role: 'M', en: 'physically', ja: '実際の機能面で（機能するか）' },
    ], 'works はwhether節内の動詞V、physically は機能する観点を示すMです。原文順を保ったまま役割を分けます。'),
  ]),
  'Such debates are rarely simple because historical meaning is often ambiguous.': Object.freeze([
    correction(['are rarely'], [
      { role: 'V', en: 'are', ja: '〜です（頻度・状態は次へ）' },
      { role: 'M', en: 'rarely', ja: 'めったに（次の状態ではなく）' },
    ], 'are は連結動詞V、rarely は頻度を示すMです。simple の状態Cと役割を混ぜません。'),
    correction(['simple'], [
      { role: 'C', en: 'simple', ja: '単純ではありません' },
    ], 'simple は Such debates の状態Cです。rarely と合わせて「めったに単純ではない」と完成します。'),
    correction(['is often'], [
      { role: 'V', en: 'is', ja: '〜です（頻度・状態は次へ）' },
      { role: 'M', en: 'often', ja: 'しばしば' },
    ], 'is は連結動詞V、often は頻度Mです。後ろの ambiguous と分けます。'),
    correction(['ambiguous'], [
      { role: 'C', en: 'ambiguous', ja: '曖昧です' },
    ], 'ambiguous は historical meaning の状態Cです。「しばしば曖昧です」とつなぎます。'),
  ]),
  'Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.': Object.freeze([
    correction(['are often'], [
      { role: 'V', en: 'are', ja: '〜です（頻度・内容は次へ）' },
      { role: 'M', en: 'often', ja: 'しばしば' },
    ], 'are は連結動詞V、often は頻度Mです。補語 the first と役割を混ぜません。'),
    correction(['the first'], [
      { role: 'C', en: 'the first', ja: '最初のものです（具体的内容は次へ）' },
    ], 'the first は they の内容を示す補語Cで、何を最初にされるかは後ろの不定詞が説明します。'),
    correction(['to be reduced'], [
      { role: 'V', en: 'to be reduced', ja: '削減される（最初のものです）' },
    ], 'to be reduced は the first の具体的内容を示す不定詞Vです。括弧で補語へ受け直します。'),
  ]),
  'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.': Object.freeze([
    correction(['confronting'], [
      { role: 'M', en: 'confronting', ja: '向き合うことに（対象は次へ）' },
    ], 'confronting は前置詞 in を共有する二つ目の動名詞内容Mです。構造表示だけ (in) を補い、音声は confronting のままです。'),
    correction(['stating'], [
      { role: 'M', en: 'stating', ja: '示すことに（内容は次へ）' },
    ], 'stating は前置詞 in を共有する三つ目の動名詞内容Mです。構造表示だけ (in) を補い、音声は stating のままです。'),
  ]),
  'Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.': Object.freeze([
    correction(['to question'], [
      { role: 'V', en: 'to question', ja: '問い直すことができ（対象は次へ）' },
    ], 'to question は can use records の目的内容となる一つ目の不定詞動作Vです。recognize / deliberate と共有toで並びます。'),
  ]),
  'Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.': Object.freeze([
    correction(['not', 'because'], [
      {
        role: 'LINK',
        en: 'not because',
        ja: '〜だからではなく（理由Aは次へ）',
        specialGrammar: ['negative-correlative'],
      },
    ], 'not because A, but because B は「AだからではなくBだから」という対照理由です。not と because を別々に重ねません。'),
    correction(['professionals'], [
      { role: 'O', en: 'professionals', ja: '専門家に（取って代わるからではなく）' },
    ], 'professionals は replace の目的語Oです。左側の理由Aをここで完成し、butへ渡します。'),
    correction(['because'], [
      { role: 'LINK', en: 'because', ja: '次の理由からです（内容は次へ）' },
    ], '二つ目の because は、価値がある本当の理由Bを導きます。'),
    correction(['contribute'], [
      { role: 'V', en: 'contribute', ja: '持ち寄ります（何をかは次へ）' },
    ], 'contribute では理由を早く閉じず、持ち寄る対象を後ろへ保留します。'),
    correction(['different strengths'], [
      { role: 'O', en: 'different strengths', ja: '異なる強みを（持ち寄るからです）' },
    ], 'different strengths は contribute の目的語Oです。ここで理由Bと主節 is valuable へのつながりを完成します。'),
  ]),
  'A careful reader first asks who produced the message and what evidence is actually available.': Object.freeze([
    correction(['is actually'], [
      { role: 'V', en: 'is', ja: '〜です（実際の状態は次へ）' },
      { role: 'M', en: 'actually', ja: '実際に' },
    ], 'is は連結動詞V、actually は「実際に」と判断を限定するMです。available の状態Cと混ぜません。'),
    correction(['available'], [
      { role: 'C', en: 'available', ja: '利用可能な状態かを' },
    ], 'available は what evidence の状態Cです。ここで二つ目の間接疑問を asks の内容として完成します。'),
  ]),
  'Suppose a survey finds that people who drink more tea report less stress.': Object.freeze([
    correction(['Suppose'], [
      {
        role: 'V',
        en: 'Suppose',
        ja: '次のことを仮定してください（内容は次へ）',
        clauseBinding: {
          type: 'omitted-that-content-clause',
          governor: 'Suppose',
          marker: '(that)',
          clauseRole: 'O',
        },
      },
    ], 'Suppose の直後には内容節を導く that が省略されています。a survey finds ... 全体を仮定する命令文です。'),
    correction(['finds'], [
      { role: 'V', en: 'finds', ja: '明らかにするとします（内容は次へ）' },
    ], 'finds は物を「見つける」ではなく、調査が後続内容を「明らかにする」というVです。'),
    correction(['that'], [
      {
        role: 'LINK',
        en: 'that',
        ja: '次の内容だと（明らかにします）',
        clauseBinding: {
          type: 'explicit-that-content-clause',
          governor: 'finds',
          marker: 'that',
          clauseRole: 'O',
        },
      },
    ], 'この that は省略されたSuppose直後のthatとは別で、finds の目的内容 people ... を明示的に導きます。'),
  ]),
  'When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.': Object.freeze([
    correction(['not'], [
      {
        role: 'LINK',
        en: 'not',
        ja: '一方で',
        focusBinding: {
          type: 'contrastive-verbal-negation',
          scope: 'replace advice from a qualified professional',
          contrast: 'support advice from a qualified professional',
          governor: 'should support / (should) replace',
        },
      },
    ], 'not は英語では replace を否定します。日本語の否定は次のV「置き換えるべきではありません」で一度だけ完成し、ここでは対照を「一方で」と示します。'),
    correction(['replace'], [
      { role: 'V', en: 'replace', ja: '置き換えるべきではありません（対象は次へ）' },
    ], 'replace は should support と助動詞shouldを共有する対照側Vです。not の否定を日本語ではここで実現します。構造表示は (should) replace、音声は replace のままです。'),
    correction(['advice'], [
      {
        role: 'O',
        en: 'advice',
        ja: '助言を（支えるべきで、置き換えるべきではありません）',
        sharedObjectBinding: {
          type: 'shared-object',
          governors: 'should support / should not replace',
          object: 'advice',
        },
      },
    ], 'advice は should support と should not replace が共有する目的語Oです。括弧で肯定側と否定側の両方へ受け直します。'),
  ]),
  'Digital records can also help consumers follow their spending and allow small businesses to sell goods online.': Object.freeze([
    correction(['can also help'], [
      { role: 'V', en: 'can also help', ja: 'さらに助けることができます（誰が何をするかは次へ）' },
    ], 'can also help は可能を表すcanを含むVです。「さらに助けます」だけにせず、できるという意味も日本語へ出します。'),
    correction(['allow'], [
      { role: 'V', en: 'allow', ja: '〜できるようにすることもできます（誰が何をかは次へ）' },
    ], 'allow は主節の can を共有する二つ目のVです。構造表示だけ (can) を補い、日本語でも可能を回収します。英語音声は allow のままです。'),
  ]),
  'For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.': Object.freeze([
    correction(['transport'], [
      { role: 'M', en: 'transport', ja: '交通への（アクセスを）' },
    ], 'transport は共通する前置詞toの二つ目の対象Mで、can limit の直接目的語Oではありません。'),
    correction(['public life'], [
      { role: 'M', en: 'public life', ja: '公共生活への（アクセスを）' },
    ], 'public life は共通する前置詞toの三つ目の対象Mで、access の行き先を示します。'),
  ]),
  'A common response is to teach digital skills and provide low-cost accounts.': Object.freeze([
    correction(['provide'], [
      { role: 'V', en: 'provide', ja: '提供することです（対象は次へ）' },
    ], 'provide は to teach と共有toを持つ二つ目の不定詞動作Vです。構造表示だけ (to) を補い、音声は provide のままです。'),
  ]),
  'That objection is important, particularly for small shops with narrow profit margins.': Object.freeze([
    correction(['with narrow profit margins'], [
      { role: 'M', en: 'with narrow profit margins', ja: '利益幅の小さい（小規模な店にとって）' },
    ], 'with narrow profit margins は small shops を後ろから限定するMです。括弧で修飾先を受け直します。'),
  ]),
  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': Object.freeze([
    correction(['not only', 'by the speed of its average transaction'], [
      {
        role: 'M',
        en: 'not only by the speed of its average transaction',
        ja: '平均的な取引速度だけによってではなく（利用できる人々の範囲によって）',
        wordLimit: 9,
        focusBinding: {
          type: 'not-only-back-reference',
          scope: 'by the speed of its average transaction',
          contrast: 'by the range of people who can use it',
          governor: 'should be judged',
        },
        specialGrammar: ['negative-focus', 'comparison'],
      },
    ], 'not only by ... は、後ろにbut alsoを要求するのではなく、既出の広い基準 by the range ... と平均速度だけの狭い基準を対照します。九語でも一つの評価基準Mとして保持します。'),
  ]),
  'Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.': Object.freeze([
    correction(['to improve'], [
      { role: 'V', en: 'to improve', ja: '改善したいと望んでいる（ほぼすべてを測定します）' },
    ], 'almost everything (that) they hope to improve の目的格関係詞省略です。to improve の省略Oを almost everything へ戻し、さらに主節 measure の目的語として受け直します。'),
    correction(['with competing public purposes'], [
      {
        role: 'M',
        en: 'with competing public purposes',
        ja: '競合する公共目的を持つ（複雑な仕組みの中で）',
        ingBinding: {
          type: 'attributive-participle',
          governor: 'public purposes',
          semanticSubject: 'public purposes',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'with competing public purposes は complex systems を後ろから限定するMです。competing は purposes を限定する現在分詞で、動名詞ではありません。括弧で修飾先を受け直します。'),
  ]),
  'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.': Object.freeze([
    correction(['while neglecting'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      {
        role: 'V',
        en: 'neglecting',
        ja: '軽視します（対象は次へ）',
        ingBinding: {
          type: 'reduced-adverbial',
          governor: 'while (a school is) neglecting',
          semanticSubject: 'A school',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'while は対比の省略節を導くLINK、neglecting は主語 A school を共有する動作Vです。'),
  ]),
  'That position underestimates why measurement became attractive in the first place.': Object.freeze([
    correction(['became'], [
      { role: 'V', en: 'became', ja: '〜になりました（状態は次へ）' },
    ], 'became は状態変化を示す連結動詞Vで、変化後の状態を次へ保留します。'),
    correction(['attractive'], [
      { role: 'C', en: 'attractive', ja: '魅力的に' },
    ], 'attractive は measurement の変化後の状態Cです。「魅力的になった」と前へつなぎます。'),
  ]),
  'Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.': Object.freeze([
    correction(['difficult'], [
      { role: 'C', en: 'difficult', ja: '難しい状態です（誰が何をするかは次へ）' },
    ], 'difficult は Judgment の状態Cで、後ろの for outsiders to challenge が難しい具体的内容を示します。'),
    correction(['for outsiders'], [
      { role: 'M', en: 'for outsiders', ja: '外部の人々が' },
    ], 'for outsiders は to challenge の意味上の主語を示すMです。日本語では「外部の人々が」と置きます。'),
    correction(['to challenge'], [
      {
        role: 'V',
        en: 'to challenge',
        ja: '異議を唱えることが（難しい）',
        infinitiveBinding: {
          type: 'adjective-complement',
          governor: 'difficult',
          semanticSubject: 'outsiders',
        },
        specialGrammar: ['infinitive'],
      },
    ], 'to challenge は difficult の具体的内容となる不定詞Vです。意味上の主語は outsiders で、括弧で difficult へ受け直します。'),
  ]),
  'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.': Object.freeze([
    correction(['while ignoring'], [
      { role: 'LINK', en: 'while', ja: '〜する一方で（動作は次へ）' },
      {
        role: 'V',
        en: 'ignoring',
        ja: '無視します（対象は次へ）',
        ingBinding: {
          type: 'reduced-adverbial',
          governor: 'while (leaders are) ignoring',
          semanticSubject: 'leaders',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'while は対比の省略節を導くLINK、ignoring は主語 leaders を共有する動作Vです。'),
    correction(['fails'], [
      { role: 'V', en: 'fails', ja: '期待に応えられません（対象は次へ）' },
    ], 'fails はここでは他動詞で、特定の共同体に対して期待された成果を出せないことを表します。'),
    correction(['particular communities'], [
      { role: 'O', en: 'particular communities', ja: '特定の共同体に対して（期待に応えられないことを）' },
    ], 'particular communities は他動詞 fail の目的語Oです。日本語では「共同体に対して期待に応えられない」と受け直します。'),
  ]),
  'Second, metrics should be interpreted with qualitative evidence from the people represented by them.': Object.freeze([
    correction(['from the people'], [
      { role: 'M', en: 'from the people', ja: '人々から得た（質的な証拠とともに。どの人々かは次へ）' },
    ], 'from the people は qualitative evidence の出所Mで、後ろの分詞修飾を次へ保留します。'),
    correction(['represented'], [
      { role: 'M', en: 'represented', ja: '表されている（人々から得た証拠とともに）' },
    ], 'represented は people (who are) represented の省略受動関係詞Mです。修飾先 people を括弧で受け直します。'),
    correction(['by them'], [
      { role: 'M', en: 'by them', ja: 'その指標によって表される（人々から得た証拠とともに）' },
    ], 'by them は represented の行為者・手段Mです。them は metrics を受け、後置修飾全体を evidence へ戻します。'),
  ]),
  'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.': Object.freeze([
    correction(['observe'], [
      { role: 'V', en: 'observe', ja: '観察する（その行動が主節へ戻り）' },
    ], 'the behavior (that) they observe の目的格関係詞省略です。observe の省略Oは the behavior で、次の changes へ主節骨格を戻します。'),
    correction(['changes'], [
      { role: 'V', en: 'changes', ja: 'その行動は変化するからです' },
    ], 'changes は関係詞節の外へ戻った理由節の主動詞Vです。主語は先に出た the behavior です。'),
  ]),
  'Transparency is important, yet publishing more data is not sufficient.': Object.freeze([
    correction(['publishing', 'more data'], [
      {
        role: 'S',
        en: 'publishing more data',
        ja: 'より多くのデータを公開することは',
        ingBinding: {
          type: 'gerund-subject',
          governor: 'is not sufficient',
          semanticSubject: 'データを公開する主体',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'publishing more data 全体が二つ目の節の動名詞主語Sです。内側のV/Oを逆順の日本語へ分断しません。'),
  ]),
  'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.': Object.freeze([
    correction(['missing cases'], [
      { role: 'M', en: 'missing cases', ja: '欠落事例についての（決定を）' },
    ], 'missing cases は共通する about の二つ目の対象Mです。decisions への係り先を括弧で受け直します。'),
    correction(['statistical adjustments'], [
      { role: 'M', en: 'statistical adjustments', ja: '統計的な調整についての（決定を）' },
    ], 'statistical adjustments は共通する about の三つ目の対象Mです。'),
    correction(['acceptable thresholds'], [
      { role: 'M', en: 'acceptable thresholds', ja: '許容される基準値についての（決定を）' },
    ], 'acceptable thresholds は共通する about の最後の対象Mです。'),
  ]),
  'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.': Object.freeze([
    correction(['can question'], [
      { role: 'V', en: 'can question', ja: '異議を唱えられるのか（対象は次へ）' },
    ], 'can question では間接疑問を早く閉じず、異議の対象を後ろへ保留します。'),
    correction(['its use'], [
      { role: 'O', en: 'its use', ja: 'その利用に（異議を唱えられるのかを）' },
    ], 'its use は question の目的語Oです。日本語では「利用に異議を唱える」と間接疑問を完成します。'),
  ]),
  'That explanation enables public deliberation about goals instead of limiting debate to technical compliance.': Object.freeze([
    correction(['instead of'], [
      { role: 'LINK', en: 'instead of', ja: '次のことではなく（対照動作は次へ）' },
    ], 'instead of は肯定側 enables public deliberation と、否定側 limiting debate ... を対照します。'),
    correction(['limiting'], [
      { role: 'V', en: 'limiting', ja: '限定すること（対象・範囲は次へ）' },
    ], 'limiting は instead of の否定側Bとなる動名詞動作Vです。ここだけで肯定終止しません。'),
    correction(['to technical compliance'], [
      { role: 'M', en: 'to technical compliance', ja: '技術的な規則順守に（限定するのではなく、公開での熟議を可能にします）' },
    ], 'to technical compliance は limiting の範囲Mです。節末で否定側Bから肯定側Aへ受け直します。'),
  ]),
  'It also gives independent researchers a way to test whether alternative definitions would tell a substantially different story.': Object.freeze([
    correction(['would tell'], [
      { role: 'V', en: 'would tell', ja: '示すことになるか（対象は次へ）' },
    ], 'would tell は仮定した別定義ならどうなるかを示すVです。would の仮定性を日本語にも残します。'),
  ]),
  'They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.': Object.freeze([
    correction(['provide'], [
      { role: 'V', en: 'provide', ja: '提供すべきです（対象は次へ）' },
    ], 'provide は should direct と助動詞shouldを共有する二つ目のVです。構造表示だけ (should) を補い、日本語でも義務を回収します。'),
  ]),
  'Some people do not have a bank account, a suitable phone, reliable internet access, or the identity documents required to open a digital account.': Object.freeze([
    correction(['required'], [
      { role: 'M', en: 'required', ja: '必要とされる（身分証明書を）' },
    ], 'required は主節Vではなく、the identity documents (that are) required ... の関係詞＋be動詞を省いた過去分詞後置修飾Mです。'),
    correction(['to open'], [
      { role: 'V', en: 'to open', ja: '開設するために' },
    ], 'to open は required を具体化し、「デジタル口座を開設するために必要な書類」という用途・条件を作る不定詞です。'),
  ]),
  'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.': Object.freeze([
    correction(['Extending', 'the life'], [
      {
        role: 'S',
        en: 'Extending the life',
        ja: '寿命を延ばすことは',
        ingBinding: {
          type: 'gerund-subject',
          governor: 'reduces / lowers',
          semanticSubject: '製品を長く使う主体',
        },
        specialGrammar: ['ing-function'],
      },
    ], 'Extending the life 全体が主節の動名詞主語Sです。内側の動作と目的語を日本語が逆転する二フレーズには分けません。'),
    correction(['required'], [
      { role: 'M', en: 'required', ja: '必要とされる（エネルギーと資源への需要を）' },
    ], 'required は energy and resources (that are) required ... の関係詞＋be動詞を省いた過去分詞後置修飾Mです。resources だけでなく、並列された energy and resources 全体を受け直します。'),
    correction(['to make'], [
      { role: 'V', en: 'to make', ja: '作るために' },
    ], 'to make は required を具体化し、「新しい商品を作るために必要とされる資源」とつなぐ形容詞補完の不定詞です。主節全体へ曖昧に目的・結果を足す用法ではありません。'),
  ]),
  'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.': Object.freeze([
    correction(['a broken object'], [
      { role: 'M', en: 'a broken object', ja: 'つまり壊れた物という（個人的な問題を）', structureEn: ', a broken object,' },
    ], 'a broken object は別の目的語Oではなく、直前の a private problem を具体的に言い換える同格挿入Mです。前後のコンマは構造表示だけに残します。'),
  ]),
  'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.': Object.freeze([
    correction(['people'], [
      { role: 'M', en: 'people', ja: '人々の（数によって。説明は次へ）' },
    ], 'people は新しい節の主語ではなく、共通する the number of の二つ目の対象です。後ろの reached がこの名詞を限定します。'),
    correction(['reached'], [
      { role: 'M', en: 'reached', ja: '情報が届いた（人々の数によって）' },
    ], 'reached は people (who are) reached の関係代名詞＋be動詞を省いた受動の過去分詞後置修飾Mです。'),
  ]),
  'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.': Object.freeze([
    correction(['competing interpretations'], [
      { role: 'M', en: 'competing interpretations', ja: '対立する解釈をまたいで' },
    ], 'competing interpretations は共通する across の二つ目の対象で、competing は interpretations を限定する現在分詞です。'),
  ]),
  'If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.': Object.freeze([
    correction(['increases'], [
      { role: 'V', en: 'increases', ja: '強めます（対象は次へ）' },
    ], 'increases ではif条件を早く閉じず、強める対象を後ろへ保留します。'),
    correction(['does not increase'], [
      { role: 'V', en: 'does not increase', ja: '強まりません（範囲は次へ）' },
    ], 'does not increase では複合条件を早く閉じず、範囲を示す above を後ろへ保留します。'),
    correction(['above'], [
      {
        role: 'M',
        en: 'above',
        ja: '上層では（説明責任が強まらないなら）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'measurement increases surveillance below but accountability does not increase above',
          governor: 'the system may weaken rather than strengthen legitimacy',
        },
      },
    ], 'above は説明責任が及ぶ上層を示すMです。複合if節の末尾で、否定条件を一度だけ完成します。'),
    correction(['rather than'], [
      { role: 'LINK', en: 'rather than', ja: '次のことではなく（対照動作は次へ）' },
    ], 'rather than は weaken A と strengthen A を対比し、後続の strengthen を否定側Bとして導きます。'),
    correction(['strengthen'], [
      { role: 'V', en: 'strengthen', ja: '強めること' },
    ], 'strengthen は rather than の否定側Bとなる肯定語義の動詞Vです。ここだけで肯定終止しません。'),
    correction(['legitimacy'], [
      { role: 'O', en: 'legitimacy', ja: '正当性を（強めるのではなく、弱めるかもしれません）' },
    ], 'legitimacy は strengthen と weaken が共有する目的語Oです。括弧で rather than の対照を前の may weaken へ受け直します。'),
  ]),
  'Metrics are most valuable when they create questions rather than close them.': Object.freeze([
    correction(['rather than'], [
      { role: 'LINK', en: 'rather than', ja: '次のことではなく（対照動作は次へ）' },
    ], 'rather than は create questions と close them を対比し、後続の close を否定側Bとして導きます。'),
    correction(['close'], [
      { role: 'V', en: 'close', ja: '閉じること' },
    ], 'close は rather than の否定側Bとなる肯定語義の動詞Vです。ここだけで肯定終止しません。'),
    correction(['them'], [
      { role: 'O', en: 'them', ja: 'それらを（閉じるのではなく、問いを生み出すとき）' },
    ], 'them は questions を受け、括弧で否定側Bから肯定側Aの create questions へ受け直します。'),
  ]),
  'Comparing conflicting accounts can help students see that disagreement is not the same as ignorance.': Object.freeze([
    correction(['as ignorance'], [
      { role: 'M', en: 'as ignorance', ja: '無知と（同じものではない）' },
    ], 'as ignorance は the same と対応する比較対象です。「無知として」というO as Cの補語用法ではありません。'),
  ]),
  'Those who design indicators should therefore be answerable for their consequences, including the administrative labor they create.': Object.freeze([
    correction(['they'], [
      { role: 'S', en: 'they', ja: '指標の設計者たちが' },
    ], 'they は Those who design indicators（指標を設計する人々）を受ける主語Sです。the administrative labor は create の省略目的語です。'),
  ]),
  'The students used this advice to plan a second garden, which made the project continue beyond one school term.': Object.freeze([
    correction(['which'], [
      { role: 'S', en: 'which', ja: 'そして、その計画が' },
    ], '非制限用法の which は直前の名詞 garden だけでなく、「二つ目の畑を計画したこと／その計画」という前節内容を受ける主語Sです。'),
  ]),
  'People do not have to pay, but they should bring a pencil.': Object.freeze([
    correction(['do not have to pay'], [
      { role: 'V', en: 'do not have to pay', ja: '支払う必要はありません' },
    ], 'do not have to pay は「支払う義務がない」を表す一つのVです。「支払ってはいけない」という禁止ではなく、支払う必要がないという意味です。'),
  ]),
  'Staff members used to write long explanations for adults, but they now ask student volunteers to read the labels first.': Object.freeze([
    correction(['used to write'], [
      { role: 'V', en: 'used to write', ja: '以前は書いていました' },
    ], 'used to＋動詞原形は「以前は〜していた（今は違う）」を表す一つのVです。be used to＋名詞「〜に慣れている」とは別構文です。'),
  ]),
  'The goal need not be to stop the transition toward digital payment.': Object.freeze([
    correction(['need not be'], [
      { role: 'V', en: 'need not be', ja: '〜である必要はありません（内容は次へ）' },
    ], 'need not be は「〜である必要がない」を表し、禁止ではありません。後続の補語C to stop ... が不要な内容を示します。'),
  ]),
  'This response need not involve obvious cheating.': Object.freeze([
    correction(['need not involve'], [
      { role: 'V', en: 'need not involve', ja: '伴うとは限りません' },
    ], 'need not involve は「必ずしも伴う必要はない／伴うとは限らない」で、禁止を表す表現ではありません。'),
  ]),
  'They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.': Object.freeze([
    correction(['to schools, shops, parks,'], [
      { role: 'M', en: 'to schools, shops, parks,', ja: '学校・商店・公園と（つながり）' },
    ], 'connected to の一つ目から三つ目の対象です。日本語の「〜とつながる」という格を、最後の並列対象とそろえます。'),
    correction(['many other parts of the community'], [
      { role: 'M', en: 'many other parts of the community', ja: '地域のほかの多くの場所とも（つながっていることに気づきます）' },
    ], 'many other parts ... は共通する to の最後の対象です。前の学校・商店・公園と同じ格で、discover の内容までここで受け直します。'),
  ]),
  'The museum has also changed the way it prepares labels for new displays.': Object.freeze([
    correction(['for new displays'], [
      { role: 'M', en: 'for new displays', ja: '新しい展示用の説明文を準備する（方法を変えました）' },
    ], 'the way (that / in which) it prepares labels ... の省略関係詞節をここで読み終えます。説明文の用途から、先行詞 the way の外側役割である changed の目的語へ戻ります。'),
  ]),
  'The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.': Object.freeze([
    correction(['most often'], [
      { role: 'M', en: 'most often', ja: '最もよく尋ねる（質問を記録します）' },
    ], 'the questions (that) visitors ask most often の目的格関係詞省略です。関係詞節末で先行詞 questions を主節 record の目的語へ戻します。'),
  ]),
  'A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.': Object.freeze([
    correction(['become'], [
      { role: 'V', en: 'become', ja: '〜になる可能性もあります（状態は次へ）' },
    ], 'become は前の may を共有する二つ目のVです。可能性を日本語にも回収し、変化後の状態を次へ保留します。'),
    correction(['unreadable'], [
      { role: 'C', en: 'unreadable', ja: '読めない状態に' },
    ], 'unreadable は become の補語Cです。前の共有mayと合わせて「読めない状態になる可能性もあります」とつなぎます。'),
  ]),
  'The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.': Object.freeze([
    correction(['explanations'], [
      { role: 'M', en: 'explanations', ja: '説明とも' },
    ], 'explanations は accessible evidence / independent review と並ぶ、共通する with の三つ目の対象Mです。combine の直接目的語Oではありません。'),
  ]),
  'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.': Object.freeze([
    correction(['makes'], [
      { role: 'V', en: 'makes', ja: '〜にします（対象・状態は次へ）' },
    ], 'make O C のVです。「作る／する」ではなく、someone を a thoughtful reader の状態にします。'),
  ]),
  'A narrow target may consequently punish the very risk taking required for genuine learning.': Object.freeze([
    correction(['required'], [
      { role: 'M', en: 'required', ja: '必要とされる（どのためかは次へ）' },
    ], 'required は risk taking (that is) required ... の省略受動関係詞Mです。後ろの for ... を読んでから risk taking へ戻します。'),
    correction(['for genuine learning'], [
      { role: 'M', en: 'for genuine learning', ja: '真の学習のために必要な（リスクを取る行為を）' },
    ], 'for genuine learning は required の必要目的を示し、後置修飾全体を the very risk taking へ受け直します。learning はここでは普通名詞「学習」で、動名詞cueの対象ではありません。'),
  ]),
  'Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.': Object.freeze([
    correction(['made'], [
      { role: 'V', en: 'made', ja: '〜にしました（対象・状態は次へ）' },
    ], 'make O C のVです。that内容節の終わりを先取りせず、the clinic と inaccessible を順に受けます。'),
    correction(['inaccessible'], [
      { role: 'C', en: 'inaccessible', ja: '利用しにくい状態に（したということを）' },
    ], 'inaccessible は the clinic の目的格補語Cです。ここで make O C と reveal の内容節を一度だけ完成します。'),
  ]),
})

const CLOSURE_READING_PHRASE_CORRECTIONS = Object.freeze({
  'At first, many students thought the work would be simple, but they soon learned that plants need careful attention.': Object.freeze([
    correction(['need'], [
      { role: 'V', en: 'need', ja: '必要としています（対象は次へ）' },
    ], 'that内容節をVで早く閉じず、need の目的語を次へ保留します。'),
    correction(['careful attention'], [
      {
        role: 'O', en: 'careful attention',
        ja: '注意深い世話を必要としている（ことを学びました）',
        closureBinding: closure('content-clause', 'that', 'learned', 'plants need careful attention'),
      },
    ], '内容節末で need の目的語を完成し、外側の learned へ受け直します。'),
  ]),
  'The program shows that learning about the past can help people build stronger relationships in the present.': Object.freeze([
    correction(['can help'], [
      { role: 'V', en: 'can help', ja: '助けになり得ます（誰が何をするかは次へ）' },
    ], 'that内容節をここで名詞化せず、help O do の関係を次へ保留します。'),
    correction(['in the present'], [
      {
        role: 'M', en: 'in the present',
        ja: '現在において、より強い関係を築く助けになり得る（ことを示しています）',
        closureBinding: closure('content-clause', 'that', 'shows', 'learning about the past can help people build stronger relationships in the present'),
      },
    ], '内容節末で build の対象と時をまとめ、外側の shows へ戻します。'),
  ]),
  'Critics therefore argue that manufacturers should make parts and instructions easier to obtain.': Object.freeze([
    correction(['should make'], [
      { role: 'V', en: 'should make', ja: '〜にするべきです（対象・状態は次へ）' },
    ], 'make O C の内容をO/C前で閉じず、対象と状態を次へ保留します。'),
    correction(['easier to obtain'], [
      {
        role: 'C', en: 'easier to obtain',
        ja: 'より入手しやすい状態にするべきだ（と主張します）',
        closureBinding: closure('content-clause', 'that', 'argue', 'manufacturers should make parts and instructions easier to obtain'),
      },
    ], '内容節末の補語Cで make O C を完成し、外側の argue へ戻します。'),
  ]),
  'Today, many planners argue that cities need a broader framework that connects transportation, housing, energy, and public health.': Object.freeze([
    correction(['need'], [
      { role: 'V', en: 'need', ja: '必要としています（対象は次へ）' },
    ], 'that内容節をO前で閉じず、need の目的語を次へ保留します。'),
    correction(['public health'], [
      {
        role: 'O', en: 'public health',
        ja: '公衆衛生を結び付ける、より広い枠組みを必要としている（と主張しています）',
        closureBinding: closure('content-clause', 'that', 'argue', 'cities need a broader framework that connects transportation, housing, energy, and public health'),
      },
    ], '関係詞節末から先行詞 framework を経て、外側の argue の内容まで受け直します。'),
  ]),
  'One reason is that a measure designed for a single purpose can have unexpected consequences in another area.': Object.freeze([
    correction(['can have'], [
      { role: 'V', en: 'can have', ja: 'もたらす可能性があります（何を・どこでかは次へ）' },
    ], 'that内容節をO/M前で閉じず、結果と範囲を次へ保留します。'),
    correction(['in another area'], [
      {
        role: 'M', en: 'in another area',
        ja: '別の分野で予期しない結果をもたらす可能性がある（ということです）',
        closureBinding: closure('content-clause', 'that', 'is / One reason', 'a measure designed for a single purpose can have unexpected consequences in another area'),
      },
    ], '内容節末で can have のO/Mを完成し、主格補語となるthat節を閉じます。'),
  ]),
  'Some observers respond by demanding that platforms remove misleading historical claims more aggressively.': Object.freeze([
    correction(['remove'], [
      { role: 'V', en: 'remove', ja: '削除するように（対象・程度は次へ）' },
    ], '要求内容のthat節をO/M前で閉じず、対象と程度を次へ保留します。'),
    correction(['more aggressively'], [
      {
        role: 'M', en: 'more aggressively',
        ja: 'もっと積極的に誤解を招く歴史的主張を削除するように（要求して対応します）',
        closureBinding: closure('content-clause', 'that', 'demanding', 'platforms remove misleading historical claims more aggressively'),
      },
    ], '要求内容の節末で remove のO/Mを完成し、外側の demanding へ戻します。'),
  ]),
  'The project taught them that reducing food waste does not require one perfect rule for everyone.': Object.freeze([
    correction(['does not require'], [
      { role: 'V', en: 'does not require', ja: '必要としません（対象・範囲は次へ）' },
    ], 'that内容節をO/M前で閉じず、不要な対象と範囲を次へ保留します。'),
    correction(['for everyone'], [
      {
        role: 'M', en: 'for everyone',
        ja: '全員に当てはまる一つの完璧な規則を必要としない（ことを教えました）',
        closureBinding: closure('content-clause', 'that', 'taught them', 'reducing food waste does not require one perfect rule for everyone'),
      },
    ], '内容節末で does not require の目的語を完成し、外側の taught them へ戻します。'),
  ]),
  'They explain that every meal uses water, energy, and work before it reaches a plate, so even a small improvement can protect valuable resources.': Object.freeze([
    correction(['uses'], [
      { role: 'V', en: 'uses', ja: '使います（対象・時は次へ）' },
    ], 'that内容節を目的語列の前で閉じず、対象とbefore節を次へ保留します。'),
    correction(['a plate'], [
      {
        role: 'O', en: 'a plate',
        ja: '皿へ届く前に水・エネルギー・労力を使う（ということを説明しています）',
        closureBinding: closure('content-clause', 'that', 'explain', 'every meal uses water, energy, and work before it reaches a plate'),
      },
    ], 'before節末で内側の到達先を完成し、that内容節全体を外側の explain へ戻します。'),
  ]),
  'Several studies report that students at these schools sleep longer on ordinary weekdays.': Object.freeze([
    correction(['sleep'], [
      { role: 'V', en: 'sleep', ja: '眠ります（どのくらい・いつかは次へ）' },
    ], 'that内容節をM前で閉じず、程度と時を次へ保留します。'),
    correction(['on ordinary weekdays'], [
      {
        role: 'M', en: 'on ordinary weekdays',
        ja: '通常の平日により長く眠る（と報告しています）',
        closureBinding: closure('content-clause', 'that', 'report', 'students at these schools sleep longer on ordinary weekdays'),
      },
    ], '内容節末で sleep の程度・時を完成し、外側の report へ戻します。'),
  ]),
  'It is that school policies should take evidence about teenage sleep seriously.': Object.freeze([
    correction(['should take'], [
      { role: 'V', en: 'should take', ja: '受け止めるべきです（対象・態度は次へ）' },
    ], 'that内容節をO/M前で閉じず、対象と態度を次へ保留します。'),
    correction(['seriously'], [
      {
        role: 'M', en: 'seriously',
        ja: '10代の睡眠についての証拠を真剣に受け止めるべきだ（ということです）',
        closureBinding: closure('content-clause', 'that', 'is / It', 'school policies should take evidence about teenage sleep seriously'),
      },
    ], '内容節末で take O seriously を完成し、主格補語となるthat節を閉じます。'),
  ]),
  'For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.': Object.freeze([
    correction(['is arriving'], [
      { role: 'V', en: 'is arriving', ja: '飛来しています（時は次へ）' },
    ], 'that内容節をM前で閉じず、到来時と並列動作を次へ保留します。'),
    correction(['disappearing'], [
      { role: 'V', en: 'disappearing', ja: '姿を消しています（どこからかは次へ）' },
    ], '共有isを持つ二つ目の進行形を、場所Mより前で名詞化しません。'),
    correction(['from certain neighborhoods'], [
      {
        role: 'M', en: 'from certain neighborhoods',
        ja: '特定の地域から姿を消している、または春により早く飛来している（ことを示すかもしれません）',
        closureBinding: closure('content-clause', 'that', 'may show', 'a species is arriving earlier in spring or disappearing from certain neighborhoods'),
      },
    ], '並列された二つの進行形を節末でまとめ、外側の may show へ戻します。'),
  ]),
  'A short video claims that a certain drink improves memory, and thousands of users share it within a day.': Object.freeze([
    correction(['improves'], [
      { role: 'V', en: 'improves', ja: '高めます（対象は次へ）' },
    ], 'that内容節をO前で閉じず、improves の目的語を次へ保留します。'),
    correction(['memory'], [
      {
        role: 'O', en: 'memory', ja: '記憶力を高める（と主張します）',
        closureBinding: closure('content-clause', 'that', 'claims', 'a certain drink improves memory'),
      },
    ], '内容節末で improves の目的語を完成し、外側の claims へ戻します。'),
  ]),
  'Critics argue that such rules create costs for merchants who must maintain two payment systems.': Object.freeze([
    correction(['create'], [
      { role: 'V', en: 'create', ja: '生じさせます（何を・誰にかは次へ）' },
    ], 'that内容節をO/M前で閉じず、費用と負担者を次へ保留します。'),
    correction(['two payment systems'], [
      {
        role: 'O', en: 'two payment systems',
        ja: '二つの決済方式を維持しなければならない商店に費用を生じさせる（と主張します）',
        closureBinding: closure('content-clause', 'that', 'argue', 'such rules create costs for merchants who must maintain two payment systems'),
      },
    ], '関係詞節末から merchants へ戻り、create costs ... のthat内容全体を外側の argue へ戻します。'),
  ]),
  'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.': Object.freeze([
    correction(['should simply be trusted'], [
      { role: 'V', en: 'should simply be trusted', ja: 'ただ信頼されるべきです（何を行うかは次へ）' },
    ], '二つ目のthat内容節を不定詞・目的語前で閉じず、信任される内容を次へ保留します。'),
    correction(['judgment'], [
      {
        role: 'O', en: 'judgment',
        ja: '判断を行使するよう信頼されるべきだ（と結論づけます）',
        closureBinding: closure('content-clause', 'that', 'conclude', 'experienced professionals should simply be trusted to exercise judgment'),
      },
    ], '二つ目の内容節末で to exercise judgment を完成し、外側の conclude へ戻します。'),
  ]),
  'The inability to assign a clean number is not evidence that a value is unreal; it is a warning that judgment must remain visible and contestable.': Object.freeze([
    correction(['unreal'], [
      {
        role: 'C', en: 'unreal', ja: '実在しないという（証拠ではありません）',
        closureBinding: closure('content-clause', 'that', 'evidence', 'a value is unreal'),
      },
    ], '一つ目のthat節末で a value is unreal を evidence の内容へ戻します。'),
    correction(['visible and contestable'], [
      {
        role: 'C', en: 'visible and contestable',
        ja: '見える形で異議を申し立てられる状態のままでなければならないという（警告です）',
        closureBinding: closure('content-clause', 'that', 'a warning', 'judgment must remain visible and contestable'),
      },
    ], '二つ目のthat節末で must remain の状態を完成し、a warning の内容へ戻します。'),
  ]),
  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': Object.freeze([
    correction(['to improve'], [
      { role: 'V', en: 'to improve', ja: '改善すること（何をかは次へ）' },
    ], '後置された実質内容の一つ目で、to improve を目的語前に「を」で閉じません。'),
    correction(['a design'], [
      { role: 'O', en: 'a design', ja: '設計を（改善することを）' },
    ], 'to improve の目的語Oで、一つ目の不定詞内容を受け直します。'),
    correction(['decide'], [
      { role: 'V', en: 'decide', ja: '判断すること（内容は次へ）', structureEn: '(to) decide', spokenEn: 'decide' },
    ], 'to improve と並列する (to) decide です。日本語でも内容節より前に格を閉じず、補ったtoは表示だけにします。'),
    correction(['that'], [
      { role: 'LINK', en: 'that', ja: '次の内容を判断すること（中身は次へ）' },
    ], 'that は decide の目的語となる内容節の入口です。「that以下の内容を判断すること」と前からつなぎます。'),
    correction(['better'], [
      {
        role: 'M', en: 'better', ja: 'よりうまく（機能するだろう）',
        closureBinding: closure('content-clause', 'that', 'decide', 'a simpler solution would work better'),
      },
    ], 'that内容節末で would work の様態を一度だけ受け直します。decide の意味まで括弧へ重ねません。'),
  ]),
  'Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.': Object.freeze([
    correction(['inaccessible'], [
      {
        role: 'C', en: 'inaccessible', ja: '利用しにくい状態に（したということを）',
        closureBinding: closure('content-clause', 'that', 'might reveal', 'a new transport schedule made the clinic inaccessible'),
      },
    ], 'make O C を内容節末で完成し、外側の might reveal へ戻します。'),
  ]),
  'They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.': Object.freeze([
    correction(['many other parts of the community'], [
      {
        role: 'M', en: 'many other parts of the community',
        ja: '地域のほかの多くの場所とも（つながっていることに気づきます）',
        closureBinding: closure('content-clause', 'that', 'discover', 'a museum is connected to schools, shops, parks, and many other parts of the community'),
      },
    ], '共有toの列挙末で is connected の対象を完成し、外側の discover へ戻します。'),
  ]),
  'Instead of simply giving the food away, the students visited the center and explained how they had grown it.': Object.freeze([
    correction(['giving'], [
      { role: 'V', en: 'giving', ja: '渡す（対象・結果は次へ）' },
    ], 'give away の動作を、目的語と小辞より前で不自然な「として」にしません。'),
    correction(['away'], [
      { role: 'M', en: 'away', ja: 'そのまま譲ってしまう代わりに' },
    ], 'away は give away を完成する小辞Mです。instead of の対照もここで受けます。'),
    correction(['had grown'], [
      { role: 'V', en: 'had grown', ja: '育てた（対象は次へ）' },
    ], 'how間接疑問を目的語Oより前で閉じず、grown の対象を次へ保留します。'),
    correction(['it'], [
      {
        role: 'O', en: 'it', ja: 'それを（どのように育てたのかを説明しました）',
        closureBinding: closure('embedded-question', 'how', 'explained', 'how they had grown it'),
      },
    ], '間接疑問節末で grown の目的語を完成し、外側の explained へ戻します。'),
  ]),
  'A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.': Object.freeze([
    correction(['to open'], [
      { role: 'V', en: 'to open', ja: '開ける（対象・方法は次へ）' },
    ], 'how-to列の一つ目をO/M前で閉じず、対象と方法を次へ保留します。'),
    correction(['safely,'], [
      { role: 'M', en: 'safely,', ja: '安全にランプを開ける方法' },
    ], '一つ目の how to open a lamp safely をここで完成します。'),
    correction(['replace'], [
      { role: 'V', en: 'replace', ja: '交換する（対象は次へ）' },
    ], '共有how toの二つ目をO前で閉じず、対象を次へ保留します。'),
    correction(['a worn wire'], [
      { role: 'O', en: 'a worn wire', ja: '摩耗した電線を交換する方法' },
    ], '二つ目の (how to) replace a worn wire をここで完成します。'),
    correction(['search'], [
      { role: 'V', en: 'search', ja: '探す（対象・場所は次へ）' },
    ], '共有how toの三つ目をM前で閉じず、検索対象と場所を次へ保留します。'),
    correction(['online'], [
      {
        role: 'M', en: 'online',
        ja: 'オンラインで説明書を探す方法を（ボランティアが示すことがあります）',
        closureBinding: closure('embedded-question', 'how', 'may show someone', 'how to open a lamp safely, replace a worn wire, or search for instructions online'),
      },
    ], '三つのhow-to動作の列を節末でまとめ、外側の may show someone へ戻します。'),
  ]),
  'Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.': Object.freeze([
    correction(['to choose'], [
      { role: 'V', en: 'to choose', ja: '選ぶ（対象は次へ）' },
    ], 'how＋to不定詞を目的語前で閉じず、選択対象を次へ保留します。'),
    correction(['a longer-lasting replacement'], [
      {
        role: 'O', en: 'a longer-lasting replacement',
        ja: 'より長持ちする代替品をどう選ぶかを（学べるかもしれません）',
        closureBinding: closure('embedded-question', 'how', 'may learn', 'how to choose a longer-lasting replacement'),
      },
    ], '二つ目の間接疑問末で choose の目的語を完成し、外側の may learn へ戻します。'),
  ]),
  'Repair cafes cannot change product design by themselves, but they can show consumers what prevents repairs.': Object.freeze([
    correction(['prevents'], [
      { role: 'V', en: 'prevents', ja: '妨げている（対象は次へ）' },
    ], 'what間接疑問をO前で閉じず、prevents の目的語を次へ保留します。'),
    correction(['repairs'], [
      {
        role: 'O', en: 'repairs', ja: '修理を妨げているものを（消費者に示せます）',
        closureBinding: closure('embedded-question', 'what', 'can show consumers', 'what prevents repairs'),
      },
    ], 'what節末で prevents の目的語と融合関係詞whatを完成し、外側の show consumers へ戻します。'),
  ]),
  'City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.': Object.freeze([
    correction(['will have'], [
      { role: 'V', en: 'will have', ja: '持つ（対象は次へ）' },
    ], 'where間接疑問をO前で閉じず、have の目的語を次へ保留します。'),
    correction(['the greatest effect'], [
      {
        role: 'O', en: 'the greatest effect',
        ja: '最大の効果を持つのはどこかを（問う必要があります）',
        closureBinding: closure('embedded-question', 'where', 'need to ask', 'where a new system will have the greatest effect'),
      },
    ], '一つ目の間接疑問末で have の目的語を完成し、外側の ask へ戻します。'),
  ]),
  'A document can survive for centuries and still fail to influence how later generations understand the past.': Object.freeze([
    correction(['understand'], [
      { role: 'V', en: 'understand', ja: '理解する（対象は次へ）' },
    ], 'how間接疑問をO前で閉じず、understand の目的語を次へ保留します。'),
    correction(['the past'], [
      {
        role: 'O', en: 'the past',
        ja: '過去をどのように理解するかに（影響を与えないことがあります）',
        closureBinding: closure('embedded-question', 'how', 'fail to influence', 'how later generations understand the past'),
      },
    ], '間接疑問節末で understand の目的語を完成し、外側の influence へ戻します。'),
  ]),
  'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.': Object.freeze([
    correction(['receive'], [
      { role: 'V', en: 'receive', ja: '受け取る（対象は次へ）' },
    ], '三つ目の間接疑問をO前で閉じず、receive の目的語を次へ保留します。'),
    correction(['scarce conservation resources'], [
      {
        role: 'O', en: 'scarce conservation resources',
        ja: '限られた保存資源をどの資料が受け取るかを（決めなければならないからです）',
        closureBinding: closure('embedded-question', 'which materials', 'must decide', 'which materials receive scarce conservation resources'),
      },
    ], '列挙された最後の間接疑問末で receive の目的語を完成し、外側の must decide へ戻します。'),
  ]),
  'Students must learn how narratives are constructed, why certain voices were ignored, and how apparently neutral categories can reflect older relations of power.': Object.freeze([
    correction(['can reflect'], [
      { role: 'V', en: 'can reflect', ja: '反映し得る（対象は次へ）' },
    ], '三つ目のhow間接疑問をO前で閉じず、reflect の目的語を次へ保留します。'),
    correction(['older relations of power'], [
      {
        role: 'O', en: 'older relations of power',
        ja: '以前からの権力関係をどのように反映し得るかを（学ばなければなりません）',
        closureBinding: closure('embedded-question', 'how', 'must learn', 'how apparently neutral categories can reflect older relations of power'),
      },
    ], '最後の間接疑問末で reflect の目的語を完成し、外側の must learn へ戻します。'),
  ]),
  'A careful reader first asks who produced the message and what evidence is actually available.': Object.freeze([
    correction(['produced'], [
      { role: 'V', en: 'produced', ja: '作った（対象は次へ）' },
    ], '一つ目のwho間接疑問をO前で閉じず、produced の目的語を次へ保留します。'),
    correction(['the message'], [
      {
        role: 'O', en: 'the message',
        ja: 'その情報を誰が作ったのかを（最初に尋ねます）',
        closureBinding: closure('embedded-question', 'who', 'asks', 'who produced the message'),
      },
    ], '一つ目の間接疑問末で produced の目的語を完成し、外側の asks へ戻します。'),
  ]),
  'Readers still need to examine how the study was designed and whether other researchers found similar results.': Object.freeze([
    correction(['found'], [
      { role: 'V', en: 'found', ja: '得た（対象は次へ）' },
    ], 'whether間接疑問をO前で閉じず、found の目的語を次へ保留します。'),
    correction(['similar results'], [
      {
        role: 'O', en: 'similar results',
        ja: '同様の結果をほかの研究者も得たかどうかを（調べる必要があります）',
        closureBinding: closure('embedded-question', 'whether', 'need to examine', 'whether other researchers found similar results'),
      },
    ], '二つ目の間接疑問末で found の目的語を完成し、外側の examine へ戻します。'),
  ]),
  'This does not make cash universally superior, but it shows why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone.': Object.freeze([
    correction(['can depend'], [
      { role: 'V', en: 'can depend', ja: '左右されることがある（基準は次へ）' },
    ], 'why間接疑問をM前で閉じず、依存する基準を次へ保留します。'),
    correction(['rather than technical knowledge alone'], [
      {
        role: 'M', en: 'rather than technical knowledge alone',
        ja: '技術知識だけでなく、その人の事情によって左右され得るのはなぜかを（示しています）',
        closureBinding: closure('embedded-question', 'why', 'shows', 'why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone'),
      },
    ], 'why節末で対照する依存基準を完成し、外側の shows へ戻します。'),
  ]),
  'That position underestimates why measurement became attractive in the first place.': Object.freeze([
    correction(['in the first place'], [
      {
        role: 'M', en: 'in the first place',
        ja: 'そもそも魅力的になったのはなぜかを（過小評価しています）',
        closureBinding: closure('embedded-question', 'why', 'underestimates', 'why measurement became attractive in the first place'),
      },
    ], 'why間接疑問末で became attractive の時・理由焦点を完成し、外側の underestimates へ戻します。'),
  ]),
  'Third, organizations must examine how people adapt once a measure carries consequences.': Object.freeze([
    correction(['adapt'], [
      { role: 'V', en: 'adapt', ja: '適応する（条件は次へ）' },
    ], 'how間接疑問を後続once節より前で閉じず、適応条件を次へ保留します。'),
    correction(['consequences'], [
      {
        role: 'O', en: 'consequences',
        ja: '測定値が結果を伴うようになったとき、人々がどのように適応するのかを（調べなければなりません）',
        closureBinding: closure('embedded-question', 'how', 'must examine', 'how people adapt once a measure carries consequences'),
      },
    ], '内側のonce節末で carries の目的語を完成し、how節全体を外側の examine へ戻します。'),
  ]),
  'There is also a political question about who bears the burden of being measured.': Object.freeze([
    correction(['bears'], [
      { role: 'V', en: 'bears', ja: '負う（対象は次へ）' },
    ], 'who間接疑問をO前で閉じず、bears の目的語を次へ保留します。'),
    correction(['the burden of being measured'], [
      {
        role: 'O', en: 'the burden of being measured',
        ja: '測定される負担を誰が負うのかについて（政治的な問いがあります）',
        closureBinding: closure('embedded-question', 'about who', 'a political question', 'who bears the burden of being measured'),
      },
    ], '前置詞aboutが取る間接疑問節末で bears の目的語を完成し、外側の question へ戻します。'),
  ]),
  'Researchers can then compare similar observations and estimate where the data may be incomplete.': Object.freeze([
    correction(['incomplete'], [
      {
        role: 'C', en: 'incomplete',
        ja: '不完全なのはどこかを（推定できます）',
        closureBinding: closure('embedded-question', 'where', 'estimate', 'where the data may be incomplete'),
      },
    ], 'where間接疑問節末で may be の補語を完成し、外側の estimate へ戻します。'),
  ]),
  'Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.': Object.freeze([
    correction(['deliberate'], [
      { role: 'V', en: 'deliberate', ja: '熟議することができる（対象は次へ）' },
    ], 'whether内容をM前で閉じず、deliberate の対象を次へ保留します。'),
    correction(['about future choices'], [
      {
        role: 'M', en: 'about future choices',
        ja: '将来の選択について熟議できるかで（その質は決まります）',
        closureBinding: closure('embedded-question', 'on whether', 'depends', 'whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices'),
      },
    ], 'whether節末で三つの共有to動作をまとめ、外側の depends on へ戻します。'),
  ]),
  'She likes English because her teacher uses many pictures.': Object.freeze([
    correction(['uses'], [
      { role: 'V', en: 'uses', ja: '使います（対象は次へ）' },
    ], 'because理由節をO前で閉じず、uses の目的語を次へ保留します。'),
    correction(['many pictures'], [
      {
        role: 'O', en: 'many pictures', ja: 'たくさんの絵を使うからです',
        closureBinding: closure('reason-clause', 'because', 'likes English', 'her teacher uses many pictures'),
      },
    ], '理由節末で uses の目的語と「〜からです」を一度だけ完成します。'),
  ]),
  'She is happy because she can use the story in English class.': Object.freeze([
    correction(['can use'], [
      { role: 'V', en: 'can use', ja: '使えます（対象・場所は次へ）' },
    ], 'because理由節をO/M前で閉じず、対象と場所を次へ保留します。'),
    correction(['in English class'], [
      {
        role: 'M', en: 'in English class', ja: '英語の授業でその物語を使えるからです',
        closureBinding: closure('reason-clause', 'because', 'is happy', 'she can use the story in English class'),
      },
    ], '理由節末で can use のO/Mを完成し、主節がうれしい理由へ戻します。'),
  ]),
  'The event is popular because children can learn about their town in a fun way.': Object.freeze([
    correction(['can learn'], [
      { role: 'V', en: 'can learn', ja: '学べます（対象・方法は次へ）' },
    ], 'because理由節をM前で閉じず、学ぶ対象と方法を次へ保留します。'),
    correction(['in a fun way'], [
      {
        role: 'M', en: 'in a fun way', ja: '楽しい方法で自分たちの町について学べるからです',
        closureBinding: closure('reason-clause', 'because', 'is popular', 'children can learn about their town in a fun way'),
      },
    ], '理由節末で can learn のMを完成し、イベントが人気の理由へ戻します。'),
  ]),
  'The work is not always easy because volunteers must communicate politely even when the building is crowded.': Object.freeze([
    correction(['must communicate'], [
      { role: 'V', en: 'must communicate', ja: '応対しなければなりません（方法・状況は次へ）' },
    ], 'because理由節をM・譲歩節前で閉じず、応対の方法と状況を次へ保留します。'),
    correction(['is crowded'], [
      {
        role: 'V', en: 'is crowded',
        ja: '館内が混雑しているときでさえ丁寧に応対しなければならないからです',
        closureBinding: closure('reason-clause', 'because / even when', 'is not always easy', 'volunteers must communicate politely even when the building is crowded'),
      },
    ], '内側のeven when節末で譲歩状況を完成し、because理由節全体を主節へ戻します。'),
  ]),
  'Another student decided to study history at college because he wanted to protect old buildings in his town.': Object.freeze([
    correction(['wanted'], [
      { role: 'V', en: 'wanted', ja: '望みました（内容は次へ）' },
    ], 'because理由節を不定詞内容前で閉じず、wanted の内容を次へ保留します。'),
    correction(['in his town'], [
      {
        role: 'M', en: 'in his town',
        ja: '自分の町にある古い建物を守ることを望んだからです',
        closureBinding: closure('reason-clause', 'because', 'decided to study history', 'he wanted to protect old buildings in his town'),
      },
    ], '理由節末で wanted to protect のO/Mを完成し、大学で歴史を学ぶと決めた理由へ戻します。'),
  ]),
  'Privacy is another concern because sensors can collect data about public behavior.': Object.freeze([
    correction(['can collect'], [
      { role: 'V', en: 'can collect', ja: '集められます（対象は次へ）' },
    ], 'because理由節をO/M前で閉じず、collect の目的語を次へ保留します。'),
    correction(['about public behavior'], [
      {
        role: 'M', en: 'about public behavior',
        ja: '人々の行動についてのデータを集められるからです',
        closureBinding: closure('reason-clause', 'because', 'is another concern', 'sensors can collect data about public behavior'),
      },
    ], '理由節末で collect の目的語と後置修飾を完成し、懸念となる理由へ戻します。'),
  ]),
  'Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.': Object.freeze([
    correction(['can be announced'], [
      { role: 'V', en: 'can be announced', ja: '発表できます（どのようなものとしてかは次へ）' },
    ], 'because理由節をas補語前で閉じず、発表時の位置づけを次へ保留します。'),
    correction(['as decisive action'], [
      {
        role: 'C', en: 'as decisive action', ja: '決定的な行動として発表できるからです',
        closureBinding: closure('reason-clause', 'because', 'are attractive to politicians', 'they are visible and can be announced as decisive action'),
      },
    ], '理由節末で announce O as C の補語を完成し、政治家に魅力的な理由へ戻します。'),
  ]),
  'Two historians may accept the same evidence yet assign different significance to it because they ask different questions.': Object.freeze([
    correction(['ask'], [
      { role: 'V', en: 'ask', ja: '立てます（対象は次へ）' },
    ], 'because理由節をO前で閉じず、ask の目的語を次へ保留します。'),
    correction(['different questions'], [
      {
        role: 'O', en: 'different questions', ja: '異なる問いを立てるからです',
        closureBinding: closure('reason-clause', 'because', 'may accept / assign', 'they ask different questions'),
      },
    ], '理由節末で ask の目的語と「〜からです」を一度だけ完成します。'),
  ]),
  'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.': Object.freeze([
    correction(['reward'], [
      { role: 'V', en: 'reward', ja: '報います（対象・比較は次へ）' },
    ], 'because理由節をO列・比較前で閉じず、報いる対象と比較を次へ保留します。'),
    correction(['than patient investigation'], [
      {
        role: 'M', en: 'than patient investigation',
        ja: '粘り強い調査より、速さ・感情的確信・集団への忠誠に容易に報いるからです',
        closureBinding: closure('reason-clause', 'because', 'intensify this risk', 'they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation'),
      },
    ], '比較後項で reward のO/Mをまとめ、危険を強める理由へ戻します。'),
  ]),
  'They must use bicycle lights because drivers may not notice them after dark.': Object.freeze([
    correction(['may not notice'], [
      { role: 'V', en: 'may not notice', ja: '気づかないかもしれません（対象・時は次へ）' },
    ], 'because理由節をO/M前で閉じず、notice の対象と時を次へ保留します。'),
    correction(['after dark'], [
      {
        role: 'M', en: 'after dark', ja: '暗くなったあとには子どもたちに気づかないかもしれないからです',
        closureBinding: closure('reason-clause', 'because', 'must use bicycle lights', 'drivers may not notice them after dark'),
      },
    ], '理由節末で notice のO/Mを完成し、ライトを使う義務の理由へ戻します。'),
  ]),
  'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.': Object.freeze([
    correction(['changes'], [
      { role: 'V', en: 'changes', ja: 'その行動は変化します（きっかけは次へ）' },
    ], 'because理由節をM前で閉じず、変化のきっかけを次へ保留します。'),
    correction(['in response to observation'], [
      {
        role: 'M', en: 'in response to observation',
        ja: '観察されることに反応して、その行動は変化するからです',
        closureBinding: closure('reason-clause', 'because', 'must be adaptive', 'the behavior they observe changes in response to observation'),
      },
    ], '理由節末で changes のMを完成し、省略関係詞を含む主語から主節の理由へ戻します。'),
  ]),
  'Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.': Object.freeze([
    correction(['prevents'], [
      { role: 'V', en: 'prevents', ja: '防ぎます（対象・内容は次へ）' },
    ], 'because理由節をO/M前で閉じず、prevent O from -ing の内容を次へ保留します。'),
    correction(['from being mistaken for certainty'], [
      {
        role: 'M', en: 'from being mistaken for certainty',
        ja: '正確さが確実さと取り違えられることを防ぐからです',
        closureBinding: closure('reason-clause', 'because', 'can strengthen trust', 'this prevents precision from being mistaken for certainty'),
      },
    ], '理由節末で prevent O from -ing を完成し、信頼を強められる理由へ戻します。'),
  ]),
})

// Vや動名詞・不定詞を「ことを／のを」で閉じた直後にO/C/Mが続くと、
// 英語順再生で日本語の格が重なる。本文ごとの終端で、内側の目的語と外側の
// governorへ戻るための追加台帳。
const ADJACENT_JA_READING_PHRASE_CORRECTIONS = Object.freeze({
  'The students began to understand how temperature, rain, and insects affected the vegetables.': Object.freeze([
    correction(['affected'], [
      { role: 'V', en: 'affected', ja: '影響を与える（対象は次へ）' },
    ], 'how間接疑問を目的語より前で閉じず、affected の対象を次へ保留します。'),
    correction(['the vegetables'], [
      {
        role: 'O', en: 'the vegetables',
        ja: '野菜にどのように影響を与えたのかを（理解し始めました）',
        closureBinding: closure('embedded-question', 'how', 'began to understand', 'how temperature, rain, and insects affected the vegetables'),
      },
    ], '間接疑問末で affected の対象を完成し、外側の began to understand へ戻します。'),
  ]),
  'Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.': Object.freeze([
    correction(['to use'], [
      { role: 'V', en: 'to use', ja: '使うこと（対象は次へ）' },
    ], 'wanted の不定詞内容を目的語より前で「を」にして閉じません。'),
    correction(['a strong chemical spray'], [
      {
        role: 'O', en: 'a strong chemical spray',
        ja: '強い薬品のスプレーを使うことを望みました',
        closureBinding: closure('infinitive-complement', 'to use', 'wanted', 'to use a strong chemical spray'),
      },
    ], 'use の目的語まで読んで wanted の内容を完成します。'),
    correction(['to research'], [
      { role: 'V', en: 'to research', ja: '調べるように（対象・順序は次へ）' },
    ], 'ask O to do の不定詞を、目的語と first より前で閉じません。'),
    correction(['first'], [
      {
        role: 'M', en: 'first',
        ja: 'まず、より安全な選択肢を調べるよう生徒たちに求めました',
        closureBinding: closure('object-to-infinitive', 'to research', 'asked', 'them to research safer choices first'),
      },
    ], '不定詞末で対象と順序を完成し、asked them へ戻します。'),
  ]),
  'They check maps, prepare simple worksheets, and practice explaining the displays in easy words.': Object.freeze([
    correction(['explaining'], [
      { role: 'V', en: 'explaining', ja: '説明すること（対象・方法は次へ）' },
    ], 'practice の動名詞内容を目的語より前で閉じません。'),
    correction(['in easy words'], [
      {
        role: 'M', en: 'in easy words',
        ja: 'やさしい言葉で展示を説明することを練習します',
        closureBinding: closure('gerund-complement', 'explaining', 'practice', 'explaining the displays in easy words'),
      },
    ], '動名詞句末で explaining のO/Mを完成し、外側の practice へ戻します。'),
  ]),
  'Another student decided to study history at college because he wanted to protect old buildings in his town.': Object.freeze([
    correction(['to study'], [
      { role: 'V', en: 'to study', ja: '学ぶこと（対象・場所は次へ）' },
    ], 'decided の不定詞内容をO/Mより前で閉じません。'),
    correction(['at college'], [
      {
        role: 'M', en: 'at college',
        ja: '大学で歴史を学ぶことを決めました',
        closureBinding: closure('infinitive-complement', 'to study', 'decided', 'to study history at college'),
      },
    ], '不定詞句末で study の対象と場所を完成し、decided へ戻します。'),
    correction(['to protect'], [
      { role: 'V', en: 'to protect', ja: '守ること（対象・場所は次へ）' },
    ], 'wanted の不定詞内容を目的語より前で閉じません。'),
  ]),
  'When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.': Object.freeze([
    correction(['to ask'], [
      { role: 'V', en: 'to ask', ja: '尋ねようとすること（対象は次へ）' },
    ], 'willing の具体的内容を questions より前で閉じません。'),
    correction(['questions'], [
      {
        role: 'O', en: 'questions', ja: '質問をしようという姿勢がより強いです',
        closureBinding: closure('infinitive-complement', 'to ask', 'are more willing', 'to ask questions'),
      },
    ], 'ask の対象まで読んで more willing の状態を完成します。'),
  ]),
  'At these events, local volunteers help visitors examine broken things and, when possible, repair them.': Object.freeze([
    correction(['help'], [
      { role: 'V', en: 'help', ja: '手助けします（誰が何をするかは次へ）' },
    ], 'help O do の意味上の主語と二つの動作を後ろへ保留します。'),
    correction(['visitors'], [
      { role: 'O', en: 'visitors', ja: '来場者が（次の動作をするのを）' },
    ], 'visitors は help の目的語で、examine / repair の意味上の主語です。'),
    correction(['examine'], [
      { role: 'V', en: 'examine', ja: '調べること（対象は次へ）' },
    ], 'help O do の一つ目を目的語より前で閉じません。'),
    correction(['broken things'], [
      { role: 'O', en: 'broken things', ja: '壊れた物を調べ' },
    ], '一つ目の動作と対象をつなぎ、並列する repair へ続けます。'),
    correction(['repair'], [
      { role: 'V', en: 'repair', ja: '修理することも（対象は次へ）' },
    ], '共有する help visitors の二つ目の原形動詞です。'),
    correction(['them'], [
      {
        role: 'O', en: 'them',
        ja: '来場者が壊れた物を調べ、可能ならそれらを修理するのを手助けします',
        closureBinding: closure('help-object-bare-infinitive', 'examine / repair', 'help visitors', 'visitors examine broken things and repair them when possible'),
      },
    ], '二つの help O do 動作を最後の目的語で完成します。'),
  ]),
  'Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.': Object.freeze([
    correction(['to sit'], [
      { role: 'V', en: 'to sit', ja: '座ること（相手は次へ）' },
    ], '期待される一つ目の動作をwith句より前で閉じません。'),
    correction(['with volunteers'], [
      { role: 'M', en: 'with volunteers', ja: 'ボランティアと一緒に座り' },
    ], '一つ目の動作を相手までつなぎ、並列する take part へ続けます。'),
    correction(['take part'], [
      { role: 'V', en: 'take part', ja: '参加することが（対象は次へ）' },
    ], 'take part in の前置詞目的語を次へ保留します。'),
    correction(['in the work'], [
      { role: 'M', en: 'in the work', ja: '作業にも参加することが' },
    ], '共有する are expected の二つ目の不定詞動作を完成します。'),
    correction(['leaving'], [
      { role: 'V', en: 'leaving', ja: '置いていくこと（対象・場所は次へ）' },
    ], 'instead of の対照動作をO/Mより前で閉じません。'),
    correction(['at a counter'], [
      {
        role: 'M', en: 'at a counter',
        ja: '受付に品物を置いていくだけでなく、ボランティアと座って作業に加わることを求められています',
        closureBinding: closure('infinitive-coordination', 'to sit / take part', 'are expected', 'to sit with volunteers and take part in the work instead of simply leaving an item at a counter'),
      },
    ], '対照末で leaving のO/Mを完成し、二つの期待動作へ戻します。'),
  ]),
  'This process allows participants to gain practical skills and confidence.': Object.freeze([
    correction(['to gain'], [
      { role: 'V', en: 'to gain', ja: '身につけること（対象は次へ）' },
    ], 'allow O to do の動作を目的語より前で閉じません。'),
    correction(['practical skills and confidence'], [
      {
        role: 'O', en: 'practical skills and confidence',
        ja: '実用的な技能と自信を参加者が身につけられるようにします',
        closureBinding: closure('object-to-infinitive', 'to gain', 'allows', 'participants to gain practical skills and confidence'),
      },
    ], 'gain の目的語まで読んで allows O to do を完成します。'),
  ]),
  'A device no longer seems like a closed box that only its manufacturer understands.': Object.freeze([
    correction(['seems'], [
      { role: 'V', en: 'seems', ja: '〜に見えます（「もはや」と状態は次へ）' },
    ], 'no longer の否定をCより前で述語に閉じず、seems の見え方を次へ保留します。'),
    correction(['like a closed box'], [
      { role: 'C', en: 'like a closed box', ja: '閉ざされた箱のようには、もはや見えません（どんな箱かは次へ）' },
    ], 'seems の補語Cで no longer の否定を一度だけ完成し、関係詞修飾を次へ保留します。'),
    correction(['only'], [
      { role: 'M', en: 'only', ja: 'ただ（限定される主体は次へ）' },
    ], 'only は understands ではなく直後の主語 its manufacturer を限定します。'),
    correction(['its manufacturer'], [
      { role: 'S', en: 'its manufacturer', ja: 'その製造業者だけが' },
    ], 'only を主語に結び付けて「製造業者だけが」と完成します。'),
    correction(['understands'], [
      {
        role: 'V', en: 'understands',
        ja: '理解しているような（閉ざされた箱のようには、もはや見えません）',
        closureBinding: closure('relative-clause', 'that', 'like a closed box / seems', 'that only its manufacturer understands'),
      },
    ], '目的格関係代名詞thatの節末で先行詞boxへ戻り、主節のseemsまで受け直します。'),
  ]),
  'If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.': Object.freeze([
    correction(['making'], [
      { role: 'V', en: 'making', ja: '〜させること（誰に・どう感じるかは次へ）' },
    ], 'without の動名詞makeを、Oと原形動詞と状態より前で閉じません。'),
    correction(['feel'], [
      { role: 'V', en: 'feel', ja: '感じること（状態は次へ）' },
    ], '使役makeの原形動詞feelは、人々自身が感じる動作です。使役をここで重ねません。'),
    correction(['by it'], [
      {
        role: 'M', en: 'by it',
        ja: 'その技術に支配されていると人々に感じさせることなく',
        closureBinding: closure('without-gerund-clause', 'without making', 'can improve public spaces', 'making people feel controlled by it'),
      },
    ], '状態の行為者まで読んで make O feel C を完成し、without へ戻します。'),
  ]),
  'Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.': Object.freeze([
    correction(['to invite'], [
      { role: 'V', en: 'to invite', ja: '呼びかけること（誰に何をするようにかは次へ）' },
    ], 'begin の不定詞内容を invite のOとto不定詞より前で閉じません。'),
    correction(['to map'], [
      { role: 'V', en: 'to map', ja: '地図に記すように（対象は次へ）' },
    ], 'invite O to do の動作を対象列より前で閉じません。'),
    correction(['after heavy rain'], [
      {
        role: 'M', en: 'after heavy rain',
        ja: '大雨のあとも水が残る場所までを地図に記すよう、住民に呼びかけ始めています',
        closureBinding: closure('object-to-infinitive', 'to invite / to map', 'have begun', 'to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain'),
      },
    ], '関係詞節末でmapの対象列を完成し、invite residents と have begun へ戻します。'),
  ]),
  'Local knowledge also helps officials identify failures that computer models miss.': Object.freeze([
    correction(['identify'], [
      { role: 'V', en: 'identify', ja: '見つけること（対象は次へ）' },
    ], 'help O do の原形動詞を目的語より前で閉じません。'),
    correction(['miss'], [
      {
        role: 'V', en: 'miss',
        ja: 'コンピューターモデルが見落とす不具合を、行政担当者が見つける助けになります',
        closureBinding: closure('help-object-bare-infinitive', 'identify', 'helps officials', 'officials identify failures that computer models miss'),
      },
    ], '関係詞節末から先行詞failuresへ戻り、help officials identify の内容を完成します。'),
  ]),
  'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.': Object.freeze([
    correction(['to revise'], [
      { role: 'V', en: 'to revise', ja: '改めること（対象・条件は次へ）' },
    ], 'allow O to do の動作を目的語とwithout句より前で閉じません。'),
    correction(['as failure'], [
      {
        role: 'C', en: 'as failure',
        ja: '見直しを失敗とみなさずに政策を改められるよう、政府を助けます',
        closureBinding: closure('object-to-infinitive', 'to revise', 'allows governments', 'governments to revise policies without treating revision as failure'),
      },
    ], 'without句末でtreat O as Cを完成し、allows governments to reviseへ戻します。'),
  ]),
  'Societies often assume that important events will be remembered simply because they are recorded in books, archives, or digital databases.': Object.freeze([
    correction(['are recorded'], [
      { role: 'V', en: 'are recorded', ja: '記録されています（場所は次へ）' },
    ], 'because理由節を場所Mより前で閉じません。'),
    correction(['in books, archives, or digital databases'], [
      {
        role: 'M', en: 'in books, archives, or digital databases',
        ja: '本・記録保管所・デジタルデータベースに記録されているというだけで、重要な出来事は記憶されると社会は考えがちです',
        closureBinding: closure('content-with-reason-clause', 'that / because', 'assume', 'important events will be remembered simply because they are recorded in books, archives, or digital databases'),
      },
    ], '内側の理由節末で記録場所を完成し、that内容節全体をassumeへ戻します。'),
  ]),
  'Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.': Object.freeze([
    correction(['to treat'], [
      { role: 'V', en: 'to treat', ja: '扱うこと（対象・位置づけは次へ）' },
    ], 'refusing の不定詞内容をO/Cより前で閉じません。'),
    correction(['as optional'], [
      {
        role: 'C', en: 'as optional',
        ja: '証拠を任意のものとして扱うことを拒みながら',
        closureBinding: closure('infinitive-complement', 'to treat', 'refusing', 'to treat evidence as optional'),
      },
    ], 'treat O as Cを完成し、while refusingへ戻します。'),
  ]),
  'It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.': Object.freeze([
    correction(['to read'], [
      { role: 'V', en: 'to read', ja: '読むこと（範囲は次へ）' },
    ], 'willingの一つ目の動作を範囲Mより前で閉じません。'),
    correction(['beyond headlines,'], [
      { role: 'M', en: 'beyond headlines,', ja: '見出しを越えて読み' },
    ], '一つ目の動作を範囲までつなぎ、並列する次の動作へ続けます。'),
    correction(['tolerate'], [
      { role: 'V', en: 'tolerate', ja: '受け入れること（対象は次へ）' },
    ], '二つ目の動作を目的語より前で閉じません。'),
    correction(['uncertainty'], [
      { role: 'O', en: 'uncertainty', ja: '不確実性を受け入れ' },
    ], '二つ目の動作を対象までつなぎ、and以下へ続けます。'),
    correction(['revise'], [
      { role: 'V', en: 'revise', ja: '改めること（対象・時は次へ）' },
    ], '三つ目の動作をOとwhen節より前で閉じません。'),
    correction(['appears'], [
      {
        role: 'V', en: 'appears',
        ja: '現れたときに自分の見解を改めようとする市民を必要とします',
        closureBinding: closure('relative-infinitive-coordination', 'who / willing to', 'requires citizens', 'citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears'),
      },
    ], 'when節末で三つ目の動作を完成し、関係詞節から外側のrequires citizensへ戻します。'),
  ]),
  'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.': Object.freeze([
    correction(['cannot be measured only'], [
      { role: 'V', en: 'cannot be measured only', ja: '測ることはできません（基準は次へ）' },
    ], 'why間接疑問を測定基準より前で閉じません。'),
    correction(['reached'], [
      {
        role: 'M', en: 'reached',
        ja: '情報が届いた人々や保存文書の数だけでは、集合的記憶を測れない理由を説明します',
        closureBinding: closure('embedded-question', 'why', 'explains', 'why collective memory cannot be measured only by the number of documents preserved or people reached'),
      },
    ], '二つ目の省略受動項まで読んで比較基準を完成し、外側のexplainsへ戻します。'),
  ]),
  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': Object.freeze([
    correction(['from losing'], [
      { role: 'M', en: 'from losing', ja: '失うこと（対象は次へ）' },
    ], 'prevent O from -ingの動名詞を目的語より前で閉じません。'),
    correction(['their ability'], [
      { role: 'O', en: 'their ability', ja: '自分たちの能力を（失うことを。どんな能力かは次へ）' },
    ], 'losingの目的語を置き、後置不定詞の内容を次へ保留します。'),
    correction(['knew'], [
      {
        role: 'V', en: 'knew',
        ja: 'かつて知っていたことから学ぶ能力を社会が失うのを、防げないでしょう',
        closureBinding: closure('prevent-object-from-gerund', 'from losing', 'will not prevent societies', 'societies from losing their ability to learn from what they once knew'),
      },
    ], '融合関係詞節末でabilityの内容を完成し、prevent O from -ingへ戻します。'),
  ]),
  'The program will teach simple traffic rules and show people how to prevent common bicycle accidents.': Object.freeze([
    correction(['to prevent'], [
      { role: 'V', en: 'to prevent', ja: '防ぐこと（対象は次へ）' },
    ], 'how＋不定詞を目的語より前で閉じません。'),
    correction(['common bicycle accidents'], [
      {
        role: 'O', en: 'common bicycle accidents',
        ja: 'よくある自転車事故をどう防ぐかを（人々に示します）',
        closureBinding: closure('embedded-question', 'how', 'show people', 'how to prevent common bicycle accidents'),
      },
    ], '間接疑問末でpreventの対象を完成し、show peopleへ戻します。'),
  ]),
  'A science class decided to study the problem instead of simply asking everyone to eat more.': Object.freeze([
    correction(['to study'], [
      { role: 'V', en: 'to study', ja: '調べること（対象は次へ）' },
    ], 'decidedの不定詞内容を目的語より前で閉じません。'),
    correction(['the problem'], [
      { role: 'O', en: 'the problem', ja: 'その問題を調べることを（選びました。対照は次へ）' },
    ], 'studyの目的語を完成し、instead ofの対照を次へ保留します。'),
    correction(['asking'], [
      { role: 'V', en: 'asking', ja: '求めること（誰に何をするようにかは次へ）' },
    ], 'instead ofの動名詞をO/to不定詞より前で閉じません。'),
    correction(['more'], [
      {
        role: 'M', en: 'more',
        ja: '単に全員へもっと食べるよう求めるのではなく、その問題を調べることにしました',
        closureBinding: closure('contrastive-infinitive', 'instead of asking', 'decided to study', 'to study the problem instead of simply asking everyone to eat more'),
      },
    ], '対照動作末でask O to doを完成し、肯定側decided to studyへ戻します。'),
  ]),
  'The students suggested offering two plate sizes at the start of lunch.': Object.freeze([
    correction(['offering'], [
      { role: 'V', en: 'offering', ja: '用意すること（対象・時は次へ）' },
    ], 'suggestedの動名詞内容をO/Mより前で閉じません。'),
    correction(['at the start of lunch'], [
      {
        role: 'M', en: 'at the start of lunch',
        ja: '昼食の始めに二つの皿サイズを用意することを提案しました',
        closureBinding: closure('gerund-complement', 'offering', 'suggested', 'offering two plate sizes at the start of lunch'),
      },
    ], '動名詞句末で対象と時を完成し、suggestedへ戻します。'),
  ]),
  'Daily records helped the cooking staff to prepare a better amount for each menu.': Object.freeze([
    correction(['to prepare'], [
      { role: 'V', en: 'to prepare', ja: '用意すること（対象・用途は次へ）' },
    ], 'help O to doの動作をO/Mより前で閉じません。'),
    correction(['for each menu'], [
      {
        role: 'M', en: 'for each menu',
        ja: '各献立に合うより適切な量を調理スタッフが用意する助けになりました',
        closureBinding: closure('help-object-to-infinitive', 'to prepare', 'helped the cooking staff', 'the cooking staff to prepare a better amount for each menu'),
      },
    ], '不定詞句末で対象と用途を完成し、helpedへ戻します。'),
  ]),
  'Some parents also depend on older children to care for younger family members after school.': Object.freeze([
    correction(['to care for'], [
      { role: 'V', en: 'to care for', ja: '世話をすること（対象・時は次へ）' },
    ], 'depend on older childrenの内容をO/Mより前で閉じません。'),
    correction(['after school'], [
      {
        role: 'M', en: 'after school',
        ja: '放課後に年下の家族の世話をすることを年上の子どもに頼っています',
        closureBinding: closure('infinitive-content', 'to care for', 'depend on older children', 'older children to care for younger family members after school'),
      },
    ], '不定詞句末で意味上の主語older childrenと対象・時を完成します。'),
  ]),
  'At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.': Object.freeze([
    correction(['design'], [
      { role: 'V', en: 'design', ja: '設計すること（対象は次へ）' },
    ], 'helpedの原形動詞を目的語より前で閉じません。'),
    correction(['the change'], [
      {
        role: 'O', en: 'the change', ja: 'その変更を設計するのを手伝いました',
        closureBinding: closure('help-bare-infinitive', 'design', 'helped', 'design the change'),
      },
    ], 'designの目的語まで読んでhelpedの内容を完成します。'),
  ]),
  'Schools need to examine bus routes, club times, and family needs before choosing a new schedule.': Object.freeze([
    correction(['to examine'], [
      { role: 'V', en: 'to examine', ja: '調べること（対象・時は次へ）' },
    ], 'needの不定詞内容を対象列とbefore句より前で閉じません。'),
    correction(['a new schedule'], [
      {
        role: 'O', en: 'a new schedule',
        ja: '新しい予定を選ぶ前に、バス路線・部活動の時間・家庭の必要を調べる必要があります',
        closureBinding: closure('infinitive-complement', 'to examine', 'need', 'to examine bus routes, club times, and family needs before choosing a new schedule'),
      },
    ], 'before動名詞句末で対象列と時を完成し、need to examineへ戻します。'),
  ]),
  'Such changes can suggest that weather, food, or habitat conditions are affecting bird populations.': Object.freeze([
    correction(['are affecting'], [
      { role: 'V', en: 'are affecting', ja: '影響しています（対象は次へ）' },
    ], 'that内容節を目的語より前で閉じません。'),
    correction(['bird populations'], [
      {
        role: 'O', en: 'bird populations',
        ja: '鳥の個体数に影響している（ことを示す場合があります）',
        closureBinding: closure('content-clause', 'that', 'can suggest', 'weather, food, or habitat conditions are affecting bird populations'),
      },
    ], '内容節末でaffectingの対象を完成し、can suggestへ戻します。'),
  ]),
  'They provide pictures and recordings that help volunteers identify species correctly.': Object.freeze([
    correction(['identify'], [
      { role: 'V', en: 'identify', ja: '特定すること（対象・方法は次へ）' },
    ], 'help O doの原形動詞をO/Mより前で閉じません。'),
    correction(['correctly'], [
      {
        role: 'M', en: 'correctly',
        ja: '写真と録音が、鳥の種を正しく特定する助けになります',
        closureBinding: closure('help-object-bare-infinitive', 'identify', 'help volunteers', 'volunteers identify species correctly'),
      },
    ], '関係詞節末でidentifyのO/Mを完成し、先行詞pictures and recordingsへ戻します。'),
  ]),
  'Tea might reduce stress, but perhaps relaxed people simply choose to drink more tea.': Object.freeze([
    correction(['to drink'], [
      { role: 'V', en: 'to drink', ja: '飲むこと（対象は次へ）' },
    ], 'chooseの不定詞内容を目的語より前で閉じません。'),
    correction(['more tea'], [
      {
        role: 'O', en: 'more tea',
        ja: 'もっと多くのお茶を飲むことを選ぶのかもしれません',
        closureBinding: closure('infinitive-complement', 'to drink', 'choose', 'to drink more tea'),
      },
    ], 'drinkの目的語まで読んでchooseの内容を完成します。'),
  ]),
  'Digital records can also help consumers follow their spending and allow small businesses to sell goods online.': Object.freeze([
    correction(['follow'], [
      { role: 'V', en: 'follow', ja: '追うこと（対象は次へ）' },
    ], 'help O doの原形動詞を目的語より前で閉じません。'),
    correction(['their spending'], [
      {
        role: 'O', en: 'their spending',
        ja: '自分の支出を追えるよう消費者を助けることができます',
        closureBinding: closure('help-object-bare-infinitive', 'follow', 'can also help consumers', 'consumers follow their spending'),
      },
    ], 'followの目的語まで読んで共有canを含むhelp O doを完成します。'),
    correction(['to sell'], [
      { role: 'V', en: 'to sell', ja: '売ること（対象・場所は次へ）' },
    ], 'allow O to doの不定詞をO/Mより前で閉じません。'),
    correction(['online'], [
      {
        role: 'M', en: 'online',
        ja: '小規模事業者が商品をオンラインで販売できるようにすることもできます',
        closureBinding: closure('object-to-infinitive', 'to sell', 'allow small businesses', 'small businesses to sell goods online'),
      },
    ], '不定詞句末でsellのO/Mを完成し、共有canを含むallowへ戻します。'),
  ]),
  'Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.': Object.freeze([
    correction(['forcing'], [
      { role: 'V', en: 'forcing', ja: '押し込むこと（誰を、どこへ、なぜかは次へ）' },
    ], 'meanの動名詞内容をO/M/理由節より前で閉じません。'),
    correction(['efficient'], [
      {
        role: 'C', en: 'efficient',
        ja: '運営側が効率的だと考えるというだけで、全員を一つの仕組みに押し込むことを意味するべきでもありません',
        closureBinding: closure('gerund-content-clause', 'forcing', 'Nor should inclusion mean', 'forcing everyone into a system simply because institutions find it efficient'),
      },
    ], '理由節末でfind O CとforcingのO/Mを完成し、倒置されたmeanへ戻します。'),
  ]),
  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': Object.freeze([
    correction(['should be judged'], [
      { role: 'V', en: 'should be judged', ja: '評価されるべきです（基準は次へ）' },
    ], 'that内容節を評価基準より前で閉じません。'),
    correction(['not only by the speed of its average transaction'], [
      {
        role: 'M', en: 'not only by the speed of its average transaction',
        ja: '平均的な取引速度だけでなく、利用できる人々の範囲によって評価されるべきだ（ということです）',
        wordLimit: 9,
        closureBinding: closure('content-clause', 'that', 'The broader lesson is', 'innovation should be judged by the range of people who can use it, not only by the speed of its average transaction'),
      },
    ], '評価基準の対照末で受動述語を完成し、主格補語that節を閉じます。'),
  ]),
  'Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.': Object.freeze([
    correction(['can do'], [
      { role: 'V', en: 'can do', ja: '何ができるのか（時は次へ）' },
    ], 'about what間接疑問を時Mより前で閉じません。'),
    correction(['later'], [
      {
        role: 'M', en: 'later',
        ja: '後に何ができるかについての情報とも、卒業率を併せて検討できます',
        closureBinding: closure('embedded-question', 'about what', 'information / may be considered', 'what graduates can do later'),
      },
    ], '間接疑問末でcan doの時を完成し、information aboutと主節へ戻します。'),
  ]),
  'No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.': Object.freeze([
    correction(['to dominate'], [
      { role: 'V', en: 'to dominate', ja: '支配すること（対象は次へ）' },
    ], '形式目的語itの真内容となるfor-to不定詞を目的語より前で閉じません。'),
    correction(['behavior'], [
      {
        role: 'O', en: 'behavior',
        ja: '行動を一つの狭い目標が支配しにくくします',
        closureBinding: closure('formal-object-for-to-infinitive', 'for / to dominate', 'make it harder', 'for one narrow target to dominate behavior'),
      },
    ], 'dominateの目的語まで読んでmake it harderの実質内容を完成します。'),
  ]),
  'Context does not excuse every poor result; it helps institutions distinguish causes that demand different responses.': Object.freeze([
    correction(['distinguish'], [
      { role: 'V', en: 'distinguish', ja: '区別すること（対象は次へ）' },
    ], 'help O doの原形動詞を目的語より前で閉じません。'),
    correction(['different responses'], [
      {
        role: 'O', en: 'different responses',
        ja: '異なる対応を必要とする原因を制度が区別する助けになります',
        closureBinding: closure('help-object-bare-infinitive', 'distinguish', 'helps institutions', 'institutions distinguish causes that demand different responses'),
      },
    ], '関係詞節末から先行詞causesへ戻り、help institutions distinguishを完成します。'),
  ]),
  'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.': Object.freeze([
    correction(['was chosen'], [
      {
        role: 'V', en: 'was chosen', ja: '選ばれたのかを',
        closureBinding: closure('parallel-embedded-question', 'why', 'explains', 'why a measure was chosen'),
      },
    ], '一つ目のwhy間接疑問はwas chosenで正しく閉じ、次のwhat疑問へ切り替わります。'),
  ]),
})

export const READING_PHRASE_CORRECTIONS = Object.freeze(Object.fromEntries(
  [...new Set([
    ...Object.keys(BASE_READING_PHRASE_CORRECTIONS),
    ...Object.keys(ADDITIONAL_READING_PHRASE_CORRECTIONS),
    ...Object.keys(CLOSURE_READING_PHRASE_CORRECTIONS),
    ...Object.keys(ADJACENT_JA_READING_PHRASE_CORRECTIONS),
  ])].map((sentence) => [
    sentence,
    Object.freeze([
      ...(BASE_READING_PHRASE_CORRECTIONS[sentence] ?? []),
      ...(ADDITIONAL_READING_PHRASE_CORRECTIONS[sentence] ?? []),
      ...(CLOSURE_READING_PHRASE_CORRECTIONS[sentence] ?? []),
      ...(ADJACENT_JA_READING_PHRASE_CORRECTIONS[sentence] ?? []),
    ]),
  ]),
))

// 後置修飾だけを切り出したとき、日本語が「〜の」で途切れないための受け直し。
// 英語の順序は変えず、括弧内で既出の係り先を短く再掲する。
export const READING_PHRASE_BACK_REFERENCES = Object.freeze({
  'Last spring, the students at Maple Junior High started a vegetable garden behind their school.': Object.freeze({
    'at Maple Junior High': 'メープル中学校に通う（生徒たちは）',
  }),
  'Students at one junior high school noticed that a lot of food was left in the cafeteria after lunch.': Object.freeze({
    'at one junior high school': 'ある中学校に通う（生徒たちは）',
  }),
  'In response, communities in several countries have started events called repair cafes.': Object.freeze({
    'in several countries': 'いくつかの国にある（共同体が）',
  }),
  'Many museums are trying to become places where teenagers can do more than simply look at objects behind glass.': Object.freeze({
    'behind glass': 'ガラスの向こうにある（物を）',
  }),
  'Children can listen to stories, make small cards, and borrow books about the month\'s topic.': Object.freeze({
    "about the month's topic": 'その月のテーマについての（本を）',
  }),
  'Their science teacher asked each group to make a schedule and write short notes about the weather.': Object.freeze({
    'about the weather': '天気についての（短いメモを）',
  }),
  'Privacy is another concern because sensors can collect data about public behavior.': Object.freeze({
    'about public behavior': '人々の行動についての（データを）',
  }),
  "A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens' judgment.": Object.freeze({
    'without a visible chain of reasoning': '見える根拠の連鎖がない（警告ラベルは）',
  }),
  'The strongest argument for change does not demand one starting time for every school.': Object.freeze({
    'for change': '変更を支持する（最も強い主張は）',
  }),
  'People with little economic or political power may be especially vulnerable when they cannot choose a private alternative.': Object.freeze({
    'with little economic or political power': '経済的・政治的な力が乏しい（人々は）',
  }),
  'When people discuss technology, they often imagine large machines, bright screens, or dramatic changes in daily life.': Object.freeze({
    'in daily life': '日常生活で起こる（劇的な変化を）',
  }),
  'It also gave them a chance to talk with older people who knew many useful farming tips.': Object.freeze({
    'to talk': '話すための（機会を）',
  }),
  'One city museum recently began a volunteer program for high school students who are interested in local culture.': Object.freeze({
    'for high school students': '高校生を対象とした（プログラムを）',
  }),
  'They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.': Object.freeze({
    'to every question': 'すべての質問への（答えを）',
  }),
  'Another student decided to study history at college because he wanted to protect old buildings in his town.': Object.freeze({
    'in his town': '自分の町にある（古い建物を）',
  }),
  'The museum has also changed the way it prepares labels for new displays.': Object.freeze({
    'for new displays': '新しい展示用の（説明文を）',
  }),
  'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.': Object.freeze({
    'of a product': 'ある製品の（寿命を）',
    'for the energy': 'エネルギーに対する（需要を）',
    resources: '資源に対する（需要を）',
  }),
  'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.': Object.freeze({
    'about waste, skills, and responsibility': 'ごみ・技能・責任についての（学びへ）',
  }),
  'In recent years, however, some of the most useful technologies have been designed to be almost invisible.': Object.freeze({
    'of the most useful technologies': '最も役立つ技術のうち（いくつかは）',
  }),
  'In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.': Object.freeze({
    'to an old bus stop': '古いバス停への（修理は）',
  }),
  'Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.': Object.freeze({
    'for the people': 'その空間を使う人々にとっての（問題を）',
  }),
  'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.': Object.freeze({
    'to reduce': '減らすための（試みが）',
  }),
  'Good policy must be based on evidence from the actual community rather than on attractive ideas copied from other cities.': Object.freeze({
    'from the actual community': '実際の地域から得た（証拠に）',
  }),
  'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.': Object.freeze({
    'in several languages': '複数の言語で書かれた（警告文を）',
  }),
  'When these mechanisms weaken, the past becomes a collection of isolated facts rather than a resource for judgment.': Object.freeze({
    'for judgment': '判断のための（資源ではなく）',
  }),
  'Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.': Object.freeze({
    'of data': 'データの（保持）',
  }),
  'This raises a difficult question about institutional responsibility.': Object.freeze({
    'about institutional responsibility': '制度的な責任についての（問いを）',
  }),
  'Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.': Object.freeze({
    'for challenge': '異議を申し立てるための（機会を）',
  }),
  'If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.': Object.freeze({
    'to distinguish': '区別するための（能力を）',
  }),
  'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.': Object.freeze({
    'to a group': '集団への（忠誠を）',
  }),
  'Remembering, in this sense, is not a passive act of storage but an active practice of civic discipline.': Object.freeze({
    'of storage': '保存という（受動的行為ではなく）',
    'of civic discipline': '市民的規律としての（実践です）',
  }),
  'It begins with a short talk at the community center on Monday evening.': Object.freeze({
    'at the community center': 'コミュニティセンターで行う（短い話から）',
  }),
  'The cafeteria also put pictures of both portions near the entrance so students could choose before reaching the counter.': Object.freeze({
    'of both portions': '二つの量を示す（写真を）',
  }),
  'After one month, food waste was almost half of the earlier amount.': Object.freeze({
    'of the earlier amount': '以前の量の（ほぼ半分）',
  }),
  'Several studies report that students at these schools sleep longer on ordinary weekdays.': Object.freeze({
    'at these schools': 'こうした学校に通う（生徒は）',
  }),
  'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.': Object.freeze({
    familiar: 'なじみがある状態',
  }),
  'Together, they can follow changes in biodiversity and identify places that may need conservation.': Object.freeze({
    'in biodiversity': '生物多様性における（変化を）',
  }),
  'However, the name of an expert or institution should not end the investigation.': Object.freeze({
    'of an expert or institution': '専門家・機関の（名前は）',
  }),
  'A result from twelve volunteers may be interesting, but it may not apply to people of different ages or health conditions.': Object.freeze({
    'from twelve volunteers': '12人のボランティアから得た（結果は）',
    'of different ages or health conditions': '年齢や健康状態の異なる（人々に）',
  }),
  'Financial interests behind a study provide useful context for readers.': Object.freeze({
    'behind a study': '研究の背後にある（金銭的利害は）',
  }),
  'Independent review and a clear statement of possible conflicts make the evidence easier to evaluate.': Object.freeze({
    'of possible conflicts': '起こり得る利害対立についての（説明は）',
  }),
  'When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.': Object.freeze({
    'from a qualified professional': '資格を持つ専門家からの（助言を）',
  }),
  'These benefits are real, but they are not shared equally.': Object.freeze({
    real: '実際に存在するもの',
  }),
  'For these users, refusing cash does more than remove a familiar habit; it can limit access to food, transport, and public life.': Object.freeze({
    'to food': '食料への（アクセスを）',
    transport: '交通への（アクセスを）',
    'public life': '公共生活への（アクセスを）',
  }),
  'A genuinely modern system is not one that eliminates older tools as quickly as possible, but one that combines convenience, privacy, inclusion, and flexibility in practice.': Object.freeze({
    'in practice': '実際には',
  }),
  'Schools compare test scores, hospitals track waiting times, universities count publications, and governments publish targets for employment, safety, and environmental quality.': Object.freeze({
    'for employment, safety, and environmental quality': '雇用・安全・環境の質についての（目標を）',
  }),
  'The difficulty begins when a useful measure becomes the institution’s practical definition of success.': Object.freeze({
    'of success': '成功の（定義に）',
  }),
  'An indicator is necessarily a simplified representation of a broader objective.': Object.freeze({
    'of a broader objective': 'より広い目的を表す（表現です）',
  }),
  'Second, metrics should be interpreted with qualitative evidence from the people represented by them.': Object.freeze({
    'from the people': '当事者から得た（質的な証拠とともに）',
  }),
  'They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.': Object.freeze({
    'for revision': '見直しに役立つ（手がかりを）',
  }),
  'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.': Object.freeze({
    'of evidence': '証拠となる（源で）',
    'of public value': '公共的価値についての（解釈を越えて）',
  }),
})
