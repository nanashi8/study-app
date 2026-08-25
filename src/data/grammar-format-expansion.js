// 文法テストで選べる「選択・並び替え・語法」を、全7級へ同数ずつ追加する。
// 既存3,450問のIDと順序は変えず、この別コーパスだけを新しい出題形式として接続する。

export const GRAMMAR_QUESTION_TYPE_META = Object.freeze({
  mixed: Object.freeze({ label: '3種類', short: '3種類', description: '選択・並び替え・語法を同じくらいずつ出題' }),
  choice: Object.freeze({ label: '選択問題', short: '選択', description: '文の形と意味に合う答えを4つから選ぶ' }),
  'word-order': Object.freeze({ label: '並び替え問題', short: '並び替え', description: '単語カードを英文の順に並べる' }),
  usage: Object.freeze({ label: '語法問題', short: '語法', description: '語と語の自然な結び付きを選ぶ' }),
})

export const GRAMMAR_QUESTION_TYPES = Object.freeze(['choice', 'word-order', 'usage'])

const choiceItem = (questionType, [
  id,
  level,
  topic,
  q,
  choices,
  answer,
  ja,
  explain,
  choiceGuidance,
]) => {
  const en = q.replace('___', answer)
  return Object.freeze({
    id,
    level,
    topic,
    questionType,
    q,
    choices: Object.freeze(choices),
    answer,
    explain,
    sentence: Object.freeze({ en, ja }),
    variationGroup: `format:${questionType}:${id}`,
    formatSource: 'balanced-question-types',
    ...(choiceGuidance
      ? { choiceGuidance: Object.freeze({ ...choiceGuidance }) }
      : {}),
  })
}

const orderItem = ([id, level, topic, en, ja, explain]) => Object.freeze({
  id,
  level,
  topic,
  questionType: 'word-order',
  q: '次の意味になるように、単語を英文の順に並べなさい。',
  choices: Object.freeze([]),
  answer: en,
  explain,
  sentence: Object.freeze({ en, ja }),
  variationGroup: `format:word-order:${id}`,
  formatSource: 'balanced-question-types',
})

