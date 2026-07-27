// 分岐型英作文「ことばルート」の教材データ。
//
// 1つの課題は、導入→理由→具体例→結論という決まったシナリオを
// steps の順に進む。各 step では表示された英語カードから1つを選ぶため、
// 文の骨格を保ちながら内容や表現を自分で組み合わせられる。
//
// choice:
//   text       … 作文へ追加する英語（単語または語のかたまり）
//   ja         … 選択肢の意味
//   grammarId  … 選択直後に表示する文法カード
//   tip        … その選択肢に固有の語法・つなぎ方
//   wordIds    … 既存語彙データに解決できる「マイ単語」候補
//   recommended… ガイド練習で示すおすすめルート

export const WRITING_LEVEL_ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']

export const WRITING_LEVEL_PROFILES = {
  5: {
    goal: '主語＋動詞をそろえて、身近なことを3〜5文で伝える',
    target: 'この練習では 18〜40語',
    wordRange: [18, 40],
    skills: ['主語と動詞', '好きなこと', 'したいこと'],
    color: '#10b981',
  },
  4: {
    goal: '過去・順序・感想を使い、出来事を時間の流れで伝える',
    target: 'この練習では 30〜55語',
    wordRange: [30, 55],
    skills: ['過去形', '順序を示す語', '感想と次の予定'],
    color: '#14b8a6',
  },
  3: {
    goal: '相手を意識したメールで、目的・理由・質問を明確にする',
    target: 'この練習では 40〜70語',
    wordRange: [40, 70],
    skills: ['メールの型', '依頼・誘い', 'because と疑問文'],
    color: '#0ea5e9',
  },
  pre2: {
    goal: '意見・理由・具体例・結論を、つなぎ語で一段落にまとめる',
    target: 'この練習では 55〜85語',
    wordRange: [55, 85],
    skills: ['意見提示', '理由の展開', '具体例と結論'],
    color: '#6366f1',
  },
  2: {
    goal: '社会的な話題を、対比や条件も使って論理的に論じる',
    target: 'この練習では 75〜110語',
    wordRange: [75, 110],
    skills: ['論点整理', '対比・条件', '提案と効果'],
    color: '#8b5cf6',
  },
  pre1: {
    goal: '利点と課題を検討し、根拠を伴うバランスのよい主張を書く',
    target: 'この練習では 110〜150語',
    wordRange: [110, 150],
    skills: ['譲歩', '根拠・因果', '反論への応答'],
    color: '#d946ef',
  },
  1: {
    goal: '複雑な公共課題に条件付きの主張を示し、政策提案まで統合する',
    target: 'この練習では 170〜220語',
    wordRange: [170, 220],
    skills: ['限定つき主張', '反論処理', '条件・統合・提言'],
    color: '#f43f5e',
  },
}

export const WRITING_GRAMMAR = [
  {
    id: 'wg_be_intro',
    level: '5',
    title: 'be動詞で自己紹介',
    pattern: 'I am ... / My name is ...',
    explanation: 'am / is は、主語と「どんな人・何であるか」をイコールで結びます。I には am、my name には is を使います。',
    example: { en: 'I am a junior high school student.', ja: '私は中学生です。' },
  },
  {
    id: 'wg_simple_present',
    level: '5',
    title: '現在形でいつものこと',
    pattern: 'I + 動詞 ...',
    explanation: '現在形は、習慣・好み・ふだんの状態を表します。主語が I のとき、動詞に s は付けません。',
    example: { en: 'I play soccer after school.', ja: '私は放課後にサッカーをします。' },
  },
  {
    id: 'wg_like_ing',
    level: '5',
    title: 'like / love ＋ -ing',
    pattern: 'I like playing ...',
    explanation: '「〜することが好き」は like / love の後ろに動詞の -ing 形を置けます。動作全体を一つの「こと」として扱う形です。',
    example: { en: 'I like reading books.', ja: '私は本を読むことが好きです。' },
  },
  {
    id: 'wg_to_purpose',
    level: '5',
    title: 'want / hope to ＋ 動詞',
    pattern: 'I want to make ...',
    explanation: 'to の後ろは動詞の原形です。want to は「〜したい」、hope to は「〜できたらと思う」を表します。',
    example: { en: 'I want to make new friends.', ja: '私は新しい友達を作りたいです。' },
  },
  {
    id: 'wg_lets',
    level: '5',
    title: "Let's で呼びかける",
    pattern: "Let's + 動詞の原形",
    explanation: "Let's は let us の短い形で、「いっしょに〜しよう」と相手へ明るく呼びかけます。",
    example: { en: "Let's have fun together!", ja: 'いっしょに楽しみましょう！' },
  },
  {
    id: 'wg_past_time',
    level: '4',
    title: '過去を示す時の表現',
    pattern: 'Last Sunday, I went ...',
    explanation: 'yesterday や last Sunday がある文では、動詞を過去形にします。go は不規則に went へ変わります。',
    example: { en: 'Last Sunday, I went to the park.', ja: '先週の日曜日、私は公園へ行きました。' },
  },
  {
    id: 'wg_sequence',
    level: '4',
    title: '順序を示す副詞',
    pattern: 'First, ... / Then, ... / After that, ...',
    explanation: 'First、Then、After that を文頭に置くと、出来事の順番が読み手にはっきり伝わります。後ろのコンマも忘れません。',
    example: { en: 'Then, we took many pictures.', ja: 'それから、私たちは写真をたくさん撮りました。' },
  },
  {
    id: 'wg_and_but',
    level: '4',
    title: 'and / but で文をつなぐ',
    pattern: 'A, and B. / A, but B.',
    explanation: 'and は同じ方向の情報を追加し、but は反対・意外な情報へ向きを変えます。',
    example: { en: 'It was cold, but we had fun.', ja: '寒かったですが、私たちは楽しみました。' },
  },
  {
    id: 'wg_feeling',
    level: '4',
    title: 'It was ＋ 形容詞',
    pattern: 'It was exciting.',
    explanation: '出来事全体の感想は It was ... でまとめられます。人の気持ちは I was happy のように人を主語にします。',
    example: { en: 'It was a wonderful day.', ja: 'すばらしい一日でした。' },
  },
  {
    id: 'wg_future_plan',
    level: '4',
    title: '次の予定・希望',
    pattern: 'I will ... / I want to ...',
    explanation: 'will はその場の意志や未来の見通し、want to は自分の希望を表します。どちらも後ろは動詞の原形です。',
    example: { en: 'I will visit the museum again.', ja: '私はまたその博物館を訪れます。' },
  },
  {
    id: 'wg_email_opening',
    level: '3',
    title: 'メールの書き出し',
    pattern: 'Hi ..., / Dear ...,',
    explanation: '親しい相手には Hi、少し改まった相手には Dear を使えます。名前の後ろにはコンマを置きます。',
    example: { en: 'Hi Emi,', ja: 'エミへ、' },
  },
  {
    id: 'wg_thank_for',
    level: '3',
    title: 'thank you for ＋ -ing',
    pattern: 'Thank you for helping me.',
    explanation: 'for は前置詞なので、後ろの動詞は -ing 形にします。「〜してくれてありがとう」の定番表現です。',
    example: { en: 'Thank you for inviting me.', ja: '招待してくれてありがとう。' },
  },
  {
    id: 'wg_invitation',
    level: '3',
    title: 'ていねいな誘い・依頼',
    pattern: 'Would you like to ...? / Could you ...?',
    explanation: 'Would you like to ...? は「〜しませんか」、Could you ...? は「〜してもらえますか」という柔らかな表現です。',
    example: { en: 'Would you like to join us?', ja: '私たちといっしょに参加しませんか。' },
  },
  {
    id: 'wg_because',
    level: '3',
    title: 'because で理由を示す',
    pattern: '..., because S + V.',
    explanation: 'because の後ろには主語＋動詞のそろった文を置きます。自分の提案や意見の理由が明確になります。',
    example: { en: 'You will enjoy it because the festival is exciting.', ja: 'その祭りはわくわくするので、楽しめるでしょう。' },
  },
  {
    id: 'wg_wh_question',
    level: '3',
    title: '疑問詞で必要な情報を聞く',
    pattern: 'What / When / Which + 疑問文?',
    explanation: 'yes / no では答えられない情報を聞くときは、疑問詞を文頭に置き、その後ろを疑問文の語順にします。',
    example: { en: 'What time can you come?', ja: '何時に来られますか。' },
  },
  {
    id: 'wg_email_closing',
    level: '3',
    title: '相手を意識した結び',
    pattern: 'I hope ... / See you ...',
    explanation: 'メールの最後に期待や再会の表現を置くと、目的が伝わり、自然に文章を閉じられます。',
    example: { en: 'I hope you can come.', ja: '来られるといいなと思います。' },
  },
  {
    id: 'wg_opinion_claim',
    level: 'pre2',
    title: '意見を最初に明示する',
    pattern: 'I think that ... / In my opinion, ...',
    explanation: '段落の最初に立場を一文で示すと、その後の理由が何を支えるのか明確になります。that は省略もできます。',
    example: { en: 'I think that school uniforms are useful.', ja: '私は学校の制服は役に立つと思います。' },
  },
  {
    id: 'wg_signpost',
    level: 'pre2',
    title: '理由の道しるべ',
    pattern: 'First, ... / Another reason is that ...',
    explanation: 'First や Another reason is that を使うと、理由の数と順序を読み手に予告できます。',
    example: { en: 'First, uniforms save students time.', ja: '第一に、制服は生徒の時間を節約します。' },
  },
  {
    id: 'wg_example',
    level: 'pre2',
    title: '具体例を加える',
    pattern: 'For example, S + V.',
    explanation: 'For example の後ろに具体的な場面を置くと、抽象的な理由を読み手が想像しやすくなります。',
    example: { en: 'For example, students can prepare quickly in the morning.', ja: '例えば、生徒は朝すぐに支度できます。' },
  },
  {
    id: 'wg_reason_result',
    level: 'pre2',
    title: '原因から結果へつなぐ',
    pattern: 'Therefore, ... / As a result, ...',
    explanation: 'Therefore と As a result は、前の内容を原因として、その結果や判断を続けるつなぎ語です。',
    example: { en: 'As a result, more people can join the activity.', ja: 'その結果、より多くの人が活動に参加できます。' },
  },
  {
    id: 'wg_conclusion',
    level: 'pre2',
    title: '結論で主張を言い直す',
    pattern: 'For these reasons, ...',
    explanation: '最後は新しい話を増やさず、理由を受けて最初の意見を別の言い方で確認します。',
    example: { en: 'For these reasons, I support the plan.', ja: 'これらの理由から、私はその計画に賛成です。' },
  },
  {
    id: 'wg_modal_proposal',
    level: '2',
    title: 'should / can で提案する',
    pattern: 'Schools should ... / This can ...',
    explanation: 'should は必要性のある提案、can は可能性や効果を表します。断定の強さを目的に合わせて選びます。',
    example: { en: 'Schools should use technology carefully.', ja: '学校は技術を注意深く使うべきです。' },
  },
  {
    id: 'wg_contrast',
    level: '2',
    title: '対比して論点を深める',
    pattern: 'However, ... / While A, B.',
    explanation: 'However は文と文を対比し、While A, B は一文の中で二つの側面を並べます。',
    example: { en: 'However, technology cannot replace good teachers.', ja: 'しかし、技術はよい教師の代わりにはなれません。' },
  },
  {
    id: 'wg_relative_clause',
    level: '2',
    title: '関係詞で名詞を説明する',
    pattern: 'students who ... / tools that ...',
    explanation: 'who は人、that / which は物を後ろから説明します。別々の二文を一文にまとめる働きがあります。',
    example: { en: 'Students who need extra help can study at home.', ja: '追加の助けが必要な生徒は家で学べます。' },
  },
  {
    id: 'wg_condition',
    level: '2',
    title: 'if で条件を示す',
    pattern: 'If S + 現在形, S + will / can ...',
    explanation: '未来の条件でも if 節の中は現在形にします。条件と、そのときに起こる結果を組にします。',
    example: { en: 'If schools set clear rules, students can use it safely.', ja: '学校が明確な規則を設ければ、生徒は安全に使えます。' },
  },
  {
    id: 'wg_effect',
    level: '2',
    title: '効果を名詞化して述べる',
    pattern: 'This will lead to ... / This will help ...',
    explanation: 'This で直前の提案全体を受けると、同じ語を繰り返さず、その効果を論理的に続けられます。',
    example: { en: 'This will lead to better access to education.', ja: 'これは教育へのよりよいアクセスにつながります。' },
  },
  {
    id: 'wg_concession',
    level: 'pre1',
    title: '譲歩してから主張する',
    pattern: 'Although A, B. / Admittedly, A; however, B.',
    explanation: '反対側の事実を先に認め、その限界を示して自分の主張へ戻ると、議論が一面的になりません。',
    example: { en: 'Although remote work is convenient, it can weaken teamwork.', ja: '在宅勤務は便利ですが、チームワークを弱めることがあります。' },
  },
  {
    id: 'wg_evidence',
    level: 'pre1',
    title: '根拠と具体的影響を結ぶ',
    pattern: 'For instance, ... / This is especially true when ...',
    explanation: '根拠は主張と直接関係する具体例にします。especially true when で、影響が強く出る条件を絞れます。',
    example: { en: 'This is especially true when employees live far from cities.', ja: 'これは従業員が都市から遠くに住む場合に特に当てはまります。' },
  },
  {
    id: 'wg_causal',
    level: 'pre1',
    title: '因果を一文に圧縮する',
    pattern: 'By -ing, S can ... / ..., thereby -ing ...',
    explanation: 'By -ing は手段、thereby -ing は前の行為が生む結果を表し、因果関係を簡潔にまとめます。',
    example: { en: 'By reducing travel, companies can lower emissions.', ja: '移動を減らすことで、企業は排出量を下げられます。' },
  },
  {
    id: 'wg_counterresponse',
    level: 'pre1',
    title: '反論を受けて条件を示す',
    pattern: 'Critics may argue that ...; nevertheless, ...',
    explanation: '予想される反論を公平に示した後、nevertheless で、それでも成り立つ自分の応答を続けます。',
    example: { en: 'Critics may question the cost; nevertheless, long-term benefits are substantial.', ja: '批判する人は費用を疑問視するかもしれませんが、長期的な利益は大きいです。' },
  },
  {
    id: 'wg_hedged_conclusion',
    level: 'pre1',
    title: '強さを調整した結論',
    pattern: 'On balance, ... provided that ...',
    explanation: 'On balance は両面を検討した結論を示します。provided that で、賛成が成り立つ条件を限定できます。',
    example: { en: 'On balance, the policy is beneficial provided that support is available.', ja: '総合的には、支援が利用できるならその政策は有益です。' },
  },
  {
    id: 'wg_qualified_claim',
    level: '1',
    title: '限定を備えた主張',
    pattern: 'X should be adopted, but only if ...',
    explanation: '高度な議論では全面的な賛否だけでなく、主張が成り立つ範囲や条件を同じ文で明示します。',
    example: { en: 'AI should be adopted, but only if public oversight is guaranteed.', ja: 'AIは導入すべきですが、公的監督が保証される場合に限ります。' },
  },
  {
    id: 'wg_nominalization',
    level: '1',
    title: '名詞化で論点をまとめる',
    pattern: 'the expansion of ... / the protection of ...',
    explanation: '動作を名詞化すると、複雑な出来事を一つの論点として文の主語や目的語に置けます。ただし重ねすぎには注意します。',
    example: { en: 'The expansion of automated services may improve efficiency.', ja: '自動化サービスの拡大は効率を改善する可能性があります。' },
  },
  {
    id: 'wg_advanced_counter',
    level: '1',
    title: '反論の前提を評価する',
    pattern: 'This objection is valid insofar as ...; yet ...',
    explanation: 'insofar as で反論が妥当な範囲を認め、yet でその反論だけでは決まらない点を示します。',
    example: { en: 'This objection is valid insofar as data are biased; yet bias can be audited.', ja: 'データに偏りがある限りその反論は妥当ですが、偏りは監査できます。' },
  },
  {
    id: 'wg_policy_condition',
    level: '1',
    title: '政策条件を列挙する',
    pattern: 'Only when A, B, and C are in place should ...',
    explanation: 'Only when を文頭に置くと、主節は should + 主語 + 動詞の倒置になります。不可欠な条件を強調する形です。',
    example: { en: 'Only when safeguards are in place should the system be deployed.', ja: '安全策が整って初めて、そのシステムを導入すべきです。' },
  },
  {
    id: 'wg_synthesis',
    level: '1',
    title: '複数の価値を統合する',
    pattern: 'Rather than choosing between A and B, ...',
    explanation: '二者択一を退け、両方の価値を満たす第三の方針を示すと、結論が議論全体を統合します。',
    example: { en: 'Rather than choosing between efficiency and privacy, governments must protect both.', ja: '効率とプライバシーのどちらかを選ぶのではなく、政府は両方を守らなければなりません。' },
  },
]

