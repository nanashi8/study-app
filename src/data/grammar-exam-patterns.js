// 英検の級別空所補充と大学入試の文脈・誤り指摘問題を研究し、
// 問われる文法判断だけを抽出して作ったオリジナル問題。
// 過去問本文は転載せず、すべて独自の場面・英文・選択肢で構成する。

const pad = (value) => String(value).padStart(3, '0')

function examFamily({ key, source, level, topic, explain, focuses, cases }) {
  return cases.map(({ q, choices, answer, ja }, index) => ({
    id: `gr_exam_${source}_${key}_${pad(index + 1)}`,
    level,
    topic,
    pattern: `exam:${source}:${key}`,
    examSource: source,
    examFocus: focuses[index],
    q,
    choices,
    answer,
    explain,
    sentence: {
      en: q.replace('___', answer),
      ja,
    },
  }))
}

const EIKEN_5_PRONOUN_FORM = examFamily({
  key: '5_pronoun_form',
  source: 'eiken',
  level: '5',
  topic: '代名詞',
  explain: '代名詞は文中の働きで形が変わる。主語には主格、動詞・前置詞の後ろには目的格、名詞の前には所有格、名詞を省いて「〜のもの」と表すときは所有代名詞を使う。',
  focuses: [
    'possessive-adjective', 'object-pronoun', 'possessive-pronoun',
    'subject-pronoun', 'object-pronoun', 'possessive-adjective',
    'possessive-adjective', 'possessive-pronoun', 'subject-pronoun',
    'object-pronoun',
  ],
  cases: [
    { q: 'Ken has a new notebook. ___ notebook is blue.', choices: ['His', 'Him', 'He', 'He’s'], answer: 'His', ja: 'ケンは新しいノートを持っています。彼のノートは青いです。' },
    { q: 'Emi is looking for her umbrella. Have you seen ___?', choices: ['it', 'its', 'itself', 'they'], answer: 'it', ja: 'エミは傘を探しています。あなたはそれを見ましたか。' },
    { q: 'These gloves belong to my parents. They are ___.', choices: ['theirs', 'their', 'them', 'they'], answer: 'theirs', ja: 'この手袋は私の両親のものです。それらは両親のものです。' },
    { q: 'Tom and I are classmates. ___ clean the room together.', choices: ['We', 'Us', 'Our', 'Ours'], answer: 'We', ja: 'トムと私は同級生です。私たちは一緒に部屋を掃除します。' },
    { q: 'Ms. Brown spoke to Aya and ___ after class.', choices: ['me', 'I', 'my', 'mine'], answer: 'me', ja: 'ブラウン先生は放課後、アヤと私に話しかけました。' },
    { q: 'You can leave ___ shoes by the door.', choices: ['your', 'you', 'yours', 'yourself'], answer: 'your', ja: 'あなたは自分の靴をドアのそばに置いてよいです。' },
    { q: 'The dog is wagging ___ tail.', choices: ['its', 'it', 'it’s', 'itself'], answer: 'its', ja: 'その犬はしっぽを振っています。' },
    { q: 'This seat is not Ken’s. It is ___.', choices: ['mine', 'my', 'me', 'I'], answer: 'mine', ja: 'この席はケンのものではありません。私のものです。' },
    { q: 'The students found their textbooks. ___ opened them at once.', choices: ['They', 'Them', 'Their', 'Theirs'], answer: 'They', ja: '生徒たちは教科書を見つけ、すぐにそれらを開きました。' },
    { q: 'I saw Ms. Brown at the station and waved to ___.', choices: ['her', 'she', 'hers', 'herself'], answer: 'her', ja: '私は駅でブラウン先生を見かけ、彼女に手を振りました。' },
  ],
})

const EIKEN_5_PRESENT_NEGATIVE = examFamily({
  key: '5_present_negative',
  source: 'eiken',
  level: '5',
  topic: '否定文・疑問文',
  explain: '一般動詞の現在形を否定するとき、3人称単数には does not、それ以外には do not を使い、動詞は原形にする。',
  focuses: [
    'negator', 'do-support', 'base-verb', 'negative-phrase', 'negator',
    'do-support', 'base-verb', 'negative-phrase', 'negator', 'do-support',
  ],
  cases: [
    { q: 'Ken does ___ play soccer on rainy days.', choices: ['not', 'no', 'none', 'neither'], answer: 'not', ja: 'ケンは雨の日にはサッカーをしません。' },
    { q: 'Emi ___ not drink coffee in the evening.', choices: ['does', 'do', 'is', 'has'], answer: 'does', ja: 'エミは夕方にコーヒーを飲みません。' },
    { q: 'My parents do not ___ on Sundays.', choices: ['work', 'works', 'working', 'worked'], answer: 'work', ja: '私の両親は日曜日には働きません。' },
    { q: 'We ___ use this room after six.', choices: ['do not', 'does not', 'are not', 'not do'], answer: 'do not', ja: '私たちは6時以降この部屋を使いません。' },
    { q: 'I do ___ watch television before breakfast.', choices: ['not', 'no', 'none', 'neither'], answer: 'not', ja: '私は朝食前にテレビを見ません。' },
    { q: 'Tom and Ken ___ not take the same bus.', choices: ['do', 'does', 'are', 'has'], answer: 'do', ja: 'トムとケンは同じバスには乗りません。' },
    { q: 'The library does not ___ on Mondays.', choices: ['open', 'opens', 'opening', 'opened'], answer: 'open', ja: 'その図書館は月曜日には開きません。' },
    { q: 'This bus ___ stop near the museum.', choices: ['does not', 'do not', 'is not', 'not'], answer: 'does not', ja: 'このバスは博物館の近くには止まりません。' },
    { q: 'Our classes do ___ start at eight today.', choices: ['not', 'no', 'none', 'neither'], answer: 'not', ja: '今日、私たちの授業は8時には始まりません。' },
    { q: 'She ___ not eat meat at school.', choices: ['does', 'do', 'is', 'has'], answer: 'does', ja: '彼女は学校で肉を食べません。' },
  ],
})