const CHOICE_ROWS = [
  // 5級
  ['gr_format_choice_5_01', '5', '一般動詞・3単現', 'My brother ___ soccer every Saturday.', ['plays', 'play', 'playing', 'played'], 'plays', '弟は毎週土曜日にサッカーをします。', '主語 My brother は3人称単数で、習慣を表す現在形なので plays とする。'],
  ['gr_format_choice_5_02', '5', '指示語', '___ these your notebooks?', ['Are', 'Is', 'Am', 'Do'], 'Are', 'これらはあなたのノートですか。', '主語 these は複数で、名詞 notebooks と be動詞で結ぶ疑問文なので Are を使う。'],
  ['gr_format_choice_5_03', '5', 'be動詞', 'Emi and I ___ classmates.', ['are', 'is', 'am', 'be'], 'are', 'エミと私は同級生です。', 'Emi and I は二人を表す複数主語なので、be動詞は are になる。'],
  ['gr_format_choice_5_04', '5', '助動詞 can', 'My father can ___ dinner tonight.', ['cook', 'cooks', 'cooking', 'cooked'], 'cook', '父は今夜夕食を作れます。', '助動詞 can の直後には主語にかかわらず動詞原形 cook を置く。'],
  ['gr_format_choice_5_05', '5', '命令文', '___ touch the wet paint.', ["Don't", 'Not', 'No', "Doesn't"], "Don't", 'ぬれたペンキに触らないでください。', '否定の命令文は Don’t + 動詞原形で作るため、Don’t touch が正しい。'],

  // 4級
  ['gr_format_choice_4_01', '4', '過去形', 'We ___ the museum last Sunday.', ['visited', 'visit', 'visits', 'visiting'], 'visited', '私たちは先週の日曜日に博物館を訪れました。', 'last Sunday が過去の時を示すので、visit の過去形 visited を使う。'],
  ['gr_format_choice_4_02', '4', '未来表現', 'I think it ___ rain tomorrow.', ['will', 'did', 'does', 'was'], 'will', '明日は雨が降ると思います。', 'tomorrow の予測を表すため、will + 動詞原形 rain の形にする。'],
  ['gr_format_choice_4_03', '4', '比較', 'This bridge is ___ than the old one.', ['longer', 'longest', 'long', 'more long'], 'longer', 'この橋は古い橋より長いです。', 'than the old one が比較の相手なので、long の比較級 longer を選ぶ。'],
  ['gr_format_choice_4_04', '4', '動名詞', 'Aya enjoys ___ mystery stories.', ['reading', 'read', 'to reading', 'reads'], 'reading', 'アヤは推理小説を読むことを楽しみます。', 'enjoy の目的語には動名詞を置くため、reading が正しい。'],
  ['gr_format_choice_4_05', '4', '接続詞', 'Please call me ___ you arrive at the station.', ['when', 'because', 'but', 'or'], 'when', '駅に着いたら私に電話してください。', '到着する時を示す副詞節なので when を用い、未来の内容でも節内は現在形 arrive にする。'],

  // 3級
  ['gr_format_choice_3_01', '3', '現在完了', 'Have you ever ___ this song before?', ['heard', 'hear', 'hearing', 'hears'], 'heard', '以前この歌を聞いたことがありますか。', 'Have + 過去分詞で経験をたずねるため、hear の過去分詞 heard を使う。'],
  ['gr_format_choice_3_02', '3', '受動態', 'This letter was ___ in French.', ['written', 'wrote', 'writing', 'write'], 'written', 'この手紙はフランス語で書かれていました。', 'was + 過去分詞の受動態にするため、write の過去分詞 written が入る。'],
  ['gr_format_choice_3_03', '3', '関係代名詞', 'The woman ___ teaches us science is from Canada.', ['who', 'which', 'where', 'whose'], 'who', '私たちに理科を教える女性はカナダ出身です。', '先行詞 The woman を主語として受ける人の関係代名詞なので who を使う。'],
  ['gr_format_choice_3_04', '3', '不定詞応用', 'Ken went to the library ___ for the report.', ['to study', 'studying', 'studied', 'study'], 'to study', 'ケンはレポートの勉強をするため図書館へ行きました。', '図書館へ行った目的を表すので、目的の不定詞 to study を置く。'],
  ['gr_format_choice_3_05', '3', '間接疑問', 'Do you know where she ___?', ['lives', 'does live', 'live', 'is live'], 'lives', '彼女がどこに住んでいるか知っていますか。', '間接疑問は疑問詞 + 主語 + 動詞の語順で、she に合わせて lives とする。'],

  // 準2級
  ['gr_format_choice_pre2_01', 'pre2', '仮定法(基礎)', 'If I ___ you, I would ask the teacher.', ['were', 'am', 'was being', 'will be'], 'were', '私があなたなら先生に尋ねます。', '現在の事実に反する仮定なので If I were you の定型を使う。'],
  ['gr_format_choice_pre2_02', 'pre2', '分詞', 'The photos ___ at the event were shared online.', ['taken', 'taking', 'took', 'take'], 'taken', '行事で撮られた写真はオンラインで共有されました。', 'photos は「撮られる」側なので、過去分詞 taken が後ろから修飾する。'],
  ['gr_format_choice_pre2_03', 'pre2', '関係副詞', 'This is the park ___ the festival is held.', ['where', 'which', 'when', 'who'], 'where', 'ここがその祭りの開かれる公園です。', '先行詞が場所で、後ろの文に場所を表す要素が欠けるため where を使う。'],
  ['gr_format_choice_pre2_04', 'pre2', 'too/enough', 'The box was light enough for Mina ___ alone.', ['to carry', 'carrying', 'carried', 'carry'], 'to carry', 'その箱はミナが一人で運べるほど軽かったです。', '形容詞 + enough + for 人 + to do の形なので to carry が入る。'],
  ['gr_format_choice_pre2_05', 'pre2', '使役・知覚', 'The coach made us ___ the plan again.', ['check', 'to check', 'checking', 'checked'], 'check', 'コーチは私たちに計画をもう一度確認させました。', 'make + 人 + 動詞原形で「人に〜させる」となるため check を使う。'],

  // 2級
  ['gr_format_choice_2_01', '2', '仮定法過去完了', 'If we had left earlier, we ___ the train.', ['would have caught', 'will catch', 'caught', 'would catch'], 'would have caught', 'もっと早く出ていたら、その電車に間に合っていたでしょう。', '過去の事実に反する仮定なので、帰結は would have + 過去分詞になる。', {
    caught: 'caught は catch の過去形・過去分詞で、We caught the train. のように実際に起きた過去の出来事を述べるときに使います。',
  }],
  ['gr_format_choice_2_02', '2', '倒置', 'Only then ___ the team understand the risk.', ['did', 'the team did', 'was', 'has'], 'did', 'その時になって初めて、チームは危険を理解しました。', 'Only + 副詞が文頭に出たため、主節を did + 主語 + 動詞原形の倒置にする。'],
  ['gr_format_choice_2_03', '2', '強調構文', 'It was the final interview ___ changed her decision.', ['that', 'what', 'where', 'whom'], 'that', '彼女の決定を変えたのは最後の面接でした。', 'It was ... that 〜 の強調構文で the final interview を焦点化する。'],
  ['gr_format_choice_2_04', '2', '関係代名詞 whose', 'We met a researcher ___ work influenced the policy.', ['whose', 'who', 'whom', 'which'], 'whose', '私たちは、その研究が政策に影響した研究者に会いました。', 'researcher と work の所有関係を表すため、関係代名詞 whose を使う。'],
  ['gr_format_choice_2_05', '2', '助動詞+have done', 'You ___ have checked the source before sharing it.', ['should', 'will', 'can', 'are'], 'should', '共有する前に出典を確認すべきでした。', 'should have + 過去分詞で、過去にすべきだったのにしなかったことを表す。'],

  // 準1級
  ['gr_format_choice_pre1_01', 'pre1', '倒置', 'No sooner had the speech ended ___ questions began.', ['than', 'when', 'that', 'then'], 'than', '演説が終わるやいなや質問が始まりました。', 'No sooner had S done than ... の固定した倒置構文なので than を使う。'],
  ['gr_format_choice_pre1_02', 'pre1', '複合関係詞', '___ needs the data may download it.', ['Whoever', 'Whomever', 'Whatever', 'However'], 'Whoever', 'そのデータを必要とする人は誰でもダウンロードできます。', '後ろの節で主語となり「〜する人は誰でも」を表す Whoever が入る。'],
  ['gr_format_choice_pre1_03', 'pre1', '独立分詞構文', 'The meeting ___ over, everyone left the room.', ['being', 'was', 'is', 'been'], 'being', '会議が終わったので、全員が部屋を出ました。', '主節と異なる主語 The meeting を持つ独立分詞構文なので being を使う。'],
  ['gr_format_choice_pre1_04', 'pre1', '仮定法応用', 'It is vital that every record ___ preserved.', ['be', 'is', 'was', 'being'], 'be', 'すべての記録が保存されることが極めて重要です。', 'vital の that 節では仮定法現在の動詞原形を用い、受動なので be preserved とする。'],
  ['gr_format_choice_pre1_05', 'pre1', '省略', 'Though ___ by the result, she continued the study.', ['disappointed', 'she disappointed', 'disappointing', 'was disappointed'], 'disappointed', '結果に落胆したものの、彼女は研究を続けました。', 'Though she was disappointed の主語と be動詞を省略し、過去分詞だけを残す。', {
    'she disappointed': 'she disappointed ... は「彼女が…を落胆させた」という主語＋他動詞の節で、後ろに落胆させた相手を置くときに使います。',
  }],

  // 1級
  ['gr_format_choice_1_01', '1', '倒置・強調', 'Not until the audit ended ___ the error become clear.', ['did', 'the error did', 'was', 'had'], 'did', '監査が終わって初めて、その誤りが明らかになりました。', 'Not until 節が文頭に出たため、主節を did + 主語 + 動詞原形の倒置にする。', {
    'the error did': 'the error did become clear は「その誤りは確かに明らかになった」と過去の肯定を強調する通常語順で使います。',
  }],
  ['gr_format_choice_1_02', '1', '仮定法・語法', 'Were the policy ___ fail, the council would revise it.', ['to', 'will', 'should have', 'for'], 'to', '万一その政策が失敗するなら、議会は改訂するでしょう。', 'Were S to do は if を省略した仮定法の倒置で、可能性の低い未来を表す。'],
  ['gr_format_choice_1_03', '1', '高度語法', 'Scarcely had the file been released ___ doubts appeared.', ['when', 'than', 'that', 'while'], 'when', 'そのファイルが公開されるとすぐに疑念が生じました。', 'Scarcely had S done when ... で「〜するとすぐに」を表す固定構文になる。'],
  ['gr_format_choice_1_04', '1', '主語と動詞の一致', 'Many a promising reform ___ failed without local support.', ['has', 'have', 'are', 'were'], 'has', '多くの有望な改革が地域の支持なしに失敗してきました。', 'many a + 単数名詞は意味が複数でも文法上は単数扱いなので has を使う。'],
  ['gr_format_choice_1_05', '1', '強調・倒置', 'Little ___ the public know how the data had been altered.', ['did', 'the public did', 'was', 'had'], 'did', 'データがどう改変されたかを一般の人々はほとんど知りませんでした。', '否定的な Little が文頭に出たため、主節を did + 主語 + 動詞原形に倒置する。', {
    'the public did': 'the public did know ... は「一般の人々は確かに知っていた」と過去の肯定を強調する通常語順で使います。',
  }],
]

