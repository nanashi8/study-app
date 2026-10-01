// 疑問詞・関係詞として働く語の「文の中での働き」。単語カードの裏と辞書ページで、意味のすぐ下に
// 働き（疑問詞・関係代名詞など）ごとに、意味・形・解説・例文・文法の参考書の単元を並べる。
//
// 決まり:
// - 母集団は英語の疑問詞・関係詞の語（WH_WORDS）。辞書の見出し語にあるものは、すべてここに働きを書く。
//   見出し語にない語は WH_WORDS_NOT_HEADWORDS に理由を書く（requests/2026-10-01-wh-word-grammar-roles.json）。
// - main: true の働きは、代表義（見出し語のタプルの意味）の訳語がどの働きの意味かを示す。
//   main の働きの訳語を合わせると、代表義の訳語がちょうど1回ずつそろう（check-data.mjs が確かめる）。
//   main の働きの例文はなくてもよい（カードの例文が代表義の例文）。
// - main でない働きは、代表義に入らない意味。vocab.js がほかの意味（otherSenses）にも合流させるので、
//   長文のタップ・例文の確認・日本語の見直しにもそのまま乗る。画面では「ほかの意味」ではなく、ここの欄に出す。
// - level はその働きを習う級（文法テストの級×単元と、文法の参考書でその働きを説明する単元の級）。
// - grammar は、その働きを説明している文法の参考書の単元（grammar-reference の id）。習う順に並べる。
// - 出題には使わない。テストの答えは今までどおり代表義の先頭。

/** 働きの名前（画面の印の色もここで決める）。 */
export const GRAMMAR_ROLE_STYLES = Object.freeze({
  疑問詞: 'bg-sky-600',
  関係代名詞: 'bg-teal-600',
  '関係代名詞・継続用法': 'bg-teal-700',
  関係副詞: 'bg-emerald-600',
  複合関係詞: 'bg-violet-600',
  感嘆文: 'bg-amber-600',
  指示語: 'bg-slate-600',
  接続詞: 'bg-pink-600',
  接続副詞: 'bg-rose-600',
})

/**
 * 働きの説明に使う文法の参考書の単元（id → 級・単元名）。単語の画面が参考書のデータ全体を読みこまずに
 * リンクの名前を出せるよう、ここに写しておく。参考書の級・topic と同じであることを check-data.mjs が確かめる。
 */
export const GRAMMAR_ROLE_UNITS = Object.freeze({
  gref_5_wh: Object.freeze({ level: '5', topic: '疑問詞' }),
  gref_5_demonstrative: Object.freeze({ level: '5', topic: '指示語' }),
  gref_4_whto: Object.freeze({ level: '4', topic: '疑問詞+不定詞' }),
  gref_4_conj: Object.freeze({ level: '4', topic: '接続詞' }),
  gref_4_exclamation: Object.freeze({ level: '4', topic: '感嘆文' }),
  gref_3_indirect: Object.freeze({ level: '3', topic: '間接疑問' }),
  gref_3_relative: Object.freeze({ level: '3', topic: '関係代名詞' }),
  gref_3_conj: Object.freeze({ level: '3', topic: '接続詞' }),
  gref_pre2_reladv: Object.freeze({ level: 'pre2', topic: '関係副詞' }),
  gref_pre2_nonrestrictive: Object.freeze({ level: 'pre2', topic: '関係代名詞(継続)' }),
  gref_pre2_what: Object.freeze({ level: 'pre2', topic: '関係代名詞 what' }),
  gref_pre2_preprel: Object.freeze({ level: 'pre2', topic: '前置詞+関係代名詞' }),
  gref_2_what: Object.freeze({ level: '2', topic: '関係代名詞 what' }),
  gref_2_whose: Object.freeze({ level: '2', topic: '関係代名詞 whose' }),
  gref_2_relapp: Object.freeze({ level: '2', topic: '関係代名詞応用' }),
  gref_2_nounclause: Object.freeze({ level: '2', topic: '名詞節' }),
  gref_2_connadv: Object.freeze({ level: '2', topic: '接続副詞' }),
  gref_pre1_compound: Object.freeze({ level: 'pre1', topic: '複合関係詞' }),
})