const EIKEN_4_EQUAL_COMPARISON = examFamily({
  key: '4_equal_comparison',
  source: 'eiken',
  level: '4',
  topic: '比較',
  explain: '同じ程度を表すときは as＋形容詞・副詞の原級＋as を使う。',
  focuses: [
    'opening-as', 'base-form', 'closing-as', 'opening-as', 'base-form',
    'negative-marker', 'closing-as', 'opening-as', 'base-form', 'negative-marker',
  ],
  cases: [
    { q: 'This bag is ___ light as that one.', choices: ['as', 'than', 'more', 'most'], answer: 'as', ja: 'このかばんはあのかばんと同じくらい軽いです。' },
    { q: 'Aya can run as ___ as her brother.', choices: ['fast', 'faster', 'fastest', 'more fast'], answer: 'fast', ja: 'アヤは兄と同じくらい速く走れます。' },
    { q: 'The blue room is not as large ___ the green room.', choices: ['as', 'than', 'so', 'to'], answer: 'as', ja: '青い部屋は緑の部屋ほど広くありません。' },
    { q: 'Today is ___ warm as yesterday.', choices: ['as', 'more', 'than', 'most'], answer: 'as', ja: '今日は昨日と同じくらい暖かいです。' },
    { q: 'Ken speaks English as ___ as his teacher.', choices: ['clearly', 'clear', 'clearer', 'clearest'], answer: 'clearly', ja: 'ケンは先生と同じくらい明瞭に英語を話します。' },
    { q: 'This puzzle is ___ as difficult as the last one.', choices: ['not', 'no', 'none', 'nothing'], answer: 'not', ja: 'このパズルは前のものほど難しくありません。' },
    { q: 'The new train moves as quietly ___ the old one.', choices: ['as', 'than', 'to', 'by'], answer: 'as', ja: '新しい列車は古い列車と同じくらい静かに走ります。' },
    { q: 'My desk is ___ wide as yours.', choices: ['as', 'so', 'more', 'than'], answer: 'as', ja: '私の机はあなたの机と同じくらい幅があります。' },
    { q: 'Mika studies as ___ as anyone in her class.', choices: ['hard', 'hardly', 'harder', 'hardest'], answer: 'hard', ja: 'ミカはクラスの誰にも劣らないほど熱心に勉強します。' },
    { q: 'The second movie was ___ as exciting as the first.', choices: ['not', 'no', 'none', 'nothing'], answer: 'not', ja: '2作目の映画は1作目ほどわくわくしませんでした。' },
  ],
})