const ORDER_ROWS = [
  // 5級
  ['gr_format_order_5_01', '5', '一般動詞・3単現', 'My sister reads a book after school.', '姉は放課後に本を読みます。', '主語 My sister の直後に動詞 reads を置き、目的語 a book、時 after school の順に続ける。'],
  ['gr_format_order_5_02', '5', '指示語', 'These apples are very sweet.', 'これらのりんごはとても甘いです。', '複数を指す These apples を主語のまとまりにし、その後ろに are と補語 very sweet を置く。'],
  ['gr_format_order_5_03', '5', '助動詞 can', 'Can your brother swim fast?', 'あなたの弟は速く泳げますか。', '助動詞の疑問文は Can + 主語 your brother + 動詞原形 swim の順にする。'],
  ['gr_format_order_5_04', '5', '否定文・疑問文', 'We do not play soccer on Monday.', '私たちは月曜日にはサッカーをしません。', '一般動詞の否定は主語 We の後ろに do not を置き、動詞は原形 play にする。'],
  ['gr_format_order_5_05', '5', '現在進行形', 'The children are studying in the library.', 'その子どもたちは図書室で勉強しています。', '進行形は複数主語 The children + are + studying を先に作り、場所を最後に置く。'],

  // 4級
  ['gr_format_order_4_01', '4', '過去形', 'Mika visited her grandmother last Sunday.', 'ミカは先週の日曜日に祖母を訪ねました。', '主語 Mika、過去形 visited、目的語 her grandmother、過去の時 last Sunday の順に置く。'],
  ['gr_format_order_4_02', '4', '未来表現', 'We are going to clean the park tomorrow.', '私たちは明日その公園を掃除する予定です。', 'be going to + 動詞原形のまとまりを主語 We の後ろに置き、tomorrow を最後に加える。'],
  ['gr_format_order_4_03', '4', '比較', 'This river is wider than that one.', 'この川はあの川より幅が広いです。', 'This river is wider を先に作り、比較の相手を than that one と続ける。'],
  ['gr_format_order_4_04', '4', '疑問詞+不定詞', 'Please tell me how to use this camera.', 'このカメラの使い方を私に教えてください。', 'tell + 人 + 内容の順にし、内容を how to use this camera のまとまりで置く。'],
  ['gr_format_order_4_05', '4', 'There is/are', 'There were three birds in the garden.', '庭には鳥が3羽いました。', '存在を表す There were の後ろに存在するもの three birds、場所 in the garden を置く。'],

  // 3級
  ['gr_format_order_3_01', '3', '現在完了', 'I have lived in this town for five years.', '私はこの町に5年間住んでいます。', '現在完了 have lived を主語 I の後ろに置き、場所と期間 for five years を続ける。'],
  ['gr_format_order_3_02', '3', '受動態', 'The bridge was built by local workers.', 'その橋は地域の作業員によって建てられました。', '受動態の骨格 The bridge was built を先に作り、行為者を by local workers で示す。'],
  ['gr_format_order_3_03', '3', '関係代名詞', 'This is the picture that my uncle painted.', 'これは叔父が描いた絵です。', '先行詞 the picture の直後に that を置き、my uncle painted が絵を説明するようにつなぐ。'],
  ['gr_format_order_3_04', '3', '文型(SVOO/SVOC)', 'My teacher showed us how to solve the problem.', '先生は私たちにその問題の解き方を示しました。', 'showed の後ろを「人 us + 内容 how to solve ...」の順に置く。'],
  ['gr_format_order_3_05', '3', '接続詞', 'Although it was raining, the game continued.', '雨が降っていましたが、試合は続きました。', 'Although 節を先にまとめ、コンマの後ろに主節 the game continued を置く。'],

  // 準2級
  ['gr_format_order_pre2_01', 'pre2', '分詞構文', 'Having finished her homework, Aya called her friend.', '宿題を終えると、アヤは友人に電話しました。', '完了を先に示す Having finished ... を文頭に置き、コンマの後ろに主節を続ける。'],
  ['gr_format_order_pre2_02', 'pre2', '関係副詞', 'This is the town where my grandfather was born.', 'ここが祖父の生まれた町です。', '先行詞 the town の直後に where を置き、場所の説明 my grandfather was born を続ける。'],
  ['gr_format_order_pre2_03', 'pre2', '過去完了', 'I had never seen such a clear night sky.', '私はそれほど澄んだ夜空を見たことがありませんでした。', '過去完了 had seen の間に否定頻度 never を置き、目的語を最後に続ける。'],
  ['gr_format_order_pre2_04', 'pre2', 'too/enough', 'The box was too heavy for me to carry.', 'その箱は重すぎて私には運べませんでした。', 'too heavy の後ろに不定詞の動作主 for me と行動 to carry をこの順に置く。'],
  ['gr_format_order_pre2_05', 'pre2', '相関接続詞', 'Not only Ken but also Emi joined the project.', 'ケンだけでなくエミもその企画に参加しました。', 'Not only A but also B を一組にし、近い主語 Emi に続けて動詞 joined を置く。'],

  // 2級
  ['gr_format_order_2_01', '2', '仮定法過去完了', 'If I had known the truth, I would have acted differently.', '真実を知っていたら、私は違う行動を取っていたでしょう。', 'If 節を had known で過去完了にし、帰結を would have acted で対応させる。'],
  ['gr_format_order_2_02', '2', '倒置', 'Never have I seen such rapid change.', '私はこれほど急速な変化を見たことがありません。', '否定語 Never を文頭に置き、have I seen と助動詞を主語の前へ倒置する。'],
  ['gr_format_order_2_03', '2', '形式目的語', 'The news made it difficult for us to decide.', 'その知らせによって、私たちは決めにくくなりました。', 'make it difficult の it を形式目的語とし、真の内容 for us to decide を後ろに置く。'],
  ['gr_format_order_2_04', '2', '強調構文', 'It was the final report that changed their plan.', '彼らの計画を変えたのは最終報告でした。', 'It was と that で焦点 the final report を挟み、残りの文を that の後ろへ置く。'],
  ['gr_format_order_2_05', '2', '分詞構文', 'Having been warned of the storm, the hikers returned early.', '嵐について警告されていたので、登山者たちは早く戻りました。', '受動の完了分詞 Having been warned を先にまとめ、主節をコンマの後ろに置く。'],

  // 準1級
  ['gr_format_order_pre1_01', 'pre1', '倒置', 'Hardly had the meeting begun when the alarm rang.', '会議が始まるやいなや警報が鳴りました。', 'Hardly had S done when ... の順を保ち、Hardly による倒置を崩さない。'],
  ['gr_format_order_pre1_02', 'pre1', 'whatever等', 'Whatever the result may be, we will publish the data.', '結果がどうであっても、私たちはデータを公表します。', 'Whatever で始まる譲歩節を先にまとめ、主節 we will publish ... を続ける。'],
  ['gr_format_order_pre1_03', 'pre1', '話法', 'The proposal is believed to have reduced waste.', 'その提案は廃棄物を減らしたと考えられています。', '受動の伝聞 is believed の後ろに、先行する完了を示す to have reduced を置く。'],
  ['gr_format_order_pre1_04', 'pre1', '付帯状況', 'With the door left open, the room grew cold.', 'ドアが開けたままだったので、部屋は寒くなりました。', 'With + 目的語 the door + 補語 left open を一まとまりにし、その後ろに主節を置く。'],
  ['gr_format_order_pre1_05', 'pre1', 'クジラ構文', 'A smartphone is no more a teacher than a calculator is.', 'スマートフォンが教師でないのは、計算機が教師でないのと同じです。', 'A is no more B than C is の固定順序を保ち、二つの否定的な比較を対応させる。'],

  // 1級
  ['gr_format_order_1_01', '1', '倒置・強調', 'Had the evidence been examined earlier, the error might have been found.', '証拠がもっと早く調べられていたら、その誤りは見つかったかもしれません。', 'If を省略した Had + 主語 + 過去分詞の条件節を先に置き、帰結を might have been found とする。'],
  ['gr_format_order_1_02', '1', '仮定法・語法', 'Were the policy to fail, the council would review it.', '万一政策が失敗するなら、議会はそれを見直すでしょう。', 'Were S to do の倒置条件節を作り、would + 動詞原形の帰結と対応させる。'],
  ['gr_format_order_1_03', '1', '高度語法', 'Seldom, if ever, does one solution satisfy everyone.', '一つの解決策が全員を満足させることは、あるとしても、めったにありません。', 'Seldom を文頭に置いて does を倒置し、if ever を挿入句としてコンマで挟む。'],
  ['gr_format_order_1_04', '1', '強調・倒置', 'So complex was the system that few users understood it.', 'その仕組みは非常に複雑だったので、理解できる利用者はほとんどいませんでした。', 'So + 形容詞を文頭へ出し、was the system と倒置して that 結果節を続ける。'],
  ['gr_format_order_1_05', '1', '省略・代用', 'No matter how carefully designed, every measure has limits.', 'どれほど慎重に設計されても、どの対策にも限界があります。', 'No matter how + 副詞 + 過去分詞の省略節を先に置き、主節 every measure has limits を続ける。'],
]

