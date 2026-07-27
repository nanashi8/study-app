// 中学・高校カリキュラムに沿った「文法解説」コンテンツ。
// 既存の4択クイズ（grammar.js）は英検級ごとだが、こちらは学年段階で並べて
// 「読んで理解する」ための解説を提供する。各レッスンは level/topic を持ち、
// grammar.js の同じ topic のクイズへ接続できる（無い場合は quiz リンクを出さない）。
//
//   stage  : 学年段階（中1/中2/中3/高校基礎/高校発展）
//   title  : 単元名
//   level  : 対応する英検級（クイズ接続・色分け用）
//   topic  : grammar.js の topic と一致させるとクイズへ飛べる
//   summary: 一言まとめ
//   form   : 形（語順・公式）。任意
//   points : 押さえるポイント（配列）
//   examples: 例文 [{en, ja}]
//   pitfalls: つまずきやすい点（任意・配列）

export const GRAMMAR_STAGES = ['中1', '中2', '中3', '高校基礎', '高校発展']

export const GRAMMAR_LESSONS = [
  // ───────────────────── 中1（英検5級）─────────────────────
  {
    id: 'gl_j1_be',
    stage: '中1',
    title: 'be動詞（am / is / are）',
    level: '5',
    topic: 'be動詞',
    summary: '「〜です」「〜にいる・ある」を表す。主語によって am/is/are を使い分ける。',
    form: '主語 + be動詞 + 〜.',
    points: [
      'I のときは am、he / she / it など3人称単数のときは is、you と複数のときは are。',
      '否定文は be動詞のあとに not（is not = isn’t、are not = aren’t）。',
      '疑問文は be動詞を主語の前に出す（Are you ...? / Is she ...?）。',
    ],
    examples: [
      { en: 'I am a student.', ja: '私は学生です。' },
      { en: 'She is kind.', ja: '彼女は親切です。' },
      { en: 'Are you busy now?', ja: 'あなたは今忙しいですか。' },
    ],
    pitfalls: ['一般動詞の文に be動詞を重ねない（×I am play → ○I play / ○I am playing）。'],
  },
  {
    id: 'gl_j1_verb',
    stage: '中1',
    title: '一般動詞と3人称単数のs',
    level: '5',
    topic: '一般動詞・3単現',
    summary: '動作や状態を表す一般動詞。主語が3人称単数で現在のときは動詞に s/es をつける。',
    form: 'He / She / It + 動詞-(e)s + 〜.',
    points: [
      '主語が he / she / it / 単数名詞のとき、現在形の動詞に s をつける（play → plays）。',
      's, x, ch, sh, o で終わる語は es（go → goes、watch → watches）。',
      '〈子音字＋y〉で終わる語は y を i に変えて es（study → studies）。',
    ],
    examples: [
      { en: 'He plays tennis every day.', ja: '彼は毎日テニスをします。' },
      { en: 'My sister goes to school by bus.', ja: '姉はバスで学校へ行きます。' },
      { en: 'She studies English hard.', ja: '彼女は英語を熱心に勉強します。' },
    ],
    pitfalls: ['I / you / 複数主語のときは s をつけない（○I play / ×I plays）。'],
  },
  {
    id: 'gl_j1_neg',
    stage: '中1',
    title: '否定文・疑問文（do / does）',
    level: '5',
    topic: '否定文・疑問文',
    summary: '一般動詞の否定文・疑問文は do / does を使い、動詞は原形にする。',
    form: '主語 + do/does + not + 動詞の原形 〜. ／ Do/Does + 主語 + 動詞の原形 〜?',
    points: [
      '主語が I / you / 複数 → do、3人称単数 → does。',
      'does や did を使ったら、動詞は必ず原形に戻す（Does she play? の play）。',
      '答えは Yes, she does. / No, she doesn’t. のように do/does で返す。',
    ],
    examples: [
      { en: 'I do not like natto.', ja: '私は納豆が好きではありません。' },
      { en: 'Does she play the piano?', ja: '彼女はピアノを弾きますか。' },
    ],
    pitfalls: ['×Does she plays → ○Does she play（does の後ろは原形）。'],
  },
  {
    id: 'gl_j1_plural',
    stage: '中1',
    title: '名詞の複数形',
    level: '5',
    topic: '名詞の複数形',
    summary: '数えられる名詞が2つ以上のときは複数形にする。',
    points: [
      '基本は s（book → books）。',
      's, x, ch, sh, o で終わる語は es（box → boxes、bus → buses）。',
      '〈子音字＋y〉は y→ies（city → cities）。不規則も（man → men、child → children）。',
    ],
    examples: [
      { en: 'I have three boxes.', ja: '私は箱を3つ持っています。' },
      { en: 'There are many animals in the zoo.', ja: '動物園にはたくさんの動物がいます。' },
    ],
  },
  {
    id: 'gl_j1_pron',
    stage: '中1',
    title: '代名詞（格変化）',
    level: '5',
    topic: '代名詞',
    summary: '代名詞は文中の働きで形が変わる（主格・所有格・目的格・所有代名詞）。',
    form: 'I - my - me - mine / he - his - him - his / they - their - them - theirs',
    points: [
      '主語になる→主格（I, he, they）、動詞・前置詞の後ろ→目的格（me, him, them）。',
      '「〜の」は所有格（my, his, their）、「〜のもの」は所有代名詞（mine, his, theirs）。',
    ],
    examples: [
      { en: 'This is Ken. I know him.', ja: 'こちらはケンです。私は彼を知っています。' },
      { en: 'This bag is mine.', ja: 'このかばんは私のものです。' },
    ],
  },
  {
    id: 'gl_j1_wh',
    stage: '中1',
    title: '疑問詞（5W1H）',
    level: '5',
    topic: '疑問詞',
    summary: 'what / who / when / where / why / how などで具体的にたずねる。',
    form: '疑問詞 + do/does/be + 主語 + 〜?',
    points: [
      'what(何) / who(誰) / when(いつ) / where(どこ) / why(なぜ) / how(どのように)。',
      '疑問詞は文の先頭。そのあとは Yes/No疑問文と同じ語順。',
      'Yes/No では答えず、具体的な内容で答える。',
    ],
    examples: [
      { en: 'When is your birthday?', ja: 'あなたの誕生日はいつですか。' },
      { en: 'Where do you live?', ja: 'あなたはどこに住んでいますか。' },
    ],
  },
  {
    id: 'gl_j1_prep',
    stage: '中1',
    title: '前置詞（場所・時）',
    level: '5',
    topic: '前置詞',
    summary: '名詞の前に置いて、場所・時・方向などの関係を表す。',
    points: [
      '時刻は at（at seven）、曜日・日付は on（on Monday）、月・年・季節は in（in May）。',
      '場所は in（中）、on（接して上）、under（下）、by/near（そば）など。',
    ],
    examples: [
      { en: 'I get up at seven.', ja: '私は7時に起きます。' },
      { en: 'The cat is under the table.', ja: '猫はテーブルの下にいます。' },
    ],
  },
  {
    id: 'gl_j1_can',
    stage: '中1',
    title: '助動詞 can',
    level: '5',
    topic: '助動詞 can',
    summary: 'can は「〜できる」（能力・可能）。助動詞のあとの動詞は原形。',
    form: '主語 + can + 動詞の原形 〜.',
    points: [
      'can は主語が3人称単数でも形は変わらない（×cans）。',
      '否定は cannot（can’t）、疑問は Can you ...? で始める。',
      'Can I ...? で許可、Can you ...? で依頼も表せる。',
    ],
    examples: [
      { en: 'She can swim very well.', ja: '彼女はとても上手に泳げます。' },
      { en: 'Can you help me?', ja: '手伝ってくれますか。' },
    ],
  },
  {
    id: 'gl_j1_prog',
    stage: '中1',
    title: '現在進行形',
    level: '5',
    topic: '現在進行形',
    summary: '「今〜している最中だ」を表す。be動詞＋動詞ing。',
    form: '主語 + am/is/are + 動詞-ing 〜.',
    points: [
      'ing の作り方：基本は ing、e で終わる語は e をとって ing（make → making）、',
      '〈短母音＋子音字〉は子音を重ねて ing（run → running）。',
      'like / know / have(持つ) など状態を表す動詞は普通進行形にしない。',
    ],
    examples: [
      { en: 'He is watching TV now.', ja: '彼は今テレビを見ています。' },
      { en: 'They are running in the park.', ja: '彼らは公園で走っています。' },
    ],
  },
  {
    id: 'gl_j1_imp',
    stage: '中1',
    title: '命令文',
    level: '5',
    topic: '命令文',
    summary: '相手に指示・依頼するとき、主語を省いて動詞の原形で始める。',
    form: '動詞の原形 〜. ／ Don’t + 動詞の原形 〜. ／ Let’s + 動詞の原形 〜.',
    points: [
      'be動詞の命令文は Be で始める（Be quiet.）。',
      '否定の命令は Don’t 〜（Don’t run.）。',
      'Let’s 〜 で「〜しましょう」と誘う。please を付けると丁寧。',
    ],
    examples: [
      { en: 'Be quiet, please.', ja: '静かにしてください。' },
      { en: 'Let’s play soccer.', ja: 'サッカーをしましょう。' },
    ],
  },

  // ───────────────────── 中2（英検4級）─────────────────────
  {
    id: 'gl_j2_past',
    stage: '中2',
    title: '過去形',
    level: '4',
    topic: '過去形',
    summary: '過去の動作・状態を表す。規則動詞は -ed、不規則動詞は形が変わる。',
    form: '主語 + 動詞の過去形 〜.（否定・疑問は did を使う）',
    points: [
      '規則動詞は -ed（play → played）。不規則動詞は暗記（go → went、write → wrote）。',
      '否定・疑問は did を使い、動詞は原形に戻す（Did you watch ...?）。',
      'be動詞の過去は was（I/3人称単数）/ were（you・複数）。',
    ],
    examples: [
      { en: 'I went to Kyoto last week.', ja: '私は先週京都へ行きました。' },
      { en: 'Did you watch the game?', ja: 'あなたはその試合を見ましたか。' },
    ],
    pitfalls: ['×Did you watched → ○Did you watch。'],
  },
  {
    id: 'gl_j2_pastprog',
    stage: '中2',
    title: '過去進行形',
    level: '4',
    topic: '過去進行形',
    summary: '「（過去のある時に）〜している最中だった」。was/were＋動詞ing。',
    form: '主語 + was/were + 動詞-ing 〜.',
    points: [
      '主語 I / 3人称単数 → was、you / 複数 → were。',
      'when（〜したとき）や while（〜している間に）とよく一緒に使う。',
    ],
    examples: [
      { en: 'I was watching TV at nine.', ja: '私は9時にテレビを見ていました。' },
      { en: 'She was cooking when I came home.', ja: '私が帰宅したとき彼女は料理をしていた。' },
    ],
  },
  {
    id: 'gl_j2_future',
    stage: '中2',
    title: '未来表現（will / be going to）',
    level: '4',
    topic: '未来表現',
    summary: '未来のことは will または be going to で表す。',
    form: 'will + 原形 ／ be going to + 原形',
    points: [
      'will はその場で決めた意志・予測、be going to は前から決めていた予定によく使う。',
      'will のあとも be going to のあとも動詞は原形。',
      '否定は won’t（will not）/ am not going to。',
    ],
    examples: [
      { en: 'It will rain tomorrow.', ja: '明日は雨が降るでしょう。' },
      { en: 'I am going to study tonight.', ja: '私は今夜勉強するつもりです。' },
    ],
  },
  {
    id: 'gl_j2_modal',
    stage: '中2',
    title: '助動詞（must / should / may など）',
    level: '4',
    topic: '助動詞',
    summary: '動詞に意味を加える語。あとの動詞は必ず原形。',
    points: [
      'must「〜しなければならない」、should「〜すべきだ」、may「〜してもよい・かもしれない」。',
      'have to も「〜しなければならない」。否定の don’t have to は「〜しなくてよい」。',
      'must not は「〜してはいけない」（強い禁止）で意味が変わる点に注意。',
    ],
    examples: [
      { en: 'You must finish your homework first.', ja: 'まず宿題を終えなければならない。' },
      { en: 'You should see a doctor.', ja: '医者に診てもらうべきです。' },
    ],
  },
  {
    id: 'gl_j2_inf',
    stage: '中2',
    title: '不定詞（to + 動詞の原形）',
    level: '4',
    topic: '不定詞',
    summary: 'to＋原形で「〜すること／〜するための／〜するために」の3用法。',
    form: 'to + 動詞の原形',
    points: [
      '名詞的用法「〜すること」（I want to be a doctor.）。',
      '形容詞的用法「〜するための」名詞を後ろから修飾（work to do）。',
      '副詞的用法「〜するために」目的（go to see ...）。',
    ],
    examples: [
      { en: 'I want to be a doctor.', ja: '私は医者になりたい。' },
      { en: 'I have a lot of work to do.', ja: '私にはやるべき仕事がたくさんある。' },
    ],
  },
  {
    id: 'gl_j2_ger',
    stage: '中2',
    title: '動名詞（動詞ing＝〜すること）',
    level: '4',
    topic: '動名詞',
    summary: '動詞ingが名詞の働きをして「〜すること」を表す。',
    points: [
      'enjoy / finish / stop / practice などの後ろは動名詞（to不定詞は不可）。',
      'want / hope / decide などの後ろは to不定詞。',
      '前置詞の後ろは必ず動名詞（good at playing）。',
    ],
    examples: [
      { en: 'He enjoys playing soccer.', ja: '彼はサッカーをするのを楽しむ。' },
      { en: 'She is good at singing.', ja: '彼女は歌うのが得意だ。' },
    ],
    pitfalls: ['×enjoy to play → ○enjoy playing。'],
  },
  {
    id: 'gl_j2_comp',
    stage: '中2',
    title: '比較（原級・比較級・最上級）',
    level: '4',
    topic: '比較',
    summary: '2つ・3つ以上を比べる表現。-er/-est、または more/most を使う。',
    form: 'A is 比較級 than B. ／ A is the 最上級 of/in 〜.',
    points: [
      '短い語は -er / -est（tall→taller→tallest）。',
      '長い語は more / most（interesting→more→most）。',
      '同程度は〈as＋原級＋as〉。good→better→best など不規則も。',
    ],
    examples: [
      { en: 'Tom is taller than Ken.', ja: 'トムはケンより背が高い。' },
      { en: 'This is the most interesting book of the three.', ja: 'これは3冊の中で一番面白い本です。' },
    ],
  },
  {
    id: 'gl_j2_conj',
    stage: '中2',
    title: '接続詞（when / because / if / that）',
    level: '4',
    topic: '接続詞',
    summary: '2つの文をつないで理由・条件・時などの関係を表す。',
    points: [
      'when（〜のとき）、because（〜だから）、if（もし〜なら）、that（〜ということ）。',
      'when / if の中の文では、未来のことでも現在形で表す。',
      'I think that 〜 の that は省略できる。',
    ],
    examples: [
      { en: 'Call me when you arrive.', ja: '着いたら電話してください。' },
      { en: 'I was happy because I passed the test.', ja: '試験に受かったので私はうれしかった。' },
    ],
  },
  {
    id: 'gl_j2_there',
    stage: '中2',
    title: 'There is / are 構文',
    level: '4',
    topic: 'There is/are',
    summary: '「〜がある／いる」と存在を表す。be動詞は後ろの名詞に合わせる。',
    form: 'There + is/are + 名詞 + 場所.',
    points: [
      '後ろが単数 → There is、複数 → There are。',
      '過去は There was / were。',
      'the や my など「特定のもの」は普通この構文では使わない。',
    ],
    examples: [
      { en: 'There are many books on the desk.', ja: '机の上にたくさんの本があります。' },
      { en: 'There is a cat under the chair.', ja: 'いすの下に猫が1匹います。' },
    ],
  },

  // ───────────────────── 中3（英検3級）─────────────────────
  {
    id: 'gl_j3_perf',
    stage: '中3',
    title: '現在完了（have + 過去分詞）',
    level: '3',
    topic: '現在完了',
    summary: '過去と現在をつなぐ表現。継続・経験・完了の3用法。',
    form: '主語 + have/has + 過去分詞 〜.',
    points: [
      '継続「ずっと〜している」：for（期間）/ since（起点）と。',
      '経験「〜したことがある」：ever / never / 〜 times と。have been to「行ったことがある」。',
      '完了「〜したところだ」：already / just / yet と。',
    ],
    examples: [
      { en: 'I have lived in Tokyo for ten years.', ja: '私は10年間東京に住んでいます。' },
      { en: 'She has been to Australia twice.', ja: '彼女は2回オーストラリアに行ったことがあります。' },
    ],
    pitfalls: ['yesterday など過去の一点を表す語とは一緒に使えない（過去形を使う）。'],
  },
  {
    id: 'gl_j3_pass',
    stage: '中3',
    title: '受動態（be + 過去分詞）',
    level: '3',
    topic: '受動態',
    summary: '「〜される／された」と動作を受ける側を主語にする言い方。',
    form: '主語 + be動詞 + 過去分詞（+ by 〜）.',
    points: [
      '時制は be動詞で表す（is read / was cleaned / will be done）。',
      '動作主は by 〜 で表すが、不要なら省略する。',
      '疑問・否定は be動詞を使う（Is it made ...? / is not made）。',
    ],
    examples: [
      { en: 'This book is read by many people.', ja: 'この本は多くの人に読まれています。' },
      { en: 'The room was cleaned yesterday.', ja: 'その部屋は昨日掃除された。' },
    ],
  },
  {
    id: 'gl_j3_rel',
    stage: '中3',
    title: '関係代名詞（who / which / that）',
    level: '3',
    topic: '関係代名詞',
    summary: '名詞（先行詞）を後ろから文で説明する。who / which / that でつなぐ。',
    form: '先行詞 + 関係代名詞 + 〈動詞〜 または 主語＋動詞〜〉',
    points: [
      '先行詞が人で主格→who、物で主格→which、目的格はどちらも that 可。',
      '目的格の関係代名詞は省略できる（the book (which) I bought）。',
      '関係代名詞のかたまりは1つの形容詞のように先行詞を修飾する。',
    ],
    examples: [
      { en: 'I have a friend who lives in Canada.', ja: '私にはカナダに住む友達がいます。' },
      { en: 'This is the book which I bought yesterday.', ja: 'これは私が昨日買った本です。' },
    ],
  },
  {
    id: 'gl_j3_indq',
    stage: '中3',
    title: '間接疑問',
    level: '3',
    topic: '間接疑問',
    summary: '疑問文が文の一部になると、〈疑問詞＋主語＋動詞〉の語順になる。',
    form: '... 疑問詞 + 主語 + 動詞 ...',
    points: [
      'Who is he? → I don’t know who he is.（語順が肯定文と同じに戻る）。',
      'do / does / did は使わず、時制だけ動詞に反映させる。',
    ],
    examples: [
      { en: 'I don’t know who he is.', ja: '私は彼が誰なのか知りません。' },
      { en: 'Tell me where the station is.', ja: '駅がどこか教えてください。' },
    ],
    pitfalls: ['×I don’t know who is he → ○who he is。'],
  },
  {
    id: 'gl_j3_inf2',
    stage: '中3',
    title: '不定詞の応用（形式主語・want 人 to）',
    level: '3',
    topic: '不定詞応用',
    summary: 'It is ... to do や〈want＋人＋to do〉など、不定詞の発展的な使い方。',
    points: [
      'It is ... (for 人) to do.「（人が）〜することは…だ」の形式主語 it。',
      '〈want / ask / tell + 人 + to do〉「人に〜してほしい／頼む／言う」。',
      '〈too ... to do〉「〜すぎて…できない」、〈... enough to do〉「〜するほど十分…」。',
    ],
    examples: [
      { en: 'It is important to study English every day.', ja: '毎日英語を勉強することは大切だ。' },
      { en: 'I want you to help me.', ja: 'あなたに手伝ってほしい。' },
    ],
  },
  {
    id: 'gl_j3_svoo',
    stage: '中3',
    title: '文型（SVOO / SVOC）',
    level: '3',
    topic: '文型(SVOO/SVOC)',
    summary: '動詞のあとに目的語が2つ（SVOO）や、目的語＋補語（SVOC）が続く形。',
    points: [
      'SVOO：give / show / teach など〈動詞＋人＋物〉「人に物を〜する」。',
      'SVOC：make / call / keep など〈動詞＋O＋C〉「OをCにする／と呼ぶ」。Cは名詞か形容詞。',
      'SVOO は〈物＋to/for＋人〉に書き換えられる（give me a pen = give a pen to me）。',
    ],
    examples: [
      { en: 'He gave me a present.', ja: '彼は私にプレゼントをくれた。' },
      { en: 'The news made me happy.', ja: 'その知らせは私を幸せにした。' },
    ],
  },
  {
    id: 'gl_j3_part',
    stage: '中3',
    title: '分詞による名詞の修飾',
    level: '3',
    topic: '分詞',
    summary: '現在分詞(ing)・過去分詞(ed)が形容詞のように名詞を修飾する。',
    points: [
      '現在分詞「〜している」（the running boy / the boy running there）。',
      '過去分詞「〜された」（a broken window / a language spoken in Canada）。',
      '1語なら名詞の前、2語以上のかたまりなら名詞の後ろに置く。',
    ],
    examples: [
      { en: 'The boy running over there is my brother.', ja: 'あそこで走っている少年は私の弟です。' },
      { en: 'This is a picture taken by my father.', ja: 'これは父が撮った写真です。' },
    ],
  },

  // ───────────────────── 高校基礎（英検準2・2級）─────────────────────
  {
    id: 'gl_h1_reladv',
    stage: '高校基礎',
    title: '関係副詞（where / when / why / how）',
    level: 'pre2',
    topic: '関係副詞',
    summary: '場所・時・理由・方法を表す名詞を、後ろの文で説明する。',
    form: '先行詞(場所/時/理由) + where/when/why + 主語 + 動詞 〜',
    points: [
      'where（場所）、when（時）、why（理由 the reason）、how（方法、the way とは併用しない）。',
      '関係副詞のあとは欠けのない完全な文が続く（前置詞＋関係代名詞に置き換え可）。',
    ],
    examples: [
      { en: 'This is the house where she lives.', ja: 'ここは彼女が住んでいる家です。' },
      { en: 'I remember the day when we met.', ja: '私は私たちが出会った日を覚えています。' },
    ],
  },
  {
    id: 'gl_h1_pastperf',
    stage: '高校基礎',
    title: '過去完了（had + 過去分詞）',
    level: 'pre2',
    topic: '過去完了',
    summary: '過去のある時点より前の出来事（大過去）や、その時点までの継続・経験・完了。',
    form: '主語 + had + 過去分詞 〜.',
    points: [
      '過去の2つの出来事で「より前」を had＋過去分詞で表す。',
      '「〜したとき、すでに…していた」のように時の前後を明確にする。',
    ],
    examples: [
      { en: 'The train had already left when I got to the station.', ja: '私が駅に着いたとき、電車はすでに出ていた。' },
      { en: 'She had never seen snow before she came to Japan.', ja: '彼女は来日前に雪を見たことがなかった。' },
    ],
  },
  {
    id: 'gl_h1_causative',
    stage: '高校基礎',
    title: '使役動詞・知覚動詞（原形不定詞）',
    level: 'pre2',
    topic: '使役・知覚',
    summary: 'make / let / have や see / hear などの後ろは to のない原形を使う。',
    form: 'make/let/have + O + 動詞の原形 ／ see/hear + O + 原形（または -ing）',
    points: [
      '使役：make O do「Oに（強制的に）〜させる」、let O do「許す」、have O do「してもらう」。',
      '知覚：see / hear / feel + O + 原形「Oが〜するのを見る／聞く」。',
      '動作の途中なら -ing（I saw him crossing the street.）。',
    ],
    examples: [
      { en: 'My mother made me clean the room.', ja: '母は私に部屋を掃除させた。' },
      { en: 'I heard someone call my name.', ja: '誰かが私の名前を呼ぶのが聞こえた。' },
    ],
    pitfalls: ['×make me to clean → ○make me clean（to を入れない）。'],
  },
  {
    id: 'gl_h1_subjunctive',
    stage: '高校基礎',
    title: '仮定法過去（現在の事実に反する仮定）',
    level: '2',
    topic: '仮定法',
    summary: '「もし〜なら…なのに」と、現在の事実と違うことを述べる。',
    form: 'If + 主語 + 動詞の過去形 〜, 主語 + would/could/might + 原形 〜.',
    points: [
      '現在のことなのに、if節で過去形を使うのが目印。be動詞は were がよく使われる。',
      '主節は would / could / might ＋原形。',
      'I wish + 仮定法過去「〜ならいいのに」も同じ発想。',
    ],
    examples: [
      { en: 'If I had more time, I would travel abroad.', ja: 'もっと時間があれば海外旅行をするのに。' },
      { en: 'I wish I could speak French.', ja: 'フランス語が話せたらいいのに。' },
    ],
  },
  {
    id: 'gl_h1_participle',
    stage: '高校基礎',
    title: '分詞構文',
    level: '2',
    topic: '分詞構文',
    summary: '接続詞＋主語＋動詞のかたまりを、分詞(-ing/-ed)で簡潔に言いかえる。',
    form: '(-ing / 過去分詞) 〜, 主語 + 動詞 〜.',
    points: [
      '時・理由・条件・付帯状況などを表す（文脈で意味を判断）。',
      '受け身の意味なら過去分詞で始める（Written in easy English, ...）。',
      '否定は Not -ing。意味上の主語が主節と同じときに使える。',
    ],
    examples: [
      { en: 'Walking in the park, I met an old friend.', ja: '公園を歩いていると、旧友に会った。' },
      { en: 'Tired from work, he went to bed early.', ja: '仕事で疲れていたので、彼は早く寝た。' },
    ],
  },

  // ───────────────────── 高校発展（英検準1・1級）─────────────────────
  {
    id: 'gl_h2_pastperfsubj',
    stage: '高校発展',
    title: '仮定法過去完了（過去の事実に反する仮定）',
    level: '2',
    topic: '仮定法過去完了',
    summary: '「もしあのとき〜だったら…だったのに」と過去の事実と違うことを述べる。',
    form: 'If + 主語 + had + 過去分詞 〜, 主語 + would/could have + 過去分詞 〜.',
    points: [
      'if節は had＋過去分詞、主節は would/could/might have＋過去分詞。',
      '現在への影響を表すときは主節だけ仮定法過去にする（混合）こともある。',
    ],
    examples: [
      { en: 'If I had studied harder, I would have passed the exam.', ja: 'もっと勉強していたら試験に受かっていたのに。' },
      { en: 'If you had told me, I could have helped you.', ja: '言ってくれていたら、助けられたのに。' },
    ],
  },
  {
    id: 'gl_h2_inversion',
    stage: '高校発展',
    title: '倒置（強調のための語順変化）',
    level: '2',
    topic: '倒置',
    summary: '否定の副詞などを文頭に出すと、その後ろが疑問文の語順になる。',
    points: [
      'Never / Little / Hardly / Not only などを文頭に → 〈助動詞＋主語〉の倒置。',
      'Only + 副詞句が文頭でも倒置。仮定法では If を省いて Had/Were で倒置できる。',
    ],
    examples: [
      { en: 'Never have I seen such a beautiful view.', ja: 'こんなに美しい景色は見たことがない。' },
      { en: 'Had I known it, I would have come.', ja: 'それを知っていたら、来ていたのに。' },
    ],
  },
  {
    id: 'gl_h2_emphasis',
    stage: '高校発展',
    title: '強調構文（It is ... that ...）',
    level: '2',
    topic: '強調構文',
    summary: '文の一部（主語・目的語・副詞句）を It is 〜 that … ではさんで強調する。',
    form: 'It is/was + 強調する語句 + that + 残りの文.',
    points: [
      '強調するのが人なら that の代わりに who も使える。',
      '形式主語の It is ... that ... と違い、強調部分を抜くと普通の文に戻せる。',
    ],
    examples: [
      { en: 'It was Tom that broke the window.', ja: '窓を割ったのはトムだった。' },
      { en: 'It is here that we first met.', ja: '私たちが初めて会ったのはここだ。' },
    ],
  },
]

export const lessonsByStage = (stage) => GRAMMAR_LESSONS.filter((l) => l.stage === stage)
export const getLesson = (id) => GRAMMAR_LESSONS.find((l) => l.id === id)