const EIKEN_4_HAVE_TO = examFamily({
  key: '4_have_to',
  source: 'eiken',
  level: '4',
  topic: '助動詞',
  explain: 'have to は必要・義務を表し、主語や時制に応じて has to・had to・will have to と形を変える。',
  focuses: [
    'inflected-have', 'to-marker', 'inflected-have', 'do-support',
    'negative-meaning', 'do-support', 'base-verb', 'inflected-have',
    'to-marker', 'base-verb',
  ],
  cases: [
    { q: 'Ken ___ finish his report by Friday.', choices: ['has to', 'have to', 'having to', 'has'], answer: 'has to', ja: 'ケンは金曜日までに報告書を終えなければなりません。' },
    { q: 'The students have ___ wear name tags at school.', choices: ['to', 'for', 'at', 'of'], answer: 'to', ja: '生徒たちは学校で名札を着けなければなりません。' },
    { q: 'We ___ leave early because of the storm yesterday.', choices: ['had to', 'have to', 'has to', 'must to'], answer: 'had to', ja: '昨日、私たちは嵐のため早く出なければなりませんでした。' },
    { q: 'Emi does not ___ to bring lunch tomorrow because the cafeteria is open.', choices: ['have', 'has', 'had', 'having'], answer: 'have', ja: '食堂が開いているので、エミは明日昼食を持ってくる必要はありません。' },
    { q: 'You ___ pay for this ticket; it is free.', choices: ['do not have to', 'does not have to', 'do not has to', 'are not have to'], answer: 'do not have to', ja: 'この券は無料なので、料金を払う必要はありません。' },
    { q: '___ Ken have to practice today?', choices: ['Does', 'Do', 'Is', 'Has'], answer: 'Does', ja: 'ケンは今日練習しなければなりませんか。' },
    { q: 'I have to ___ the office before it closes.', choices: ['call', 'calls', 'called', 'calling'], answer: 'call', ja: '私は事務所が閉まる前に電話しなければなりません。' },
    { q: 'The driver ___ check the bus every morning.', choices: ['has to', 'have to', 'is have to', 'has checking'], answer: 'has to', ja: '運転手は毎朝バスを点検しなければなりません。' },
    { q: 'We will have ___ take a different route next week.', choices: ['to', 'for', 'at', 'of'], answer: 'to', ja: '私たちは来週、別の道を通らなければならないでしょう。' },
    { q: 'She had to ___ two hours at the hospital last night.', choices: ['wait', 'waits', 'waited', 'waiting'], answer: 'wait', ja: '彼女は昨夜、病院で2時間待たなければなりませんでした。' },
  ],
})

const EIKEN_3_VERB_COMPLEMENT = examFamily({
  key: '3_verb_complement',
  source: 'eiken',
  level: '3',
  topic: '動詞と不定詞・動名詞',
  explain: '動詞の直後の形は動詞ごとに決まる。finish・enjoy・practice・stop・keep の後ろは動名詞、decide・hope・want・need・plan の後ろは to＋原形を使う。',
  focuses: [
    'gerund-complement', 'infinitive-complement', 'governing-verb',
    'to-marker', 'gerund-complement', 'governing-verb',
    'gerund-complement', 'to-marker', 'governing-verb',
    'infinitive-complement',
  ],
  cases: [
    { q: 'Emi finished ___ her science report before dinner.', choices: ['writing', 'to write', 'write', 'wrote'], answer: 'writing', ja: 'エミは夕食前に理科のレポートを書き終えました。' },
    { q: 'Ken decided ___ the school band this year.', choices: ['to join', 'joining', 'join', 'joined'], answer: 'to join', ja: 'ケンは今年、学校の楽団に入ることを決めました。' },
    { q: 'We ___ walking along the lake after lunch.', choices: ['enjoyed', 'decided', 'hoped', 'wanted'], answer: 'enjoyed', ja: '私たちは昼食後、湖に沿って歩くことを楽しみました。' },
    { q: 'Aya hopes ___ visit her cousin during the summer vacation.', choices: ['to', 'for', 'at', 'of'], answer: 'to', ja: 'アヤは夏休みにいとこを訪ねたいと思っています。' },
    { q: 'The students practiced ___ their speeches clearly.', choices: ['giving', 'to give', 'give', 'gave'], answer: 'giving', ja: '生徒たちはスピーチを明瞭に行う練習をしました。' },
    { q: 'I ___ to keep this book for one more week.', choices: ['want', 'enjoy', 'finish', 'practice'], answer: 'want', ja: '私はこの本をもう1週間借りておきたいです。' },
    { q: 'Please stop ___ while the teacher is speaking.', choices: ['talking', 'to talk', 'talk', 'talked'], answer: 'talking', ja: '先生が話している間は、おしゃべりをやめてください。' },
    { q: 'You need ___ show your library card at the entrance.', choices: ['to', 'for', 'at', 'of'], answer: 'to', ja: '入口で図書館カードを見せる必要があります。' },
    { q: 'The baby ___ smiling even after the music stopped.', choices: ['kept', 'hoped', 'decided', 'wanted'], answer: 'kept', ja: '音楽が止まった後も、赤ちゃんはほほ笑み続けました。' },
    { q: 'My family plans ___ Nagasaki next spring.', choices: ['to visit', 'visiting', 'visit', 'visited'], answer: 'to visit', ja: '私の家族は来春、長崎を訪れる予定です。' },
  ],
})

