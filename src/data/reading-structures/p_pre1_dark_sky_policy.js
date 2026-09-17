import { st } from './entry.js'

export default Object.freeze([
  st('[M {前| For most {前| of human history}}], [S darkness] [V was] [C a predictable part {前| of every night}].', {
    chunks: [
      ['For most of human history,', '人の歴史のほとんどの間'],
      ['darkness was a predictable part', '暗さは、決まってやってくるものでした（何のかは次へ）'],
      ['of every night', '毎晩の（決まった一部でした）'],
    ],
    notes: {
      'darkness was a predictable part': 'predictable は「前もって分かる・決まってやってくる」。',
    },
  }),
  st('[S Modern lighting] [V has extended] [O working hours], [V made] [O travel] [C easier], [接 and] [V allowed] [O public spaces] [C {to:補語| [V to remain] [C active] [M {前| after sunset}]}].', {
    chunks: [
      ['Modern lighting has extended working hours,', '現代の照明は、働く時間を延ばし'],
      ['made travel easier,', '移動を楽にしました'],
      ['and allowed public spaces to remain active', 'そして、公共の場が活動を続けられるようにしました（いつまでかは次へ）'],
      ['after sunset', '日が沈んだ後も'],
    ],
    notes: {
      'Modern lighting has extended working hours,': '3つの動詞 has extended・made・allowed が and で並び、主語はどれも Modern lighting です。',
      'made travel easier,': 'make ＋ もの ＋ 形容詞 で「ものを〜の状態にする」。easier は easy の比較級です。',
      'and allowed public spaces to remain active': 'allow ＋ もの ＋ to 〜 で「ものが〜できるようにする」。remain ＋ 形容詞 で「〜のままである」。',
    },
    rules: ['parallel-shape', 'svoc-core', 'infinitive-role'],
  }),
  st('[M Yet] [S artificial light] [M now] [V reaches] [O places and times {関係>places and times| [M where] [S it] [V serves] [O little clear purpose]}].', {
    chunks: [
      ['Yet artificial light now reaches', 'しかし、人工の光は今では届いています（どこにかは次へ）'],
      ['places and times', '場所や時間にまで（どんな場所かは次へ）'],
      ['where it serves little clear purpose', 'はっきりした役目をほとんど果たさない（場所や時間に）'],
    ],
    notes: {
      'where it serves little clear purpose': 'little は「ほとんどない」という否定の意味。serve a purpose で「役目を果たす」。',
    },
  }),
  st('[S This excess] [V is known] [C {前| as light pollution}], [M {副詞節:譲歩| [接 though] [S the phrase] [V describes] [O several different problems]}].', {
    chunks: [
      ['This excess is known as light pollution,', 'この行きすぎた光は、光害と呼ばれています'],
      ['though the phrase describes several different problems', 'もっとも、この言葉はいくつかの別の問題をまとめて指しています'],
    ],
    notes: {
      'This excess is known as light pollution,': 'be known as 〜 で「〜として知られている」。excess は「多すぎること」。',
      'though the phrase describes several different problems': 'though は「〜ではあるが」。次の段落で、その別々の問題が並びます。',
    },
  }),
  st('[S Sky glow] [V makes] [O stars] [C difficult {to:副詞(形容詞)| [V to see] [M far {前| beyond the streets {関係>the streets| [S that] [V produce] [O it]}}]}].', {
    chunks: [
      ['Sky glow makes stars difficult to see', '空が明るくなると、星は見えにくくなります（どこでかは次へ）'],
      ['far beyond the streets', '通りからずっと離れた所でも（どんな通りかは次へ）'],
      ['that produce it', 'その明るさを出している（通りから）'],
    ],
    notes: {
      'Sky glow makes stars difficult to see': 'sky glow は、街の光が空をぼんやり明るくすることです。make ＋ もの ＋ 形容詞 で「ものを〜の状態にする」。',
      'that produce it': 'it は Sky glow を指します。光を出している通りから遠い場所でも星が見えにくい、ということです。',
    },
    rules: ['svoc-core', 'relative-clause', 'paragraph-map'],
  }),
  st('[S Glare {前| from a poorly aimed lamp}] [V can reduce] [O visibility] [M even {副詞節:時| [接 while] [V increasing] [O brightness]}].', {
    chunks: [
      ['Glare from a poorly aimed lamp', '向きの悪い照明のまぶしさは'],
      ['can reduce visibility', 'かえって見えにくくすることがあります'],
      ['even while increasing brightness', '明るさを増やしているときでさえ'],
    ],
    notes: {
      'Glare from a poorly aimed lamp': 'glare は「目に刺すようなまぶしさ」。poorly aimed は「向きの調整が悪い」。',
      'even while increasing brightness': 'while ＋ -ing で「〜しながら」。even が「〜でさえ」と意外さを加えます。',
    },
  }),
  st('[S Light {現在分詞>Light| [V entering] [O homes]}] [V may disturb] [O sleep], [M {副詞節:対比| [接 while] [S constant illumination] [V changes] [O the behavior {前| of insects, birds, and other animals}]}].', {
    chunks: [
      ['Light entering homes may disturb sleep,', '家の中に入る光は、眠りを妨げることがあります'],
      ['while constant illumination changes the behavior', '一方、ずっとついている照明は、ふるまいを変えます（何のかは次へ）'],
      ['of insects, birds, and other animals', '昆虫や鳥、ほかの動物の'],
    ],
    notes: {
      'Light entering homes may disturb sleep,': 'entering homes は Light を後ろから説明して「家に入ってくる光」。',
      'while constant illumination changes the behavior': 'while はここでは「一方で」と2つの影響を対比します。constant illumination は「絶え間ない照明」。',
    },
  }),
  st('[S Migrating birds] [V can lose] [O direction], [接 and] [S insects] [V may circle] [O lamps] [M {副詞節:時| [接 until] [S they] [V are] [C exhausted]}].', {
    chunks: [
      ['Migrating birds can lose direction,', '渡り鳥は方向が分からなくなることがあります'],
      ['and insects may circle lamps', 'そして昆虫は、照明の周りを回り続けることがあります（いつまでかは次へ）'],
      ['until they are exhausted', '疲れ切ってしまうまで'],
    ],
    notes: {
      'Migrating birds can lose direction,': 'migrating は「渡りをしている」。渡り鳥は星や空の明るさを頼りに進みます。',
      'until they are exhausted': 'exhausted は「疲れ切った」。until 〜 で「〜するまで」。',
    },
  }),
  st('[S Calls {to:形容詞>Calls| [V to reduce] [O night lighting]}] [M often] [V meet] [O an immediate objection {前| about safety}].', {
    chunks: [
      ['Calls to reduce night lighting', '夜の照明を減らそうという声は'],
      ['often meet an immediate objection', 'すぐに反対の声とぶつかることがよくあります（何についてかは次へ）'],
      ['about safety', '安全についての'],
    ],
    notes: {
      'Calls to reduce night lighting': 'to reduce night lighting が Calls を後ろから説明して「〜しようという声」。',
      'often meet an immediate objection': 'meet an objection で「反対に出会う」。immediate は「すぐの」。',
    },
    rules: ['infinitive-role', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S Residents] [V may] [M reasonably] [V fear] [O darker sidewalks], [接 and] [S workers] [V may need] [O visible routes] [M {前| during late shifts}].', {
    chunks: [
      ['Residents may reasonably fear darker sidewalks,', '住民が、暗くなった歩道を不安に思うのは当然です'],
      ['and workers may need visible routes', 'そして働く人には、見えやすい道が必要かもしれません（いつかは次へ）'],
      ['during late shifts', '夜遅い勤務のときには'],
    ],
    notes: {
      'Residents may reasonably fear darker sidewalks,': 'reasonably は「もっともなことに」。筆者は反対の声を無理のないものとして認めています。',
      'during late shifts': 'late shift は「夜遅い勤務」。',
    },
  }),
  st('[S Businesses] [M also] [V use] [O light] [M {to:副詞(目的)| [V to signal] [O {that節| [接 that] [S a place] [V is] [C open and welcoming]}]}].', {
    chunks: [
      ['Businesses also use light to signal', 'お店や会社も、知らせるために光を使います（何をかは次へ）'],
      ['that a place is open and welcoming', 'その場所が開いていて、入りやすいということを'],
    ],
    notes: {
      'Businesses also use light to signal': 'to signal は「知らせるために」という目的を表します。',
      'that a place is open and welcoming': 'welcoming は「迎えてくれる感じがする」。',
    },
  }),
  st('[S A policy {関係>A policy| [S that] [V treats] [O every lamp] [C {前| as equally harmful}]}] [V will] [M therefore] [V lose] [O public trust].', {
    chunks: [
      ['A policy that treats every lamp', 'どの照明も扱うような政策は（どう扱うかは次へ）'],
      ['as equally harmful', '同じように害があるものとして'],
      ['will therefore lose public trust', 'そのため、人々の信頼を失うでしょう'],
    ],
    notes: {
      'as equally harmful': 'treat A as B で「AをBとみなす」。equally は「同じように」。',
      'will therefore lose public trust': 'therefore は、安全を心配する声にも理由があるという前の3文を受けています。',
    },
  }),
  st('[S The relevant question] [V is not] [C {whether節| [接 whether] [S communities] [V should choose] [O light or darkness]}].', {
    chunks: [
      ['The relevant question is not', '考えるべき問いは〜ではありません（内容は次へ）'],
      ['whether communities should choose light or darkness', '地域が光か暗さのどちらかを選ぶべきか、ということ'],
    ],
    notes: {
      'The relevant question is not': 'relevant は「今の話に関わる・大事な」。not が whether 以下を打ち消しています。',
      'whether communities should choose light or darkness': 'whether A or B で「AかBかどうか」。二つに一つの問いの立て方を、筆者は退けています。',
    },
    rules: ['negation-scope', 'wh-clause', 'paragraph-map'],
  }),
  st('[S It] [V is] [C {疑問詞節| [M where] [S light] [V is needed]}, {疑問詞節| [S how much] [V is] [C useful]}, {疑問詞節| [C what color] [S it] [V should be]}, and {疑問詞節| [M when] [S it] [V should operate]}].', {
    chunks: [
      ['It is where light is needed,', '問うべきなのは、どこに光が必要かです'],
      ['how much is useful,', 'どれだけの明るさが役に立つか'],
      ['what color it should be,', 'どの色にするべきか'],
      ['and when it should operate', 'そして、いつつけるべきか'],
    ],
    notes: {
      'It is where light is needed,': 'It は前の文の The relevant question を指します。4つの疑問詞のまとまりが and で並び、どれも is の補語です。',
      'and when it should operate': 'operate はここでは「（照明が）働く・つく」。',
    },
  }),
  st('[S A shield] [V can direct] [O light] [M {前| toward the ground}] [M {前| instead of {動名詞| [V allowing] [O it] [C {to:補語| [V to escape] [M {前| into the sky or nearby windows}]}]}}].', {
    chunks: [
      ['A shield can direct light toward the ground', '覆いをつければ、光を地面の方へ向けられます'],
      ['instead of allowing it to escape', '光を逃がすのではなく（どこへかは次へ）'],
      ['into the sky or nearby windows', '空や近くの窓へ'],
    ],
    notes: {
      'A shield can direct light toward the ground': 'shield は照明の上や横につける覆いです。direct A toward B で「AをBの方へ向ける」。',
      'instead of allowing it to escape': 'instead of ＋ -ing で「〜する代わりに」。allow ＋ もの ＋ to 〜 で「ものが〜するのを許す」。it は light を指します。',
    },
  }),
  st('[S Warmer-colored lamps] [V may affect] [O wildlife] [M less {前| than blue-rich white light}].', {
    chunks: [
      ['Warmer-colored lamps may affect wildlife less', '暖かい色の照明のほうが、野生の生き物への影響が小さいかもしれません'],
      ['than blue-rich white light', '青い光を多く含む白い光より'],
    ],
    notes: {
      'Warmer-colored lamps may affect wildlife less': 'warmer-colored は「より暖かい色の」。less は「より少なく」で、affect を弱めています。',
    },
  }),
  st('[S Timers and motion sensors] [V can provide] [O brightness] [M {副詞節:時| [接 when] [S people] [V are] [C present]}] [M {前| without {動名詞| [V maintaining] [O it] [M all night]}}].', {
    chunks: [
      ['Timers and motion sensors can provide brightness', 'タイマーや人を感じるセンサーは、明るさを出せます（いつかは次へ）'],
      ['when people are present', '人がいるときに'],
      ['without maintaining it all night', '一晩中つけたままにせずに'],
    ],
    notes: {
      'when people are present': 'present はここでは「その場にいる」。',
      'without maintaining it all night': 'without ＋ -ing で「〜せずに」。it は brightness を指します。',
    },
  }),
  st('[S These changes] [V sound] [C simple], [接 but] [S good policy] [V requires] [O more {前| than {動名詞| [V replacing] [O equipment]}}].', {
    chunks: [
      ['These changes sound simple,', 'こうした工夫は簡単そうに聞こえます'],
      ['but good policy requires more', 'しかし、よい政策にはもっと多くのことが必要です（何以上かは次へ）'],
      ['than replacing equipment', '器具を取り替える以上に'],
    ],
    notes: {
      'These changes sound simple,': 'sound ＋ 形容詞 で「〜に聞こえる」。These changes は覆い・色・センサーの工夫です。',
      'than replacing equipment': 'more than 〜ing で「〜する以上のこと」。ここから、政策に必要な手順の話に移ります。',
    },
    rules: ['comparison-pairs', 'contrast-concession', 'paragraph-map'],
  }),
  st('[S Officials] [M first] [V need] [O a map {前| of current lighting}, {前| including ownership, energy use, brightness, direction, and hours {前| of operation}}].', {
    chunks: [
      ['Officials first need a map of current lighting,', '担当者はまず、今ある照明の地図が必要です（何を書いた地図かは次へ）'],
      ['including ownership, energy use,', 'だれのものか、どれだけ電気を使うか'],
      ['brightness, direction, and hours of operation', '明るさ、向き、つけている時間を書き入れた地図が'],
    ],
    notes: {
      'including ownership, energy use,': 'including 〜 で「〜を含めて」。地図に書き込む項目が5つ並びます。',
      'brightness, direction, and hours of operation': 'hours of operation は「動かしている時間」。',
    },
  }),
  st('[S They] [V must] [M also] [V learn] [O {疑問詞節| [M how] [S different groups] [V use] [O the same places] [M {前| at different times}]}].', {
    chunks: [
      ['They must also learn', '担当者はさらに知る必要があります（何をかは次へ）'],
      ['how different groups use the same places', 'いろいろな人たちが同じ場所をどう使うかを'],
      ['at different times', '時間帯によって'],
    ],
    notes: {
      'They must also learn': 'They は前の文の Officials を指します。',
      'how different groups use the same places': 'how 以下は「どのように〜か」という名詞のまとまりで、learn の目的語です。',
    },
  }),
  st('[S An empty park {前| at midnight}] [V may be] [C a necessary path {前| for a nurse {現在分詞>a nurse| [V returning] [M {前| from work}]}}].', {
    chunks: [
      ['An empty park at midnight', '真夜中の人のいない公園が'],
      ['may be a necessary path', '欠かせない通り道かもしれません（だれにとってかは次へ）'],
      ['for a nurse returning from work', '仕事から帰る看護師にとっては'],
    ],
    notes: {
      'An empty park at midnight': '「だれもいない公園」は暗くしてよさそうに見えますが、そうとは限らないという例です。',
      'for a nurse returning from work': 'returning from work が a nurse を後ろから説明して「仕事から帰る看護師」。',
    },
  }),
  st('[S Several communities] [V have begun] [M {前| with small trials} {前| rather than immediate town-wide rules}].', {
    chunks: [
      ['Several communities have begun', 'いくつかの地域は始めています（何からかは次へ）'],
      ['with small trials', '小さな試しから'],
      ['rather than immediate town-wide rules', '町全体の規則をすぐ作るのではなく'],
    ],
    notes: {
      'with small trials': 'begin with 〜 で「〜から始める」。trial は「試しにやってみること」。',
      'rather than immediate town-wide rules': 'town-wide は「町全体の」。A rather than B で「BではなくA」。',
    },
    rules: ['contrast-concession', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S One neighborhood] [V might shield] [O lamps] [接 and] [V reduce] [O brightness] [M {前| after the last bus}] [M {副詞節:時| [接 while] [V keeping] [O crossings] [C clearly lit]}].', {
    chunks: [
      ['One neighborhood might shield lamps', 'ある地区では、照明に覆いをつけるかもしれません'],
      ['and reduce brightness after the last bus', 'そして最終バスの後は明るさを下げる、というやり方です'],
      ['while keeping crossings clearly lit', '横断歩道をはっきり照らしたまま'],
    ],
    notes: {
      'and reduce brightness after the last bus': 'and の後ろの reduce の主語も One neighborhood です。might は「〜するかもしれない」という例の示し方です。',
      'while keeping crossings clearly lit': 'keep ＋ もの ＋ 過去分詞 で「ものを〜された状態にしておく」。lit は light の過去分詞です。',
    },
  }),
  st('[S Researchers] [V can] [M then] [V measure] [O sky brightness, energy use, traffic incidents, wildlife activity, and residents\' reported comfort].', {
    chunks: [
      ['Researchers can then measure sky brightness,', '研究者はそのあと、空の明るさを測れます'],
      ['energy use, traffic incidents, wildlife activity,', 'エネルギーの使用量、交通の事故、野生の生き物の活動'],
      ['and residents\' reported comfort', 'そして住民が答えた安心の度合いも'],
    ],
    notes: {
      'Researchers can then measure sky brightness,': 'then は「（試したあと）そのあとで」。測る項目が5つ並びます。',
      'and residents\' reported comfort': 'residents\' reported comfort は「住民が自分で答えた安心の度合い」。',
    },
  }),
  st('[S No single measure] [V proves] [O success], [接 but] [S several forms {前| of evidence}] [V can reveal] [O trade-offs].', {
    chunks: [
      ['No single measure proves success,', 'どれか一つの指標だけでは、うまくいったとは言えません'],
      ['but several forms of evidence', 'しかし、いくつかの種類の証拠を合わせれば'],
      ['can reveal trade-offs', '何を得て何を失うかが見えてきます'],
    ],
    notes: {
      'No single measure proves success,': 'No single 〜 で「どの一つの〜も…ない」。measure はここでは「測る物差し・指標」。',
      'can reveal trade-offs': 'trade-off は「一方を取れば他方をあきらめることになる関係」。',
    },
  }),
  st('[S The trial] [V should] [M also] [V record] [O complaints and near misses], [M {副詞節:理由| [接 since] [S average comfort] [V may hide] [O risks {過去分詞>risks| [V faced] [M {前| by a small group}]}]}].', {
    chunks: [
      ['The trial should also record', '試すときには、記録すべきです（何をかは次へ）'],
      ['complaints and near misses,', '苦情や、あやうく事故になりかけた例も'],
      ['since average comfort may hide risks', '平均の安心の度合いは、危険を隠してしまうことがあるからです（だれの危険かは次へ）'],
      ['faced by a small group', '少数の人が実際に受けている（危険を）'],
    ],
    notes: {
      'complaints and near misses,': 'near miss は「あと少しで事故になりかけたこと」。',
      'faced by a small group': 'faced は過去分詞で risks を後ろから説明して「〜が受けている危険」。平均では見えない少数の人の危険です。',
    },
  }),
  st('[S Economic arguments] [V can strengthen] [O the case {前| for careful lighting}], [接 but] [S they] [V can] [M also] [V distort] [O it].', {
    chunks: [
      ['Economic arguments can strengthen the case', 'お金の面からの説明は、主張を強められます（何のためのかは次へ）'],
      ['for careful lighting,', 'ていねいな照明にするための'],
      ['but they can also distort it', 'しかし、その主張をゆがめることもあります'],
    ],
    notes: {
      'Economic arguments can strengthen the case': 'the case for 〜 は「〜を支持する言い分」。',
      'but they can also distort it': 'they は Economic arguments、it は the case を指します。distort は「ゆがめる」。',
    },
    rules: ['contrast-concession', 'reference-chain', 'paragraph-map'],
  }),
  st('[S Dark-sky tourism] [V may bring] [O visitors] [M {前| to rural areas}], [接 and] [S lower electricity use] [V can save] [O public money].', {
    chunks: [
      ['Dark-sky tourism may bring visitors', '星空を目当てにした観光は、旅行者を運んでくるかもしれません（どこへかは次へ）'],
      ['to rural areas,', '農村部へ'],
      ['and lower electricity use can save public money', 'そして電気の使用が減れば、公のお金を節約できます'],
    ],
    notes: {
      'Dark-sky tourism may bring visitors': 'dark-sky tourism は、暗い夜空や星を見に行く観光です。',
      'and lower electricity use can save public money': 'lower は「より少ない」。public money は税金などの公のお金です。',
    },
  }),
  st('[M However], [S a policy] [V should not protect] [O only places {関係>only places| [M where] [S darkness] [V can be sold] [C {前| as an experience}]}].', {
    chunks: [
      ['However, a policy should not protect only places', 'しかし、政策が守るのは〜の場所だけではいけません（どんな場所かは次へ）'],
      ['where darkness can be sold as an experience', '暗さを体験として売れる（場所）'],
    ],
    notes: {
      'However, a policy should not protect only places': 'not … only は「〜だけを…するのではない」。観光になる場所だけを守るのは不十分だということです。',
      'where darkness can be sold as an experience': 'can be sold は sell の受け身。sell A as B で「AをBとして売る」。',
    },
  }),
  st('[S People {前| in ordinary neighborhoods}] [M also] [V deserve] [O sleep, visible stars, and healthy local ecosystems].', {
    chunks: [
      ['People in ordinary neighborhoods also deserve sleep,', '普通の住宅地に住む人にも、当然与えられるべきものがあります。眠りや'],
      ['visible stars, and healthy local ecosystems', '見える星、健全な地域の生態系です'],
    ],
    notes: {
      'People in ordinary neighborhoods also deserve sleep,': 'deserve は「当然受けるに値する」。観光地でない場所の人も同じだ、ということです。',
      'visible stars, and healthy local ecosystems': 'deserve の目的語に3つが and で並んでいます。ecosystem は「生態系」。',
    },
  }),
  st('[S The strongest standards] [V set] [O goals {前| for useful light}] [M {前| rather than {動名詞| [V demanding] [O darkness] [M {前| for its own sake}]}}].', {
    chunks: [
      ['The strongest standards set goals for useful light', '最もしっかりした基準は、役に立つ光のための目標を定めます'],
      ['rather than demanding darkness for its own sake', '暗さそのものを求めるのではなく'],
    ],
    notes: {
      'The strongest standards set goals for useful light': 'set goals for 〜 で「〜のための目標を定める」。',
      'rather than demanding darkness for its own sake': 'for its own sake は「それ自体を目的として」。暗くすること自体が目的ではない、ということです。',
    },
    rules: ['contrast-concession', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S They] [V specify] [O direction, intensity, color, and timing] [M {副詞節:時| [接 while] [V allowing] [O justified exceptions]}].', {
    chunks: [
      ['They specify direction, intensity, color, and timing', 'その基準は、向き、強さ、色、時間を決めます'],
      ['while allowing justified exceptions', '理由のある例外は認めながら'],
    ],
    notes: {
      'They specify direction, intensity, color, and timing': 'They は前の文の The strongest standards を指します。specify は「はっきり決める」。',
      'while allowing justified exceptions': 'justified は「理由のある・正当な」。while ＋ -ing で「〜しながら」。',
    },
  }),
  st('[S They] [M also] [V require] [O monitoring] [M {副詞節:理由| [接 because] [S new buildings, new technologies, and changing travel patterns] [V can alter] [O local needs]}].', {
    chunks: [
      ['They also require monitoring', 'その基準は、見守り続けることも求めます（なぜかは次へ）'],
      ['because new buildings, new technologies,', '新しい建物や新しい技術'],
      ['and changing travel patterns can alter local needs', 'そして移動の仕方の変化が、地域の必要を変えうるからです'],
    ],
    notes: {
      'They also require monitoring': 'monitoring は「様子を測り続けること」。一度決めて終わりにしない、ということです。',
      'and changing travel patterns can alter local needs': 'changing travel patterns は「変わっていく移動の仕方」。alter は「変える」。',
    },
  }),
  st('[S Public reports] [V allow] [O residents] [C {to:補語| [V to see] [O {whether節| [接 whether] [S promised improvements] [M actually] [V occur]}]}].', {
    chunks: [
      ['Public reports allow residents to see', '公開される報告は、住民が確かめられるようにします（何をかは次へ）'],
      ['whether promised improvements actually occur', '約束された改善が実際に起きているかどうかを'],
    ],
    notes: {
      'Public reports allow residents to see': 'allow ＋ 人 ＋ to 〜 で「人が〜できるようにする」。',
      'whether promised improvements actually occur': 'whether 以下は「〜かどうか」という名詞のまとまりで、to see の目的語です。',
    },
  }),
  st('[S {動名詞| [V Protecting] [O the night]}] [V is] [M therefore] [C not a return {前| to the past} but a more disciplined use {前| of modern light}].', {
    chunks: [
      ['Protecting the night is therefore not a return', 'だから、夜を守ることは、戻ることではなく'],
      ['to the past', '昔へ'],
      ['but a more disciplined use of modern light', '現代の光を、より節度をもって使うことなのです'],
    ],
    notes: {
      'Protecting the night is therefore not a return': 'Protecting the night は動名詞のまとまりで、文の主語です。not A but B で「AではなくB」。',
      'but a more disciplined use of modern light': 'disciplined は「節度のある・きちんと管理された」。筆者の結論は but の後ろにあります。',
    },
    rules: ['contrast-concession', 'ing-ed-role', 'author-stance'],
  }),
])