export const WRITING_GRAMMAR_BY_ID = Object.fromEntries(
  WRITING_GRAMMAR.map((item) => [item.id, item]),
)

const choice = (
  id,
  text,
  ja,
  grammarId,
  tip,
  wordIds = [],
  recommended = false,
) => ({ id, text, ja, grammarId, tip, wordIds, recommended })

const step = (id, phase, prompt, constraint, guide, options) => ({
  id,
  phase,
  prompt,
  constraint,
  guide,
  options,
})

const makeExercise = (data) => ({
  ...data,
  steps: data.steps.map((item, index) => ({
    ...item,
    index,
  })),
})

export const WRITING_EXERCISES = [
  makeExercise({
    id: 'wr_5_self_intro',
    level: '5',
    genre: '自己紹介',
    title: '新しい友だちに自己紹介',
    emoji: '👋',
    scene: '転校初日。クラスの友だちへ、あなたのことを英語で伝えます。',
    task: '自分の立場、好きなこと、これからしたいことを順に書こう。',
    rubric: ['自分について言えた', '好きなことを説明した', 'これからしたいことを書いた'],
    steps: [
      step('opening', 'はじめ', '最初の一文を選ぼう', '主語と be動詞をそろえる', 'まず「私は何者か」を短く伝えると、読み手が安心します。', [
        choice('a', 'I am a junior high school student.', '私は中学生です。', 'wg_be_intro', 'I の be動詞は am。a は「一人の」という意味で、student の前に必要です。', ['student'], true),
        choice('b', 'My name is Haru.', '私の名前はハルです。', 'wg_be_intro', 'My name は1つの名前を表す単数なので、be動詞は is を使います。'),
        choice('c', 'I am new to this school.', '私はこの学校に来たばかりです。', 'wg_be_intro', 'be new to ... で「〜に不慣れな・〜に来たばかりの」というまとまりです。'),
      ]),
      step('like', '好き', '好きなことをつなげよう', 'like / love の後ろを -ing にする', '自分らしさが伝わる活動を1つ選びます。', [
        choice('a', 'I like playing soccer after school.', '私は放課後にサッカーをするのが好きです。', 'wg_like_ing', 'play を playing にして、「サッカーをすること」を like の目的語にしています。', ['soccer'], true),
        choice('b', 'I love reading books with my friends.', '私は友達と本を読むのが大好きです。', 'wg_like_ing', 'love の後ろでも動詞を -ing 形にできます。with は「〜といっしょに」です。', ['friend']),
        choice('c', 'I like cooking with my family.', '私は家族と料理をするのが好きです。', 'wg_like_ing', 'cooking は cook の -ing 形。with my family が「家族と」を加えます。', ['cooking', 'family']),
      ]),
      step('habit', 'ふだん', 'もう一つ、ふだんのことを選ぼう', 'I ＋ 動詞の現在形', '現在形を使って、いつもの行動を足します。', [
        choice('a', 'I study English every day.', '私は毎日英語を勉強します。', 'wg_simple_present', 'every day があるので、習慣を表す現在形 study がぴったりです。', [], true),
        choice('b', 'I listen to music in my room.', '私は自分の部屋で音楽を聴きます。', 'wg_simple_present', 'listen は音そのものを目的語にするとき listen to music と to が必要です。'),
        choice('c', 'I play games on the weekend.', '私は週末にゲームをします。', 'wg_simple_present', 'on the weekend は「週末に」。習慣なので play は現在形です。', ['weekend']),
      ]),
      step('wish', 'これから', '学校でしてみたいことを選ぼう', 'want / hope to ＋ 動詞の原形', '未来への希望を加えると、自己紹介に目的が生まれます。', [
        choice('a', 'I want to make many new friends.', '私は新しい友達をたくさん作りたいです。', 'wg_to_purpose', 'want to の後ろは動詞の原形 make。make friends で「友達を作る」です。', ['friend'], true),
        choice('b', 'I hope to join the music club.', '私は音楽部に入りたいと思っています。', 'wg_to_purpose', 'hope to は「〜できたらと思う」。join は「団体に加わる」なので後ろに to は置きません。', ['club']),
        choice('c', 'I want to speak English well.', '私は英語を上手に話したいです。', 'wg_to_purpose', 'speak は動詞、well は「上手に」と動作を説明する副詞です。'),
      ]),
      step('closing', 'おわり', '相手への一言で結ぼう', '相手へ働きかける表現にする', '最後は読み手へ向けた言葉にします。', [
        choice('a', "Let's have fun together!", 'いっしょに楽しみましょう！', 'wg_lets', "Let's の後ろは動詞の原形 have。together が「いっしょに」を表します。", ['friend'], true),
        choice('b', 'Nice to meet you!', 'はじめまして！', 'wg_email_closing', '初対面の結びに使う決まり表現です。文末の感嘆符で明るい調子を出せます。'),
        choice('c', 'Please talk to me anytime!', 'いつでも私に話しかけてください！', 'wg_lets', 'Please + 動詞の原形で、相手への丁寧なお願いになります。'),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_5_favorite_day',
    level: '5',
    genre: '紹介文',
    title: 'わたしの好きな一日',
    emoji: '🌞',
    scene: '海外の友だちに、あなたが好きな休日の過ごし方を紹介します。',
    task: 'いつ、だれと、何をするか、そして感想を順に書こう。',
    rubric: ['好きな日を示した', '行動を2つ書いた', '感想で結んだ'],
    steps: [
      step('day', '話題', '好きな日を決めよう', 'I like ... で話題を示す', '最初に何について書くか宣言します。', [
        choice('a', 'I like Sundays.', '私は日曜日が好きです。', 'wg_simple_present', '曜日は名前なので先頭を大文字にし、複数形 Sundays で「毎週の日曜日」を表せます。', [], true),
        choice('b', 'Saturday is my favorite day.', '土曜日は私の好きな日です。', 'wg_be_intro', 'Saturday と my favorite day を is で結んでいます。'),
        choice('c', 'I love the weekend.', '私は週末が大好きです。', 'wg_simple_present', 'love は「大好き」。the weekend は週末というまとまりを指します。', ['weekend']),
      ]),
      step('morning', '朝', '朝の過ごし方を選ぼう', '現在形で習慣を書く', '時間の流れに沿って朝から始めます。', [
        choice('a', 'I eat breakfast with my family.', '私は家族と朝食を食べます。', 'wg_simple_present', 'eat は現在形。with my family でいっしょにいる相手を足します。', ['family'], true),
        choice('b', 'I get up late and read a book.', '私は遅く起きて本を読みます。', 'wg_and_but', 'and が get up と read という二つの動作を同じ主語 I につなぎます。'),
        choice('c', 'I walk in the park in the morning.', '私は朝、公園を歩きます。', 'wg_simple_present', 'in the park は場所、in the morning は時間を表します。', ['park']),
      ]),
      step('afternoon', '午後', '午後の行動を足そう', 'I + 動詞で一文を作る', '別の行動を加えて内容を広げます。', [
        choice('a', 'I play soccer with my friends.', '私は友達とサッカーをします。', 'wg_simple_present', 'play soccer は「サッカーをする」。スポーツ名の前に the は要りません。', ['soccer', 'friend'], true),
        choice('b', 'I cook lunch with my family.', '私は家族と昼食を作ります。', 'wg_simple_present', 'cook lunch では lunch が cook の目的語です。', ['cooking', 'family']),
        choice('c', 'I visit a museum near my house.', '私は家の近くの博物館を訪れます。', 'wg_simple_present', 'visit は後ろに場所を直接置き、visit to とはしません。', ['museum']),
      ]),
      step('feeling', '感想', 'その日が好きな理由を選ぼう', 'because の後ろを文にする', '好きという意見に理由をつけます。', [
        choice('a', 'I am happy because we are together.', '私たちはいっしょなので、私は幸せです。', 'wg_because', 'because の後ろには we are together という主語＋動詞の文があります。', ['family'], true),
        choice('b', 'I like it because I can relax.', 'くつろげるので、私はその日が好きです。', 'wg_because', 'can の後ろは動詞の原形 relax。it は好きな日を受けます。'),
        choice('c', 'It is fun because I try new things.', '新しいことに挑戦するので楽しいです。', 'wg_because', 'because の後ろの I try が理由を表します。'),
      ]),
      step('closing', 'おわり', '最後の一文を選ぼう', '短く感想を言い直す', '話題へ戻って気持ちよく結びます。', [
        choice('a', 'It is always a special day for me.', 'それはいつも私にとって特別な日です。', 'wg_feeling', 'for me を付けると「私にとって」という評価の立場が伝わります。', [], true),
        choice('b', 'I look forward to every weekend.', '私は毎週末を楽しみにしています。', 'wg_to_purpose', 'look forward to の to は前置詞です。この後ろに動詞を置くなら -ing 形にします。', ['weekend']),
        choice('c', 'That is why I love this day.', 'だから私はこの日が大好きです。', 'wg_reason_result', 'That is why ... は、前までの内容を理由として結論を示す表現です。'),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_4_weekend_diary',
    level: '4',
    genre: '日記',
    title: '週末の思い出日記',
    emoji: '📔',
    scene: '英語の日記に、週末の出来事を時間順に残します。',
    task: 'いつ・どこへ行ったか、二つの出来事、感想、次の希望を書こう。',
    rubric: ['過去形を使った', '出来事を順番に並べた', '感想と希望を書いた'],
    steps: [
      step('where', '導入', 'いつ、どこへ行ったか選ぼう', '時の表現＋過去形', '過去の時を示してから出来事を始めます。', [
        choice('a', 'Last Sunday, I went to the park with my family.', '先週の日曜日、家族と公園へ行きました。', 'wg_past_time', 'last Sunday が過去を示すため、go は過去形 went です。', ['park', 'family'], true),
        choice('b', 'Yesterday, I visited a science museum with my friend.', '昨日、友達と科学博物館を訪れました。', 'wg_past_time', 'visit の過去形は規則変化で visited。場所の前に to は要りません。', ['museum', 'friend']),
        choice('c', 'Last weekend, we walked around the old town.', '先週末、私たちは古い町を歩き回りました。', 'wg_past_time', 'walk は -ed を付けて walked。around は「〜の周りを・あちこち」です。', ['weekend']),
      ]),
      step('first', '出来事1', '最初にしたことを選ぼう', 'First, の後ろを過去形にする', '順番の一つ目をはっきり示します。', [
        choice('a', 'First, we ate lunch under a big tree.', '最初に、大きな木の下で昼食を食べました。', 'wg_sequence', 'First の後ろにコンマを置きます。eat の過去形は ate です。', [], true),
        choice('b', 'First, we looked at many interesting exhibits.', '最初に、おもしろい展示をたくさん見ました。', 'wg_sequence', 'look at で「〜を見る」。過去形 looked にします。', ['museum']),
        choice('c', 'First, we bought snacks at a small shop.', '最初に、小さな店でお菓子を買いました。', 'wg_sequence', 'buy の過去形は不規則変化の bought です。'),
      ]),
      step('then', '出来事2', '次にしたことをつなげよう', 'Then / After that ＋ 過去形', '二つ目の出来事へ進みます。', [
        choice('a', 'Then, we played badminton for an hour.', 'それから、1時間バドミントンをしました。', 'wg_sequence', 'for an hour は動作が続いた時間を表します。', [], true),
        choice('b', 'After that, we took many pictures together.', 'その後、いっしょに写真をたくさん撮りました。', 'wg_sequence', 'take pictures で「写真を撮る」。過去形は took です。'),
        choice('c', 'Then, we talked and laughed for a long time.', 'それから、長い時間話して笑いました。', 'wg_and_but', 'and で talked と laughed の二つの過去形を並べています。', ['friend']),
      ]),
      step('surprise', '変化', '小さな出来事を一つ足そう', 'and / but で流れを変える', '日記に変化が生まれる一文を加えます。', [
        choice('a', 'It started to rain, but we stayed there.', '雨が降り始めましたが、私たちはそこにいました。', 'wg_and_but', 'but が予想と反対の「それでもいた」をつなぎます。', [], true),
        choice('b', 'We were tired, so we rested on a bench.', '疲れたので、ベンチで休みました。', 'wg_reason_result', 'so は原因の後ろに結果を続けます。were は主語 we に合う be動詞の過去形です。'),
        choice('c', 'I lost my cap, and my friend found it.', '帽子をなくし、友達が見つけてくれました。', 'wg_and_but', 'and で二つの関連する出来事を時間順につないでいます。', ['friend']),
      ]),
      step('feeling', '感想', '一日の感想を選ぼう', 'It was / I was を使い分ける', '出来事全体か、自分の気持ちかを選びます。', [
        choice('a', 'It was an exciting day.', 'わくわくする一日でした。', 'wg_feeling', '出来事全体を指す It と was を使います。exciting は「人をわくわくさせる」です。', [], true),
        choice('b', 'I was tired, but I was very happy.', '疲れましたが、とても幸せでした。', 'wg_and_but', '自分の状態なので主語 I。過去の be動詞 was を二度使っています。'),
        choice('c', 'The day was better than I expected.', 'その日は思っていたよりよかったです。', 'wg_feeling', 'better than ... は good の比較級で「〜よりよい」です。'),
      ]),
      step('next', '結び', '次にしたいことを書こう', 'will / want to ＋ 動詞の原形', '日記を未来への一言で閉じます。', [
        choice('a', 'I want to go there again soon.', 'またすぐそこへ行きたいです。', 'wg_future_plan', 'want to の後ろは動詞の原形 go。again が「もう一度」です。', [], true),
        choice('b', 'I will invite another friend next time.', '次回は別の友達も誘います。', 'wg_future_plan', 'will の後ろは動詞の原形 invite。next time が未来を示します。', ['invite', 'friend']),
        choice('c', 'Next weekend, I will try something new.', '次の週末は新しいことに挑戦します。', 'wg_future_plan', '未来の意志を will + try で表します。', ['weekend']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_4_thank_you',
    level: '4',
    genre: 'お礼メッセージ',
    title: '友だちへのお礼',
    emoji: '🎁',
    scene: '週末に家へ招いてくれた友だちへ、短いお礼のメッセージを書きます。',
    task: 'お礼、楽しかった出来事、感想、次の誘いを順に書こう。',
    rubric: ['お礼を伝えた', '過去の出来事を書いた', '次の誘いで結んだ'],
    steps: [
      step('thanks', 'お礼', '最初のお礼を選ぼう', 'Thank you for の形を使う', '最初の一文で目的を明確にします。', [
        choice('a', 'Thank you for inviting me to your house.', '家に招いてくれてありがとう。', 'wg_thank_for', 'for の後ろは invite ではなく inviting。invite A to B で「AをBへ招く」です。', ['invite'], true),
        choice('b', 'Thank you for the wonderful weekend.', 'すばらしい週末をありがとう。', 'wg_past_time', 'for の後ろに名詞 the wonderful weekend を置いた形です。', ['weekend']),
        choice('c', 'I was very happy to visit you.', 'あなたを訪ねられてとてもうれしかったです。', 'wg_feeling', 'happy to + 動詞で「〜してうれしい」。過去なので was を使います。'),
      ]),
      step('memory1', '思い出1', '楽しかったことを一つ書こう', '動詞を過去形にする', '具体的な行動がお礼に温かさを加えます。', [
        choice('a', 'We cooked dinner together.', '私たちはいっしょに夕食を作りました。', 'wg_past_time', 'cook に -ed を付けた cooked が過去形です。', ['cooking'], true),
        choice('b', 'We played games after dinner.', '夕食後にゲームをしました。', 'wg_past_time', 'play の過去形 played と after dinner で時を表します。'),
        choice('c', 'We watched a funny movie.', 'おもしろい映画を見ました。', 'wg_past_time', 'watch は -ed を付けて watched。funny が movie を前から説明します。'),
      ]),
      step('memory2', '思い出2', 'もう一つ出来事を足そう', 'Then / Also で追加する', '一文だけでなく、もう一つ思い出を選びます。', [
        choice('a', 'Then, your family taught me a new game.', 'それから、あなたの家族が新しいゲームを教えてくれました。', 'wg_sequence', 'teach の過去形は taught。teach 人 物で「人に物を教える」です。', ['family'], true),
        choice('b', 'Also, we talked about school for a long time.', 'また、学校について長い時間話しました。', 'wg_sequence', 'Also を文頭に置いて同じ方向の情報を追加しています。'),
        choice('c', 'After that, we walked in the park.', 'その後、私たちは公園を歩きました。', 'wg_sequence', 'After that で前の出来事の後だと明示します。', ['park']),
      ]),
      step('feeling', '感想', '気持ちを伝えよう', 'I was / It was で感想を表す', '相手に伝わる素直な感想を置きます。', [
        choice('a', 'I was nervous at first, but I soon relaxed.', '最初は緊張しましたが、すぐにくつろげました。', 'wg_and_but', 'at first と soon が気持ちの変化を示し、but が対比します。', [], true),
        choice('b', 'It was one of my best weekends.', '最高の週末の一つでした。', 'wg_feeling', 'one of + 複数名詞で「〜の一つ」。weekends は複数形です。', ['weekend']),
        choice('c', 'I enjoyed every minute of the day.', 'その日の一分一分を楽しみました。', 'wg_past_time', 'enjoy の後ろには目的語を直接置き、enjoyed to とはしません。'),
      ]),
      step('invite', '結び', '次はこちらから誘おう', '未来の希望・誘いにする', '関係が続く一文でメッセージを閉じます。', [
        choice('a', 'Please come to my house next time.', '次は私の家に来てください。', 'wg_lets', 'Please + 動詞の原形 come で丁寧に招いています。', ['invite'], true),
        choice('b', "Let's visit the museum together next month.", '来月いっしょに博物館へ行きましょう。', 'wg_lets', "Let's の後ろは visit。visit の後ろに場所を直接置きます。", ['museum']),
        choice('c', 'I hope we can meet again soon.', 'またすぐ会えるといいなと思います。', 'wg_future_plan', 'hope の後ろに we can meet という文を置いて未来への希望を表します。', ['friend']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_3_festival_email',
    level: '3',
    genre: '招待メール',
    title: '学校祭へ招待しよう',
    emoji: '🎪',
    scene: '海外から来た友だちを、今週末の学校祭へメールで誘います。',
    task: 'あいさつ、誘い、見どころ、理由、質問、結びを含めよう。',
    rubric: ['メールの形を使った', '誘いと理由を示した', '相手への質問を入れた'],
    steps: [
      step('hello', '宛名', '相手に合う書き出しを選ぼう', '呼びかけの後ろにコンマ', 'メールの距離感を決めます。', [
        choice('a', 'Hi Alex,', 'アレックスへ、', 'wg_email_opening', '親しい友だちなので Hi が自然です。名前の後ろにコンマを置きます。', ['friend'], true),
        choice('b', 'Dear Emma,', 'エマへ、', 'wg_email_opening', 'Dear は Hi より少し丁寧な呼びかけです。'),
        choice('c', 'Hello Sam,', 'サムへ、', 'wg_email_opening', 'Hello も親しみのある書き出しです。後ろに相手の名前を置きます。'),
      ]),
      step('opening', '近況', 'メールの目的へ入る一文を選ぼう', '現在形または進行形で近況を示す', 'いきなり誘う前に短い導入を置きます。', [
        choice('a', 'How are you doing?', '元気にしていますか。', 'wg_wh_question', 'How are you doing? は近況を聞く定番の疑問文です。', [], true),
        choice('b', 'I hope you are enjoying your new school.', '新しい学校を楽しんでいるといいなと思います。', 'wg_email_closing', 'hope の後ろに主語＋動詞の文を置きます。'),
        choice('c', 'I have exciting news for you.', 'あなたにわくわくする知らせがあります。', 'wg_simple_present', 'have は「持っている」から「知らせがある」を表します。for you が相手を示します。'),
      ]),
      step('invite', '誘い', '中心となる誘いを書こう', 'Would you like to ＋ 動詞', 'メールの目的を疑問文で明示します。', [
        choice('a', 'Would you like to come to our school festival this Saturday?', '今週土曜日に学校祭へ来ませんか。', 'wg_invitation', 'Would you like to の後ろは動詞の原形 come。come to で行き先を示します。', ['invite', 'festival'], true),
        choice('b', 'Can you join us at the school festival this weekend?', '今週末の学校祭に参加できますか。', 'wg_invitation', 'can の疑問文は Can + 主語 + 動詞の原形。join の後ろに us を直接置きます。', ['festival', 'weekend']),
        choice('c', 'I would like to invite you to our school festival.', 'あなたを学校祭へ招待したいです。', 'wg_invitation', 'would like to は want to より丁寧。invite 人 to 場所の語順です。', ['invite', 'festival']),
      ]),
      step('feature', '見どころ', 'おすすめを一つ選ぼう', 'There is / You can で紹介する', '相手が場面を想像できる情報を加えます。', [
        choice('a', 'You can enjoy music, games, and food from many countries.', '音楽、ゲーム、多くの国の食べ物を楽しめます。', 'wg_modal_proposal', 'can の後ろは動詞の原形 enjoy。三つの名詞をコンマと and で並べます。', ['food'], true),
        choice('b', 'There will be a concert in the school hall.', '学校のホールでコンサートがあります。', 'wg_future_plan', 'There will be で未来に「〜がある」を表します。'),
        choice('c', 'Our class will sell handmade cookies.', '私たちのクラスは手作りクッキーを売ります。', 'wg_future_plan', 'will の後ろは動詞の原形 sell。handmade が cookies を説明します。'),
      ]),
      step('reason', '理由', '相手におすすめする理由を選ぼう', 'because の後ろを文にする', '誘いに理由を付けて説得力を上げます。', [
        choice('a', 'I think you will enjoy it because you love music.', '音楽が大好きなので楽しめると思います。', 'wg_because', 'because の後ろの you love music が理由です。it は学校祭を受けます。', ['festival'], true),
        choice('b', 'It will be fun because many students will perform.', '多くの生徒が演じるので楽しいでしょう。', 'wg_because', 'because 節にも主語 many students と動詞 will perform があります。', ['student']),
        choice('c', 'You can make new friends because many visitors will come.', '多くの来場者が来るので新しい友達を作れます。', 'wg_because', '前半の can make と後半の will come で、可能性と理由を分けています。', ['friend']),
      ]),
      step('question', '質問', '返事に必要なことを聞こう', '疑問詞を文頭に置く', '相手が返信しやすい具体的な質問を一つ入れます。', [
        choice('a', 'What time can you come?', '何時に来られますか。', 'wg_wh_question', 'What time の後ろは can you come という疑問文の語順です。', [], true),
        choice('b', 'Which activity would you like to try?', 'どの活動をしてみたいですか。', 'wg_wh_question', 'Which + 名詞 activity で選択肢の中から一つを尋ねます。'),
        choice('c', 'Who would you like to come with?', 'だれといっしょに来たいですか。', 'wg_wh_question', 'Who を文頭に置き、with は文末に残せる自然な疑問文です。'),
      ]),
      step('closing', '結び', '返事を待つ一文で結ぼう', 'hope / look forward to を使う', '相手に次の行動をやさしく促します。', [
        choice('a', 'I hope you can come. See you soon!', '来られるといいな。またすぐに！', 'wg_email_closing', 'hope の後ろに you can come を置き、短いあいさつで結んでいます。', ['invite'], true),
        choice('b', 'Please let me know by Friday.', '金曜日までに知らせてください。', 'wg_email_closing', 'let me know は「私に知らせる」。by Friday は締め切りを表します。'),
        choice('c', 'I look forward to hearing from you.', '返事を楽しみにしています。', 'wg_email_closing', 'look forward to の to は前置詞なので、hear ではなく hearing を置きます。'),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_3_club_request',
    level: '3',
    genre: 'お願いメール',
    title: '部活動について質問',
    emoji: '🏀',
    scene: '興味のある部活動の先輩へ、見学をお願いするメールを書きます。',
    task: '自己紹介、興味、見学のお願い、理由、具体的な質問を入れよう。',
    rubric: ['自分と目的を示した', '丁寧にお願いした', '具体的な質問をした'],
    steps: [
      step('hello', '宛名', '丁寧な書き出しを選ぼう', 'Dear / Hello の後ろに相手', '初めて連絡する相手を意識します。', [
        choice('a', 'Dear Club Leader,', '部長さんへ、', 'wg_email_opening', '相手の名前が不明でも、役割を大文字で呼びかけに使えます。', ['club'], true),
        choice('b', 'Hello Ms. Brown,', 'ブラウン先生へ、', 'wg_email_opening', 'Ms. は女性への敬称で、姓の前に置きます。'),
        choice('c', 'Dear Basketball Team,', 'バスケットボール部のみなさんへ、', 'wg_email_opening', '団体全体への丁寧な呼びかけです。'),
      ]),
      step('intro', '自己紹介', '自分を短く説明しよう', 'be動詞で所属を示す', '相手があなたを判断できる情報を置きます。', [
        choice('a', 'I am a new student in Class 1-B.', '私は1年B組の新入生です。', 'wg_be_intro', 'I と a new student を am で結び、in Class 1-B で所属を加えます。', ['student'], true),
        choice('b', 'My name is Sora, and I am in the first year.', '私はソラで、1年生です。', 'wg_and_but', 'and が My name is ... と I am ... の二つの情報をつなぎます。', ['student']),
        choice('c', 'I joined this school last month.', '私は先月この学校に入りました。', 'wg_past_time', 'last month があるので join は過去形 joined です。', ['club']),
      ]),
      step('interest', '興味', 'なぜ連絡したか書こう', '現在形で興味を示す', 'メールの目的につながる自分の関心を伝えます。', [
        choice('a', 'I am interested in your basketball club.', '私はバスケットボール部に興味があります。', 'wg_simple_present', 'be interested in ... で「〜に興味がある」というまとまりです。', ['club'], true),
        choice('b', 'I like playing sports after school.', '私は放課後にスポーツをするのが好きです。', 'wg_like_ing', 'like の後ろに playing を置き、「すること」を表しています。'),
        choice('c', 'I want to learn how to play basketball better.', 'もっと上手にバスケットボールをする方法を学びたいです。', 'wg_to_purpose', 'how to + 動詞で「〜する方法」。want to の後ろは learn です。'),
      ]),
      step('request', 'お願い', '見学を丁寧にお願いしよう', 'Could I / Would it be possible to', '相手が答えやすい形で希望を示します。', [
        choice('a', 'Could I watch your practice next Tuesday?', '次の火曜日に練習を見学してもよいですか。', 'wg_invitation', 'Could I ...? は許可を丁寧に求めます。後ろは動詞の原形 watch です。', ['club'], true),
        choice('b', 'Would it be possible to join one practice?', '練習に一度参加することは可能でしょうか。', 'wg_invitation', 'Would it be possible to ...? はとても丁寧な依頼表現です。', ['club']),
        choice('c', 'Can I visit the club after school tomorrow?', '明日の放課後、部を訪ねてもよいですか。', 'wg_invitation', 'Can I ...? は許可を求める基本形。visit の後ろに場所を直接置きます。', ['club']),
      ]),
      step('reason', '理由', '見学したい理由を足そう', 'because で理由を続ける', 'お願いだけでなく理由も伝えます。', [
        choice('a', 'I am asking because I want to choose the right club.', '自分に合う部を選びたいのでお願いしています。', 'wg_because', 'because の後ろに I want to choose ... という完全な文を置きます。', ['club'], true),
        choice('b', 'I would like to meet the team before I decide.', '決める前にチームのみなさんに会いたいです。', 'wg_invitation', 'before の後ろに I decide を置き、二つの行動の順序を示します。'),
        choice('c', 'I need more information because I am a beginner.', '初心者なので、もっと情報が必要です。', 'wg_because', 'because I am a beginner が information を必要とする理由です。'),
      ]),
      step('question', '質問', '必要な情報を一つ聞こう', '疑問詞＋疑問文', '具体的な質問を入れると返信しやすくなります。', [
        choice('a', 'What should I bring to the practice?', '練習には何を持っていけばよいですか。', 'wg_wh_question', 'What の後ろは should I bring。bring A to B で「AをBへ持ってくる」です。', [], true),
        choice('b', 'How many days a week does the club practice?', 'その部は週に何日練習しますか。', 'wg_wh_question', '主語 the club が3人称単数なので、疑問文では does を使い practice は原形です。', ['club']),
        choice('c', 'When does the practice usually finish?', '練習は普段いつ終わりますか。', 'wg_wh_question', 'does があるため finish に s は付けません。usually は頻度を表します。'),
      ]),
      step('closing', '結び', '丁寧にメールを閉じよう', 'お礼＋返信を待つ表現', '相手の時間への配慮を示します。', [
        choice('a', 'Thank you for your time. I look forward to your reply.', 'お時間をありがとうございます。お返事をお待ちしています。', 'wg_email_closing', 'look forward to の後ろに名詞 your reply を置いています。', [], true),
        choice('b', 'Thank you for reading my message.', 'メッセージを読んでくださりありがとうございます。', 'wg_thank_for', 'for の後ろなので read を reading にします。'),
        choice('c', 'I hope I can visit the club soon.', '近いうちに部を訪ねられるとよいと思います。', 'wg_email_closing', 'hope の後ろに I can visit という主語＋動詞の文を置きます。', ['club']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_pre2_uniforms',
    level: 'pre2',
    genre: '意見文',
    title: '学校の制服は役立つか',
    emoji: '🎓',
    scene: '学校新聞の「制服は必要か」という特集に、賛成意見を投稿します。',
    task: '賛成の立場、二つの理由、具体例、結論を一段落にまとめよう。',
    rubric: ['立場を明示した', '理由を二つに整理した', '例を入れて結論へ戻った'],
    steps: [
      step('claim', '主張', '賛成の立場を示そう', 'I think / In my opinion で始める', '最初の一文だけで立場が分かるようにします。', [
        choice('a', 'I think that school uniforms are useful for students.', '学校の制服は生徒にとって役立つと思います。', 'wg_opinion_claim', 'think の後ろの that 節に主語 uniforms と動詞 are を置きます。', ['uniform', 'student'], true),
        choice('b', 'In my opinion, schools should keep their uniform rules.', '私の意見では、学校は制服の規則を維持すべきです。', 'wg_opinion_claim', 'In my opinion の後ろにコンマを置き、should keep で提案します。', ['uniform']),
        choice('c', 'I support school uniforms for two main reasons.', '私は主に二つの理由で学校の制服を支持します。', 'wg_opinion_claim', 'support の後ろに目的語 school uniforms を直接置きます。', ['uniform']),
      ]),
      step('reason1', '理由1', '一つ目の理由を選ぼう', 'First, で理由を予告する', '読み手が理由の順番を追えるようにします。', [
        choice('a', 'First, uniforms save students time every morning.', '第一に、制服は毎朝生徒の時間を節約します。', 'wg_signpost', '主語 uniforms は複数なので動詞は save。save 人 time の語順です。', ['uniform', 'student'], true),
        choice('b', 'First, students do not need to choose different clothes each day.', '第一に、生徒は毎日違う服を選ぶ必要がありません。', 'wg_signpost', 'do not need to の後ろは動詞の原形 choose です。', ['student']),
        choice('c', 'First, a uniform makes getting ready much easier.', '第一に、制服は身支度をずっと簡単にします。', 'wg_signpost', 'make A B で「AをBの状態にする」。getting ready が名詞の役割です。', ['uniform']),
      ]),
      step('example1', '具体例', '朝の場面を例にしよう', 'For example で具体化する', '理由が本当に働く場面を示します。', [
        choice('a', 'For example, students can prepare quickly on busy mornings.', '例えば、生徒は忙しい朝にすばやく準備できます。', 'wg_example', 'can の後ろは prepare。quickly は動作を説明する副詞です。', ['student'], true),
        choice('b', 'For example, they have more time to eat breakfast.', '例えば、朝食を食べる時間が増えます。', 'wg_example', 'time to eat は「食べるための時間」。they は students を受けます。', ['student']),
        choice('c', 'This is helpful when students are late.', 'これは生徒が遅れているときに役立ちます。', 'wg_example', 'when の後ろに students are late という時の条件を置きます。', ['student']),
      ]),
      step('reason2', '理由2', 'もう一つの理由を加えよう', 'Another reason is that ...', '違う角度の理由を選びます。', [
        choice('a', 'Another reason is that uniforms can create a sense of unity.', 'もう一つの理由は、制服が一体感を生み出せることです。', 'wg_signpost', 'is that の後ろに理由の内容を主語＋動詞で置きます。', ['uniform'], true),
        choice('b', 'Second, uniforms can reduce differences between students.', '第二に、制服は生徒間の違いを減らせます。', 'wg_signpost', 'reduce differences between ... で「〜の間の違いを減らす」です。', ['uniform', 'reduce', 'student']),
        choice('c', 'In addition, uniforms help students focus on school life.', 'さらに、制服は生徒が学校生活に集中するのを助けます。', 'wg_signpost', 'help 人 動詞の原形で「人が〜するのを助ける」です。', ['uniform', 'student']),
      ]),
      step('example2', '効果', '二つ目の理由の効果を示そう', 'As a result で結果へつなぐ', '理由から生まれる変化を書きます。', [
        choice('a', 'As a result, students may feel that they belong to one community.', 'その結果、生徒は一つの共同体に属していると感じるかもしれません。', 'wg_reason_result', 'may feel で控えめな可能性を示し、that 節が感じる内容です。', ['student', 'community'], true),
        choice('b', 'Therefore, clothes are less likely to become a source of pressure.', 'そのため、服装がプレッシャーの原因になりにくくなります。', 'wg_reason_result', 'be less likely to で「〜する可能性がより低い」です。'),
        choice('c', 'This can make the school environment more comfortable.', 'これは学校環境をより快適にできます。', 'wg_effect', 'make A B の形で、A = environment を B = more comfortable にします。', ['environment']),
      ]),
      step('balance', '注意', '小さな注意点も認めよう', 'However で一面を補う', '反対側を一言認めると意見が公平になります。', [
        choice('a', 'However, schools should allow some freedom in how uniforms are worn.', 'しかし学校は制服の着方にある程度の自由を認めるべきです。', 'wg_contrast', 'However の後ろにコンマ。how uniforms are worn は「制服がどう着られるか」です。', ['uniform'], true),
        choice('b', 'Of course, uniforms should be comfortable in every season.', 'もちろん、制服はどの季節でも快適であるべきです。', 'wg_modal_proposal', 'should be の後ろに形容詞 comfortable を置きます。', ['uniform']),
        choice('c', 'Schools must also listen to students who need special clothing.', '学校は特別な服装が必要な生徒の声も聞かなければなりません。', 'wg_relative_clause', 'who need special clothing が students を後ろから説明します。', ['student']),
      ]),
      step('conclusion', '結論', '最初の意見へ戻ろう', 'For these reasons でまとめる', '新しい理由は加えず、主張を言い直します。', [
        choice('a', 'For these reasons, I believe school uniforms remain a good choice.', 'これらの理由から、学校の制服はよい選択肢であり続けると思います。', 'wg_conclusion', 'believe の後ろに uniforms remain ... という文を置きます。', ['uniform'], true),
        choice('b', 'Therefore, uniforms can benefit both students and schools.', 'したがって、制服は生徒と学校の両方に役立ちます。', 'wg_conclusion', 'both A and B で「AとBの両方」。benefit はここでは動詞です。', ['uniform', 'benefit', 'student']),
        choice('c', 'Overall, I support uniforms if the rules are flexible.', '全体として、規則が柔軟なら制服を支持します。', 'wg_conclusion', 'if 節で、支持する条件を加えた結論です。', ['uniform']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_pre2_volunteering',
    level: 'pre2',
    genre: '提案文',
    title: '地域ボランティアを増やすには',
    emoji: '🤝',
    scene: '学校が地域ボランティアの日を作る案について、生徒会へ提案します。',
    task: '提案、二つの利点、具体例、実施方法、結論を書こう。',
    rubric: ['提案を明示した', '利点を具体例で支えた', '実行方法まで書いた'],
    steps: [
      step('claim', '提案', '中心となる提案を選ぼう', 'should で必要性を示す', '何をしてほしいかを最初に置きます。', [
        choice('a', 'I think our school should hold a community volunteer day.', '学校は地域ボランティアの日を開くべきだと思います。', 'wg_opinion_claim', 'should の後ろは動詞の原形 hold。community が volunteer day を説明します。', ['community', 'volunteer'], true),
        choice('b', 'In my opinion, every student should try local volunteer work.', '私の意見では、全生徒が地域のボランティア活動を試すべきです。', 'wg_opinion_claim', 'every student は単数扱いですが、should の後ろは常に原形 try です。', ['student', 'volunteer']),
        choice('c', 'Our school can help the community through a special service day.', '学校は特別な奉仕日を通して地域を助けられます。', 'wg_modal_proposal', 'through は「〜を手段として」。can の後ろは help です。', ['community', 'volunteer']),
      ]),
      step('reason1', '利点1', '生徒にとっての利点を選ぼう', 'First で一つ目を示す', '活動が参加者に何を与えるか考えます。', [
        choice('a', 'First, volunteer work teaches students responsibility.', '第一に、ボランティア活動は生徒に責任を教えます。', 'wg_signpost', 'teach 人 物で「人に物を教える」。主語 work は単数なので teaches です。', ['volunteer', 'student', 'responsibility'], true),
        choice('b', 'First, students can learn useful skills outside the classroom.', '第一に、生徒は教室外で役立つ技能を学べます。', 'wg_signpost', 'can learn で可能性を示し、outside が場所を加えます。', ['student']),
        choice('c', 'First, working with others can build confidence.', '第一に、他の人と活動することは自信を育てます。', 'wg_signpost', 'Working ... は動名詞句で、文全体の主語になっています。', ['volunteer']),
      ]),
      step('example1', '具体例', '活動の例を選ぼう', 'For example で場面を示す', '実際にできる行動へ落とし込みます。', [
        choice('a', 'For example, students could clean a park or help older people.', '例えば、生徒は公園を清掃したり高齢者を助けたりできます。', 'wg_example', 'could の後ろで clean と help を or で並べています。', ['student', 'park'], true),
        choice('b', 'For example, they could collect food for local families.', '例えば、地域の家族のために食料を集められます。', 'wg_example', 'collect A for B で「BのためにAを集める」です。', ['food', 'family', 'community']),
        choice('c', 'For example, volunteers could teach children simple computer skills.', '例えば、ボランティアは子どもに簡単なコンピューター技能を教えられます。', 'wg_example', 'teach children skills の語順で、教える相手を先に置きます。', ['volunteer']),
      ]),
      step('reason2', '利点2', '地域にとっての利点を加えよう', 'Another reason で視点を変える', '生徒だけでなく地域への効果を示します。', [
        choice('a', 'Another reason is that the activity would connect the school with the community.', 'もう一つの理由は、その活動が学校と地域を結びつけることです。', 'wg_signpost', 'connect A with B で「AをBと結ぶ」。would は期待される効果を控えめに示します。', ['community'], true),
        choice('b', 'In addition, local people would receive practical support.', 'さらに、地域の人々が実際的な支援を受けられます。', 'wg_signpost', 'receive support で「支援を受ける」。would で提案実施後の効果を表します。', ['community']),
        choice('c', 'The project could create new friendships across generations.', 'その企画は世代を超えた新しい友情を生み出せます。', 'wg_effect', 'across generations で「世代を超えて」。could create は可能性です。', ['friend', 'community']),
      ]),
      step('method', '方法', '参加しやすくする方法を選ぼう', 'If で実施条件を示す', 'よい案を実行可能な案へ進めます。', [
        choice('a', 'If students can choose from several activities, more of them will join.', '生徒が複数の活動から選べれば、より多くの生徒が参加します。', 'wg_condition', 'if 節は現在形 can choose、主節は未来 will join です。', ['student', 'volunteer'], true),
        choice('b', 'The school should offer short activities on weekends.', '学校は週末に短時間の活動を用意すべきです。', 'wg_modal_proposal', 'offer の後ろに用意する物 short activities を置きます。', ['weekend', 'volunteer']),
        choice('c', 'Teachers can invite local groups to explain their work.', '先生は地域団体を招き、活動を説明してもらえます。', 'wg_modal_proposal', 'invite 人 to + 動詞で「人に〜してもらうため招く」です。', ['invite', 'community']),
      ]),
      step('result', '効果', '方法から生まれる結果を書こう', 'As a result / This would で受ける', '直前の方法がなぜよいか説明します。', [
        choice('a', 'As a result, everyone could find a suitable way to help.', 'その結果、だれもが自分に合う助け方を見つけられます。', 'wg_reason_result', 'suitable way to help で「助けるのに適した方法」です。', ['volunteer'], true),
        choice('b', 'This would make volunteering easier for busy students.', 'これは忙しい生徒にとってボランティアをより簡単にします。', 'wg_effect', 'make A B で A = volunteering を B = easier にしています。', ['volunteer', 'student']),
        choice('c', 'Therefore, the project could continue for many years.', 'そのため、その企画は長年続けられるでしょう。', 'wg_reason_result', 'could continue で実現可能性を控えめに述べます。'),
      ]),
      step('conclusion', '結論', '提案をまとめよう', '理由を受けて賛成を言い直す', '冒頭の提案へ戻ります。', [
        choice('a', 'For these reasons, a volunteer day would benefit both students and the community.', 'これらの理由から、ボランティアの日は生徒と地域の両方に役立ちます。', 'wg_conclusion', 'both A and B で二つの受益者をまとめます。', ['volunteer', 'benefit', 'student', 'community'], true),
        choice('b', 'Therefore, I strongly recommend that our school start this project.', 'したがって、学校がこの企画を始めることを強く勧めます。', 'wg_conclusion', 'recommend that + 主語 + 動詞の原形 start を使った提案です。', ['encourage']),
        choice('c', 'Overall, this is a good opportunity to learn while helping others.', '全体として、これは人を助けながら学ぶよい機会です。', 'wg_conclusion', 'while helping が「助けながら」を表し、二つの行動を重ねます。', ['opportunity', 'volunteer']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_2_learning_technology',
    level: '2',
    genre: '論説文',
    title: '授業でのデジタル技術',
    emoji: '💻',
    scene: '学校の授業でデジタル技術をもっと使うべきか、条件付きの賛成意見を書きます。',
    task: '利点、対象となる生徒、課題、利用条件、期待される効果を論じよう。',
    rubric: ['利点を対象と結びつけた', '課題を認めた', '条件付きの提案にした'],
    steps: [
      step('claim', '主張', '中心の提案を示そう', 'should を使い、使い方も限定する', '全面賛成ではなく、目的のある導入にします。', [
        choice('a', 'Schools should use digital technology to support, rather than replace, classroom teaching.', '学校は授業を置き換えるのでなく支えるためにデジタル技術を使うべきです。', 'wg_modal_proposal', 'rather than replace が「置き換えるのではなく」と使い方を限定します。', ['technology', 'education'], true),
        choice('b', 'I believe technology can improve education when it is used for clear purposes.', '明確な目的で使われるなら、技術は教育を改善できると思います。', 'wg_condition', 'when it is used ... が効果の成り立つ条件を示します。', ['technology', 'education']),
        choice('c', 'Digital tools should become a regular but carefully controlled part of lessons.', 'デジタル機器は授業の通常の、しかし注意深く管理された一部になるべきです。', 'wg_contrast', 'regular but carefully controlled と二つの形容表現を but で対比します。', ['technology', 'education']),
      ]),
      step('benefit', '利点', '最初の利点を説明しよう', 'can で可能になることを示す', '技術そのものではなく、学習への効果を書きます。', [
        choice('a', 'First, online materials can give students immediate feedback on their work.', '第一に、オンライン教材は学習への即時のフィードバックを生徒に与えられます。', 'wg_signpost', 'give 人 物の語順で、students に feedback を与えると表します。', ['student', 'technology'], true),
        choice('b', 'First, digital resources can present difficult ideas in several different ways.', '第一に、デジタル教材は難しい考えを複数の方法で示せます。', 'wg_signpost', 'present A in ways で「Aをいくつかの方法で示す」です。', ['technology']),
        choice('c', 'First, technology can help learners study at their own pace.', '第一に、技術は学習者が自分のペースで学ぶのを助けます。', 'wg_signpost', 'help 人 動詞の原形で、learners study の形になります。', ['technology', 'education']),
      ]),
      step('target', '対象', '特に役立つ生徒を示そう', 'who で students を説明する', '利点が強く働く対象を絞ります。', [
        choice('a', 'This is especially valuable for students who need extra practice.', 'これは追加練習が必要な生徒に特に価値があります。', 'wg_relative_clause', 'who need extra practice が students を後ろから説明します。', ['student'], true),
        choice('b', 'Students who miss a lesson can review the material at home.', '授業を欠席した生徒は家で教材を復習できます。', 'wg_relative_clause', 'who miss a lesson がどの students かを限定しています。', ['student', 'education']),
        choice('c', 'It can also support learners who find large classes difficult.', '大人数の授業を難しいと感じる学習者も支援できます。', 'wg_relative_clause', 'who find ... が learners を説明し、find A B で「AをBと感じる」です。', ['education']),
      ]),
      step('example', '具体例', '学習場面の例を選ぼう', 'For example で利点を見える形にする', '読み手が授業を想像できるようにします。', [
        choice('a', 'For example, a student can replay an explanation until it becomes clear.', '例えば、生徒は説明が分かるまで繰り返し再生できます。', 'wg_example', 'until の後ろに it becomes clear を置き、動作の終点を示します。', ['student', 'technology'], true),
        choice('b', 'For instance, an interactive quiz can identify a learner’s weak points.', '例えば、対話型クイズは学習者の弱点を特定できます。', 'wg_example', 'identify の目的語が weak points。所有格 learner’s が誰の弱点か示します。', ['technology']),
        choice('c', 'A translation tool can help a new student understand key instructions.', '翻訳ツールは新しい生徒が重要な指示を理解するのを助けます。', 'wg_relative_clause', 'help 人 動詞の原形 understand の形です。', ['student', 'technology']),
      ]),
      step('risk', '課題', '一方の課題を認めよう', 'However / While で対比する', '賛成意見でも限界を隠さず示します。', [
        choice('a', 'However, too much screen time can reduce concentration and real conversation.', 'しかし、長すぎる画面時間は集中と実際の会話を減らすことがあります。', 'wg_contrast', 'too much が過剰さを示し、reduce の目的語を and で二つ並べます。', ['reduce', 'technology'], true),
        choice('b', 'While online tools are useful, they cannot understand every student’s needs.', 'オンライン機器は有用ですが、全生徒の必要を理解できるわけではありません。', 'wg_contrast', 'While A, B で利点を認めた後に限界を示します。', ['student', 'technology']),
        choice('c', 'Nevertheless, unequal access to devices may widen educational differences.', 'それでも、機器への不平等なアクセスは教育格差を広げるかもしれません。', 'wg_contrast', 'may widen で起こり得る危険を断定しすぎず示します。', ['access', 'education', 'technology']),
      ]),
      step('teacher', '役割', '教師の役割を位置づけよう', 'that / who で必要な役割を説明する', '技術と人の関係を明確にします。', [
        choice('a', 'Teachers are still needed to choose tools that match each learning goal.', '各学習目標に合う機器を選ぶため、教師は依然必要です。', 'wg_relative_clause', 'that match ... が tools を説明し、match は「〜に合う」です。', ['technology', 'education'], true),
        choice('b', 'Good teachers provide guidance that a computer cannot offer.', 'よい教師はコンピューターにはできない指導を提供します。', 'wg_relative_clause', 'that a computer cannot offer が guidance を限定します。', ['technology', 'education']),
        choice('c', 'Human discussion should remain at the center of every lesson.', '人同士の話し合いはすべての授業の中心であり続けるべきです。', 'wg_modal_proposal', 'remain at the center of ... で中心的役割を保つことを表します。', ['education']),
      ]),
      step('condition', '条件', '安全に使う条件を選ぼう', 'If でルールと結果を結ぶ', '課題への具体的な対策を示します。', [
        choice('a', 'If schools set time limits and clear goals, students can use technology effectively.', '学校が時間制限と明確な目標を定めれば、生徒は技術を効果的に使えます。', 'wg_condition', 'if 節は現在形 set、主節は can use。effectively は使い方を説明します。', ['student', 'technology', 'efficient'], true),
        choice('b', 'Schools should lend devices to students who cannot afford them.', '学校は機器を買えない生徒に貸し出すべきです。', 'wg_modal_proposal', 'lend 物 to 人の語順で、who cannot afford them が students を説明します。', ['student', 'technology', 'access']),
        choice('c', 'Teachers should check whether each tool actually improves learning.', '教師は各機器が実際に学習を改善するか確認すべきです。', 'wg_modal_proposal', 'whether 節が check の内容になり、「〜かどうか」を表します。', ['technology', 'education']),
      ]),
      step('effect', '効果', '条件を守った結果を書こう', 'This で直前の提案全体を受ける', '対策が何を実現するか示します。', [
        choice('a', 'This balanced approach will make lessons more flexible without losing human support.', 'このバランスの取れた方法は、人の支援を失わず授業を柔軟にします。', 'wg_effect', 'without -ing で「〜せずに」。make A B で lessons を more flexible にします。', ['balance', 'education'], true),
        choice('b', 'As a result, technology will expand access while teachers protect learning quality.', 'その結果、教師が学習の質を守りながら技術が利用機会を広げます。', 'wg_reason_result', 'while で二つの働きを同時に示します。', ['technology', 'access', 'education']),
        choice('c', 'Such rules can turn digital tools into a reliable part of education.', 'そのような規則はデジタル機器を教育の信頼できる一部にできます。', 'wg_effect', 'turn A into B で「AをBに変える」です。', ['technology', 'education']),
      ]),
      step('conclusion', '結論', '立場と条件をまとめよう', 'Overall / Therefore で統合する', '利点・課題・条件を一文にまとめます。', [
        choice('a', 'Overall, schools should use technology as a tool for better teaching, not as a substitute for it.', '全体として、学校は技術を授業の代用品でなく、よりよい指導の道具として使うべきです。', 'wg_conclusion', 'as A, not as B で望ましい役割と避ける役割を対比します。', ['technology', 'education'], true),
        choice('b', 'Therefore, careful use of technology can benefit students without weakening the classroom community.', 'したがって、技術を注意深く使えば教室の共同体を弱めず生徒に役立ちます。', 'wg_conclusion', 'without weakening が避ける悪影響を示します。', ['technology', 'benefit', 'student', 'community']),
        choice('c', 'For these reasons, digital learning deserves support when access and guidance are guaranteed.', 'これらの理由から、利用機会と指導が保証されるならデジタル学習は支援に値します。', 'wg_conclusion', 'when 節で賛成の条件を限定しています。', ['technology', 'education', 'access']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_2_environment',
    level: '2',
    genre: '提案型エッセイ',
    title: '町のごみを減らす計画',
    emoji: '♻️',
    scene: '地域のごみを減らすため、自治体へ実行可能な提案を書きます。',
    task: '問題、原因、二つの対策、条件、地域への効果を論じよう。',
    rubric: ['問題と原因を結びつけた', '対策を二つ提案した', '実施条件と効果を示した'],
    steps: [
      step('problem', '問題', '中心課題を示そう', '現在の問題＋should で方向を示す', '何を変える作文かを最初に明確にします。', [
        choice('a', 'Our town should take stronger action to reduce household waste.', '私たちの町は家庭ごみを減らすため、より強い対策を取るべきです。', 'wg_modal_proposal', 'take action to + 動詞で「〜するために対策を取る」です。', ['reduce', 'waste', 'environment'], true),
        choice('b', 'Reducing local waste should become a priority for both citizens and businesses.', '地域のごみ削減は市民と企業双方の優先事項になるべきです。', 'wg_modal_proposal', 'Reducing ... は動名詞句で文の主語です。both A and B で対象を並べます。', ['reduce', 'waste', 'community']),
        choice('c', 'The amount of food and packaging thrown away in our community is unsustainable.', '地域で捨てられる食品と包装の量は持続不可能です。', 'wg_relative_clause', 'thrown away ... が food and packaging を後ろから説明する過去分詞句です。', ['food', 'waste', 'community', 'sustainable']),
      ]),
      step('cause', '原因', '問題が続く理由を選ぼう', 'because / one reason で原因を示す', '対策につながる原因を一つに絞ります。', [
        choice('a', 'One reason is that many people do not know how much they discard.', '一つの理由は、多くの人が自分の廃棄量を知らないことです。', 'wg_signpost', 'is that の後ろに原因の内容を完全な文で置きます。', ['waste'], true),
        choice('b', 'Waste remains high because convenient products often use unnecessary packaging.', '便利な商品が不要な包装をよく使うため、ごみは多いままです。', 'wg_because', 'because 節が waste remains high の原因です。', ['waste', 'consumer']),
        choice('c', 'Consumers have little information about what can be reused or recycled.', '消費者には何を再利用・再生利用できるかの情報がほとんどありません。', 'wg_relative_clause', 'what can be ... は「何が〜できるか」を表す名詞節です。', ['consumer', 'recycle', 'waste']),
      ]),
      step('solution1', '対策1', '家庭向けの対策を提案しよう', 'should で具体的行動を示す', '原因へ直接働く対策を選びます。', [
        choice('a', 'First, the town should give every household a simple monthly waste report.', '第一に、町は全世帯へ簡単な月間ごみ報告を渡すべきです。', 'wg_signpost', 'give 人 物の語順で every household に a report を渡します。', ['waste'], true),
        choice('b', 'First, residents should receive clear instructions on sorting and recycling.', '第一に、住民は分別と再生利用の明確な説明を受けるべきです。', 'wg_signpost', 'instructions on ... で「〜についての説明」。sorting と recycling を並べます。', ['recycle', 'waste']),
        choice('c', 'First, families should be offered smaller bins for general waste.', '第一に、家庭には一般ごみ用の小さな箱が提供されるべきです。', 'wg_modal_proposal', 'should be offered は受動態で、「家庭が提供を受ける」側を主語にします。', ['family', 'waste']),
      ]),
      step('effect1', '効果1', 'その対策の効果を書こう', 'who / This で前文を受ける', 'なぜその方法が機能するか示します。', [
        choice('a', 'People who see their own data are more likely to change their habits.', '自分のデータを見る人は習慣を変える可能性が高くなります。', 'wg_relative_clause', 'who see their own data が People を説明し、be likely to で可能性を示します。', ['technology', 'waste'], true),
        choice('b', 'This information can help families identify easy ways to reduce waste.', 'この情報は家庭が簡単なごみ削減法を見つける助けになります。', 'wg_effect', 'help families identify のように help の後ろへ人＋動詞の原形を置きます。', ['family', 'reduce', 'waste']),
        choice('c', 'As a result, recycling would become a normal part of daily life.', 'その結果、再生利用が日常生活の普通の一部になります。', 'wg_reason_result', 'would become で対策後に期待される変化を表します。', ['recycle']),
      ]),
      step('solution2', '対策2', '企業向けの対策を加えよう', 'In addition で別の対象へ進む', '家庭だけに責任を負わせない提案にします。', [
        choice('a', 'In addition, local shops should reward customers who bring reusable containers.', 'さらに、地域の店は再利用容器を持参する客に特典を与えるべきです。', 'wg_relative_clause', 'who bring ... が customers を説明し、reward 人で「人に報いる」です。', ['consumer', 'sustainable'], true),
        choice('b', 'Businesses should be encouraged to remove unnecessary packaging.', '企業は不要な包装をなくすよう促されるべきです。', 'wg_modal_proposal', 'should be encouraged to + 動詞で、働きかけを受ける側を主語にします。', ['encourage', 'reduce', 'waste']),
        choice('c', 'The town could lower fees for stores that donate unsold food.', '町は売れ残り食品を寄付する店の料金を下げられます。', 'wg_relative_clause', 'that donate ... が stores を説明します。unsold は food の状態を表す過去分詞です。', ['food', 'waste']),
      ]),
      step('condition', '条件', '公平に実施する条件を選ぼう', 'If で支援条件を示す', '負担が偏らないようにします。', [
        choice('a', 'If the rules are simple and affordable, most businesses will cooperate.', '規則が簡単で負担可能なら、ほとんどの企業が協力します。', 'wg_condition', 'if 節は現在形 are、主節は未来 will cooperate です。', ['community'], true),
        choice('b', 'Small shops should receive support while they change their systems.', '小規模店は仕組みを変える間、支援を受けるべきです。', 'wg_contrast', 'while の後ろに変化の期間を示す文を置きます。'),
        choice('c', 'The policy will work only if convenient alternatives are available.', '便利な代替品が利用できる場合にのみ、その政策は機能します。', 'wg_condition', 'only if が不可欠な条件を強調します。', ['policy', 'sustainable']),
      ]),
      step('community', '地域効果', '地域全体への効果をまとめよう', 'This / Together で対策を統合する', '二つの対策が同時に働く姿を示します。', [
        choice('a', 'Together, these measures would reduce costs and protect the local environment.', 'これらの対策は合わせて費用を減らし、地域環境を守ります。', 'wg_effect', 'reduce と protect を and で並べ、一つの主語 measures が共有します。', ['reduce', 'environment'], true),
        choice('b', 'This approach would share responsibility among citizens, businesses, and government.', 'この方法は市民、企業、政府の間で責任を分かち合います。', 'wg_effect', 'among は三者以上の間を表し、responsibility の分担先を並べます。', ['responsibility', 'government']),
        choice('c', 'The program could also create a cleaner and more sustainable community.', 'その計画はより清潔で持続可能な地域も作れます。', 'wg_effect', 'cleaner and more sustainable という二つの比較表現が community を説明します。', ['sustainable', 'community']),
      ]),
      step('conclusion', '結論', '実行を促す一文で結ぼう', 'Therefore / For these reasons でまとめる', '問題・対策・効果を主張へ戻します。', [
        choice('a', 'For these reasons, the town should combine information, incentives, and fair rules to reduce waste.', 'これらの理由から、町は情報、奨励策、公平な規則を組み合わせてごみを減らすべきです。', 'wg_conclusion', 'combine A, B, and C で三つの対策を統合します。', ['reduce', 'waste', 'policy'], true),
        choice('b', 'Therefore, a shared plan offers the most practical path toward lasting change.', 'したがって、共同計画が持続的変化への最も実用的な道を示します。', 'wg_conclusion', 'the most practical は最上級で、選択肢の中で最も実行可能だと評価します。', ['sustainable', 'community']),
        choice('c', 'Acting now will benefit both the environment and future generations.', '今行動することは環境と将来世代の両方に役立ちます。', 'wg_conclusion', 'Acting now は動名詞句の主語。both A and B で二つの対象を並べます。', ['benefit', 'environment']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_pre1_remote_work',
    level: 'pre1',
    genre: 'バランス型論説',
    title: '在宅勤務をどう設計するか',
    emoji: '🏠',
    scene: '在宅勤務を恒久制度にする企業へ、利点と課題を踏まえた提言を書きます。',
    task: '譲歩、二つの利点、具体例、課題、反論への応答、条件付き結論を含めよう。',
    rubric: ['利点と課題を公平に扱った', '具体例と因果を示した', '条件付きの制度提言にした'],
    steps: [
      step('context', '背景', '話題の現状を示そう', '現在完了・変化を表す表現', '議論が必要になった背景を簡潔に置きます。', [
        choice('a', 'Remote work has become a permanent feature of many modern workplaces.', '在宅勤務は多くの現代的職場の恒久的特徴になりました。', 'wg_nominalization', 'has become は過去から現在までの変化を表す現在完了です。', ['remote', 'work'], true),
        choice('b', 'Companies are reconsidering where and how their employees should work.', '企業は従業員がどこでどう働くべきか再検討しています。', 'wg_relative_clause', 'where and how ... は reconsidering の内容となる間接疑問です。', ['work']),
        choice('c', 'The rapid expansion of remote work has changed expectations about employment.', '在宅勤務の急速な拡大は雇用への期待を変えました。', 'wg_nominalization', 'expand を expansion と名詞化し、複雑な変化を主語にしています。', ['remote', 'work']),
      ]),
      step('claim', '主張', '両面を認めた立場を選ぼう', 'Although / While で譲歩する', '利点だけの賛成ではないことを示します。', [
        choice('a', 'Although remote work offers clear benefits, a fully remote model is not suitable for every organization.', '在宅勤務には明確な利点がありますが、完全在宅型は全組織に適するわけではありません。', 'wg_concession', 'Although 節で利点を認め、主節で適用範囲を限定します。', ['remote', 'work', 'benefit'], true),
        choice('b', 'While flexible work should be supported, companies must also protect collaboration and employee well-being.', '柔軟な働き方は支援すべきですが、企業は協働と従業員の健康も守らなければなりません。', 'wg_concession', 'While A, B で支持と必要な注意を同時に示します。', ['work', 'balance']),
        choice('c', 'On balance, a hybrid policy is preferable to either complete freedom or a total office requirement.', '総合的には、全面的自由や完全出社よりハイブリッド方針が望ましいです。', 'wg_hedged_conclusion', 'preferable to ... で比較し、either A or B で両極端を並べます。', ['balance', 'policy', 'work']),
      ]),
      step('benefit1', '利点1', '個人への利点を説明しよう', '因果が分かる一文にする', '便利というだけでなく、何が改善するか示します。', [
        choice('a', 'By eliminating daily travel, remote work can give employees more control over their time.', '毎日の移動をなくすことで、在宅勤務は従業員が時間をより管理できるようにします。', 'wg_causal', 'By eliminating が手段を示し、give 人 control over ... で効果を表します。', ['remote', 'work'], true),
        choice('b', 'Greater flexibility allows workers to organize demanding tasks around their most productive hours.', '柔軟性が高まると、働く人は負荷の高い仕事を最も生産的な時間に合わせられます。', 'wg_effect', 'allow 人 to + 動詞で「人が〜できるようにする」です。', ['work', 'productivity']),
        choice('c', 'Employees may achieve a healthier balance between professional and family responsibilities.', '従業員は仕事と家族の責任の間でより健全なバランスを得られるかもしれません。', 'wg_effect', 'between A and B で二つの責任領域を対比します。', ['balance', 'family', 'responsibility', 'work']),
      ]),
      step('example1', '根拠1', '利点が強く出る場面を示そう', 'especially true when で条件を絞る', '誰に、いつ有効か具体化します。', [
        choice('a', 'This is especially valuable for people who care for children or older relatives.', 'これは子どもや高齢の親族を世話する人に特に価値があります。', 'wg_evidence', 'who care for ... が people を説明し、対象を具体化します。', ['family', 'responsibility'], true),
        choice('b', 'For instance, workers in distant communities can access jobs without relocating.', '例えば、遠隔地域の働く人は転居せずに仕事へアクセスできます。', 'wg_evidence', 'without relocating で「転居することなく」という条件を加えます。', ['remote', 'community', 'access', 'work']),
        choice('c', 'Employees can use the time once spent commuting for exercise, study, or rest.', '従業員は以前通勤に使った時間を運動、学習、休息に使えます。', 'wg_relative_clause', 'once spent commuting が time を後ろから説明する短縮された関係表現です。', ['education', 'work']),
      ]),
      step('benefit2', '利点2', '組織への利点を加えよう', 'By -ing / thereby -ing で因果を圧縮', '個人から企業の視点へ移ります。', [
        choice('a', 'Companies can recruit from a wider area, thereby gaining access to more diverse skills.', '企業はより広い地域から採用し、それによって多様な技能へアクセスできます。', 'wg_causal', 'thereby gaining が前の recruit から生じる結果を表します。', ['access', 'work'], true),
        choice('b', 'By reducing office space and travel, organizations may lower operating costs.', 'オフィス空間と移動を減らすことで、組織は運営費を下げられるかもしれません。', 'wg_causal', 'By reducing が手段、may lower が控えめな効果です。', ['reduce', 'work']),
        choice('c', 'A flexible policy may improve retention by giving employees greater autonomy.', '柔軟な方針は従業員へより大きな自律性を与え、定着率を改善するかもしれません。', 'wg_causal', 'by giving が improve retention の手段を示します。', ['policy', 'work']),
      ]),
      step('risk', '課題', '制度の課題を示そう', 'However / Nevertheless で転換する', '議論を反対側へ進めます。', [
        choice('a', 'However, prolonged isolation can damage motivation, informal learning, and a sense of belonging.', 'しかし、長期の孤立は意欲、非公式な学び、所属感を損なうことがあります。', 'wg_contrast', 'damage の目的語を三つ並べ、isolation の複数の影響を示します。', ['isolation', 'education', 'work'], true),
        choice('b', 'Nevertheless, digital meetings rarely reproduce the spontaneous exchanges of a shared workplace.', 'それでも、デジタル会議は共有職場の自然な交流を再現することはほとんどありません。', 'wg_contrast', 'rarely で頻度を低くし、断定の根拠となる限界を示します。', ['technology', 'work']),
        choice('c', 'Remote employees may struggle to separate work from private life.', '在宅勤務者は仕事と私生活を分けることに苦労するかもしれません。', 'wg_contrast', 'struggle to + 動詞で「〜するのに苦労する」。separate A from B の語順です。', ['remote', 'work', 'privacy']),
      ]),
      step('counter', '反論', '想定される反論を取り上げよう', 'Critics may argue that ...', '反対意見を弱く書かず、公平に示します。', [
        choice('a', 'Critics may argue that employees can solve these problems simply by communicating more often.', '批判する人は、従業員がより頻繁に連絡すれば問題を解決できると主張するかもしれません。', 'wg_counterresponse', 'may argue that の後ろに反論の内容を完全な文で置きます。', ['work'], true),
        choice('b', 'Some claim that online collaboration tools make physical offices unnecessary.', 'オンライン協働機器が物理的オフィスを不要にすると主張する人もいます。', 'wg_counterresponse', 'claim that の that 節が主張内容です。make A B で offices を unnecessary にします。', ['technology', 'work']),
        choice('c', 'It might be said that workers should be responsible for managing their own well-being.', '働く人は自分の健康管理に責任を負うべきだと言われるかもしれません。', 'wg_counterresponse', 'It might be said that は反論の出所を一般化する受動表現です。', ['responsibility', 'work']),
      ]),
      step('response', '応答', '反論だけでは足りない理由を書こう', 'nevertheless / yet で応答する', '組織が果たすべき役割へ戻ります。', [
        choice('a', 'Nevertheless, individual effort cannot replace the social conditions created by thoughtful management.', 'それでも、個人の努力は配慮ある管理が作る社会的条件を代替できません。', 'wg_counterresponse', 'created by ... が conditions を説明し、反論の限界を示します。', ['work', 'responsibility'], true),
        choice('b', 'Yet communication is effective only when companies provide time and spaces for it.', 'しかし、企業が時間と場を用意するときにのみ意思疎通は効果的です。', 'wg_condition', 'only when が effective になる不可欠な条件を示します。', ['efficient', 'work']),
        choice('c', 'Even highly independent workers benefit from regular contact and clear boundaries.', '自立性の高い働く人でさえ、定期的な接触と明確な境界から恩恵を受けます。', 'wg_counterresponse', 'Even が「その人でさえ」と反論への例外を示します。', ['benefit', 'work']),
      ]),
      step('policy', '制度', '具体的な制度条件を提案しよう', 'provided that / if で条件を示す', 'ハイブリッド案を実行可能にします。', [
        choice('a', 'A hybrid system can work provided that teams agree on shared office days and response times.', 'チームが共通出社日と応答時間に合意するなら、ハイブリッド制度は機能します。', 'wg_hedged_conclusion', 'provided that が「〜という条件で」を表します。', ['work', 'policy'], true),
        choice('b', 'Companies should guarantee equipment, mental-health support, and equal promotion opportunities.', '企業は機器、心の健康支援、平等な昇進機会を保証すべきです。', 'wg_modal_proposal', 'guarantee の目的語を三つ並べ、制度の具体性を上げます。', ['opportunity', 'technology', 'work']),
        choice('c', 'Managers should judge performance by results rather than by physical presence.', '管理者は物理的な在席でなく成果によって業績を判断すべきです。', 'wg_contrast', 'A rather than B で望ましい基準と避ける基準を対比します。', ['productivity', 'work']),
      ]),
      step('conclusion', '結論', '両面を統合して結ぼう', 'On balance ＋ 条件付き主張', '利点も課題も残したまま、明確な提言にします。', [
        choice('a', 'On balance, remote work should remain available, provided that flexibility is matched by deliberate social support.', '総合的には、柔軟性に意図的な社会的支援が伴うなら在宅勤務は利用可能であるべきです。', 'wg_hedged_conclusion', 'provided that 以下が賛成の条件で、is matched by は受動態です。', ['balance', 'remote', 'work'], true),
        choice('b', 'The most sustainable policy is therefore one that combines autonomy with meaningful human connection.', 'したがって最も持続可能な方針は、自律性と意味ある人のつながりを組み合わせるものです。', 'wg_hedged_conclusion', 'one that ... の one は policy を受け、that 節が内容を説明します。', ['sustainable', 'policy', 'work']),
        choice('c', 'Rather than choosing between home and office, organizations should design work around both performance and well-being.', '自宅かオフィスかを選ぶのでなく、組織は業績と健康の両方を軸に仕事を設計すべきです。', 'wg_synthesis', 'Rather than -ing で二者択一を退け、both A and B で統合します。', ['balance', 'work', 'productivity']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_pre1_food_waste',
    level: 'pre1',
    genre: '政策提言',
    title: '食品ロス削減の責任',
    emoji: '🥕',
    scene: '食品ロスを減らすため、消費者・企業・政府の役割を論じます。',
    task: '問題の複合性、各主体の責任、反論、実施条件、総合的提言を書こう。',
    rubric: ['複数主体の責任を整理した', '反論へ応答した', '政策を条件付きで提案した'],
    steps: [
      step('context', '背景', '問題の規模を示そう', '名詞化で問題を一つの論点にする', '個人の行動だけに見えない導入にします。', [
        choice('a', 'The continued waste of edible food is both an environmental and a social failure.', '食べられる食品が廃棄され続けることは環境面・社会面双方の失敗です。', 'wg_nominalization', 'waste を名詞として主語にし、both A and B で二面を示します。', ['food', 'waste', 'environment'], true),
        choice('b', 'Food waste persists despite growing public concern about sustainability.', '持続可能性への関心が高まっているにもかかわらず、食品ロスは続いています。', 'wg_concession', 'despite の後ろに名詞句 growing public concern を置いて譲歩します。', ['food', 'waste', 'sustainable']),
        choice('c', 'Reducing food waste has become an urgent challenge for wealthy societies.', '食品ロス削減は豊かな社会にとって緊急課題になりました。', 'wg_nominalization', 'Reducing food waste は動名詞句で、問題全体を主語にします。', ['reduce', 'food', 'waste', 'challenge']),
      ]),
      step('claim', '主張', '責任の分担を主張しよう', 'not only A but also B で範囲を広げる', '一つの主体だけで解けない立場を明示します。', [
        choice('a', 'Responsibility should be shared not only by consumers but also by businesses and government.', '責任は消費者だけでなく、企業と政府にも分担されるべきです。', 'wg_synthesis', 'not only A but also B で責任の範囲を広げ、受動態 should be shared を使います。', ['responsibility', 'consumer', 'government'], true),
        choice('b', 'Although individual choices matter, systemic incentives have a greater influence on waste.', '個人の選択も重要ですが、制度的誘因のほうがごみに大きく影響します。', 'wg_concession', 'Although で個人の役割を認め、主節でより大きな要因を示します。', ['consumer', 'waste']),
        choice('c', 'An effective strategy must combine education, regulation, and changes in business practice.', '効果的な戦略は教育、規制、商慣行の変化を組み合わせなければなりません。', 'wg_synthesis', 'combine の目的語を三つ並べ、複合的な方針を示します。', ['efficient', 'education', 'policy']),
      ]),
      step('consumer', '消費者', '消費者の役割を具体化しよう', 'By -ing で行動と効果を結ぶ', '個人ができる現実的な行動を示します。', [
        choice('a', 'By planning meals and understanding date labels, consumers can avoid unnecessary purchases.', '食事を計画し期限表示を理解することで、消費者は不要な購入を避けられます。', 'wg_causal', 'By の後ろに planning と understanding を並べ、手段を二つ示します。', ['consumer', 'food', 'waste'], true),
        choice('b', 'Consumers can reduce waste by buying smaller quantities and using leftovers creatively.', '消費者は少量を買い残り物を工夫して使うことで、ごみを減らせます。', 'wg_causal', 'by buying ... and using ... が reduce の具体的な方法です。', ['consumer', 'reduce', 'waste']),
        choice('c', 'Households should treat edible leftovers as resources rather than rubbish.', '家庭は食べられる残り物をごみではなく資源として扱うべきです。', 'wg_contrast', 'treat A as B rather than C で、望ましい見方と避ける見方を対比します。', ['food', 'waste']),
      ]),
      step('business', '企業', '企業側の責任へ進もう', 'which / that で対象を説明する', '廃棄が生まれる仕組みへ視点を移します。', [
        choice('a', 'Retailers should redesign promotions that encourage customers to buy more than they need.', '小売業者は客に必要以上の購入を促す販売促進を見直すべきです。', 'wg_relative_clause', 'that encourage ... が promotions を説明し、more than ... で過剰を示します。', ['encourage', 'consumer', 'waste'], true),
        choice('b', 'Restaurants could offer flexible portions and make excess food available for donation.', '飲食店は量を柔軟に選べるようにし、余剰食品を寄付に回せます。', 'wg_modal_proposal', 'offer と make を and で並べ、make A available for B の形を使います。', ['food', 'waste']),
        choice('c', 'Manufacturers should reduce packaging that pushes consumers toward oversized products.', '製造業者は消費者を大型商品へ誘導する包装を減らすべきです。', 'wg_relative_clause', 'that pushes ... が packaging を説明し、主語が単数なので pushes です。', ['reduce', 'consumer', 'waste']),
      ]),
      step('government', '政府', '制度の役割を加えよう', 'could / should で政策手段を示す', '個人・企業を支えるルールを提案します。', [
        choice('a', 'Governments could require large companies to report how much edible food they discard.', '政府は大企業に食べられる食品の廃棄量を報告させられます。', 'wg_modal_proposal', 'require 人 to + 動詞で「人に〜を義務づける」です。', ['government', 'food', 'waste'], true),
        choice('b', 'Tax incentives should reward businesses that donate safe surplus food.', '税制上の奨励策は安全な余剰食品を寄付する企業に報いるべきです。', 'wg_relative_clause', 'that donate ... が businesses を説明します。', ['government', 'food', 'policy']),
        choice('c', 'Public education should explain food labels and the environmental cost of waste.', '公教育は食品表示と廃棄の環境コストを説明すべきです。', 'wg_modal_proposal', 'explain の目的語を and で二つ並べています。', ['education', 'food', 'environment', 'waste']),
      ]),
      step('evidence', '根拠', '政策が働く仕組みを示そう', 'thereby / especially when で因果を明確に', '提案の効果を具体的に説明します。', [
        choice('a', 'Transparent reporting would expose inefficient practices, thereby creating pressure for improvement.', '透明な報告は非効率な慣行を明らかにし、改善への圧力を生みます。', 'wg_causal', 'thereby creating が expose の結果を示します。', ['transparent', 'efficient', 'policy'], true),
        choice('b', 'Such incentives are especially effective when donation networks are easy to access.', 'そのような奨励策は、寄付網へ簡単にアクセスできるとき特に効果的です。', 'wg_evidence', 'especially effective when ... が効果の高い条件を絞ります。', ['efficient', 'access']),
        choice('c', 'Clear labels would help consumers distinguish safety information from quality guidance.', '明確な表示は消費者が安全情報と品質目安を区別する助けになります。', 'wg_effect', 'distinguish A from B で二つを区別します。', ['consumer', 'food']),
      ]),
      step('counter', '反論', '規制への反論を示そう', 'Critics may argue that ...', '費用や自由への懸念を公平に扱います。', [
        choice('a', 'Critics may argue that additional rules would raise costs for businesses and consumers.', '批判する人は追加規制が企業と消費者の費用を上げると主張するかもしれません。', 'wg_counterresponse', 'argue that の後ろに反論内容を置き、would で予想される影響を示します。', ['consumer', 'policy'], true),
        choice('b', 'Some object that food decisions should remain a matter of personal responsibility.', '食品の判断は個人責任の問題であるべきだと反対する人もいます。', 'wg_counterresponse', 'object that で反対意見を導き、a matter of ... で「〜の問題」です。', ['food', 'responsibility']),
        choice('c', 'Businesses may claim that unpredictable demand makes waste unavoidable.', '企業は予測不能な需要が廃棄を避けられなくすると主張するかもしれません。', 'wg_counterresponse', 'make A B で waste を unavoidable の状態にします。', ['waste']),
      ]),
      step('response', '応答', '反論の限界を説明しよう', 'nevertheless / yet で戻る', '懸念を認めつつ、提案の必要性を守ります。', [
        choice('a', 'Nevertheless, carefully designed rules can prevent costs from falling unfairly on small firms.', 'それでも、注意深く設計した規則は費用が小企業へ不公平にかかるのを防げます。', 'wg_counterresponse', 'prevent A from -ing で「Aが〜するのを防ぐ」です。', ['policy', 'balance'], true),
        choice('b', 'Yet personal responsibility is meaningful only when consumers receive accurate information and realistic choices.', 'しかし個人責任は、消費者が正確な情報と現実的な選択肢を得るときにのみ意味を持ちます。', 'wg_condition', 'only when が責任を問える条件を限定します。', ['responsibility', 'consumer']),
        choice('c', 'Although demand is uncertain, better data can help companies manage surplus more efficiently.', '需要は不確実ですが、よりよいデータは企業が余剰を効率的に管理する助けになります。', 'wg_concession', 'Although で不確実性を認め、主節で対応可能性を示します。', ['technology', 'efficient', 'waste']),
      ]),
      step('condition', '条件', '公平で実行可能な条件を選ぼう', 'provided that で政策を限定する', '提案を現実的な形へ調整します。', [
        choice('a', 'The measures will be credible provided that targets are measurable and support is available to smaller businesses.', '目標が測定可能で小企業への支援があるなら、対策は信頼されます。', 'wg_hedged_conclusion', 'provided that の中で二つの条件を and で並べます。', ['policy', 'efficient'], true),
        choice('b', 'Any regulation should be introduced gradually and reviewed with evidence from each stage.', '規制は段階的に導入し、各段階の根拠とともに見直すべきです。', 'wg_evidence', 'should be introduced / reviewed という二つの受動態を並べています。', ['policy', 'evidence']),
        choice('c', 'Policies must distinguish between avoidable waste and losses caused by genuine safety concerns.', '政策は避けられる廃棄と真の安全懸念による損失を区別しなければなりません。', 'wg_contrast', 'distinguish between A and B で政策対象を分けます。', ['policy', 'waste']),
      ]),
      step('conclusion', '結論', '複数主体を統合して結ぼう', 'On balance / Rather than で総合する', '一つの万能策ではなく連携を提言します。', [
        choice('a', 'On balance, lasting reductions in food waste require informed consumers, responsible businesses, and supportive regulation.', '総合的には、食品ロスの持続的削減には、知識ある消費者、責任ある企業、支援的規制が必要です。', 'wg_hedged_conclusion', 'require の目的語を三つ並べ、議論全体を統合します。', ['balance', 'reduce', 'food', 'waste', 'consumer', 'responsibility'], true),
        choice('b', 'Rather than blaming one group, society should align information, incentives, and accountability across the entire food system.', '一集団を責めるのでなく、社会は食品制度全体で情報、誘因、説明責任を整合させるべきです。', 'wg_synthesis', 'Rather than -ing で単純な責任追及を退け、三つの手段を統合します。', ['food', 'responsibility', 'policy']),
        choice('c', 'Only coordinated action can turn wasted food from an accepted cost into a preventable exception.', '協調行動だけが、食品廃棄を当然の費用から防げる例外へ変えられます。', 'wg_synthesis', 'turn A from B into C で、現在の状態から望む状態への変化を表します。', ['food', 'waste']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_1_public_ai',
    level: '1',
    genre: '公共政策論',
    title: '行政サービスへのAI導入',
    emoji: '🏛️',
    scene: '政府が行政サービスへAIを導入する際の原則を、効率・公平性・プライバシーから論じます。',
    task: '限定付き主張、利益、リスク、反論評価、不可欠な条件、統合的提言を書こう。',
    rubric: ['主張の適用条件を限定した', '反論の妥当範囲を評価した', '複数価値を政策条件へ統合した'],
    steps: [
      step('context', '背景', '政策課題を定義しよう', '名詞化で複雑な変化を主語にする', '技術の存在ではなく、公共部門での利用を論点にします。', [
        choice('a', 'The rapid expansion of artificial intelligence into public administration demands careful democratic scrutiny.', '人工知能の行政への急速な拡大には、慎重な民主的検証が必要です。', 'wg_nominalization', 'expand を expansion と名詞化し、変化全体を主語にしています。', ['artificial', 'intelligence', 'government', 'policy'], true),
        choice('b', 'Governments increasingly rely on automated systems to allocate benefits, answer inquiries, and detect fraud.', '政府は給付配分、問い合わせ対応、不正検知に自動化システムをますます利用しています。', 'wg_nominalization', 'to allocate, answer, and detect と目的を三つ並べています。', ['government', 'benefit', 'technology']),
        choice('c', 'As artificial intelligence enters essential public services, technical choices acquire political consequences.', '人工知能が不可欠な公共サービスに入るにつれ、技術的選択が政治的結果を持ちます。', 'wg_causal', 'As 節で同時進行の変化を示し、主節へ結果をつなぎます。', ['artificial', 'intelligence', 'government', 'policy']),
      ]),
      step('claim', '主張', '導入への限定付き立場を示そう', 'but only if で必要条件を予告する', '賛否を一語で決めず、条件を主張に含めます。', [
        choice('a', 'Governments should adopt AI where it improves public access, but only if human oversight remains decisive.', '政府は公共アクセスを改善する場面でAIを導入すべきですが、人の監督が決定的である場合に限ります。', 'wg_qualified_claim', 'where で適用場面、but only if で導入条件を同じ文に置きます。', ['government', 'artificial', 'intelligence', 'access'], true),
        choice('b', 'Automated administration is defensible only when efficiency gains are matched by enforceable rights and transparent review.', '行政自動化は、効率向上に実効的権利と透明な審査が伴う場合にのみ正当化できます。', 'wg_qualified_claim', 'only when が正当化の条件を限定し、are matched by は受動態です。', ['efficient', 'transparent', 'policy']),
        choice('c', 'AI should supplement public officials rather than replace accountable human judgment.', 'AIは説明責任ある人の判断を置き換えず、行政職員を補助すべきです。', 'wg_synthesis', 'supplement A rather than replace B で、望ましい役割を対比します。', ['artificial', 'intelligence', 'government', 'responsibility']),
      ]),
      step('benefit1', '利益1', '利用者への利益を説明しよう', 'can / may で効果の範囲を示す', '効率という抽象語を具体的な公共価値へ結びます。', [
        choice('a', 'Automated assistance can make essential information available around the clock and in multiple languages.', '自動支援は不可欠な情報を24時間、多言語で利用可能にできます。', 'wg_effect', 'make A available の形で information を利用可能な状態にします。', ['technology', 'access', 'efficient'], true),
        choice('b', 'Properly designed systems may shorten waiting times for citizens who need routine services.', '適切に設計されたシステムは、定型サービスが必要な市民の待ち時間を短縮できます。', 'wg_relative_clause', 'who need ... が citizens を説明し、Properly designed は systems を修飾します。', ['technology', 'government', 'efficient']),
        choice('c', 'AI can help public agencies identify patterns that human staff might otherwise overlook.', 'AIは行政機関が人の職員なら見落とし得る傾向を特定する助けになります。', 'wg_relative_clause', 'that ... overlook が patterns を説明し、otherwise が別条件での結果を示します。', ['artificial', 'intelligence', 'government', 'technology']),
      ]),
      step('benefit2', '利益2', '組織への効果を因果で示そう', 'thereby -ing で結果を続ける', '単なる速度ではなく、資源配分への効果を書きます。', [
        choice('a', 'By processing routine requests, AI can free skilled officials to handle complex cases, thereby improving service quality.', '定型依頼を処理することで、AIは専門職員を複雑案件へ振り向け、サービス品質を改善できます。', 'wg_causal', 'By processing が手段、thereby improving が最終的な結果を示します。', ['artificial', 'intelligence', 'government', 'efficient'], true),
        choice('b', 'Predictive tools may reveal unmet needs, enabling agencies to allocate limited resources more strategically.', '予測機器は満たされない需要を示し、行政機関が限られた資源を戦略的に配分できるようにします。', 'wg_causal', 'enabling ... が前文全体の結果を表す分詞構文です。', ['technology', 'government']),
        choice('c', 'Consistent automation can reduce arbitrary variation in simple administrative decisions.', '一貫した自動化は単純な行政判断の恣意的なばらつきを減らせます。', 'wg_effect', 'reduce の目的語 arbitrary variation が改善対象です。', ['reduce', 'government', 'technology']),
      ]),
      step('risk_privacy', 'リスク1', 'プライバシーの問題を示そう', 'However で利益から転換する', '便利さと引き換えになる危険を明示します。', [
        choice('a', 'However, systems trained on extensive personal data can turn administrative convenience into continuous surveillance.', 'しかし、大量の個人データで訓練されたシステムは行政上の便利さを継続的監視へ変えかねません。', 'wg_contrast', 'trained on ... が systems を説明し、turn A into B で危険な変化を表します。', ['technology', 'privacy', 'government'], true),
        choice('b', 'The concentration of sensitive data creates privacy risks that no efficiency gain can simply cancel out.', '機微データの集中は、効率向上だけでは相殺できないプライバシーリスクを生みます。', 'wg_nominalization', 'concentrate を concentration と名詞化し、that 節が risks を説明します。', ['privacy', 'efficient', 'technology']),
        choice('c', 'Citizens may surrender more information than necessary because automated procedures often appear non-negotiable.', '自動手続きが交渉不能に見えるため、市民は必要以上の情報を渡すかもしれません。', 'wg_because', 'more ... than necessary で過剰を示し、because 節が原因です。', ['privacy', 'government', 'technology']),
      ]),
      step('risk_fairness', 'リスク2', '公平性の問題を深めよう', 'whose / which で仕組みを説明する', '誤りの存在だけでなく、誰が影響を受けるか示します。', [
        choice('a', 'Algorithms whose training data reflect past discrimination may reproduce that injustice at greater scale.', '訓練データが過去の差別を反映するアルゴリズムは、その不正義をより大規模に再生産しかねません。', 'wg_relative_clause', 'whose training data ... が algorithms を所有関係とともに説明します。', ['technology', 'evidence', 'policy'], true),
        choice('b', 'People who cannot navigate digital systems may face new barriers to services that are formally universal.', 'デジタル制度を使えない人は、形式上は普遍的なサービスへの新たな障壁に直面し得ます。', 'wg_relative_clause', 'who 節が people、that 節が services をそれぞれ説明します。', ['technology', 'access', 'government']),
        choice('c', 'An opaque error can be especially harmful when it affects housing, health care, or financial support.', '不透明な誤りは住宅、医療、金銭支援に影響すると特に有害です。', 'wg_evidence', 'especially harmful when ... で害が大きくなる条件を絞ります。', ['transparent', 'benefit', 'government']),
      ]),
      step('counter', '反論', '導入推進側の反論を評価しよう', 'insofar as で妥当な範囲を認める', '反論を全面否定せず、成り立つ範囲を示します。', [
        choice('a', 'Supporters argue that human officials are also biased; this objection is valid insofar as automation is compared with an unrealistic ideal.', '推進派は人の職員にも偏りがあると述べます。この反論は自動化を非現実的な理想と比べる限り妥当です。', 'wg_advanced_counter', 'insofar as が反論の妥当な範囲を限定します。', ['government', 'technology', 'balance'], true),
        choice('b', 'It is true that refusing automation would preserve slow and inconsistent systems; yet speed alone cannot define justice.', '自動化拒否が遅く不均一な制度を残すのは事実ですが、速度だけでは正義を定義できません。', 'wg_advanced_counter', 'It is true that で認め、yet で評価基準の不足を示します。', ['efficient', 'policy']),
        choice('c', 'Cost savings are a legitimate public interest, but they do not override rights to explanation and appeal.', '費用削減は正当な公共利益ですが、説明と不服申立ての権利に優先しません。', 'wg_concession', 'but が正当な利益と、それでも守る権利を対比します。', ['government', 'benefit', 'responsibility']),
      ]),
      step('condition1', '条件1', '透明性の条件を提案しよう', 'Only when を文頭に置いて強調', '導入前に必ず必要な制度を示します。', [
        choice('a', 'Only when decision criteria, data sources, and error rates are independently auditable should an AI system be deployed.', '判断基準、データ源、誤り率を独立監査できる場合にのみ、AIを導入すべきです。', 'wg_policy_condition', 'Only when が文頭にあるため、主節は should an AI system be ... と倒置します。', ['artificial', 'intelligence', 'transparent', 'evidence'], true),
        choice('b', 'Only when citizens receive a meaningful explanation should automated decisions carry legal force.', '市民が意味ある説明を得る場合にのみ、自動判断は法的効力を持つべきです。', 'wg_policy_condition', 'should automated decisions carry と主語・助動詞を倒置しています。', ['government', 'technology', 'transparent']),
        choice('c', 'Public agencies must publish clear standards by which systems are tested and approved.', '行政機関はシステムを検査・承認する明確な基準を公表しなければなりません。', 'wg_relative_clause', 'by which が standards と tested / approved の関係を示します。', ['government', 'transparent', 'policy']),
      ]),
      step('condition2', '条件2', '人の救済手段を加えよう', 'not merely A but B で不可欠な要素を示す', '説明だけでなく、誤りを直せる仕組みにします。', [
        choice('a', 'Oversight must include not merely human review, but a genuine power to reverse automated outcomes.', '監督には人の審査だけでなく、自動結果を覆す実質的権限が必要です。', 'wg_synthesis', 'not merely A but B で、形式的審査より強い条件を示します。', ['responsibility', 'technology', 'government'], true),
        choice('b', 'Every affected person should have access to a trained official who can reconsider the case.', '影響を受ける全員が、案件を再検討できる訓練済み職員へアクセスできるべきです。', 'wg_relative_clause', 'who can reconsider ... が official を説明します。', ['access', 'government']),
        choice('c', 'Governments should establish independent appeal bodies with authority over automated agencies.', '政府は自動化機関への権限を持つ独立不服申立て機関を設けるべきです。', 'wg_modal_proposal', 'with authority over ... が appeal bodies の権限範囲を示します。', ['government', 'policy', 'technology']),
      ]),
      step('condition3', '条件3', 'データ利用の境界を定めよう', 'unless / no more than で限界を明示', '目的外利用を防ぐ条件を加えます。', [
        choice('a', 'Personal data should be collected for no longer and no broader a purpose than the service strictly requires.', '個人データはサービスが厳密に必要とする期間・目的を超えて収集すべきではありません。', 'wg_qualified_claim', 'no longer / no broader ... than で収集の時間と範囲を限定します。', ['privacy', 'technology', 'government'], true),
        choice('b', 'Data gathered for one service must not be reused elsewhere unless citizens give informed consent.', '一サービス用のデータは、市民が十分な説明に基づき同意しない限り他で再利用してはなりません。', 'wg_condition', 'unless が「〜でない限り」という例外条件を示します。', ['privacy', 'government', 'technology']),
        choice('c', 'Privacy protection should be treated as a design requirement rather than an obstacle added later.', 'プライバシー保護は後付けの障害でなく、設計要件として扱うべきです。', 'wg_synthesis', 'as A rather than B で望ましい位置づけを対比します。', ['privacy', 'responsibility', 'technology']),
      ]),
      step('synthesis', '統合', '効率と権利を統合しよう', 'Rather than choosing between A and B', '二者択一を超える政策原則を示します。', [
        choice('a', 'Rather than choosing between efficient government and individual rights, policymakers should make each a condition of the other.', '効率的政府か個人の権利かを選ぶのでなく、政策立案者は双方を互いの条件にすべきです。', 'wg_synthesis', 'Rather than choosing ... で二者択一を退け、each ... the other で相互条件を示します。', ['efficient', 'government', 'policy', 'privacy'], true),
        choice('b', 'The relevant question is not whether government should use AI, but which uses can survive transparent public review.', '問題は政府がAIを使うべきかではなく、どの利用法が透明な公的審査に耐えられるかです。', 'wg_synthesis', 'not whether A, but which B で議論の問いそのものを組み替えます。', ['government', 'artificial', 'intelligence', 'transparent']),
        choice('c', 'Technical capacity must be subordinated to democratic accountability, even when restraint appears less efficient.', '技術的能力は民主的説明責任に従属すべきで、抑制が非効率に見える場合も同様です。', 'wg_concession', 'even when で主張が維持される難しい条件を加えます。', ['technology', 'responsibility', 'efficient']),
      ]),
      step('conclusion', '結論', '政策原則として結ぼう', 'Only under these conditions / Ultimately', '全ての利益・危険・条件を最終判断へまとめます。', [
        choice('a', 'Only under these conditions can artificial intelligence strengthen public administration without weakening the citizens it is meant to serve.', 'これらの条件の下でのみ、人工知能は奉仕すべき市民を弱めず行政を強化できます。', 'wg_policy_condition', 'Only under ... が文頭なので can artificial intelligence ... と倒置します。', ['artificial', 'intelligence', 'government', 'responsibility'], true),
        choice('b', 'Ultimately, legitimate public AI is not defined by sophistication, but by transparency, contestability, and equal access.', '最終的に、正当な公共AIを定義するのは高度さでなく、透明性、異議申立て可能性、平等なアクセスです。', 'wg_synthesis', 'not by A, but by B で評価基準を置き換え、三つの価値を並べます。', ['artificial', 'intelligence', 'transparent', 'access']),
        choice('c', 'AI can earn a place in democratic government only when efficiency remains the servant, rather than the master, of justice.', 'AIは、効率が正義の主人でなく僕であり続ける場合にのみ、民主政府での地位を得られます。', 'wg_qualified_claim', 'only when が受容条件を示し、servant rather than master で価値の優先順位を表します。', ['artificial', 'intelligence', 'government', 'efficient']),
      ]),
    ],
  }),
  makeExercise({
    id: 'wr_1_urban_resilience',
    level: '1',
    genre: '戦略提言',
    title: '気候災害に強い都市',
    emoji: '🌧️',
    scene: '気候災害に備える都市投資を、公平性と長期効果の観点から提言します。',
    task: '危機の定義、優先順位、反論、投資条件、社会的公平、統合的結論を書こう。',
    rubric: ['短期対応と長期投資を区別した', '公平性を政策条件にした', '反論を評価して戦略へ統合した'],
    steps: [
      step('context', '背景', '危機の性質を定義しよう', 'not merely A but B で見方を広げる', '単発の災害ではなく都市構造の課題として置きます。', [
        choice('a', 'Climate-related disasters are no longer exceptional shocks but recurring tests of urban institutions.', '気候関連災害はもはや例外的衝撃ではなく、都市制度への反復的試練です。', 'wg_synthesis', 'no longer A but B で問題の捉え方が変わったことを示します。', ['environment', 'challenge', 'policy'], true),
        choice('b', 'The growing frequency of extreme weather has exposed weaknesses in infrastructure, housing, and public health systems.', '異常気象の頻度増加は、インフラ、住宅、公衆衛生制度の弱点を明らかにしました。', 'wg_nominalization', 'frequent を frequency と名詞化し、影響先を三つ並べます。', ['environment', 'infrastructure', 'government']),
        choice('c', 'Urban resilience has become a question not simply of engineering, but of social justice and democratic planning.', '都市の回復力は工学だけでなく、社会正義と民主的計画の問題になりました。', 'wg_synthesis', 'not simply A, but B で論点を技術から社会へ広げます。', ['resilience', 'policy', 'community']),
      ]),
      step('claim', '主張', '投資の優先原則を示そう', 'should, but only if で条件を予告', '投資賛成と、その配分原則を同時に示します。', [
        choice('a', 'Cities should invest aggressively in resilience, but only if protection is directed first toward the most vulnerable communities.', '都市は回復力へ積極投資すべきですが、保護が最も弱い地域へまず向く場合に限ります。', 'wg_qualified_claim', 'but only if が投資を正当化する公平性の条件を示します。', ['resilience', 'community', 'government'], true),
        choice('b', 'Adaptation policy should prioritize measures that reduce both physical exposure and social inequality.', '適応政策は物理的危険と社会的不平等の両方を減らす対策を優先すべきです。', 'wg_relative_clause', 'that reduce ... が measures を説明し、both A and B で二つの目的を統合します。', ['policy', 'reduce', 'environment']),
        choice('c', 'Public resilience spending is justified insofar as it strengthens essential systems without displacing those already at risk.', '公共の回復力支出は、既に危険な人々を追い出さず不可欠な制度を強化する範囲で正当化されます。', 'wg_qualified_claim', 'insofar as が正当化の範囲を限定し、without -ing が避ける害を示します。', ['resilience', 'government', 'community']),
      ]),
      step('infrastructure', '基盤', '物理的対策を説明しよう', 'By -ing で投資と効果を結ぶ', '最初の政策分野を具体化します。', [
        choice('a', 'By upgrading drainage, power grids, and transport links, cities can prevent local hazards from becoming systemic failures.', '排水、電力網、交通網を更新することで、都市は局地的危険が制度全体の障害になるのを防げます。', 'wg_causal', 'By upgrading が手段、prevent A from -ing が防ぐ結果を示します。', ['infrastructure', 'government', 'resilience'], true),
        choice('b', 'Redundant infrastructure allows essential services to continue even when one network is damaged.', '予備性のあるインフラは一つの網が損傷しても不可欠なサービスの継続を可能にします。', 'wg_effect', 'allow A to + 動詞で services が continue できると表します。', ['infrastructure', 'resilience']),
        choice('c', 'Nature-based defenses can absorb floodwater while improving air quality and public space.', '自然を基盤とする防御は洪水を吸収しつつ、空気の質と公共空間を改善できます。', 'wg_causal', 'while improving で防災と日常的利益が同時に生じることを示します。', ['environment', 'sustainable', 'infrastructure']),
      ]),
      step('evidence', '長期効果', '投資の長期的価値を示そう', 'thereby / which で二次効果へつなぐ', '災害時以外にも働く価値を示します。', [
        choice('a', 'Such investments reduce repeated repair costs, thereby freeing future budgets for education and health.', 'その投資は反復する修理費を減らし、将来予算を教育と健康へ振り向けられます。', 'wg_causal', 'thereby freeing が reduce の財政的な二次効果を示します。', ['reduce', 'education', 'infrastructure'], true),
        choice('b', 'Reliable systems also encourage private investment, which can stabilize employment after a disaster.', '信頼できる制度は民間投資も促し、それが災害後の雇用を安定させます。', 'wg_relative_clause', 'which が前の private investment 全体を受け、追加効果を示します。', ['encourage', 'resilience', 'work']),
        choice('c', 'Preventive spending may appear expensive, yet it is often cheaper than repeated emergency reconstruction.', '予防支出は高く見えても、反復する緊急復旧より安いことがよくあります。', 'wg_concession', 'may appear ... yet ... で見かけの費用と長期比較を対比します。', ['infrastructure', 'resilience']),
      ]),
      step('social', '公平', '社会的対策を加えよう', 'who / whose で優先対象を明確に', 'インフラだけでは守れない人を示します。', [
        choice('a', 'Physical defenses are insufficient for residents who lack savings, insurance, or safe alternative housing.', '貯蓄、保険、安全な代替住宅を持たない住民には物理的防御だけでは不十分です。', 'wg_relative_clause', 'who lack ... が residents を説明し、三つの不足を並べます。', ['community', 'resilience'], true),
        choice('b', 'People whose work, health, or mobility limits their choices need targeted evacuation and income support.', '仕事、健康、移動能力により選択が限られる人には、対象を絞った避難・所得支援が必要です。', 'wg_relative_clause', 'whose ... limits ... が People の状況を説明します。', ['work', 'benefit', 'community']),
        choice('c', 'A city is not resilient if recovery depends on vulnerable families absorbing losses alone.', '弱い家庭だけが損失を引き受けて復旧するなら、その都市は強いとは言えません。', 'wg_condition', 'if 節が resilient と呼べない条件を示します。', ['resilience', 'family', 'responsibility']),
      ]),
      step('participation', '参加', '住民参加の役割を説明しよう', 'not only A but also B で価値を加える', '対策を上から与えるだけにしません。', [
        choice('a', 'Community participation not only reveals local risks but also builds trust before emergencies occur.', '地域参加は局地的危険を明らかにするだけでなく、緊急事態前の信頼も築きます。', 'wg_synthesis', 'not only reveals but also builds と動詞を並べ、二つの価値を示します。', ['community', 'evidence', 'resilience'], true),
        choice('b', 'Residents should help determine which services, routes, and shelters are genuinely usable.', '住民はどのサービス、経路、避難所が実際に使えるかの判断に参加すべきです。', 'wg_relative_clause', 'which ... are usable が determine の内容となる間接疑問です。', ['community', 'government']),
        choice('c', 'Plans designed with affected communities are more likely to be trusted and maintained.', '影響を受ける地域とともに設計した計画は、信頼され維持される可能性が高くなります。', 'wg_evidence', 'designed with ... が Plans を説明し、be likely to で実行可能性を示します。', ['community', 'policy']),
      ]),
      step('counter', '反論', '費用への反論を評価しよう', 'insofar as で妥当範囲を認める', '限られた予算という本物の懸念を扱います。', [
        choice('a', 'Critics warn that resilience projects divert funds from immediate social needs; this concern is valid insofar as projects are poorly targeted.', '批判者は回復力事業が目前の社会需要から資金をそらすと警告します。この懸念は事業の対象設定が悪い限り妥当です。', 'wg_advanced_counter', 'insofar as が懸念が妥当になる条件を絞ります。', ['resilience', 'policy', 'benefit'], true),
        choice('b', 'Some argue that uncertain climate forecasts cannot justify major long-term commitments.', '不確実な気候予測では大規模な長期投資を正当化できないという意見もあります。', 'wg_counterresponse', 'argue that の後ろに反論内容を置き、cannot justify で限界を主張します。', ['environment', 'evidence', 'policy']),
        choice('c', 'Large infrastructure programs may indeed create debt and opportunities for political favoritism.', '大規模インフラ計画が債務と政治的えこひいきの機会を生む可能性は確かにあります。', 'wg_concession', 'may indeed で反対側の危険を明確に認めます。', ['infrastructure', 'opportunity', 'government']),
      ]),
      step('response', '応答', '反論への基準を示そう', 'yet / nevertheless で戦略へ戻る', '不確実性の中で判断する方法を説明します。', [
        choice('a', 'Yet uncertainty strengthens the case for flexible measures that produce benefits under several possible futures.', 'しかし不確実性は、複数の未来で利益を生む柔軟な対策の必要性をむしろ強めます。', 'wg_advanced_counter', 'that produce ... が measures を説明し、不確実性への応答を示します。', ['benefit', 'policy', 'resilience'], true),
        choice('b', 'Nevertheless, transparent cost comparisons can distinguish useful prevention from symbolic construction.', 'それでも、透明な費用比較は有用な予防と象徴的建設を区別できます。', 'wg_counterresponse', 'distinguish A from B で投資の質を評価する基準を示します。', ['transparent', 'evidence', 'infrastructure']),
        choice('c', 'Debt is defensible when long-lived assets protect future taxpayers from even greater losses.', '長寿命資産が将来の納税者をさらに大きな損失から守るなら、債務は正当化できます。', 'wg_condition', 'when 節で債務を認める条件を限定します。', ['infrastructure', 'policy']),
      ]),
      step('condition1', '条件1', '投資判断の条件を定めよう', 'Only when で不可欠条件を強調', '事業を始める前の審査基準を示します。', [
        choice('a', 'Only when projects are independently evaluated for cost, risk reduction, and distributional impact should funding be approved.', '費用、危険削減、分配影響を独立評価した場合にのみ、資金を承認すべきです。', 'wg_policy_condition', 'Only when が文頭なので should funding be approved と倒置します。', ['evidence', 'reduce', 'policy', 'balance'], true),
        choice('b', 'Only when maintenance costs are included should cities compare competing proposals.', '維持費を含めた場合にのみ、都市は競合案を比較すべきです。', 'wg_policy_condition', 'should cities compare と倒置し、比較前の条件を強調します。', ['government', 'infrastructure']),
        choice('c', 'Every project should publish measurable goals against which later performance can be judged.', '全事業は後に成果を評価できる測定可能な目標を公表すべきです。', 'wg_relative_clause', 'against which が goals と judged の評価関係を示します。', ['transparent', 'evidence', 'policy']),
      ]),
      step('condition2', '条件2', '公平な資金配分を条件にしよう', 'rather than / unless で境界を示す', '投資が格差を広げない仕組みにします。', [
        choice('a', 'Funding should follow measured vulnerability rather than property values or political influence.', '資金は資産価値や政治的影響力でなく、測定された脆弱性に従うべきです。', 'wg_synthesis', 'A rather than B で、望ましい配分基準と避ける基準を対比します。', ['evidence', 'balance', 'government'], true),
        choice('b', 'No neighborhood should be protected by measures that simply transfer danger to a less powerful one.', '危険をより弱い地域へ移すだけの対策で守られる地域があってはなりません。', 'wg_relative_clause', 'that simply transfer ... が measures を説明し、外部化する害を示します。', ['community', 'responsibility']),
        choice('c', 'Resilience investment is unjust unless displaced residents can return and benefit from the improvements.', '立ち退いた住民が戻り改善の利益を得られないなら、回復力投資は不公正です。', 'wg_condition', 'unless が公正と呼べるための最低条件を示します。', ['resilience', 'benefit', 'community']),
      ]),
      step('synthesis', '統合', '日常と災害時の価値を統合しよう', 'Rather than choosing between A and B', '防災投資を普段の生活改善にも結びます。', [
        choice('a', 'Rather than separating disaster protection from daily welfare, cities should favor projects that advance both.', '災害保護と日常福祉を分けず、都市は両方を進める事業を優先すべきです。', 'wg_synthesis', 'Rather than separating で分断を退け、both が二つの価値を受けます。', ['resilience', 'benefit', 'government'], true),
        choice('b', 'The strongest strategy combines robust infrastructure, trusted institutions, and the capacity of residents to act together.', '最も強い戦略は、堅牢なインフラ、信頼される制度、住民が協働する力を組み合わせます。', 'wg_synthesis', 'combines の目的語を三つ並べ、物理・制度・社会を統合します。', ['infrastructure', 'community', 'resilience']),
        choice('c', 'Adaptation succeeds when technical expertise and local knowledge correct each other’s blind spots.', '技術的専門知と地域知が互いの盲点を補うとき、適応は成功します。', 'wg_condition', 'when 節が succeeds の条件を示し、each other’s で相互性を表します。', ['community', 'technology', 'evidence']),
      ]),
      step('conclusion', '結論', '都市戦略として結ぼう', 'Ultimately / Only such で原則化する', '投資額だけでなく、強さの定義を示します。', [
        choice('a', 'Ultimately, a resilient city is not one that merely survives disaster, but one that protects its least powerful residents while preparing for it.', '最終的に強い都市とは、災害を生き延びるだけでなく、備えながら最も弱い住民を守る都市です。', 'wg_synthesis', 'not one that A, but one that B で resilience の定義を組み替えます。', ['resilience', 'community', 'responsibility'], true),
        choice('b', 'Only a strategy that joins prevention, fairness, and public participation can convert climate risk into shared civic responsibility.', '予防、公平、住民参加を結ぶ戦略だけが、気候リスクを共有された市民責任へ変えられます。', 'wg_synthesis', 'that joins ... が strategy を説明し、convert A into B で変化を示します。', ['environment', 'responsibility', 'community']),
        choice('c', 'Resilience should therefore be judged not by the visibility of projects, but by whose lives become safer and more secure.', 'したがって回復力は事業の目立ちやすさでなく、誰の生活がより安全になるかで評価すべきです。', 'wg_synthesis', 'not by A, but by B で評価基準を置き換え、whose lives ... を名詞節にしています。', ['resilience', 'evidence', 'community']),
      ]),
    ],
  }),
]

export const WRITING_EXERCISES_BY_ID = Object.fromEntries(
  WRITING_EXERCISES.map((item) => [item.id, item]),
)

export const writingExercisesByLevel = (level) =>
  WRITING_EXERCISES.filter((item) => item.level === level)

export const getWritingExercise = (id) => WRITING_EXERCISES_BY_ID[id]

export const getWritingGrammar = (id) => WRITING_GRAMMAR_BY_ID[id]