const EIKEN_3_PERFECT_QUESTION = examFamily({
  key: '3_perfect_question',
  source: 'eiken',
  level: '3',
  topic: '現在完了',
  explain: '現在完了の疑問文は Have/Has＋主語＋過去分詞で作り、経験には ever、完了には yet などをよく使う。',
  focuses: [
    'auxiliary', 'auxiliary', 'participle', 'auxiliary', 'duration-marker',
    'participle', 'perfect-adverb', 'participle', 'perfect-adverb',
    'perfect-adverb',
  ],
  cases: [
    { q: '___ you ever visited Okinawa?', choices: ['Have', 'Did', 'Has', 'Are'], answer: 'Have', ja: 'あなたは沖縄を訪れたことがありますか。' },
    { q: '___ Emi ever ridden a horse?', choices: ['Has', 'Have', 'Did', 'Is'], answer: 'Has', ja: 'エミは馬に乗ったことがありますか。' },
    { q: 'Have your parents ___ this movie before?', choices: ['seen', 'saw', 'see', 'seeing'], answer: 'seen', ja: 'あなたの両親は以前この映画を見たことがありますか。' },
    { q: '___ Ken finished his homework yet?', choices: ['Has', 'Did', 'Have', 'Is'], answer: 'Has', ja: 'ケンはもう宿題を終えましたか。' },
    { q: 'How ___ have you lived in this town?', choices: ['long', 'many', 'often', 'much'], answer: 'long', ja: 'あなたはこの町にどのくらい住んでいますか。' },
    { q: 'Has the train ___ yet?', choices: ['arrived', 'arrive', 'arrives', 'arriving'], answer: 'arrived', ja: '列車はもう到着しましたか。' },
    { q: 'Have they ___ tried Japanese calligraphy?', choices: ['ever', 'ago', 'since', 'for'], answer: 'ever', ja: '彼らは書道を体験したことがありますか。' },
    { q: 'How many times has Aya ___ abroad?', choices: ['traveled', 'travel', 'travels', 'traveling'], answer: 'traveled', ja: 'アヤは何回海外へ旅行したことがありますか。' },
    { q: 'Have you returned the library book ___?', choices: ['yet', 'ago', 'since', 'for'], answer: 'yet', ja: 'あなたはもう図書館の本を返しましたか。' },
    { q: 'Has your brother ___ cooked dinner for the family?', choices: ['ever', 'yet', 'since', 'for'], answer: 'ever', ja: 'あなたの兄は家族のために夕食を作ったことがありますか。' },
  ],
})

const EIKEN_PRE2_USED_TO = examFamily({
  key: 'pre2_used_to_contrast',
  source: 'eiken',
  level: 'pre2',
  topic: 'used to / be used to',
  explain: 'used to＋原形は過去の習慣、be used to＋名詞・動名詞は「〜に慣れている」を表す。',
  focuses: [
    'used-marker', 'used-to-base', 'to-marker', 'used-to-base', 'used-marker',
    'used-to-form', 'used-marker', 'do-support-use', 'gerund-after-to',
    'do-support-use',
  ],
  cases: [
    { q: 'Mika is ___ to getting up early for practice.', choices: ['used', 'use', 'using', 'uses'], answer: 'used', ja: 'ミカは練習のため早起きすることに慣れています。' },
    { q: 'My grandfather used to ___ here when he was young.', choices: ['live', 'living', 'lived', 'to living'], answer: 'live', ja: '祖父は若いころここに住んでいました。' },
    { q: 'The new employee is not used ___ giving presentations in English.', choices: ['to', 'for', 'at', 'of'], answer: 'to', ja: 'その新入社員は英語で発表することに慣れていません。' },
    { q: 'We used to ___ by the river every summer.', choices: ['camp', 'camping', 'camped', 'to camped'], answer: 'camp', ja: '私たちは以前、毎年夏に川辺でキャンプをしたものです。' },
    { q: 'After a month, Ken got ___ to taking the crowded train.', choices: ['used', 'use', 'using', 'uses'], answer: 'used', ja: '1か月後、ケンは混んだ列車に乗ることに慣れました。' },
    { q: 'There used to ___ a bookstore on this corner.', choices: ['be', 'being', 'was', 'is'], answer: 'be', ja: '以前この角には書店がありました。' },
    { q: 'Are you ___ to eating spicy food?', choices: ['used', 'use', 'using', 'uses'], answer: 'used', ja: 'あなたは辛い食べ物を食べることに慣れていますか。' },
    { q: 'Aya did not ___ to like science, but now she loves it.', choices: ['use', 'used', 'uses', 'using'], answer: 'use', ja: 'アヤは以前理科が好きではありませんでしたが、今は大好きです。' },
    { q: 'The players are used to ___ under pressure.', choices: ['performing', 'perform', 'performed', 'to perform'], answer: 'performing', ja: 'その選手たちは重圧の中で力を発揮することに慣れています。' },
    { q: 'Did your family ___ to live in Hokkaido?', choices: ['use', 'used', 'uses', 'using'], answer: 'use', ja: 'あなたの家族は以前北海道に住んでいましたか。' },
  ],
})

