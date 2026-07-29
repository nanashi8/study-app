// 追加長文の内容理解問題。本文の明示情報だけでなく、因果・対比・筆者の限定も問う。

export const EXAM_READING_QUESTIONS = {
  p_5_school_open_day: [
    {
      q: 'What do families watch first?',
      choices: ['A science class.', 'A sports game.', 'A short movie.', 'A bus ride.'],
      answer: 'A science class.',
      explain: '“First, families visit classrooms and watch a science class.” が根拠です。',
    },
    {
      q: 'What should families bring?',
      choices: ['Their own drinks.', 'A lunch table.', 'Outdoor shoes.', 'A music book.'],
      answer: 'Their own drinks.',
      explain: '“Please bring your own drinks.” と案内されています。',
    },
    {
      q: 'Where can visitors ask a teacher a question?',
      choices: [
        'Near the front door.',
        'In the school garden.',
        'At the bus stop.',
        'Behind the music hall.',
      ],
      answer: 'Near the front door.',
      explain: '質問がある人は正面のドア近くにいる先生へ尋ねます。',
    },
  ],

  p_4_bicycle_safety: [
    {
      q: 'Why should riders use bicycle lights after dark?',
      choices: [
        'Drivers may not notice them.',
        'The park closes early.',
        'Helmets become difficult to wear.',
        'The bicycles move too slowly.',
      ],
      answer: 'Drivers may not notice them.',
      explain: '暗くなると運転手から自転車が見えにくくなるためです。',
    },
    {
      q: 'What will local shop workers do on Wednesday?',
      choices: [
        'Check bicycle parts for free.',
        'Sell new bicycles in the park.',
        'Teach a class at the police station.',
        'Lead families through busy streets.',
      ],
      answer: 'Check bicycle parts for free.',
      explain: '公園でブレーキ、座席、ライトを無料点検します。',
    },
    {
      q: 'What can the workers NOT do?',
      choices: [
        'Replace expensive parts.',
        'Check bicycle seats.',
        'Make small repairs.',
        'Look at bicycle lights.',
      ],
      answer: 'Replace expensive parts.',
      explain: '小さな修理はできますが、高価な部品の交換はできません。',
    },
    {
      q: 'Why should parents join the Saturday ride?',
      choices: [
        'To practice the rules with their children.',
        'To pay the volunteers for their work.',
        'To carry bicycles back from the park.',
        'To choose a new police officer.',
      ],
      answer: 'To practice the rules with their children.',
      explain: '保護者も子どもと一緒に交通ルールを練習するためです。',
    },
    {
      q: 'What is the main purpose of bicycle safety week?',
      choices: [
        'To help families prevent accidents through learning and practice.',
        'To encourage children to ride on crowded roads alone.',
        'To advertise expensive parts from local bicycle shops.',
        'To replace the town’s buses with bicycles.',
      ],
      answer: 'To help families prevent accidents through learning and practice.',
      explain: '講習、点検、実地練習を通して事故を防ぐ催しです。',
    },
  ],

  p_3_lunch_food_waste: [
    {
      q: 'Why did the science class begin with a survey?',
      choices: [
        'To learn why different students left food.',
        'To decide which cooking staff should leave.',
        'To find a school with a larger cafeteria.',
        'To ask every student to eat the same amount.',
      ],
      answer: 'To learn why different students left food.',
      explain: '学年や活動によって必要な量が異なることを調べるためでした。',
    },
    {
      q: 'When was food waste greatest?',
      choices: [
        'When every student received the same large portion.',
        'When students could return for more food.',
        'When pictures were placed near the entrance.',
        'When the cooking staff used daily records.',
      ],
      answer: 'When every student received the same large portion.',
      explain: '全員に同じ大盛りを配った日に廃棄が最大でした。',
    },
    {
      q: 'How did the two plate sizes help students?',
      choices: [
        'They could choose an amount and get more later.',
        'They could take their lunch home every day.',
        'They could avoid eating vegetables completely.',
        'They could receive a different menu from every class.',
      ],
      answer: 'They could choose an amount and get more later.',
      explain: '小盛りを選んでも、必要なら後でおかわりできる仕組みでした。',
    },
    {
      q: 'What happened after one month?',
      choices: [
        'Leftover food fell by almost half.',
        'The cafeteria stopped serving bread.',
        'Sports practice moved to the morning.',
        'The school closed its cooking room.',
      ],
      answer: 'Leftover food fell by almost half.',
      explain: '1か月後、食べ残しはほぼ半減しました。',
    },
    {
      q: 'What lesson did the students learn?',
      choices: [
        'Clear information and useful choices can reduce waste.',
        'One strict portion rule works perfectly for everyone.',
        'Food waste is caused only by younger students.',
        'Measuring a problem makes action unnecessary.',
      ],
      answer: 'Clear information and useful choices can reduce waste.',
      explain: '一律の規則ではなく、情報と選択肢が改善を生んだことが本文の結論です。',
    },
  ],

  p_pre2_later_school_start: [
    {
      q: 'Why do many teenagers find it difficult to sleep early?',
      choices: [
        'Their body clock often changes during the teenage years.',
        'Their schools always hold sports practice at night.',
        'Their teachers ask them to wake during the night.',
        'Their buses arrive after morning classes begin.',
      ],
      answer: 'Their body clock often changes during the teenage years.',
      explain: '10代には体内時計が変わり、夜に眠くなる時刻が遅くなると説明されています。',
    },
    {
      q: 'Which result was reported in one experiment?',
      choices: [
        'Attendance and mood improved before test scores did.',
        'Transportation costs disappeared immediately.',
        'Every family preferred the same starting time.',
        'Afternoon activities ended earlier than before.',
      ],
      answer: 'Attendance and mood improved before test scores did.',
      explain: '出席状況と気分は改善した一方、点数はすぐには上がりませんでした。',
    },
    {
      q: 'Why does the passage describe students helping to design a schedule?',
      choices: [
        'To show that cooperation can solve practical local problems.',
        'To prove that sleep research is unnecessary.',
        'To show that students should control every school policy.',
        'To argue that buses should not be used after school.',
      ],
      answer: 'To show that cooperation can solve practical local problems.',
      explain: '生徒の提案で、睡眠と午後の活動を両立するバス時刻表を作れた例です。',
    },
    {
      q: 'What is the author’s main conclusion?',
      choices: [
        'Schools should use sleep evidence and review plans that fit local needs.',
        'Every school should begin at exactly the same later time.',
        'Schools should cancel clubs whenever their starting time changes.',
        'An old schedule is best because families already know it.',
      ],
      answer: 'Schools should use sleep evidence and review plans that fit local needs.',
      explain: '証拠を重視しつつ地域事情と調整し、実施後も見直すという限定的な結論です。',
    },
  ],

  p_pre2plus_city_bird_count: [
    {
      q: 'What can researchers learn from thousands of bird reports?',
      choices: [
        'Patterns that a small team might miss.',
        'The exact age of every bird in a city.',
        'A way to make all birds live in gardens.',
        'The name of every person who visits a park.',
      ],
      answer: 'Patterns that a small team might miss.',
      explain: '多数の報告により、少人数の研究者では見落とす広域・長期の傾向を発見できます。',
    },
    {
      q: 'How can easy-to-reach locations create bias?',
      choices: [
        'They receive more reports than distant locations.',
        'They always contain more bird species.',
        'They prevent experts from training volunteers.',
        'They make every beginner identify birds correctly.',
      ],
      answer: 'They receive more reports than distant locations.',
      explain: '行きやすい場所に観察が偏り、生息地ごとの報告量に差が生じます。',
    },
    {
      q: 'Why should volunteers report visits when no birds appear?',
      choices: [
        'Those reports help researchers understand absence and incomplete data.',
        'Those reports allow volunteers to avoid recording time.',
        'Those reports prove that a habitat is permanently empty.',
        'Those reports replace the need for all other observations.',
      ],
      answer: 'Those reports help researchers understand absence and incomplete data.',
      explain: '鳥がいなかった観察も含めると、出現しない場合と単なる未観察を区別しやすくなります。',
    },
    {
      q: 'How do professionals and volunteers contribute different strengths?',
      choices: [
        'Volunteers provide many local observations, while scientists provide research methods.',
        'Volunteers write conclusions, while scientists only take photographs.',
        'Volunteers study unsafe places, while scientists study easy places.',
        'Volunteers replace professionals after receiving one training session.',
      ],
      answer: 'Volunteers provide many local observations, while scientists provide research methods.',
      explain: '市民は時間・地域知識・観察数を、科学者は信頼できる結論へ導く方法を提供します。',
    },
    {
      q: 'What broader lesson does the partnership teach?',
      choices: [
        'Useful science records uncertainty as honestly as discovery.',
        'Large datasets are automatically free from mistakes.',
        'Only unusual observations are valuable to conservation.',
        'Scientific conclusions should never be changed.',
      ],
      answer: 'Useful science records uncertainty as honestly as discovery.',
      explain: '発見だけでなく、限界や不確実性も正直に記録することが結論です。',
    },
  ],

  p_2_online_health_claims: [
    {
      q: 'Why is a university report easier to check than an unnamed video?',
      choices: [
        'The report describes its methods and source.',
        'The report always reaches fewer people.',
        'The video never mentions scientific ideas.',
        'The university cannot make mistakes.',
      ],
      answer: 'The report describes its methods and source.',
      explain: '情報源と方法が明示されていれば、内容を追跡して検証できます。',
    },
    {
      q: 'Why does sample size matter?',
      choices: [
        'A small group may not represent people with different conditions.',
        'A large group makes comparison between treatments impossible.',
        'Only twelve volunteers can produce reliable evidence.',
        'Sample size determines who paid for a study.',
      ],
      answer: 'A small group may not represent people with different conditions.',
      explain: '少人数の結果を、年齢や健康状態が違う集団へ一般化できるとは限りません。',
    },
    {
      q: 'What alternative explanation is given for the tea survey?',
      choices: [
        'Relaxed people may choose to drink more tea.',
        'Tea drinkers may answer every survey incorrectly.',
        'Stress may prevent researchers from measuring income.',
        'Working hours may be caused only by tea.',
      ],
      answer: 'Relaxed people may choose to drink more tea.',
      explain: 'お茶がストレスを減らす以外に、もともと穏やかな人がお茶を選ぶ可能性が示されています。',
    },
    {
      q: 'How should readers treat company-funded research?',
      choices: [
        'Check its methods, conflicts, and independent review.',
        'Accept it if the advertisement sounds confident.',
        'Reject it automatically without reading the study.',
        'Use it instead of advice from a professional.',
      ],
      answer: 'Check its methods, conflicts, and independent review.',
      explain: '企業資金だけで真偽を決めず、方法・利害関係・独立審査を確認します。',
    },
    {
      q: 'What does the author mean by matching confidence to evidence?',
      choices: [
        'Strong conclusions require strong and repeated support.',
        'Readers should doubt every health statement equally.',
        'A popular claim is more reliable than a careful review.',
        'Uncertainty means that research has no value.',
      ],
      answer: 'Strong conclusions require strong and repeated support.',
      explain: '証拠の質と量に応じて、どこまで確信できるかを調整する姿勢です。',
    },
  ],

  p_pre1_cashless_inclusion: [
    {
      q: 'How can refusing cash restrict public participation?',
      choices: [
        'Some people lack the accounts, devices, access, or documents required for digital payment.',
        'Digital payments prevent every business from selling goods online.',
        'Cash users are unable to understand the price of food.',
        'Public facilities accept only foreign bank accounts.',
      ],
      answer: 'Some people lack the accounts, devices, access, or documents required for digital payment.',
      explain: '必要な口座・機器・通信・身分証がない人は、生活必需品や公共生活から排除され得ます。',
    },
    {
      q: 'Why does the author compare cash with backup power?',
      choices: [
        'Both may seem inefficient until a system failure makes them valuable.',
        'Both require every household to open several digital accounts.',
        'Both eliminate privacy risks during ordinary transactions.',
        'Both are used only by small shops with narrow margins.',
      ],
      answer: 'Both may seem inefficient until a system failure makes them valuable.',
      explain: '平常時の重複が、障害・災害時には制度の回復力になるという類比です。',
    },
    {
      q: 'What does the envelope example show?',
      choices: [
        'The most useful payment tool can depend on a person’s circumstances.',
        'Cash is technically superior for every consumer.',
        'Digital balances are always incorrect.',
        'Financial training has no value for households.',
      ],
      answer: 'The most useful payment tool can depend on a person’s circumstances.',
      explain: '収入や家計管理の事情によって、現金が実用的な人もいることを示します。',
    },
    {
      q: 'Which policy best matches the author’s conclusion?',
      choices: [
        'Expand digital access while preserving meaningful payment alternatives.',
        'Require every transaction to become cashless immediately.',
        'Stop all digital innovation to protect older payment tools.',
        'Let efficiency alone decide which citizens may participate.',
      ],
      answer: 'Expand digital access while preserving meaningful payment alternatives.',
      explain: 'デジタル化を止めず、障壁を除きながら実質的な代替手段も維持する立場です。',
    },
  ],

  p_1_metric_fixation: [
    {
      q: 'What problem arises when an indicator becomes a practical definition of success?',
      choices: [
        'People may optimize the proxy while neglecting the underlying mission.',
        'Institutions become unable to publish any performance information.',
        'Professional judgment becomes perfectly consistent and unbiased.',
        'Every qualitative value is converted into an accurate number.',
      ],
      answer: 'People may optimize the proxy while neglecting the underlying mission.',
      explain: '代理指標の改善が本来の教育・医療などの目的より優先される問題です。',
    },
    {
      q: 'Why does the author reject simply replacing metrics with professional judgment?',
      choices: [
        'Judgment can also be biased, inconsistent, and difficult to challenge.',
        'Professionals are unable to understand qualitative evidence.',
        'Measurement never creates unintended consequences.',
        'Outsiders should have no role in institutional accountability.',
      ],
      answer: 'Judgment can also be biased, inconsistent, and difficult to challenge.',
      explain: '数量化の欠点だけでなく、記録のない裁量にも偏りや検証困難という欠点があります。',
    },
    {
      q: 'Why must evaluation systems be adaptive?',
      choices: [
        'People change their behavior when rewards or penalties depend on a measure.',
        'A single metric eventually captures every part of a mission.',
        'Published dashboards remove the need for audits.',
        'Stable definitions always reveal groups missing from the data.',
      ],
      answer: 'People change their behavior when rewards or penalties depend on a measure.',
      explain: '測定される側が指標に適応するため、指標の信頼性や副作用を継続的に見直す必要があります。',
    },
    {
      q: 'What is the author’s final position on metrics?',
      choices: [
        'They are valuable as one contestable source of evidence, not as a substitute for a mission.',
        'They should automatically determine every institutional decision.',
        'They are useful only when they eliminate public disagreement.',
        'They should be abandoned whenever a value is difficult to quantify.',
      ],
      answer: 'They are valuable as one contestable source of evidence, not as a substitute for a mission.',
      explain: '指標を廃止も絶対化もせず、異議申し立て可能な証拠の一つとして使う結論です。',
    },
  ],
}
