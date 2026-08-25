// 時事長文の内容理解問題。
// 各設問は本文の一か所へ戻れる根拠を持ち、explain で日本語の根拠を示す。

export const CURRENT_AFFAIRS_READING_QUESTIONS = Object.freeze({
  p_5_hot_summer_school: [
    {
      q: 'Why did the school put new curtains in every classroom?',
      choices: [
        'To stop strong sunlight in the afternoon.',
        'To make the classrooms darker at night.',
        'To keep rain out of the classrooms.',
        'To show pictures of the school garden.',
      ],
      answer: 'To stop strong sunlight in the afternoon.',
      explain: '第3文に「そのカーテンは午後の強い日差しを止めます」とあり、購入の目的が示されています。',
    },
    {
      q: 'What does the teacher check every morning?',
      choices: [
        'The temperature in the gym.',
        'The number of green plants.',
        'The water in every bottle.',
        'The books in the library.',
      ],
      answer: 'The temperature in the gym.',
      explain: '第6文の “a teacher checks the temperature in the gym” が根拠です。何を確認するかを問う設問です。',
    },
    {
      q: 'What do the students do on hot days?',
      choices: [
        'They study in the library and drink a lot of water.',
        'They run outside before lunch.',
        'They clean the gym after school.',
        'They plant new trees near the station.',
      ],
      answer: 'They study in the library and drink a lot of water.',
      explain: '第8文に「暑い日には図書室で勉強し、水をたくさん飲む」と書かれています。',
    },
  ],

  p_4_school_solar_roof: [
    {
      q: 'What does the screen near the office show?',
      choices: [
        'The power that the school makes each day.',
        'The names of students who clean the roof.',
        'The time of the next science class.',
        'The price of electricity in the town.',
      ],
      answer: 'The power that the school makes each day.',
      explain: '第3文に、事務室近くの画面が学校が毎日作る電力を伝えるとあります。',
    },
    {
      q: 'Why did the number fall in June?',
      choices: [
        'Because clouds and rain continued for two weeks.',
        'Because the panels were broken.',
        'Because students forgot to check.',
        'Because the school used less power.',
      ],
      answer: 'Because clouds and rain continued for two weeks.',
      explain: '第6文で6月は雲と雨が数値を下げたと述べ、第7文で故障ではなく天気が本当の理由だと確認しています。',
    },
    {
      q: 'Why did families come to the gym after the typhoon?',
      choices: [
        'Because the lights there were still on.',
        'Because the school gave them free food.',
        'Because their houses were too hot.',
        'Because the science teacher asked them.',
      ],
      answer: 'Because the lights there were still on.',
      explain: '第11文の because 節に「そこの照明がまだついていたので」と理由が明示されています。',
    },
    {
      q: 'What is one limit of the solar panels?',
      choices: [
        'They cannot make enough power on dark winter days.',
        'They cannot be used during an emergency.',
        'They must be checked every morning.',
        'They make the classrooms too bright.',
      ],
      answer: 'They cannot make enough power on dark winter days.',
      explain: '第12文と第13文で、すべての問題は解決せず、暗い冬の日には十分な電力を作れないと述べています。',
    },
    {
      q: 'What change happened at home?',
      choices: [
        'Some families began checking their own use of electricity.',
        'Some families bought solar panels for their roofs.',
        'Some families stopped using the school website.',
        'Some families moved to another town.',
      ],
      answer: 'Some families began checking their own use of electricity.',
      explain: '最終文に、生徒が家でエネルギーの話をし、自分の使用量を確認する家庭もあるとあります。',
    },
  ],

  p_3_ai_class_rules: [
    {
      q: 'What did one teacher notice about the reports?',
      choices: [
        'Several reports used the same unusual phrase.',
        'Several reports were much shorter than before.',
        'Several reports had no title at all.',
        'Several reports were written by hand.',
      ],
      answer: 'Several reports used the same unusual phrase.',
      explain: '第4文に、いくつかの報告が同じ珍しい表現を使っていることに先生が気づいたとあります。',
    },
    {
      q: 'Why did the school not ban the tools?',
      choices: [
        'It asked each class to write its own rules instead.',
        'It could not check every student’s computer.',
        'It had already bought the tools for every class.',
        'It wanted students to finish homework faster.',
      ],
      answer: 'It asked each class to write its own rules instead.',
      explain: '第5文と第6文で、完全な禁止は望まず、代わりに各クラスへルール作成を求めたと述べています。',
    },
    {
      q: 'What did the short experiment show?',
      choices: [
        'The AI group finished faster but wrote general sentences.',
        'The AI group wrote longer and more exact summaries.',
        'Both groups finished at exactly the same time.',
        'The group without AI could not finish the task.',
      ],
      answer: 'The AI group finished faster but wrote general sentences.',
      explain: '第13文に、AIを使った組は速く終えたが文はしばしば一般的すぎたとあります。',
    },
    {
      q: 'What must students do under the new rules?',
      choices: [
        'List the source of every piece of information.',
        'Write every report without any digital tool.',
        'Send their first draft to the town library.',
        'Ask a teacher before starting any homework.',
      ],
      answer: 'List the source of every piece of information.',
      explain: '第17文に、それぞれの報告はあらゆる情報の出典を挙げなければならないと明記されています。',
    },
    {
      q: 'What does the teacher say the real skill is?',
      choices: [
        'Learning to judge information.',
        'Writing reports without help.',
        'Using new tools more quickly.',
        'Remembering many long words.',
      ],
      answer: 'Learning to judge information.',
      explain: '最終文で、情報を判断できるようになることが本当の力だと先生が述べています。',
    },
  ],

  p_pre2_crowded_town_tourism: [
    {
      q: 'Why did shops and restaurants welcome the visitors at first?',
      choices: [
        'Many young families had left the town.',
        'The council paid them to stay open longer.',
        'The shrine had been closed for many years.',
        'The buses had become cheaper for residents.',
      ],
      answer: 'Many young families had left the town.',
      explain: '第4文の because 節に、多くの若い家族が町を去っていたためだと理由が示されています。',
    },
    {
      q: 'What did the officials do before changing the bus service?',
      choices: [
        'They counted visitors and recorded the busiest hours.',
        'They asked the shrine to close on Saturdays.',
        'They stopped all tour buses for one season.',
        'They built a new road around the town.',
      ],
      answer: 'They counted visitors and recorded the busiest hours.',
      explain: '第11文と第12文で、3か所で来訪者を数え、混雑時間を記録してからバスを増やしたと分かります。',
    },
    {
      q: 'Why did some shop owners disagree with the fee?',
      choices: [
        'They feared that fewer buses would mean fewer customers.',
        'They thought the money would be used for the shrine.',
        'They wanted the town to build a larger parking area.',
        'They believed the streets were already quiet enough.',
      ],
      answer: 'They feared that fewer buses would mean fewer customers.',
      explain: '第18文に、バスが減れば客も減ると恐れたために反対したと書かれています。',
    },
    {
      q: 'What is the writer’s point in the last paragraph?',
      choices: [
        'Tourism must serve the people who live in the town every day.',
        'Tourism should be stopped until the streets become wider.',
        'Tourism brings only problems to small mountain towns.',
        'Tourism should be managed by the bus company alone.',
      ],
      answer: 'Tourism must serve the people who live in the town every day.',
      explain: '最終文で町長が、観光は毎日そこで暮らす人々の役に立たねばならないと述べています。',
    },
  ],

  p_pre2plus_rural_bus_future: [
    {
      q: 'What two problems does the first paragraph put together?',
      choices: [
        'Falling passenger numbers and drivers close to retirement.',
        'Rising fuel prices and damaged mountain roads.',
        'Longer routes and a shortage of hospitals.',
        'New railway lines and cheaper private cars.',
      ],
      answer: 'Falling passenger numbers and drivers close to retirement.',
      explain: '第2文で乗客の減少、第4文で運転手の高齢化が示され、二つが重なった課題として並べられます。',
    },
    {
      q: 'Why did the officials study one ordinary week of travel?',
      choices: [
        'To learn how residents actually traveled.',
        'To decide which company should be paid.',
        'To count the visitors from other prefectures.',
        'To prove that the old timetable was correct.',
      ],
      answer: 'To learn how residents actually traveled.',
      explain: '第9文に、住民が実際どう移動したかを調べたとあり、設計はその結果に基づいています。',
    },
    {
      q: 'What happened to the cost after the small bus began?',
      choices: [
        'It dropped by about a third for each trip.',
        'It rose because more drivers were needed.',
        'It stayed the same as the old timetable.',
        'It became higher than the taxi plan.',
      ],
      answer: 'It dropped by about a third for each trip.',
      explain: '第15文に、車両が小さいため1回の移動あたりの費用が約3分の1下がったとあります。',
    },
    {
      q: 'Which difficulty did the planners not expect?',
      choices: [
        'Some residents could not use the app or disliked booking.',
        'The small bus was too large for narrow roads.',
        'The taxi companies refused to carry passengers.',
        'The prefecture stopped paying for driver training.',
      ],
      answer: 'Some residents could not use the app or disliked booking.',
      explain: '第17文から第19文で、予約を嫌う高齢者と電波の弱さによる利用困難が「予想していなかった困難」として挙がります。',
    },
    {
      q: 'What does the writer say about the two plans at the end?',
      choices: [
        'Neither can succeed if no one is willing to drive.',
        'The taxi plan is clearly cheaper for every town.',
        'The booking bus removes the need for drivers.',
        'Both plans have already solved the problem.',
      ],
      answer: 'Neither can succeed if no one is willing to drive.',
      explain: '第23文で、運転する人がいなければどちらの方式も成功しないと述べ、運転手確保を共通の条件としています。',
    },
  ],

  p_2_space_debris: [
    {
      q: 'Why do operators move their satellites several times a year?',
      choices: [
        'To avoid possible collisions with other objects.',
        'To collect fragments left by old rockets.',
        'To send weather data to remote communities.',
        'To reach a higher and cheaper orbit.',
      ],
      answer: 'To avoid possible collisions with other objects.',
      explain: '第7文に、衝突の可能性を避けるため年に数回衛星を移動させているとあります。',
    },
    {
      q: 'What chain of events do the researchers describe?',
      choices: [
        'One collision creates fragments, which strike other objects and create more.',
        'One satellite fails, so operators launch two more to replace it.',
        'Fragments slowly burn away, so old orbits become safe again.',
        'Storms on the Earth push fragments into higher orbits.',
      ],
      answer: 'One collision creates fragments, which strike other objects and create more.',
      explain: '第10文と第11文で、一度の衝突が破片を生み、その破片がさらに衝突を生む連鎖が説明されています。',
    },
    {
      q: 'Why does a careful company gain no direct advantage?',
      choices: [
        'Because other companies may ignore the same risk.',
        'Because careful design costs nothing at all.',
        'Because insurance covers every kind of damage.',
        'Because agencies pay for all removal missions.',
      ],
      answer: 'Because other companies may ignore the same risk.',
      explain: '第22文に、他社が危険を無視すれば慎重に設計した企業も直接の利益を得られないとあります。',
    },
    {
      q: 'Which statement matches the writer’s view of current measures?',
      choices: [
        'They show that the problem is understood, not that it is solved.',
        'They prove that the crowded orbits are now safe.',
        'They remove the need for international agreement.',
        'They show that removal technology already works at scale.',
      ],
      answer: 'They show that the problem is understood, not that it is solved.',
      explain: '第29文がそのまま根拠で、理解と解決を区別する筆者の慎重な立場が示されます。',
    },
    {
      q: 'What does the last sentence suggest about orbits?',
      choices: [
        'They are a shared resource that fails when each user acts alone.',
        'They belong to the countries that launch the most satellites.',
        'They should be closed until removal missions are cheaper.',
        'They can be divided fairly among insurance companies.',
      ],
      answer: 'They are a shared resource that fails when each user acts alone.',
      explain: '最終文で軌道を共有資源と呼び、単独行動が資源を損なうという主張でまとめています。',
    },
  ],

  p_pre1_ai_and_work: [
    {
      q: 'How do careful studies describe the change?',
      choices: [
        'At the level of tasks rather than whole occupations.',
        'As the sudden disappearance of most occupations.',
        'As a change limited to factory work.',
        'As proof that earlier forecasts were correct.',
      ],
      answer: 'At the level of tasks rather than whole occupations.',
      explain: '第10文に、職業全体ではなく作業の水準で変化を記述するとあり、本文全体の枠組みになっています。',
    },
    {
      q: 'Why does the writer mention cash machines and bank clerks?',
      choices: [
        'To show that employment did not collapse when routine work was automated.',
        'To prove that automation always creates more jobs than it removes.',
        'To argue that banks should not use any new technology.',
        'To explain why bank clerks needed longer training.',
      ],
      answer: 'To show that employment did not collapse when routine work was automated.',
      explain: '第16文から第18文で、定型業務が減っても20年間雇用が崩れなかった例として挙げられています。',
    },
    {
      q: 'What warning does the writer add to that example?',
      choices: [
        'Aggregate stability can hide serious harm to particular regions and age groups.',
        'Every worker gains from automation within a few years.',
        'Retraining programs always reach the workers who need them.',
        'Older workers move easily to new cities for new jobs.',
      ],
      answer: 'Aggregate stability can hide serious harm to particular regions and age groups.',
      explain: '第21文で、全体の安定が特定の地域や年齢層への打撃を覆い隠しうると注意しています。',
    },
    {
      q: 'Which question does the writer call the most misleading?',
      choices: [
        'Whether machines will take our jobs.',
        'Who decides how these systems are used.',
        'Who is protected during the transition.',
        'How any productivity gain is shared.',
      ],
      answer: 'Whether machines will take our jobs.',
      explain: '第40文で最も誤解を招く問いだと述べ、最終文でより有益な問いを示しています。',
    },
  ],

  p_1_synthetic_media_trust: [
    {
      q: 'According to the writer, where did the old authority of a photograph come from?',
      choices: [
        'From a production process that was expensive, slow, and hard to conceal.',
        'From the image itself, which could not be changed at all.',
        'From laws that punished anyone who altered a picture.',
        'From the training that ordinary readers received at school.',
      ],
      answer: 'From a production process that was expensive, slow, and hard to conceal.',
      explain: '第2文と第3文で、権威は画像そのものではなく費用と時間のかかる制作過程に依存していたと述べています。',
    },
    {
      q: 'What is the second danger described in the passage?',
      choices: [
        'Genuine evidence can be dismissed once audiences know anything can be faked.',
        'False recordings become easier to detect as tools improve.',
        'Officials lose the right to answer accusations in public.',
        'Corrections spread faster than the material they answer.',
      ],
      answer: 'Genuine evidence can be dismissed once audiences know anything can be faked.',
      explain: '第15文から第19文で、疑いが安価になり本物の証拠まで否定できる「配当」が説明されています。',
    },
    {
      q: 'Why does the writer call the detection contest asymmetric?',
      choices: [
        'One success is enough for an attacker, but a verifier needs consistent reliability.',
        'Detection software is far more expensive than generation software.',
        'Only large newsrooms are allowed to publish detection results.',
        'Compressed files can never be examined by any tool.',
      ],
      answer: 'One success is enough for an attacker, but a verifier needs consistent reliability.',
      explain: '第24文に非対称性の理由が明示され、検出だけに頼れないという結論につながります。',
    },
    {
      q: 'Which statement best matches the writer’s conclusion?',
      choices: [
        'A claim should be judged by independent records and institutions that can be questioned.',
        'Provenance systems alone can restore trust in every image.',
        'Audiences should doubt every photograph they are shown.',
        'Platform labels are the strongest available protection.',
      ],
      answer: 'A claim should be judged by independent records and institutions that can be questioned.',
      explain: '第53文から最終文で、単一のファイルではなく独立した記録・証言・問いただせる制度を重ねる立場を示しています。',
    },
  ],
})