const EIKEN_PRE2_DIFFICULTY_GERUND = examFamily({
  key: 'pre2_difficulty_gerund',
  source: 'eiken',
  level: 'pre2',
  topic: '動名詞の慣用',
  explain: 'have difficulty/trouble (in) doing で「〜するのに苦労する」を表し、後ろには動名詞を置く。',
  focuses: [
    'difficulty-noun', 'gerund-after-noun', 'have-support', 'difficulty-noun',
    'gerund-after-noun', 'difficulty-noun', 'gerund-after-noun',
    'have-support', 'have-support', 'in-marker',
  ],
  cases: [
    { q: 'I had ___ hearing the speaker in the noisy room.', choices: ['difficulty', 'difficult', 'difficultly', 'difficulties to'], answer: 'difficulty', ja: '私は騒がしい部屋で話し手の声を聞き取るのに苦労しました。' },
    { q: 'Ken has trouble ___ all the new names.', choices: ['remembering', 'remember', 'to remember', 'remembered'], answer: 'remembering', ja: 'ケンは新しい名前を全部覚えるのに苦労しています。' },
    { q: 'The visitors ___ difficulty finding the entrance.', choices: ['had', 'were', 'did', 'made'], answer: 'had', ja: '訪問者たちは入口を見つけるのに苦労しました。' },
    { q: 'Aya never has ___ expressing her ideas clearly.', choices: ['trouble', 'troubled', 'troubling', 'to trouble'], answer: 'trouble', ja: 'アヤは自分の考えを明確に表すのに困ることがありません。' },
    { q: 'We had difficulty ___ which route was safer.', choices: ['deciding', 'decide', 'to deciding', 'decided'], answer: 'deciding', ja: '私たちはどちらの道が安全か決めるのに苦労しました。' },
    { q: 'Some students have ___ staying focused online.', choices: ['trouble', 'troubled', 'troubling', 'to trouble'], answer: 'trouble', ja: 'オンラインで集中を保つのに苦労する生徒もいます。' },
    { q: 'The team had no difficulty ___ the new system.', choices: ['using', 'use', 'to use', 'used'], answer: 'using', ja: 'そのチームは新しい仕組みを使うのに苦労しませんでした。' },
    { q: 'My grandmother ___ difficulty reading small letters.', choices: ['has', 'is', 'does', 'makes'], answer: 'has', ja: '祖母は小さな文字を読むのに苦労しています。' },
    { q: 'Did you ___ trouble opening the file?', choices: ['have', 'had', 'having', 'has'], answer: 'have', ja: 'そのファイルを開くのに苦労しましたか。' },
    { q: 'The hikers had difficulty ___ crossing the river after the rain.', choices: ['in', 'to', 'for', 'at'], answer: 'in', ja: '登山者たちは雨の後に川を渡るのに苦労しました。' },
  ],
})

const COMMON_TEST_2_SUPPOSED_TO = examFamily({
  key: '2_supposed_to',
  source: 'common',
  level: '2',
  topic: '助動詞・義務',
  explain: 'be supposed to do は、規則・予定・一般的な期待として「〜することになっている」を表す。',
  focuses: [
    'to-marker', 'base-verb', 'to-marker', 'passive-be', 'to-marker',
    'base-verb', 'base-verb', 'supposed-form', 'passive-be', 'be-form',
  ],
  cases: [
    { q: 'Visitors are supposed ___ show their passes at the gate.', choices: ['to', 'for', 'that', 'with'], answer: 'to', ja: '訪問者は門で通行証を見せることになっています。' },
    { q: 'The meeting is supposed to ___ at three.', choices: ['begin', 'begins', 'began', 'beginning'], answer: 'begin', ja: '会議は3時に始まることになっています。' },
    { q: 'Students are not supposed ___ phones during the test.', choices: ['to use', 'using', 'use', 'used'], answer: 'to use', ja: '生徒は試験中に携帯電話を使ってはいけないことになっています。' },
    { q: 'This medicine is supposed to ___ taken after meals.', choices: ['be', 'being', 'been', 'is'], answer: 'be', ja: 'この薬は食後に服用することになっています。' },
    { q: 'I was supposed ___ Ken at the station, but my train was late.', choices: ['to meet', 'meeting', 'meet', 'met'], answer: 'to meet', ja: '私は駅でケンに会うことになっていましたが、列車が遅れました。' },
    { q: 'What are we supposed to ___ next?', choices: ['do', 'doing', 'did', 'done'], answer: 'do', ja: '私たちは次に何をすることになっていますか。' },
    { q: 'The package was supposed to ___ yesterday.', choices: ['arrive', 'arrived', 'arriving', 'arrival'], answer: 'arrive', ja: 'その荷物は昨日届く予定でした。' },
    { q: 'Employees are ___ to follow the safety rules carefully.', choices: ['supposed', 'supposing', 'suppose', 'supposes'], answer: 'supposed', ja: '従業員は安全規則を注意深く守ることになっています。' },
    { q: 'The results are supposed to ___ announced tomorrow.', choices: ['be', 'being', 'been', 'have'], answer: 'be', ja: '結果は明日発表されることになっています。' },
    { q: 'You ___ not supposed to leave this door unlocked.', choices: ['were', 'did', 'had', 'have'], answer: 'were', ja: 'あなたはこのドアの鍵を開けたままにしてはいけないことになっていました。' },
  ],
})

