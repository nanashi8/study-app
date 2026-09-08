// 分野長文の内容理解問題。
// 各設問は本文の一か所へ戻れる根拠を持ち、explain で日本語の根拠を示す。

export const FIELD_READING_QUESTIONS = Object.freeze({
  p_pre2_pond_comeback: [
    {
      q: 'Why had the number of the foreign fish grown so quickly?',
      choices: [
        'Because the fish had no natural enemy in the area.',
        'Because the water of the pond was badly polluted.',
        'Because the club fed the fish every Saturday.',
        'Because the prefecture asked residents to keep the fish.',
      ],
      answer: 'Because the fish had no natural enemy in the area.',
      explain: '第10文に「その魚にはここで天敵がいないので、その数は急速に増えていました」とあり、増加の理由が示されています。第6文は水質が悪くないと述べており、汚染は理由ではありません。',
    },
    {
      q: 'What did the data from six months show?',
      choices: [
        'The pond needed a deeper bank.',
        'The number of the foreign fish went down steadily.',
        'The temperature of the water rose every week.',
        'The insects came back before the frogs.',
      ],
      answer: 'The number of the foreign fish went down steadily.',
      explain: '第14文の “revealed a steady decline in the foreign population” が根拠です。着実な減少という数値の変化を問う設問です。',
    },
    {
      q: 'Why did the club agree to continue the survey?',
      choices: [
        'Because the city office stopped paying for the nets.',
        'Because the members wanted a longer festival report.',
        'Because a damaged habitat needs several seasons to become stable.',
        'Because the foreign fish had completely disappeared.',
      ],
      answer: 'Because a damaged habitat needs several seasons to become stable.',
      explain: '第18文で先生が「傷んだ生息地が安定するには数季節が必要だ」と説明し、第19文の「そこで（therefore）続けることに同意した」につながります。',
    },
    {
      q: 'What do the students think after the project?',
      choices: [
        'Protecting a habitat is much harder than damaging it.',
        'A pond is too small to teach anyone anything.',
        'The town should sell the land behind the school.',
        'Only scientists can record water conditions.',
      ],
      answer: 'Protecting a habitat is much harder than damaging it.',
      explain: '第24文の “it is much harder to protect a habitat than to damage one” が根拠です。最後の段落の筆者・生徒の結論を問う設問です。',
    },
  ],
  p_pre2_morning_market: [
    {
      q: 'What can customers ask the producers about?',
      choices: [
        'The name of the town station.',
        'The soil, the water and the harvest.',
        'The salary of each volunteer.',
        'The price of the trucks.',
      ],
      answer: 'The soil, the water and the harvest.',
      explain: '第7文で生産者が農場名をカードに書き、第8文で「だから客は土や水や収穫について尋ねられる」と続きます。名前を書くことが質問を可能にしている流れです。',
    },
    {
      q: 'Why do the volunteers check the temperature and the moisture?',
      choices: [
        'Because visitors want a warmer market.',
        'Because the trucks need a cool engine.',
        'Because local rules regulate the handling of fresh food.',
        'Because the club uses the numbers in a cooking workshop.',
      ],
      answer: 'Because local rules regulate the handling of fresh food.',
      explain: '第14文の「地元の規則が生鮮食品の取り扱いを規制し、市場はそれに厳密に従う」が、第15文の点検と第16文の役所への報告の理由です。',
    },
    {
      q: 'What happens to the sellers in wet weather?',
      choices: [
        'They carry the loss themselves.',
        'The town office pays the fee for them.',
        'They sell more leaf vegetables than usual.',
        'They move the market into the station.',
      ],
      answer: 'They carry the loss themselves.',
      explain: '第20文に「雨の多い気候では訪れる世帯が少なく、売り手が自分でその損失を負う」とあります。費用の負担がだれに残るかを問う設問です。',
    },
    {
      q: 'What do the producers value most?',
      choices: [
        'A large profit in a single season.',
        'A longer list of requirements.',
        'A wider road in front of the station.',
        'Steady growth and a place for people.',
      ],
      answer: 'Steady growth and a place for people.',
      explain: '第28文の「着実な成長のほうが大きな利益よりよい」と、第29文の「市場は人々を集める場所で、商品は二の次」が根拠です。最終段落の主張を問う設問です。',
    },
  ],
  p_2_injury_free_practice: [
    {
      q: 'When did most of the damage appear?',
      choices: [
        'After a sudden rise in weekly distance.',
        'After the club moved practice to the morning.',
        'After the school council joined the club.',
        'After the members began to use a cheap device.',
      ],
      answer: 'After a sudden rise in weekly distance.',
      explain: '第7文の “Most damage appeared after a sudden rise in weekly distance.” が根拠です。記録から見えた第一の要因を問う設問です。',
    },
    {
      q: 'Why did the mentor separate the report of pain from the choice of members?',
      choices: [
        'Because the teacher wanted a shorter practice.',
        'Because the school council asked for the change.',
        'Because students had hidden pains out of anxiety.',
        'Because the budget did not cover a second device.',
      ],
      answer: 'Because students had hidden pains out of anxiety.',
      explain: '第19文と第20文で、生徒が「チームでの場所を失う不安」から痛みを隠していたことが述べられ、第21文の切り離しにつながります。',
    },
    {
      q: 'What does the cheap device at the field do?',
      choices: [
        'It records the distance of every member.',
        'It shows the temperature and the humidity.',
        'It sends the results to the school council.',
        'It stops the practice by itself.',
      ],
      answer: 'It shows the temperature and the humidity.',
      explain: '第16文の “A cheap device shows the temperature and the humidity at the field.” が根拠です。練習を止める判断は第17文でリーダーが行います。',
    },
    {
      q: 'What happened in the second year?',
      choices: [
        'The club trained for more hours than before.',
        'The number of hurt members fell from nine to one.',
        'The mentor left the club after the first season.',
        'The team stopped keeping records of pain.',
      ],
      answer: 'The number of hurt members fell from nine to one.',
      explain: '第26文が数の変化を示し、第27文で「だれも長く練習していないのに成績は良くなった」と続きます。',
    },
    {
      q: 'What limit does the mentor point out?',
      choices: [
        'The device is too expensive for a school club.',
        'The school council does not accept the method.',
        'Members refuse to report pain in the second year.',
        'Records cannot predict every accident.',
      ],
      answer: 'Records cannot predict every accident.',
      explain: '第31文と第32文で「記録はすべての事故を予測できない」「一部の損傷は古い傷から生じる」と限界が述べられています。',
    },
  ],
  p_2_factory_museum: [
    {
      q: 'What did the town council plan at first?',
      choices: [
        'To pull the building down.',
        'To open a museum of the local economy.',
        'To rent the building to young makers.',
        'To repair the roof over ten years.',
      ],
      answer: 'To pull the building down.',
      explain: '第5文の “The town council first planned to pull the building down.” が根拠です。first が最初の方針であることを示しています。',
    },
    {
      q: 'Why did the study of the costs discourage the town?',
      choices: [
        'Because the museum needed a large staff.',
        'Because no company wanted to buy the land.',
        'Because repair and old waste demanded a large sum.',
        'Because former workers refused to guide visitors.',
      ],
      answer: 'Because repair and old waste demanded a large sum.',
      explain: '第12文の屋根と金属の壁の修理、第13文の古い塗料と化学廃棄物が費用を押し上げたことが根拠です。',
    },
    {
      q: 'How would the second plan produce money?',
      choices: [
        'By selling the land to a private company.',
        'By rent from small workshops in the building.',
        'By a large gift from the local economy.',
        'By a higher price for each museum ticket.',
      ],
      answer: 'By rent from small workshops in the building.',
      explain: '第18文と第19文で、建物の半分に小さな仕事場を入れ、その家賃が安定した収入を生む計画だと述べられています。',
    },
    {
      q: 'What do former workers do at the museum?',
      choices: [
        'They clean the machines every morning.',
        'They pay a part of the public money.',
        'They decide the plan of each project.',
        'They lead the tours and explain each machine.',
      ],
      answer: 'They lead the tours and explain each machine.',
      explain: '第27文が根拠です。第23文の掃除はボランティア、第25文の運営は地元の組織が担っています。',
    },
    {
      q: 'What does the writer say about the result?',
      choices: [
        'It is not a complete success.',
        'It has removed the debt of the town.',
        'It shows that every old building can be kept.',
        'It has closed the museum after four years.',
      ],
      answer: 'It is not a complete success.',
      explain: '第32文で「完全な成功ではない」と述べ、第33文と第34文で閉じたままの棟、雨漏り、公的な資金への依存を挙げています。',
    },
  ],
  p_pre2_school_radio: [
    {
      q: 'What did the survey tell the club?',
      choices: [
        'The lunch program was too long.',
        'The voices were too fast and the topics felt far away.',
        'The school needed a second radio room.',
        'The members had to read more books.',
      ],
      answer: 'The voices were too fast and the topics felt far away.',
      explain: '第7文と第8文が調査の結果です。第6文で意見が率直だったと述べ、その中身がこの二点だと続きます。',
    },
    {
      q: 'What does an older student check before the program?',
      choices: [
        'The speed and the volume of the reading.',
        'The names of every teacher in the school.',
        'The weather for the next morning.',
        'The number of listeners in the halls.',
      ],
      answer: 'The speed and the volume of the reading.',
      explain: '第12文が根拠です。第11文で各部員が原稿を書いて読む手順が示され、その次の確認を上級生が行います。',
    },
    {
      q: 'How did the club treat the students in the election?',
      choices: [
        'It asked the town office to choose the topics.',
        'It gave the same three minutes to each student.',
        'It read only the name of the winner.',
        'It stopped the lunch program during the election.',
      ],
      answer: 'It gave the same three minutes to each student.',
      explain: '第20文の “the club gave the same three minutes to each student” が根拠です。公平な扱いを問う設問です。',
    },
    {
      q: 'What is the club ready to do in an emergency?',
      choices: [
        'To repair the school bell by itself.',
        'To send reporters to the town office.',
        'To carry the announcement from the radio room.',
        'To collect a new survey from the audience.',
      ],
      answer: 'To carry the announcement from the radio room.',
      explain: '第27文で非常時の役割が示され、第28文で「災害が学校のチャイムを止めたら放送室が知らせを伝える」と具体化されています。',
    },
  ],
  p_2_disaster_translators: [
    {
      q: 'Why did the foreign residents stay at home during the first typhoon?',
      choices: [
        'Because the message never reached their phones.',
        'Because the town office sent the warning too late.',
        'Because the wording and the translation hid the urgency.',
        'Because the shelter in their area was already full.',
      ],
      answer: 'Because the wording and the translation hid the urgency.',
      explain: '第3文で知らせは1分以内に全員へ届いたと述べられ、第6文から第8文で古い言い回しと機械翻訳の誤りが原因だと示されます。',
    },
    {
      q: 'What does each rewritten notice keep?',
      choices: [
        'One idea, one action and a short sentence.',
        'The same official words as before.',
        'A long explanation for every reader.',
        'Three languages on the same page.',
      ],
      answer: 'One idea, one action and a short sentence.',
      explain: '第13文の “Each notice keeps one idea, one action and a short sentence.” が根拠です。書き直しの基準を問う設問です。',
    },
    {
      q: 'Why did the town need more than translation?',
      choices: [
        'Because the town office had no budget for printing.',
        'Because people were needed who could interpret in the shelter.',
        'Because the teachers refused to write the notices.',
        'Because the warning levels changed every year.',
      ],
      answer: 'Because people were needed who could interpret in the shelter.',
      explain: '第17文の「翻訳だけでは解決しなかった」に続き、第18文で避難所そのもので通訳できる人が必要だったと述べられています。',
    },
    {
      q: 'What happened when the second typhoon came?',
      choices: [
        'The town office stopped using easy Japanese.',
        'The group lost its network of neighbors.',
        'Machine translation replaced the interpreters.',
        'Most foreign residents left their homes on time.',
      ],
      answer: 'Most foreign residents left their homes on time.',
      explain: '第27文と第28文が結果を示し、第29文で年配の日本人の隣人もやさしい知らせを使ったと続きます。',
    },
    {
      q: 'What does the group say about real safety?',
      choices: [
        'It grows from contact between people in ordinary times.',
        'It depends on the speed of machine translation.',
        'It needs one interpreter for every language.',
        'It begins when a warning reaches every phone.',
      ],
      answer: 'It grows from contact between people in ordinary times.',
      explain: '第37文が結論です。第32文から第35文で限界を認めたうえで、第36文の「最後には近所のつながりに頼る」へつながります。',
    },
  ],
})