const USAGE_ROWS = [
  // 5級
  ['gr_format_usage_5_01', '5', '一般動詞・3単現', 'I ___ my homework after dinner.', ['do', 'make', 'take', 'play'], 'do', '私は夕食後に宿題をします。', 'do one’s homework が「宿題をする」の決まった語の結び付きである。'],
  ['gr_format_usage_5_02', '5', '一般動詞・3単現', 'Please ___ a picture of our class.', ['take', 'make', 'do', 'play'], 'take', '私たちのクラスの写真を撮ってください。', 'take a picture で「写真を撮る」。make a picture では通常この意味にならない。'],
  ['gr_format_usage_5_03', '5', '前置詞', 'She goes ___ school by bus.', ['to', 'at', 'on', 'for'], 'to', '彼女はバスで学校へ行きます。', 'go to + 場所で「〜へ行く」となるため、school の前は to を使う。'],
  ['gr_format_usage_5_04', '5', '一般動詞・3単現', 'We ___ English after lunch.', ['study', 'play', 'open', 'carry'], 'study', '私たちは昼食後に英語を勉強します。', 'study English で教科として英語を学ぶことを表し、目的語を直接取る。'],
  ['gr_format_usage_5_05', '5', '一般動詞・3単現', 'Tom ___ his teeth before bed.', ['brushes', 'opens', 'carries', 'visits'], 'brushes', 'トムは寝る前に歯を磨きます。', 'brush one’s teeth が「歯を磨く」の自然な語の組み合わせである。'],

  // 4級
  ['gr_format_usage_4_01', '4', '未来表現', 'We will ___ a picnic if it is sunny.', ['have', 'do', 'make', 'take'], 'have', '晴れたら私たちはピクニックをします。', 'have a picnic で「ピクニックをする」。行事を行う have の語法を使う。'],
  ['gr_format_usage_4_02', '4', '過去形', 'My aunt ___ me a useful book.', ['gave', 'said', 'told', 'borrowed'], 'gave', '叔母は私に役立つ本をくれました。', 'give + 人 + 物で「人に物を与える」。me と a book の二つを目的語に取る。', {
    said: 'said は say something to someone または said that ... の形で、言った内容を目的語にするときに使います。',
    told: 'told は tell someone something の形で、told me a story のように人へ情報や物語を伝えたときに使います。',
  }],
  ['gr_format_usage_4_03', '4', '不定詞', 'Please ___ care of this plant.', ['take', 'make', 'do', 'get'], 'take', 'この植物の世話をしてください。', 'take care of ... で「〜の世話をする」という固定表現になる。'],
  ['gr_format_usage_4_04', '4', '前置詞', 'I am looking ___ my lost key.', ['for', 'at', 'after', 'up'], 'for', '私はなくした鍵を探しています。', 'look for ... は「〜を探す」。look at や look after とは目的が異なる。'],
  ['gr_format_usage_4_05', '4', '過去形', 'The train ___ at nine yesterday.', ['arrived', 'reached', 'visited', 'entered'], 'arrived', 'その電車は昨日9時に到着しました。', 'arrive は自動詞で、この文では目的語を取らず時刻 at nine と結び付く。'],

  // 3級
  ['gr_format_usage_3_01', '3', '現在完了', 'She has ___ a cold since Monday.', ['had', 'caught', 'taken', 'made'], 'had', '彼女は月曜日からずっと風邪をひいています。', 'have a cold で風邪の状態を表し、since と現在完了で継続を示す。', {
    caught: 'caught a cold は「風邪をひいた」という状態の始まりを表し、She caught a cold on Monday. のように時点と組み合わせます。',
  }],
  ['gr_format_usage_3_02', '3', '受動態', 'This tool is used ___ cutting paper.', ['for', 'by', 'to', 'with'], 'for', 'この道具は紙を切るために使われます。', 'be used for + 動名詞で「〜するために使われる」と用途を表す。'],
  ['gr_format_usage_3_03', '3', '不定詞応用', 'My teacher ___ me to check the source.', ['advised', 'said', 'explained', 'spoke'], 'advised', '先生は私に出典を確認するよう助言しました。', 'advise + 人 + to do で「人に〜するよう助言する」。said はこの形を取らない。', {
    said: 'said は said that ... または said something to me の形で、発言内容を伝えるときに使い、人 + to do を直接には続けません。',
  }],
  ['gr_format_usage_3_04', '3', '動詞と不定詞・動名詞', 'We look forward to ___ from you.', ['hearing', 'hear', 'to hear', 'heard'], 'hearing', 'ご連絡を楽しみにしています。', 'look forward to の to は前置詞なので、後ろには動名詞 hearing を置く。'],
  ['gr_format_usage_3_05', '3', '前置詞', 'The rain prevented us ___ playing outside.', ['from', 'of', 'to', 'for'], 'from', '雨のため私たちは外で遊べませんでした。', 'prevent + 人 + from doing で「人が〜するのを妨げる」と表す。'],

  // 準2級
  ['gr_format_usage_pre2_01', 'pre2', '前置詞', 'Please ___ attention to the final paragraph.', ['pay', 'borrow', 'charge', 'spend'], 'pay', '最後の段落に注意を払ってください。', 'pay attention to ... が「〜に注意を払う」の固定した語法である。'],
  ['gr_format_usage_pre2_02', 'pre2', '前置詞', 'The new rule will come ___ effect next month.', ['into', 'in', 'to', 'for'], 'into', '新しい規則は来月発効します。', 'come into effect で法律や規則が「発効する・実施される」と表す。'],
  ['gr_format_usage_pre2_03', 'pre2', '前置詞', 'Our results were consistent ___ the earlier study.', ['with', 'to', 'for', 'from'], 'with', '私たちの結果は先の研究と一致していました。', 'be consistent with ... で「〜と一致している・矛盾しない」となる。'],
  ['gr_format_usage_pre2_04', 'pre2', '動名詞の慣用', 'She is capable ___ solving the problem alone.', ['of', 'to', 'for', 'with'], 'of', '彼女は一人でその問題を解く力があります。', 'be capable of doing で「〜する能力がある」。of の後ろは動名詞になる。'],
  ['gr_format_usage_pre2_05', 'pre2', '前置詞', 'The committee took the evidence ___ account.', ['into', 'on', 'by', 'at'], 'into', '委員会はその証拠を考慮に入れました。', 'take ... into account で「〜を考慮に入れる」という固定表現になる。'],

  // 2級
  ['gr_format_usage_2_01', '2', '無生物主語', 'The policy gave ___ to public concern.', ['rise', 'raise', 'growth', 'up'], 'rise', 'その政策は市民の懸念を生みました。', 'give rise to ... で「〜を引き起こす」。rise はここでは名詞として使われる。'],
  ['gr_format_usage_2_02', '2', '接続詞', 'We should distinguish facts ___ opinions.', ['from', 'with', 'by', 'for'], 'from', '私たちは事実と意見を区別すべきです。', 'distinguish A from B で「AとBを区別する」と二項を結ぶ。'],
  ['gr_format_usage_2_03', '2', '無生物主語', 'The plan is likely to ___ resistance.', ['meet', 'see', 'take', 'carry'], 'meet', 'その計画は反対に遭う可能性が高いです。', 'meet resistance で「抵抗・反対に遭う」という自然な語の結び付きになる。'],
  ['gr_format_usage_2_04', '2', '前置詞', 'The new system places a burden ___ small schools.', ['on', 'at', 'to', 'by'], 'on', '新しい制度は小規模校に負担をかけます。', 'place a burden on ... で「〜に負担をかける」と表す。'],
  ['gr_format_usage_2_05', '2', '接続詞', 'His explanation accounts ___ the difference.', ['for', 'to', 'of', 'with'], 'for', '彼の説明によってその違いを説明できます。', 'account for ... で「〜を説明する・〜の割合を占める」となる。'],

  // 準1級
  ['gr_format_usage_pre1_01', 'pre1', '前置詞', 'The report casts doubt ___ the original claim.', ['on', 'for', 'to', 'with'], 'on', 'その報告は当初の主張に疑いを投げかけます。', 'cast doubt on ... で「〜に疑いを投げかける」という語法になる。'],
  ['gr_format_usage_pre1_02', 'pre1', '前置詞', 'The result is attributable ___ several factors.', ['to', 'for', 'with', 'from'], 'to', 'その結果はいくつかの要因によるものです。', 'be attributable to ... で「〜に起因する・〜のおかげである」と表す。'],
  ['gr_format_usage_pre1_03', 'pre1', '比較構文', 'The proposal falls short ___ the required standard.', ['of', 'to', 'from', 'at'], 'of', 'その提案は必要な基準に達していません。', 'fall short of ... で「〜に達しない・不足する」という固定表現になる。'],
  ['gr_format_usage_pre1_04', 'pre1', '前置詞', 'The two accounts are at odds ___ each other.', ['with', 'to', 'for', 'of'], 'with', '二つの説明は互いに食い違っています。', 'be at odds with ... で「〜と食い違う・対立する」と表す。'],
  ['gr_format_usage_pre1_05', 'pre1', 'be to構文', 'The rule is subject ___ review every year.', ['to', 'for', 'with', 'by'], 'to', 'その規則は毎年見直しの対象となります。', 'be subject to ... で「〜の対象となる・〜を受ける可能性がある」となる。'],

  // 1級
  ['gr_format_usage_1_01', '1', '高度語法', 'The evidence does not ___ close examination.', ['withstand', 'prevent', 'avoid', 'refuse'], 'withstand', 'その証拠は綿密な検討に耐えません。', 'withstand scrutiny / examination で「精査に耐える」という語の結び付きになる。'],
  ['gr_format_usage_1_02', '1', '高度語法', 'The decision is contingent ___ future funding.', ['on', 'to', 'for', 'with'], 'on', 'その決定は今後の資金次第です。', 'be contingent on ... で「〜を条件とする・〜次第である」と表す。'],
  ['gr_format_usage_1_03', '1', '高度語法', 'The article ___ light on a hidden cost.', ['sheds', 'spends', 'borrows', 'divides'], 'sheds', 'その記事は隠れた費用を明らかにします。', 'shed light on ... で「〜を明らかにする・解明する」という固定表現になる。'],
  ['gr_format_usage_1_04', '1', '高度語法', 'The measure is intended to ___ accountability.', ['enhance', 'rise', 'grow', 'happen'], 'enhance', 'その措置は説明責任を高めることを意図しています。', 'enhance accountability で「説明責任を高める」という自然な政策表現になる。'],
  ['gr_format_usage_1_05', '1', '高度語法', 'The claim is open ___ challenge.', ['to', 'for', 'by', 'with'], 'to', 'その主張には異議を唱える余地があります。', 'be open to challenge で「異議を受ける余地がある」と表す。'],
]

export const GRAMMAR_FORMAT_EXPANSION = Object.freeze([
  ...CHOICE_ROWS.map((row) => choiceItem('choice', row)),
  ...ORDER_ROWS.map(orderItem),
  ...USAGE_ROWS.map((row) => choiceItem('usage', row)),
])

export const grammarQuestionType = (item) => item?.questionType ?? 'choice'

export const grammarFormatExpansionByLevel = (level) =>
  GRAMMAR_FORMAT_EXPANSION.filter((item) => item.level === level)