const UNIVERSITY_2_PERFECT_PASSIVE = examFamily({
  key: '2_perfect_passive',
  source: 'university',
  level: '2',
  topic: '完了形応用',
  explain: '完了形の受動態は have/has/had＋been＋過去分詞で作る。',
  focuses: [
    'perfect-auxiliary', 'been-marker', 'past-participle', 'perfect-auxiliary',
    'past-participle', 'perfect-adverb', 'been-marker', 'past-participle',
    'perfect-auxiliary', 'been-marker',
  ],
  cases: [
    { q: 'The final results ___ not been confirmed yet.', choices: ['have', 'has', 'are', 'were'], answer: 'have', ja: '最終結果はまだ確認されていません。' },
    { q: 'The bridge has ___ inspected twice this year.', choices: ['been', 'being', 'be', 'was'], answer: 'been', ja: 'その橋は今年2回点検されています。' },
    { q: 'All the seats had been ___ before noon.', choices: ['reserved', 'reserve', 'reserving', 'reservation'], answer: 'reserved', ja: '正午前には全席が予約されていました。' },
    { q: 'The missing painting ___ finally been found.', choices: ['has', 'have', 'was', 'is'], answer: 'has', ja: '行方不明だった絵がついに見つかりました。' },
    { q: 'Several errors have been ___ in the report.', choices: ['discovered', 'discover', 'discovering', 'discovery'], answer: 'discovered', ja: '報告書でいくつかの誤りが見つかっています。' },
    { q: 'The new rules had ___ been explained to everyone.', choices: ['already', 'all ready', 'ready', 'earlier than'], answer: 'already', ja: '新しい規則はすでに全員へ説明されていました。' },
    { q: 'No decision has ___ made about the location.', choices: ['been', 'being', 'be', 'was'], answer: 'been', ja: '場所については何も決定されていません。' },
    { q: 'The old theater has recently been ___.', choices: ['restored', 'restore', 'restoring', 'restoration'], answer: 'restored', ja: 'その古い劇場は最近修復されました。' },
    { q: 'By then, the road ___ been closed for several hours.', choices: ['had', 'has', 'was', 'is'], answer: 'had', ja: 'その時までに道路は数時間閉鎖されていました。' },
    { q: 'The cause of the problem has never ___ identified.', choices: ['been', 'being', 'be', 'was'], answer: 'been', ja: '問題の原因は一度も特定されていません。' },
  ],
})

const UNIVERSITY_PRE1_MANDATIVE = examFamily({
  key: 'pre1_mandative',
  source: 'university',
  level: 'pre1',
  topic: '仮定法応用',
  explain: '要求・提案・必要性を表す動詞や形容詞の that 節では、主語にかかわらず動詞原形を使う。',
  focuses: [
    'base-verb', 'trigger-expression', 'base-verb', 'passive-be', 'that-marker',
    'passive-be', 'trigger-expression', 'negative-position', 'base-verb',
    'passive-be',
  ],
  cases: [
    { q: 'The residents demanded that the council ___ the safety report.', choices: ['publish', 'publishes', 'published', 'publishing'], answer: 'publish', ja: '住民は市議会が安全報告書を公表するよう要求しました。' },
    { q: 'The doctor ___ that Ken get more rest.', choices: ['recommended', 'recommendation', 'recommending', 'recommends to'], answer: 'recommended', ja: '医師はケンがもっと休息を取るよう勧めました。' },
    { q: 'It is essential that every applicant ___ the form.', choices: ['sign', 'signs', 'signed', 'signing'], answer: 'sign', ja: '応募者全員が用紙に署名することが不可欠です。' },
    { q: 'The committee proposed that the rule ___ revised.', choices: ['be', 'is', 'was', 'being'], answer: 'be', ja: '委員会はその規則を改正するよう提案しました。' },
    { q: 'Her teacher insisted ___ she cite the source clearly.', choices: ['that', 'what', 'whether', 'because'], answer: 'that', ja: '先生は彼女が出典を明記するよう強く求めました。' },
    { q: 'The law requires that each vehicle ___ inspected yearly.', choices: ['be', 'is', 'was', 'been'], answer: 'be', ja: '法律は各車両を毎年点検するよう定めています。' },
    { q: 'They ___ that the meeting be postponed.', choices: ['suggested', 'suggestion', 'suggesting', 'suggested to'], answer: 'suggested', ja: '彼らは会議を延期するよう提案しました。' },
    { q: 'It is important that the data ___ be released early.', choices: ['not', 'no', 'never to', 'none'], answer: 'not', ja: 'データが早期に公開されないことが重要です。' },
    { q: 'The coach requested that every player ___ on time.', choices: ['arrive', 'arrives', 'arrived', 'arriving'], answer: 'arrive', ja: '監督は全選手が時間どおり到着するよう求めました。' },
    { q: 'The judge ordered that the document ___ kept private.', choices: ['be', 'is', 'was', 'being'], answer: 'be', ja: '裁判官はその文書を非公開にするよう命じました。' },
  ],
})