/** 英語の疑問詞・関係詞の語（疑問詞・関係代名詞・関係副詞・複合関係詞）。 */
export const WH_WORDS = Object.freeze([
  'who', 'whom', 'whose', 'which', 'what', 'that', 'when', 'where', 'why', 'how',
  'whoever', 'whomever', 'whatever', 'whichever', 'whenever', 'wherever', 'however',
])

/** 疑問詞・関係詞の語のうち、辞書の見出し語にない語と、見出し語を足さない理由。 */
export const WH_WORDS_NOT_HEADWORDS = Object.freeze({
  whoever: '複合関係詞。準1級の文法の参考書「複合関係詞」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
  whomever: '複合関係詞。準1級の文法の参考書「複合関係詞」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
  whatever: '複合関係詞。準1級の文法の参考書「複合関係詞」「whatever等」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
  whichever: '複合関係詞。準1級の文法の参考書「複合関係詞」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
  whenever: '複合関係詞。準1級の文法の参考書「複合関係詞」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
  wherever: '複合関係詞。準1級の文法の参考書「複合関係詞」で学ぶ。見出し語を足すのは別の依頼として利用者に聞く',
})

const role = (item) => Object.freeze({
  ...item,
  ...(item.example ? { example: Object.freeze({ ...item.example }) } : {}),
  grammar: Object.freeze([...(item.grammar ?? [])]),
})

