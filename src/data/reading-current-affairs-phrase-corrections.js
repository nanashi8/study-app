// 時事長文を全文で読み、自動推定のままでは一つの発音・意味単位として長すぎる
// 名詞句・不定詞句を、英語順を崩さずに中心語と修飾に切り分けた訂正台帳。
// 英語は原文順のまま保ち、日本語はその場で必要な意味だけを隣接させる。

const freeze = (value) => Object.freeze(value)

const correction = (match, parts, note, occurrence = 1) => freeze({
  match: freeze(match),
  parts: freeze(parts.map((part) => freeze(part))),
  note,
  occurrence,
})

export const CURRENT_AFFAIRS_READING_PHRASE_CORRECTIONS = freeze({
  'They also require monitoring because new buildings, new technologies, and changing travel patterns can alter local needs.': freeze([
    correction(['monitoring'], [
      { role: 'O', en: 'monitoring', ja: '監視を' },
    ], 'requireの目的語Oはmonitoring「監視」です。動名詞ですが、この文では主節の述語Vではありません。'),
    correction(['because new buildings, new technologies'], [
      { role: 'LINK', en: 'because', ja: 'なぜなら（理由の節は次へ）' },
      { role: 'S', en: 'new buildings, new technologies', ja: '新しい建物や新技術が' },
    ], 'becauseが理由節の入口LINKで、new buildingsとnew technologiesはalterの主語Sの一部です。'),
    correction(['and changing travel patterns'], [
      { role: 'LINK', en: 'and', ja: 'そして' },
      { role: 'S', en: 'changing travel patterns', ja: '変化する移動パターンが' },
    ], 'andは三つ目の主語を加えるLINKで、changingはtravel patternsを修飾します。changing travel patterns全体がSです。'),
    correction(['can alter local needs'], [
      { role: 'V', en: 'can alter', ja: '変える可能性があります（対象は次へ）' },
      {
        role: 'O', en: 'local needs', ja: '地域の必要を（変え得るため、監視も必要です）',
        closureBinding: {
          type: 'reason-clause',
          opener: 'because',
          governor: 'They also require monitoring',
          clause: 'new buildings, new technologies, and changing travel patterns can alter local needs',
        },
      },
    ], 'can alterが理由節のV、local needsがOです。Oまで読んでbecauseの理由を主節へ戻します。'),
  ]),
  'In many rural areas, the local bus is the only way for people without cars to reach a hospital.': freeze([
    correction(['is the only way'], [
      { role: 'V', en: 'is', ja: '〜です（内容は次へ）' },
      { role: 'C', en: 'the only way', ja: '唯一の手段' },
    ], 'isがV、the only wayが主語the local busの内容を説明するCです。このonlyはthe wayの中で「唯一の」という意味を作ります。'),
  ]),
  'The village then tested a small bus that comes only when someone books it.': freeze([
    correction(['only when someone books it'], [
      { role: 'M', en: 'only', ja: '〜のときだけ（時の節は次へ）' },
      { role: 'LINK', en: 'when', ja: '〜するとき' },
      { role: 'S', en: 'someone', ja: 'だれかが' },
      { role: 'V', en: 'books', ja: '予約します（対象は次へ）' },
      {
        role: 'O', en: 'it', ja: 'そのバスを（予約したときだけ来る）',
        closureBinding: {
          type: 'focused-time-clause',
          opener: 'only when',
          governor: 'comes',
          clause: 'someone books it',
        },
      },
    ], 'onlyはMで、直後のwhen節全体だけに運行時を限定します。whenが時の節の入口、someoneがS、booksがV、itがOです。'),
  ]),
  'Most jobs consist of many tasks, and only some of them can be automated well.': freeze([
    correction(['only some of them'], [
      { role: 'M', en: 'only', ja: '〜だけが（対象は次へ）' },
      { role: 'S', en: 'some of them', ja: 'その一部だけが' },
    ], 'onlyは主語some of themだけに範囲を限定するMです。some of them全体がcan be automatedのSです。'),
  ]),
  'Students who only learn to produce text that a machine can also produce are poorly prepared.': freeze([
    correction(['only learn'], [
      { role: 'M', en: 'only', ja: '〜だけを（動作は次へ）' },
      { role: 'V', en: 'learn', ja: '学びます' },
    ], 'onlyはMで、関係詞節の述語Vであるlearnに焦点を当て、学ぶ内容をその一つに限定します。learnを主語Sとは扱いません。'),
  ]),
  'The class also found that copying a finished report was not honest work.': freeze([
    correction(['that copying a finished', 'report'], [
      { role: 'LINK', en: 'that', ja: '〜ということも' },
      { role: 'S', en: 'copying a finished report', ja: '完成した報告を写すことは' },
    ], 'that は found の内容節を導くLINKで、動名詞句 copying a finished report がその節の主語Sです。'),
  ]),
  'Some students thought the panels were broken, but the weather was the real reason.': freeze([
    correction(['Some students thought', 'the panels were', 'broken'], [
      { role: 'S', en: 'Some students', ja: '一部の生徒は' },
      { role: 'V', en: 'thought', ja: '〜と思いました（内容は次へ）' },
      { role: 'S', en: 'the panels', ja: 'パネルが' },
      { role: 'V', en: 'were', ja: '〜です（状態は次へ）' },
      { role: 'C', en: 'broken', ja: '壊れている' },
    ], 'thought の内容は the panels をS、were をV、broken をCとする節です。主節と内容節の役割を混ぜません。'),
  ]),
  'Now students talk about energy at home, and some families check their own use.': freeze([
    correction(['check their own', 'use'], [
      { role: 'V', en: 'check', ja: '自分で確認します' },
      { role: 'O', en: 'their own use', ja: '使用量を' },
    ], 'check が述語Vで、their own use がその目的語Oです。所有格を動詞側に含めません。'),
  ]),
  'Some used them to check spelling, and others asked for ideas before writing.': freeze([
    correction(['Some used', 'them', 'to check', 'spelling'], [
      { role: 'S', en: 'Some', ja: 'ある生徒は' },
      { role: 'V', en: 'used', ja: '使いました' },
      { role: 'O', en: 'them', ja: 'それらを' },
      { role: 'M', en: 'to check spelling', ja: 'つづりを確認するために' },
    ], 'Some が主語S、used が述語V、them が目的語Oです。to check spelling は目的を示す不定詞Mです。'),
  ]),
  'A few students copied whole answers and did not read them carefully.': freeze([
    correction(['and did not', 'read', 'them carefully'], [
      { role: 'LINK', en: 'and', ja: 'そして' },
      { role: 'V', en: 'did not read', ja: '読みませんでした' },
      { role: 'O', en: 'them carefully', ja: 'それらを注意深く' },
    ], 'and は主語を共有したまま述語を並べます。did not read は助動詞と本動詞を分けず一つのVです。'),
  ]),
  'Our class first collected examples of good and bad use.': freeze([
    correction(['Our class first', 'collected examples'], [
      { role: 'S', en: 'Our class', ja: '私たちのクラスは' },
      { role: 'M', en: 'first', ja: 'まず' },
      { role: 'V', en: 'collected', ja: '集めました' },
      { role: 'O', en: 'examples', ja: '例を' },
    ], 'first は順序を示すM、collected が述語V、examples がその目的語Oです。'),
  ]),
  'A student pointed out that the tools sometimes give confident but wrong answers.': freeze([
    correction(['that the tools sometimes'], [
      { role: 'S', en: 'that the tools sometimes', ja: 'その道具が時に' },
    ], 'that は pointed out の内容節を導き、the tools がその節の主語Sです。sometimes は頻度を添えます。'),
  ]),
  'However, residents soon noticed problems that the first reports had not mentioned.': freeze([
    correction(['that the first', 'reports'], [
      { role: 'O', en: 'that', ja: 'その問題に' },
      { role: 'S', en: 'the first reports', ja: '最初の報道は' },
    ], 'that は problems を受ける関係代名詞で、節内では mentioned の目的語Oです。the first reports が節内の主語Sになります。'),
  ]),
  'Litter increased near the bus stop, and neighbors collected it themselves every Monday.': freeze([
    correction(['it', 'themselves', 'every Monday'], [
      { role: 'O', en: 'it', ja: 'それを' },
      { role: 'M', en: 'themselves', ja: '自分たちで' },
      { role: 'M', en: 'every Monday', ja: '毎週月曜日に' },
    ], 'collected の目的語Oは it だけです。themselves は主語を強調する再帰代名詞、every Monday は頻度を示すMです。'),
  ]),
  'Residents call a number or use a simple app, and the route changes each day.': freeze([
    correction(['a number or use'], [
      { role: 'O', en: 'a number', ja: '番号に' },
      { role: 'LINK', en: 'or', ja: 'あるいは' },
      { role: 'V', en: 'use', ja: '使います' },
    ], 'call の目的語Oは a number までで、or の後ろの use は主語を共有する二つ目の述語Vです。'),
  ]),
  'Those fragments may then strike other objects and produce still more debris.': freeze([
    correction(['may', 'then strike other objects'], [
      { role: 'V', en: 'may then strike', ja: 'その後当たるかもしれません' },
      { role: 'O', en: 'other objects', ja: 'ほかの物体に' },
    ], '助動詞 may と副詞 then、本動詞 strike を一つのVとして読み、other objects をその目的語Oに分けます。'),
  ]),
  'If the number is too high, we do not run outside.': freeze([
    correction(['do not run', 'outside'], [
      { role: 'V', en: 'do not run outside', ja: '外を走りません' },
    ], 'run outside は「外を走る」という一つの動作です。outside を単独の前置詞として切り離しません。'),
  ]),
  'However, the system created new difficulties that planners had not expected.': freeze([
    correction(['that planners', 'had not', 'expected'], [
      { role: 'O', en: 'that', ja: 'その困難を' },
      { role: 'S', en: 'planners', ja: '計画者は' },
      { role: 'V', en: 'had not expected', ja: '予想していませんでした' },
    ], 'that は関係代名詞で difficulties を受けるOです。had not expected は助動詞と本動詞を分けず一つのVとして読みます。'),
  ]),
  'Last year, many students at our school began using AI chat tools for homework.': freeze([
    correction(['began using'], [
      {
        role: 'V',
        en: 'began using',
        ja: '使い始めました',
        ingBinding: {
          type: 'verb-complement-gerund',
          governor: 'began',
          semanticSubject: 'many students at our school',
        },
      },
    ], 'begin doing の -ing は動名詞で、began の目的語として動作の開始を示します。進行形の分詞ではありません。'),
  ]),
  'Our teacher told us that learning to judge information is the real skill.': freeze([
    correction(['that learning', 'to judge information'], [
      { role: 'LINK', en: 'that', ja: '〜ということを' },
      {
        role: 'S',
        en: 'learning to judge information',
        ja: '情報を判断することを学ぶことが',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'learning',
          semanticSubject: '情報を判断できるようになる学習者',
        },
      },
    ], 'that は told の内容節を導くLINKで、動名詞句 learning to judge information がその節の主語Sです。'),
  ]),
  'A company that spends money on careful design gains no direct advantage if others ignore the risk.': freeze([
    correction(['the risk'], [
      {
        role: 'O',
        en: 'the risk',
        ja: 'その危険を（無視するなら、慎重な設計に費用をかけても直接の利益は得られません）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'others ignore the risk',
          governor: 'gains no direct advantage',
        },
      },
    ], 'if で保留した条件を節末で受け直し、主節の「直接の利益は得られない」まで含めて条件と結び付けます。'),
  ]),
  'If this process continues, certain orbits could become too dangerous to use.': freeze([
    correction(['to use'], [
      {
        role: 'M',
        en: 'to use',
        ja: '使うには',
        infinitiveBinding: {
          type: 'adjective-complement',
          governor: 'too dangerous',
          semanticSubject: '軌道を使う運用者',
        },
      },
    ], 'too ... to do の不定詞で、程度を示す too dangerous が支配します。使う主体は運用者側です。'),
  ]),
  'Insurance companies have also begun to ask about disposal plans before they accept a customer.': freeze([
    correction(['to ask'], [
      {
        role: 'V',
        en: 'to ask',
        ja: '尋ねることに（対象は次へ）',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'have also begun',
          semanticSubject: 'Insurance companies',
        },
      },
    ], 'begin to do の不定詞で、尋ねる主体は主語の保険会社です。対象は後ろの about 句へ送ります。'),
  ]),
  'The town council did not want to stop tourism, so it looked for practical answers.': freeze([
    correction(['to stop'], [
      {
        role: 'V',
        en: 'to stop',
        ja: '止めることに（対象は次へ）',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'did not want',
          semanticSubject: 'The town council',
        },
      },
    ], 'want to do の不定詞で、止める主体は主語の町議会です。目的語は後ろへ保留します。'),
  ]),
  'Yet those abilities are difficult to measure, and examinations reward what is easy to score.': freeze([
    correction(['to measure'], [
      {
        role: 'M',
        en: 'to measure',
        ja: '測ることが',
        infinitiveBinding: {
          type: 'adjective-complement',
          governor: 'difficult',
          semanticSubject: '能力を測る評価者',
        },
      },
    ], 'be difficult to do の不定詞で、difficult が支配します。測る主体は文中に現れない評価する側です。'),
  ]),
  'Work is not a fixed quantity waiting to be divided.': freeze([
    correction(['to be divided'], [
      {
        role: 'M',
        en: 'to be divided',
        ja: '分け合われるのを',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'waiting',
          semanticSubject: 'a fixed quantity',
        },
      },
    ], 'wait to do の不定詞が受動になった形で、分けられる対象は a fixed quantity です。'),
  ]),
  'It is more useful to ask who decides how these systems are used and who is protected during the transition.': freeze([
    correction(['to ask'], [
      {
        role: 'V',
        en: 'to ask',
        ja: '尋ねることが',
        infinitiveBinding: {
          type: 'extraposed-subject-content',
          governor: 'It is more useful',
          semanticSubject: '問いを立てる一般の主体',
        },
      },
    ], '形式主語 It の実質内容を作る不定詞です。問う主体は特定されず、読者を含む一般の主体になります。'),
  ]),
  'Platform labels are a weaker instrument than they first appear to be.': freeze([
    correction(['to be'], [
      {
        role: 'M',
        en: 'to be',
        ja: 'そう見えるほどには',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'appear',
          semanticSubject: 'they / Platform labels',
        },
      },
    ], 'appear to be の不定詞で、主語 they（＝配信基盤の表示）がそう見えるという判断を表します。'),
  ]),
  'Useful teaching shows students how to ask who published a claim and what independent evidence supports it.': freeze([
    correction(['to ask'], [
      {
        role: 'V',
        en: 'to ask',
        ja: '尋ねるかを',
        infinitiveBinding: {
          type: 'wh-infinitive',
          governor: 'how',
          semanticSubject: 'students',
        },
      },
    ], 'how to do の不定詞で、尋ねる主体は shows の目的語である students です。'),
  ]),
  'A single file is rarely decisive on its own, whether it happens to be genuine or not.': freeze([
    correction(['to be genuine'], [
      {
        role: 'C',
        en: 'to be genuine',
        ja: '本物であろうと',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'happens',
          semanticSubject: 'it / A single file',
        },
      },
    ], 'happen to do の不定詞で、たまたまそうであるという意味を作ります。主体は主語の it です。'),
  ]),
  'Students carry a bottle and a small towel every day.': freeze([
    correction(['a bottle and a small towel'], [
      { role: 'O', en: 'a bottle', ja: '水筒を' },
      { role: 'O', en: 'and a small towel', ja: 'そして小さなタオルを' },
    ], 'and で並ぶ二つの持ち物は、それぞれが carry の目的語Oです。一息で言える長さへ分けて読みます。'),
  ]),
  'They cannot make enough power for the whole school on dark winter days.': freeze([
    correction(['enough power for the whole school'], [
      { role: 'O', en: 'enough power', ja: '十分な電力を' },
      { role: 'M', en: 'for the whole school', ja: '学校全体のための' },
    ], 'make の目的語Oは enough power までで、for 以下はその電力の用途を後ろから限定するMです。'),
  ]),
  'Each report must list the source of every piece of information.': freeze([
    correction(['the source of every piece of information'], [
      { role: 'O', en: 'the source', ja: '出典を' },
      { role: 'M', en: 'of every piece of information', ja: 'あらゆる情報の' },
    ], 'list の目的語Oの中心は the source です。of 以下はどの情報の出典かを後ろから限定します。'),
  ]),
  'A small mountain town near a famous shrine has become popular with foreign visitors.': freeze([
    correction(['A small mountain town near a famous shrine'], [
      { role: 'S', en: 'A small mountain town', ja: '小さな山あいの町が' },
      { role: 'M', en: 'near a famous shrine', ja: '有名な神社の近くの' },
    ], '主語Sの中心は A small mountain town です。near 以下は場所を後ろから限定するMで、述語はその後に来ます。'),
  ]),
  'Photographs shared online showed a quiet street with old wooden houses and a view of the valley.': freeze([
    correction(['with old wooden houses and a view of the valley'], [
      { role: 'M', en: 'with old wooden houses', ja: '古い木造家屋のある' },
      { role: 'M', en: 'and a view of the valley', ja: 'そして谷の眺めのある' },
    ], 'with が導く二つの特徴は、どちらも a quiet street を後ろから説明するMです。and で並ぶ位置で切ります。'),
  ]),
  'The number of visitors on spring weekends doubled within three years.': freeze([
    correction(['The number of visitors on spring weekends'], [
      { role: 'S', en: 'The number of visitors', ja: '来訪者の数は' },
      { role: 'M', en: 'on spring weekends', ja: '春の週末の' },
    ], '主語Sの中心は The number of visitors です。on 以下はいつの数かを限定するMです。'),
  ]),
  'New jobs appeared, and two empty buildings became a cafe and a small hotel.': freeze([
    correction(['a cafe and a small hotel'], [
      { role: 'C', en: 'a cafe', ja: '喫茶店に' },
      { role: 'C', en: 'and a small hotel', ja: 'そして小さな宿に' },
    ], 'became の補語Cが and で二つ並びます。二軒の建物がそれぞれ何になったかを順に受け取ります。'),
  ]),
  'The town then asked the bus company to add two morning buses for residents only.': freeze([
    correction(['two morning buses for residents only'], [
      { role: 'O', en: 'two morning buses', ja: '朝のバスを2本' },
      { role: 'M', en: 'for residents only', ja: '住民専用の' },
    ], 'add の目的語Oは two morning buses までです。for residents only は利用できる相手を限定するMです。'),
  ]),
  'The council now plans a new comparison of weekday and weekend data before changing the rules again.': freeze([
    correction(['a new comparison of weekday and weekend data'], [
      { role: 'O', en: 'a new comparison', ja: '新たな比較を' },
      { role: 'M', en: 'of weekday and weekend data', ja: '平日と週末のデータの' },
    ], 'plans の目的語Oの中心は a new comparison です。of 以下は何を比べるのかを後ろから限定します。'),
  ]),
  'The office therefore kept a telephone line and trained volunteers to help with the first booking.': freeze([
    correction(['to help with the first booking'], [
      { role: 'M', en: 'to help', ja: '手伝うために' },
      { role: 'M', en: 'with the first booking', ja: '最初の予約を' },
    ], 'to help は目的を表す不定詞Mで、with 以下が何を手伝うのかを続けます。二段に分けて前から読みます。'),
  ]),
  'The prefecture has now begun paying part of the cost of driver training.': freeze([
    correction(['part of the cost of driver training'], [
      { role: 'O', en: 'part of the cost', ja: '費用の一部を' },
      { role: 'M', en: 'of driver training', ja: '運転手養成の' },
    ], 'paying の目的語Oの中心は part of the cost です。二つ目の of 以下が何の費用かを限定します。'),
  ]),
  'However, the same orbits also hold used rocket parts, broken satellites, and countless small fragments.': freeze([
    correction(['the same orbits also', 'hold', 'used rocket parts, broken satellites, and countless small fragments'], [
      { role: 'S', en: 'the same orbits', ja: '同じ軌道は' },
      { role: 'M', en: 'also', ja: 'また' },
      { role: 'V', en: 'hold', ja: '抱えています' },
      { role: 'O', en: 'used rocket parts', ja: '使用済みロケットの部品を' },
      { role: 'O', en: 'broken satellites', ja: '壊れた衛星を' },
      { role: 'O', en: 'and countless small fragments', ja: 'そして無数の小さな破片を' },
    ], 'hold が述語Vで、used は rocket parts を限定する過去分詞です。目的語Oは三つの名詞句が並ぶ列なので、コンマと and の位置で切ります。'),
  ]),
  'Each of these movements uses fuel and shortens the useful life of the satellite.': freeze([
    correction(['the useful life of the satellite'], [
      { role: 'O', en: 'the useful life', ja: '使用可能な期間を' },
      { role: 'M', en: 'of the satellite', ja: 'その衛星の' },
    ], 'shortens の目的語Oの中心は the useful life です。of 以下は何の期間かを後ろから限定します。'),
  ]),
  'Some engineers argue that every satellite should carry enough fuel to leave orbit at the end of its mission.': freeze([
    correction(['to leave orbit at the end of its mission'], [
      { role: 'M', en: 'to leave', ja: '離れるための' },
      { role: 'M', en: 'orbit', ja: '軌道を' },
      { role: 'M', en: 'at the end of its mission', ja: '任務の終わりに' },
    ], 'to leave は enough fuel の用途を示す不定詞Mです。orbit はその不定詞の目的語で、at 以下が時を足します。'),
  ]),
  'Removing a few large objects each year may be far cheaper than removing thousands of fragments later.': freeze([
    correction(['Removing a few large objects each year'], [
      { role: 'S', en: 'Removing a few large objects', ja: '少数の大型物体を除去することは' },
      { role: 'M', en: 'each year', ja: '毎年' },
    ], '動名詞句が主語Sです。中心は Removing a few large objects で、each year は頻度を足すMです。'),
  ]),
  'Predictions about machines replacing human work are older than the machines themselves.': freeze([
    correction(['Predictions about machines replacing human work'], [
      { role: 'S', en: 'Predictions', ja: '予測は' },
      { role: 'M', en: 'about machines replacing human work', ja: '機械が人間の労働に取って代わるという' },
    ], '主語Sは Predictions の一語です。about 以下は何についての予測かを後ろから限定するMです。'),
  ]),
  'Recent systems that generate text, images, and computer code have revived the debate with unusual intensity.': freeze([
    correction(['Recent systems that generate text, images'], [
      { role: 'S', en: 'Recent systems', ja: '最近の技術は' },
      { role: 'M', en: 'that generate text, images', ja: '文章や画像を生成する' },
    ], '主語Sの中心は Recent systems です。that 以下は関係詞節で、どんな技術かを後ろから説明します。'),
  ]),
  'Previous machines mainly replaced physical effort or highly repetitive calculation.': freeze([
    correction(['physical effort or highly repetitive calculation'], [
      { role: 'O', en: 'physical effort', ja: '肉体的な労力を' },
      { role: 'O', en: 'or highly repetitive calculation', ja: 'あるいは極めて反復的な計算を' },
    ], 'or で並ぶ二つの名詞句は、どちらも replaced の目的語Oです。並列の位置で切って読みます。'),
  ]),
  'When one task becomes cheaper, the value of the remaining tasks often rises.': freeze([
    correction(['the value of the remaining tasks'], [
      { role: 'S', en: 'the value', ja: '価値は' },
      { role: 'M', en: 'of the remaining tasks', ja: '残りの作業の' },
    ], '主節の主語Sの中心は the value です。of 以下は何の価値かを後ろから限定します。'),
  ]),
  'Cash machines reduced the routine work of bank clerks.': freeze([
    correction(['the routine work of bank clerks'], [
      { role: 'O', en: 'the routine work', ja: '定型的な仕事を' },
      { role: 'M', en: 'of bank clerks', ja: '銀行員の' },
    ], 'reduced の目的語Oの中心は the routine work です。of 以下は誰の仕事かを限定します。'),
  ]),
  'Aggregate stability can hide serious harm to particular regions and age groups.': freeze([
    correction(['serious harm to particular regions and age groups'], [
      { role: 'O', en: 'serious harm', ja: '深刻な打撃を' },
      { role: 'M', en: 'to particular regions and age groups', ja: '特定の地域や年齢層への' },
    ], 'hide の目的語Oの中心は serious harm です。to 以下は誰への打撃かを後ろから限定します。'),
  ]),
  'Employment law, union strength, and public investment decide how any productivity gain is shared.': freeze([
    correction(['Employment law, union strength, and public investment'], [
      { role: 'S', en: 'Employment law', ja: '雇用法' },
      { role: 'S', en: 'union strength', ja: '労働組合の力' },
      { role: 'S', en: 'and public investment', ja: 'そして公共投資が' },
    ], '三つの名詞句が並んで一つの主語Sを作ります。動詞 decide は複数主語に対応しています。'),
  ]),
  'Evaluation is as important as ambition, since untested programs consume budgets that could support proven ones.': freeze([
    correction(['is', 'as important'], [
      { role: 'V', en: 'is as important', ja: '同じくらい重要です' },
    ], 'as ... as の前半は be動詞と一体で程度を示します。短い述語と補語を切り離さず一息で読みます。'),
    correction(['budgets that could support proven ones'], [
      { role: 'O', en: 'budgets', ja: '予算を' },
      { role: 'M', en: 'that could support proven ones', ja: '実証済みの制度を支えうる' },
    ], 'consume の目的語Oは budgets です。that 以下は関係詞節で、どんな予算かを後ろから説明します。'),
  ]),
  'For most of the last century, a photograph or a sound recording carried a special kind of authority in public argument.': freeze([
    correction(['a photograph or a sound recording'], [
      { role: 'S', en: 'a photograph', ja: '写真は' },
      { role: 'S', en: 'or a sound recording', ja: 'あるいは録音は' },
    ], 'or で並ぶ二つの名詞句がまとめて主語Sになります。どちらにも同じ述語がかかります。'),
  ]),
  'Many readers of a false claim never see the response to it.': freeze([
    correction(['Many readers of a false claim'], [
      { role: 'S', en: 'Many readers', ja: '多くの読者は' },
      { role: 'M', en: 'of a false claim', ja: '偽の主張の' },
    ], '主語Sの中心は Many readers です。of 以下は何の読者かを後ろから限定します。'),
  ]),
  'Detection therefore deserves continued investment, but it cannot carry the whole burden of public trust.': freeze([
    correction(['the whole burden of public trust'], [
      { role: 'O', en: 'the whole burden', ja: '重荷のすべてを' },
      { role: 'M', en: 'of public trust', ja: '公共の信頼という' },
    ], 'carry の目的語Oの中心は the whole burden です。of 以下は何の重荷かを後ろから限定します。'),
  ]),
  'Metadata that establishes authenticity may also reveal the location, the device, and the identity of a source.': freeze([
    correction(['may also reveal the location, the device,'], [
      { role: 'V', en: 'may', ja: '可能性を表し（動作は次へ）' },
      { role: 'M', en: 'also', ja: '同時に' },
      { role: 'V', en: 'reveal', ja: '明らかにするおそれがあります' },
      { role: 'O', en: 'the location, the device,', ja: '場所や機器を' },
    ], 'mayとrevealがVを作り、その間のalsoは追加の危険を示す副詞Mです。コンマで並ぶ目的語Oを後ろへ分けます。'),
  ]),
  'A system designed to protect the public can therefore endanger the people who expose wrongdoing.': freeze([
    correction(['A system designed to protect the public'], [
      { role: 'S', en: 'A system', ja: '仕組みは' },
      { role: 'M', en: 'designed to protect the public', ja: '公衆を守るために設計された' },
    ], '主語Sの中心は A system です。designed 以下は過去分詞句で、どんな仕組みかを後ろから説明します。'),
  ]),
  'Newsrooms that publish their verification steps allow readers to judge the strength of a report.': freeze([
    correction(['to judge'], [
      {
        role: 'C',
        en: 'to judge',
        ja: '判断することを',
        infinitiveBinding: {
          type: 'object-to-infinitive',
          governor: 'allow',
          semanticSubject: 'readers',
        },
      },
    ], 'allow O to do の不定詞で、判断する主体は目的語の readers です。'),
    correction(['Newsrooms that publish their verification steps'], [
      { role: 'S', en: 'Newsrooms', ja: '報道機関は' },
      { role: 'M', en: 'that publish their verification steps', ja: '検証の手順を公開する' },
    ], '主語Sは Newsrooms の一語です。that 以下は関係詞節で、どんな報道機関かを後ろから説明します。'),
  ]),
  'The burden of this new work is distributed very unevenly across the world.': freeze([
    correction(['The burden of this new work'], [
      { role: 'S', en: 'The burden', ja: '負担は' },
      { role: 'M', en: 'of this new work', ja: 'この新しい作業の' },
    ], '主語Sの中心は The burden です。of 以下は何の負担かを後ろから限定します。'),
  ]),
  'Most detection tools and training materials are produced for a few widely spoken languages.': freeze([
    correction(['Most detection tools and training materials'], [
      { role: 'S', en: 'Most detection tools', ja: '検出の道具の多くは' },
      { role: 'S', en: 'and training materials', ja: 'そして研修資料は' },
    ], 'and で並ぶ二つの名詞句がまとめて主語Sになります。受動態の述語は両方にかかります。'),
  ]),
  'Several agencies now set a fixed period for leaving crowded orbits.': freeze([
    correction(['now set'], [
      { role: 'M', en: 'now', ja: '今では' },
      { role: 'V', en: 'set', ja: '定めています' },
    ], 'now は時を示すM、set が定めるという動作のVです。名詞の set と読み違えないように分けます。'),
  ]),
  'A worker of fifty-five rarely benefits from jobs created ten years later in another city.': freeze([
    correction(['rarely benefits'], [
      { role: 'M', en: 'rarely', ja: 'めったに〜しません' },
      { role: 'V', en: 'benefits', ja: '利益を得ます' },
    ], 'rarely は頻度を否定する副詞Mで、benefits が述語Vです。文全体はほぼ否定の意味になります。'),
  ]),
  'Communities with the fewest resources therefore face the highest risk of manufactured evidence.': freeze([
    correction(['therefore face'], [
      { role: 'M', en: 'therefore', ja: 'それゆえ' },
      { role: 'V', en: 'face', ja: '直面します' },
    ], 'therefore は前段からの帰結を示すM、face が述語Vです。名詞の face と読み違えないように分けます。'),
    correction(['the highest risk of manufactured evidence'], [
      { role: 'O', en: 'the highest risk', ja: '最も高い危険に' },
      { role: 'M', en: 'of manufactured evidence', ja: '作られた証拠の' },
    ], 'face の目的語Oの中心は the highest risk です。of 以下は何の危険かを後ろから限定します。'),
  ]),
})