const UNIVERSITY_PRE1_CONCESSION_AS = examFamily({
  key: 'pre1_concession_as',
  source: 'university',
  level: 'pre1',
  topic: '譲歩',
  explain: '形容詞・副詞・無冠詞の名詞＋as＋主語＋動詞で「〜ではあるが」という譲歩を表す。',
  focuses: [
    'as-marker', 'subject-position', 'predicate-verb', 'fronted-adverb',
    'fronted-complement', 'as-marker', 'predicate-verb', 'fronted-complement',
    'as-marker', 'predicate-verb',
  ],
  cases: [
    { q: 'Tight ___ the schedule was, the team met every deadline.', choices: ['as', 'although', 'despite', 'because'], answer: 'as', ja: '日程は厳しかったものの、チームはすべての締め切りを守りました。' },
    { q: 'Young as ___ is, Aya leads the research group well.', choices: ['she', 'her', 'hers', 'herself'], answer: 'she', ja: '若いとはいえ、アヤは研究班をうまく率いています。' },
    { q: 'Difficult as the task may ___, it can be completed today.', choices: ['seem', 'seems', 'seemed', 'seeming'], answer: 'seem', ja: 'その作業は難しく見えるかもしれませんが、今日中に終えられます。' },
    { q: '___ as Ken tried, he could not lift the stone.', choices: ['Hard', 'Hardly', 'Although hard', 'Difficulty'], answer: 'Hard', ja: 'ケンは懸命に試しましたが、その石を持ち上げられませんでした。' },
    { q: '___ as the evidence is, further testing is necessary.', choices: ['Promising', 'Promise', 'Promisingly', 'Despite promising'], answer: 'Promising', ja: '証拠は有望ですが、さらなる検証が必要です。' },
    { q: 'Tired ___ he was, the traveler continued walking.', choices: ['as', 'although', 'despite', 'because'], answer: 'as', ja: '疲れてはいたものの、その旅人は歩き続けました。' },
    { q: 'Plain as the room ___, it contained valuable records.', choices: ['looked', 'looking', 'looks like', 'was look'], answer: 'looked', ja: 'その部屋は質素に見えましたが、貴重な記録を収めていました。' },
    { q: '___ as the solution sounds, it requires careful planning.', choices: ['Simple', 'Simply', 'Although simple', 'Simplicity'], answer: 'Simple', ja: 'その解決策は単純に聞こえますが、慎重な計画が必要です。' },
    { q: 'Old ___ the device is, many hospitals still use it.', choices: ['as', 'although', 'despite', 'because'], answer: 'as', ja: 'その装置は古いものの、多くの病院が今も使っています。' },
    { q: 'Certain as the claim ___, it lacks reliable support.', choices: ['appears', 'appear', 'appearing', 'appearance'], answer: 'appears', ja: 'その主張は確かに見えますが、信頼できる裏付けを欠いています。' },
  ],
})

const UNIVERSITY_1_NOT_UNTIL_INVERSION = examFamily({
  key: '1_not_until_inversion',
  source: 'university',
  level: '1',
  topic: '倒置・強調',
  explain: 'Not until＋時・節を文頭に置くと、主節は助動詞＋主語＋動詞の倒置語順になる。',
  focuses: [
    'inverted-auxiliary', 'not-until-marker', 'base-verb', 'subject-position',
    'inverted-word-order', 'inverted-auxiliary', 'base-verb',
    'not-until-marker', 'past-participle', 'inverted-auxiliary',
  ],
  cases: [
    { q: 'Not until midnight ___ the team finish the analysis.', choices: ['did', 'the team did', 'was', 'had'], answer: 'did', ja: '真夜中になって初めてチームは分析を終えました。' },
    { q: '___ the data were checked did we notice the error.', choices: ['Not until', 'Until not', 'Only not', 'Since not'], answer: 'Not until', ja: 'データを確認して初めて私たちは誤りに気づきました。' },
    { q: 'Not until years later did the truth ___ public.', choices: ['become', 'became', 'becoming', 'becomes'], answer: 'become', ja: '何年も後になって初めて真相が公になりました。' },
    { q: 'Not until she reread the letter did ___ understand its meaning.', choices: ['Aya', 'did Aya', 'Aya did', 'understood Aya'], answer: 'Aya', ja: '手紙を読み直して初めてアヤはその意味を理解しました。' },
    { q: 'Not until the final vote ___ certain.', choices: ['was the result', 'the result was', 'did the result', 'the result did'], answer: 'was the result', ja: '最終投票になって初めて結果が確定しました。' },
    { q: 'Not until the storm ended ___ the rescue team leave.', choices: ['could', 'the team could', 'was', 'had'], answer: 'could', ja: '嵐が収まって初めて救助隊は出発できました。' },
    { q: 'Not until all witnesses had spoken did the judge ___ a decision.', choices: ['make', 'made', 'making', 'makes'], answer: 'make', ja: '全証人が話し終えて初めて裁判官は決定を下しました。' },
    { q: '___ the lights went out did anyone realize the danger.', choices: ['Not until', 'Until not', 'Only not', 'Since not'], answer: 'Not until', ja: '明かりが消えて初めて皆は危険に気づきました。' },
    { q: 'Not until the experiment was repeated was the finding ___.', choices: ['accepted', 'accept', 'accepting', 'acceptance'], answer: 'accepted', ja: '実験が再現されて初めてその発見は受け入れられました。' },
    { q: 'Not until next month ___ the full report be available.', choices: ['will', 'the report will', 'does', 'is'], answer: 'will', ja: '来月になって初めて完全な報告書が利用可能になります。' },
  ],
})