export const WORD_GRAMMAR_ROLES = Object.freeze({
  who: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '代',
      level: '5',
      meaning: '誰が・誰',
      form: 'Who ＋ 動詞 〜? ／ Who ＋ be動詞・do ＋ 主語 〜?',
      explain: '文の先頭に置いて、人についてたずねる。who が主語のときは、すぐ後ろに動詞を置く（Who made this cake?）。答えるときは Yes / No ではなく、誰なのかを答える。文の中に入れると「who＋主語＋動詞」の順になる（I don\'t know who he is.＝彼が誰なのか知らない）。',
      example: { en: 'Who made this cake?', ja: 'このケーキは誰が作ったの？' },
      grammar: ['gref_5_wh', 'gref_3_indirect'],
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: '3',
      meaning: '〜する(人)',
      form: '人 ＋ who ＋ 動詞 〜',
      explain: '人を表す名詞（先行詞）のすぐ後ろに置き、その人がどんな人かを後ろから説明する。who のすぐ後ろに動詞が続き、who がその動詞の主語の働きをする（主格）。訳すときは、who から後ろを先行詞の前に回して「〜する人」とする。動詞の形は先行詞に合わせる（a girl who plays 〜）。後ろに「主語＋動詞」が続くとき（目的格）は who・whom・that のどれも使え、省くこともできる。',
      example: { en: 'The boy who is running over there is my brother.', ja: 'あそこを走っている男の子は私の弟だ。' },
      grammar: ['gref_3_relative'],
    }),
    role({
      role: '関係代名詞・継続用法',
      pos: '代',
      level: 'pre2',
      meaning: 'そしてその人は〜',
      form: '人, who ＋ 動詞 〜',
      explain: 'コンマ（,）のあとに置き、前に出た人について説明を付け足す（継続用法）。前から順に「そしてその人は〜」と読むとわかりやすい。この使い方では that は使えない。',
      example: { en: 'On the train I talked with an old man, who told me about the history of the town.', ja: '電車で年配の男性と話すと、その人は町の歴史を話してくれた。' },
      grammar: ['gref_pre2_nonrestrictive'],
    }),
  ]),

  whom: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '代',
      level: 'pre2',
      meaning: 'だれを・だれに',
      form: 'Whom ＋ do ＋ 主語 ＋ 動詞 〜? ／ 前置詞 ＋ whom ＋ do ＋ 主語 〜?',
      explain: 'who の目的格で、「だれを・だれに」とたずねる。かたい言い方で、ふだんの会話では文の先頭に who を使うことが多い（Who did you meet?）。前置詞のすぐ後ろでは whom を使う（To whom did you send it?）。',
      example: { en: 'To whom did you send the letter?', ja: 'あなたはその手紙をだれに送ったのですか。' },
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: '3',
      meaning: '〜が…する(人)',
      form: '人 ＋ whom ＋ 主語 ＋ 動詞 〜 ／ 人 ＋ 前置詞 ＋ whom ＋ 主語 ＋ 動詞 〜',
      explain: '人を表す名詞（先行詞）の後ろに「主語＋動詞」の文をつなぎ、whom がその動詞や前置詞の目的語の働きをする（目的格）。前置詞のすぐ後ろ（the woman to whom I spoke）や、コンマのあとの「数量＋of whom」（two of whom＝そのうち2人）では whom を使う。前置詞を前に出さないふだんの英語では、who・that を使ったり省いたりして、前置詞を後ろに残すことが多い（the woman (who) I spoke to）。',
      example: { en: 'He is the friend whom I trust most.', ja: '彼は私がいちばん信頼している友達だ。' },
      grammar: ['gref_3_relative', 'gref_pre2_preprel', 'gref_2_relapp'],
    }),
  ]),

  whose: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '代',
      level: '5',
      meaning: '誰の',
      form: 'Whose ＋ 名詞 ＋ is ＋ 主語?',
      explain: '持ち主をたずねる。whose のすぐ後ろに名詞を置いて「誰の〜」とたずね、Mary\'s（メアリーのもの）や mine（私のもの）のように持ち主を答える。',
      grammar: ['gref_5_wh'],
    }),
    role({
      role: '疑問詞',
      pos: '代',
      level: '5',
      meaning: '誰のもの',
      form: 'Whose ＋ is ＋ 主語?',
      explain: 'whose の後ろに名詞を置かずに使うと、「誰のもの」とたずねる。',
      example: { en: 'Whose is this umbrella?', ja: 'この傘は誰のものですか。' },
      grammar: ['gref_5_wh'],
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: '3',
      meaning: 'その〜が…する(人・物)',
      form: '先行詞 ＋ whose ＋ 名詞 ＋ 動詞 〜',
      explain: '先行詞（人・物）と whose のすぐ後ろの名詞が「〜の…」（持ち主と持ち物）の関係にあるときに使う。whose の後ろには a・the の付かない名詞が来て、「whose＋名詞」が後ろの文の主語や目的語の働きをする。先行詞は人でも物でもよい。',
      example: { en: 'I have a friend whose father is a pilot.', ja: '私には、お父さんがパイロットをしている友達がいる。' },
      grammar: ['gref_3_relative', 'gref_2_whose'],
    }),
  ]),

  which: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '代',
      level: '5',
      meaning: 'どれ・どちら',
      form: 'Which ＋ 動詞 〜? ／ Which ＋ do ＋ 主語 ＋ 動詞 〜, A or B?',
      explain: '決まったいくつかの中から「どれ・どちら」と選ばせるときに使う。選ぶものを文の最後に A or B で並べることも多い。which to 〜は「どちらを〜すればよいか」。文の中に入れると「which＋主語＋動詞」の順になる。',
      example: { en: 'Which do you want, the red one or the blue one?', ja: '赤いのと青いのでは、どちらがほしいですか。' },
      grammar: ['gref_5_wh', 'gref_4_whto', 'gref_3_indirect'],
    }),
    role({
      role: '疑問詞',
      pos: '形',
      level: '5',
      meaning: 'どの・どちらの',
      form: 'Which ＋ 名詞 〜?',
      explain: 'which のすぐ後ろに名詞を置くと「どの〜・どちらの〜」になる。「which＋名詞」が主語なら、そのすぐ後ろに動詞が続く。',
      example: { en: 'Which bus goes to the city hall?', ja: 'どのバスが市役所へ行きますか。' },
      grammar: ['gref_5_wh'],
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: '3',
      meaning: '〜する(物・事)',
      form: '物 ＋ which ＋ 動詞 〜 ／ 物 ＋ which ＋ 主語 ＋ 動詞 〜',
      explain: '物・事を表す名詞（先行詞）のすぐ後ろに置き、それがどんな物かを後ろから説明する。which のすぐ後ろに動詞が続けば主格、「主語＋動詞」が続けば目的格で、目的格の which は省くことができる。前置詞のすぐ後ろでは that ではなく which を使う（the house in which he lives）。',
      example: { en: 'This is the bike which my father gave me.', ja: 'これは父が私にくれた自転車だ。' },
      grammar: ['gref_3_relative', 'gref_pre2_preprel'],
    }),
    role({
      role: '関係代名詞・継続用法',
      pos: '代',
      level: 'pre2',
      meaning: 'そしてそれは〜',
      form: '物, which 〜',
      explain: 'コンマ（,）のあとに置き、前に出た物について説明を付け足す（継続用法）。前から順に「そしてそれは〜」と読むとわかりやすい。that は使えない。前の文の内容全体を受けて「そしてそのことは〜」の意味になることもある。「数量＋of which」（some of which＝そのいくつか）でも使う。',
      example: { en: 'We visited the old castle, which was built about 400 years ago.', ja: '私たちはその古い城を訪れたが、それは約400年前に建てられたものだった。' },
      grammar: ['gref_pre2_nonrestrictive', 'gref_2_relapp'],
    }),
  ]),

  what: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '代',
      level: '5',
      meaning: '何・何の',
      form: 'What ＋ be動詞 ＋ 主語? ／ What ＋ 名詞 ＋ do ＋ 主語 ＋ 動詞 〜?',
      explain: '「何」とたずねる。すぐ後ろに名詞を置くと「何の〜・どんな〜」になり（What color do you like?）、What time（何時）・What day（何曜日）のような決まったたずね方も多い。what to 〜は「何を〜すればよいか」。文の中に入れると「what＋主語＋動詞」の順になる。',
      example: { en: 'What color do you like best?', ja: 'あなたは何色がいちばん好きですか。' },
      grammar: ['gref_5_wh', 'gref_4_whto', 'gref_3_indirect'],
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: 'pre2',
      meaning: '〜すること・〜するもの',
      form: 'what ＋ (主語 ＋) 動詞 〜',
      explain: 'what 自身が「〜すること・〜するもの」（the thing(s) that）の意味をふくむので、前に先行詞を置かない。what で始まるまとまりは、文の中で主語・目的語・補語の働きをする（What I need is time.＝私に必要なのは時間だ）。',
      example: { en: 'I could not believe what I saw.', ja: '私は自分が見たものを信じられなかった。' },
      grammar: ['gref_pre2_what', 'gref_2_what'],
    }),
    role({
      role: '感嘆文',
      pos: '形',
      level: '4',
      meaning: 'なんて〜だろう',
      form: 'What ＋ (a / an ＋) 形容詞 ＋ 名詞 ＋ (主語 ＋ 動詞)!',
      explain: '文の先頭に置き、「なんて〜なのだろう」と驚きや感動を表す（感嘆文）。What のすぐ後ろには名詞をふくむまとまりが来る。名詞をふくまず、形容詞・副詞だけを強めるときは How を使う。',
      example: { en: 'What a funny story that was!', ja: 'なんておもしろい話だったのだろう！' },
      grammar: ['gref_4_exclamation'],
    }),
  ]),

  that: Object.freeze([
    role({
      main: true,
      role: '指示語',
      pos: '代',
      level: '5',
      meaning: 'あれ・その',
      form: 'That is 〜. ／ that ＋ 名詞',
      explain: '離れた所にある物や、話に出た物・ことを指して「あれ・それ」と言う。すぐ後ろに名詞を置くと「あの〜・その〜」になる（that man）。2つ以上なら those を使う。',
      grammar: ['gref_5_demonstrative'],
    }),
    role({
      main: true,
      role: '接続詞',
      pos: '接',
      level: '4',
      meaning: '〜ということ',
      form: 'think・know など ＋ that ＋ 主語 ＋ 動詞 〜',
      explain: 'think・know・hope などの後ろに「主語＋動詞」の文をつないで、「〜ということ」を表す。この that はよく省かれる（I think he is right.）。',
      example: { en: 'I know that you are busy today.', ja: '今日あなたが忙しいということは知っている。' },
      grammar: ['gref_4_conj', 'gref_2_nounclause'],
    }),
    role({
      role: '関係代名詞',
      pos: '代',
      level: '3',
      meaning: '〜する(人・物)',
      form: '先行詞 ＋ that ＋ 動詞 〜 ／ 先行詞 ＋ that ＋ 主語 ＋ 動詞 〜',
      explain: '名詞（先行詞）のすぐ後ろに置き、どんな人・物かを後ろから説明する。先行詞が人でも物でも使え、the best・the first・the only・all などが付く先行詞ではとくによく使う。コンマのあと（継続用法）と前置詞のすぐ後ろでは使えない。',
      example: { en: 'Is there anything that I can do for you?', ja: 'あなたのために私にできることは何かありますか。' },
      grammar: ['gref_3_relative'],
    }),
  ]),

  when: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '副',
      level: '5',
      meaning: 'いつ',
      form: 'When ＋ be動詞・do ＋ 主語 〜?',
      explain: '文の先頭に置いて「いつ」と時をたずねる。時刻をはっきりたずねるときは What time を使うことが多い。when to 〜は「いつ〜すればよいか」。文の中に入れると「when＋主語＋動詞」の順になる。',
      example: { en: 'When does the next train leave?', ja: '次の電車はいつ出発しますか。' },
      grammar: ['gref_5_wh', 'gref_4_whto', 'gref_3_indirect'],
    }),
    role({
      main: true,
      role: '接続詞',
      pos: '接',
      level: '4',
      meaning: '〜のとき',
      form: 'when ＋ 主語 ＋ 動詞 〜',
      explain: '2つの文をつないで「〜するとき・〜したとき」を表す。when のまとまりを文の前に置くときは、コンマで区切る。未来のことでも、when のまとまりの中は現在形にする（when you arrive＝あなたが着いたら）。',
      example: { en: 'When the bell rang, all the students stood up.', ja: 'ベルが鳴ったとき、生徒はみんな立ち上がった。' },
      grammar: ['gref_4_conj', 'gref_3_conj'],
    }),
    role({
      role: '関係副詞',
      pos: '副',
      level: 'pre2',
      meaning: '〜する(時)',
      form: '時を表す名詞 ＋ when ＋ 主語 ＋ 動詞 〜',
      explain: 'the day・the year など時を表す名詞（先行詞）のすぐ後ろに置き、その時に何があったかを後ろから説明する。when の後ろには、主語も目的語もそろった文が続く。',
      example: { en: 'Do you remember the year when this bridge was built?', ja: 'この橋が建てられた年を覚えていますか。' },
      grammar: ['gref_pre2_reladv'],
    }),
  ]),

  where: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '副',
      level: '5',
      meaning: 'どこに・どこで',
      form: 'Where ＋ be動詞・do ＋ 主語 〜?',
      explain: '文の先頭に置いて「どこに・どこで」と場所をたずねる。Where are you from?（どこの出身ですか）のように、前置詞を文の最後に残すこともある。where to 〜は「どこへ〜すればよいか」。文の中に入れると「where＋主語＋動詞」の順になる。',
      example: { en: 'Where did you buy that bag?', ja: 'あなたはそのかばんをどこで買ったのですか。' },
      grammar: ['gref_5_wh', 'gref_4_whto', 'gref_3_indirect'],
    }),
    role({
      role: '関係副詞',
      pos: '副',
      level: 'pre2',
      meaning: '〜する(場所)',
      form: '場所を表す名詞 ＋ where ＋ 主語 ＋ 動詞 〜',
      explain: 'the house・the town など場所を表す名詞（先行詞）のすぐ後ろに置き、その場所で何をするか・何があったかを後ろから説明する。where の後ろには主語も目的語もそろった文が続く（欠けているときは which・that を使う）。This is where 〜（ここが〜する場所だ）のように先行詞を省くこともある。',
      example: { en: 'We visited the village where my mother grew up.', ja: '私たちは母が育った村を訪れた。' },
      grammar: ['gref_pre2_reladv'],
    }),
  ]),

  why: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '副',
      level: '5',
      meaning: 'なぜ',
      form: 'Why ＋ be動詞・do ＋ 主語 〜?',
      explain: '文の先頭に置いて「なぜ」と理由をたずねる。答えるときは Because 〜.（〜だからです）を使うことが多い。Why don\'t you 〜?（〜したらどう？）は、相手にすすめる言い方。',
      example: { en: 'Why were you late for school this morning?', ja: '今朝はなぜ学校に遅れたのですか。' },
      grammar: ['gref_5_wh', 'gref_3_indirect'],
    }),
    role({
      role: '関係副詞',
      pos: '副',
      level: 'pre2',
      meaning: '〜する(理由)',
      form: 'the reason ＋ why ＋ 主語 ＋ 動詞 〜',
      explain: 'the reason（理由）のすぐ後ろに置き、何の理由かを後ろから説明する。the reason と why のどちらかを省くことも多い（That is why 〜.＝そういうわけで〜）。',
      example: { en: 'Tell me the reason why you changed your plan.', ja: 'あなたが計画を変えた理由を教えて。' },
      grammar: ['gref_pre2_reladv'],
    }),
  ]),

  how: Object.freeze([
    role({
      main: true,
      role: '疑問詞',
      pos: '副',
      level: '5',
      meaning: 'どのように・どれくらい',
      form: 'How ＋ do ＋ 主語 ＋ 動詞 〜? ／ How ＋ 形容詞・副詞 〜?',
      explain: '文の先頭に置いて、やり方や様子（どのように・どう）をたずねる。すぐ後ろに形容詞・副詞を置くと「どれくらい〜」と程度をたずねる（How many＝いくつ、How much＝いくら、How old＝何歳）。how to 〜は「〜のしかた」。',
      example: { en: 'How long does it take to get to the station?', ja: '駅まで行くのにどれくらい時間がかかりますか。' },
      grammar: ['gref_5_wh', 'gref_4_whto', 'gref_3_indirect'],
    }),
    role({
      role: '関係副詞',
      pos: '副',
      level: 'pre2',
      meaning: '〜する方法・〜するやり方',
      form: 'This is how ＋ 主語 ＋ 動詞 〜.',
      explain: '「〜する方法・〜するやり方」を表すまとまりを作る。This is how 〜. は「このようにして〜」の意味になる。the way と how は並べて使わない（the way he did it か how he did it のどちらか）。',
      example: { en: 'This is how I learned to ride a bike.', ja: 'このようにして私は自転車に乗れるようになった。' },
      grammar: ['gref_pre2_reladv'],
    }),
    role({
      role: '感嘆文',
      pos: '副',
      level: '4',
      meaning: 'なんて〜だろう',
      form: 'How ＋ 形容詞・副詞 ＋ (主語 ＋ 動詞)!',
      explain: '文の先頭に置き、すぐ後ろの形容詞・副詞を強めて「なんて〜なのだろう」と驚きや感動を表す（感嘆文）。名詞をふくむときは What を使う。',
      example: { en: 'How cold the water in this lake is!', ja: 'この湖の水はなんて冷たいのだろう！' },
      grammar: ['gref_4_exclamation'],
    }),
  ]),

  however: Object.freeze([
    role({
      main: true,
      role: '接続副詞',
      pos: '副',
      level: 'pre2',
      meaning: 'しかしながら',
      form: 'However, 主語 ＋ 動詞 〜.',
      explain: '前の文と逆の内容を続けるときに、文の先頭や途中にコンマといっしょに置く。接続詞ではないので、but のように2つの文を直接つなぐことはできない。',
      grammar: ['gref_2_connadv'],
    }),
    role({
      role: '複合関係詞',
      pos: '副',
      level: 'pre1',
      meaning: 'どんなに〜しても',
      form: 'However ＋ 形容詞・副詞 ＋ 主語 ＋ 動詞 〜, …',
      explain: 'however のすぐ後ろに形容詞・副詞を置き、「どんなに〜しても」という意味のまとまりを作る（no matter how で言いかえられる）。形容詞・副詞を however から離さない（However hard I tried, 〜）。',
      example: { en: 'However hard I tried, the door would not open.', ja: 'どんなに努力しても、そのドアは開かなかった。' },
      grammar: ['gref_pre1_compound'],
    }),
  ]),
})

/** その語の、文の中での働き（なければ空）。 */
export const grammarRolesFor = (wordId) => WORD_GRAMMAR_ROLES[wordId] ?? []