const UNIVERSITY_1_DEGREE_ADVERB = examFamily({
  key: '1_degree_adverb',
  source: 'university',
  level: '1',
  topic: '高度語法',
  explain: 'nothing・no・anyや形容詞を程度修飾するときは、形容詞ではなく practically・virtually・hardly などの副詞を使う。',
  focuses: [
    'negative-quantifier', 'negative-quantifier', 'degree-adverb',
    'negative-quantifier', 'comparative-complement', 'degree-adverb',
    'adjective-complement', 'adjective-complement', 'degree-adverb',
    'comparative-complement',
  ],
  cases: [
    { q: 'The laboratory test showed the filter was useless: it removed practically ___ from the polluted water.', choices: ['nothing', 'anything', 'something', 'everything'], answer: 'nothing', ja: '実験の結果、そのフィルターは役に立たず、汚染水からほとんど何も取り除けないと分かりました。' },
    { q: 'There is virtually ___ chance of finishing before noon.', choices: ['no', 'not', 'none', 'nothing'], answer: 'no', ja: '正午までに終える可能性は事実上ありません。' },
    { q: 'The two versions are ___ identical in meaning.', choices: ['almost', 'most', 'almostly', 'the most'], answer: 'almost', ja: 'その2つの版は意味がほとんど同じです。' },
    { q: 'We have hardly ___ reliable evidence at this stage.', choices: ['any', 'some', 'many', 'every'], answer: 'any', ja: '現段階では信頼できる証拠がほとんどありません。' },
    { q: 'The cost was considerably ___ than we had expected.', choices: ['higher', 'highest', 'highly', 'height'], answer: 'higher', ja: '費用は予想よりかなり高額でした。' },
    { q: 'The machine is ___ impossible to repair safely.', choices: ['practically', 'practical', 'practice', 'practiced'], answer: 'practically', ja: 'その機械を安全に修理することは事実上不可能です。' },
    { q: 'The new evidence is largely ___ to the central issue.', choices: ['irrelevant', 'irrelevance', 'irrelevantly', 'relevant to not'], answer: 'irrelevant', ja: '新しい証拠は中心的な問題にはほぼ無関係です。' },
    { q: 'The village remained virtually ___ for a century.', choices: ['unchanged', 'unchangingly', 'unchange', 'unchanges'], answer: 'unchanged', ja: 'その村は1世紀の間ほとんど変わりませんでした。' },
    { q: 'The witness could ___ remember what had happened.', choices: ['barely', 'bare', 'bareness', 'bared'], answer: 'barely', ja: 'その証人は何が起きたかほとんど思い出せませんでした。' },
    { q: 'Her explanation was far ___ convincing than his.', choices: ['more', 'most', 'many', 'much of'], answer: 'more', ja: '彼女の説明は彼の説明よりはるかに説得力がありました。' },
  ],
})

export const GRAMMAR_EXAM_PATTERN_FAMILIES = Object.freeze([
  EIKEN_5_PRONOUN_FORM,
  EIKEN_5_PRESENT_NEGATIVE,
  EIKEN_4_EQUAL_COMPARISON,
  EIKEN_4_HAVE_TO,
  EIKEN_3_VERB_COMPLEMENT,
  EIKEN_3_PERFECT_QUESTION,
  EIKEN_PRE2_USED_TO,
  EIKEN_PRE2_DIFFICULTY_GERUND,
  COMMON_TEST_2_SUPPOSED_TO,
  UNIVERSITY_2_PERFECT_PASSIVE,
  UNIVERSITY_PRE1_MANDATIVE,
  UNIVERSITY_PRE1_CONCESSION_AS,
  UNIVERSITY_1_NOT_UNTIL_INVERSION,
  UNIVERSITY_1_DEGREE_ADVERB,
])

export const GRAMMAR_EXAM_PATTERNS = GRAMMAR_EXAM_PATTERN_FAMILIES.flat()
export const GRAMMAR_EXAM_PATTERN_COUNT = GRAMMAR_EXAM_PATTERN_FAMILIES.length
export const GRAMMAR_EXAM_QUESTION_COUNT = GRAMMAR_EXAM_PATTERNS.length
