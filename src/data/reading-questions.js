// 長文ごとの内容理解問題。
// answer は choices の文字列と完全一致させ、表示時は正解位置を安定的に分散する。
import { EXAM_READING_QUESTIONS } from './reading-questions-exam.js'

export const READING_QUESTIONS = {
  ...EXAM_READING_QUESTIONS,
  p_5_lost_notebook: [
    {
      q: 'How does Rina go to school every morning?',
      choices: ['By bus.', 'By train.', 'By bicycle.', 'On foot.'],
      answer: 'By bus.',
      explain: '第2文の “She goes to school by bus every morning.” が根拠です。',
    },
    {
      q: 'Where does Ken find Rina’s notebook?',
      choices: [
        'Near the classroom door.',
        'Under a bus seat.',
        'In the music room.',
        'Next to the teacher’s desk.',
      ],
      answer: 'Near the classroom door.',
      explain: 'Ken sees the notebook near the classroom door.',
    },
    {
      q: 'Why is Rina happy at the end?',
      choices: [
        'She can use her story in English class.',
        'She can go home before lunch.',
        'She has no science class.',
        'Her teacher gives her a new notebook.',
      ],
      answer: 'She can use her story in English class.',
      explain: '最後の文に、書いた物語を英語の授業で使えるのでうれしいとあります。',
    },
  ],

  p_4_library_event: [
    {
      q: 'What is this month’s topic at Green Town Library?',
      choices: ['Local history.', 'River animals.', 'Music from abroad.', 'Healthy lunches.'],
      answer: 'Local history.',
      explain: '“This month, the topic is local history.” と明記されています。',
    },
    {
      q: 'What will the children do after Ms. Brown’s talk?',
      choices: [
        'Build a paper model of the old station.',
        'Walk to the river with their parents.',
        'Write a story about a new train.',
        'Clean the library before lunch.',
      ],
      answer: 'Build a paper model of the old station.',
      explain: '話の後、小グループで古い駅の紙模型を作ります。',
    },
    {
      q: 'What should people bring to the event?',
      choices: ['A pencil.', 'Some glue.', 'Old photographs.', 'Money for a ticket.'],
      answer: 'A pencil.',
      explain: '紙とのりは図書館が用意し、参加者は鉛筆を持参します。',
    },
    {
      q: 'Why do many families come early?',
      choices: [
        'The room is not very large.',
        'The event begins before the library opens.',
        'The models are free only in the morning.',
        'Ms. Brown leaves at ten.',
      ],
      answer: 'The room is not very large.',
      explain: '部屋が広くなく、満員になる可能性があるためです。',
    },
    {
      q: 'What is the passage mainly about?',
      choices: [
        'A monthly library event where children learn local history.',
        'A plan to build a new station beside the library.',
        'A website that sells books and craft materials.',
        'A librarian who wants families to donate old pictures.',
      ],
      answer: 'A monthly library event where children learn local history.',
      explain: '日時、内容、持ち物、参加上の注意をまとめたイベント案内です。',
    },
  ],

  p_3_school_garden: [
    {
      q: 'Why did the tomatoes not grow well during the first week?',
      choices: [
        'Some students forgot their jobs.',
        'The garden did not get any sunlight.',
        'The teacher removed the young plants.',
        'Older residents picked them too early.',
      ],
      answer: 'Some students forgot their jobs.',
      explain: '最初の週は担当の仕事を忘れる生徒がいたことが原因です。',
    },
    {
      q: 'What did the science teacher ask each group to do?',
      choices: [
        'Make a schedule and record the weather.',
        'Move the garden inside the school.',
        'Buy vegetables from a community center.',
        'Use a chemical spray every morning.',
      ],
      answer: 'Make a schedule and record the weather.',
      explain: '予定表を作り、天気について短い記録を書くよう求めました。',
    },
    {
      q: 'How did the class respond to the insects eating the leaves?',
      choices: [
        'They planted flowers that attract helpful insects.',
        'They stopped growing vegetables for the summer.',
        'They covered every plant with strong chemicals.',
        'They asked the community center to remove the insects.',
      ],
      answer: 'They planted flowers that attract helpful insects.',
      explain: '害虫を食べる虫を引き寄せる花を菜園の周りに植えました。',
    },
    {
      q: 'What did the older residents do when the students visited them?',
      choices: [
        'They shared recipes and suggested autumn vegetables.',
        'They asked the students to sell all the food.',
        'They built a new garden behind the school.',
        'They taught the class how to use chemical sprays.',
      ],
      answer: 'They shared recipes and suggested autumn vegetables.',
      explain: '年配の住民はレシピと秋に植える野菜の案を伝えました。',
    },
    {
      q: 'What is one lesson the students learned?',
      choices: [
        'Small daily actions and cooperation can help the environment.',
        'Only experts should decide how vegetables are grown.',
        'Gardening becomes easy when people ignore the weather.',
        'A school project should always end after one term.',
      ],
      answer: 'Small daily actions and cooperation can help the environment.',
      explain: '日々の世話、調査、地域との交流が環境保護と活動の継続につながりました。',
    },
  ],

  p_pre2_museum_volunteers: [
    {
      q: 'What do the volunteers do before the museum opens?',
      choices: [
        'They learn about the exhibition and practice explaining it.',
        'They sell worksheets to families with children.',
        'They move old buildings into the museum.',
        'They write college reports for the staff.',
      ],
      answer: 'They learn about the exhibition and practice explaining it.',
      explain: '開館前に展示を学び、地図やワークシートを準備して説明を練習します。',
    },
    {
      q: 'What are volunteers taught to do when they do not know an answer?',
      choices: [
        'Admit it and ask a staff member for help.',
        'Give the visitor their best guess.',
        'Tell the visitor to leave the museum.',
        'Remove the object from the display.',
      ],
      answer: 'Admit it and ask a staff member for help.',
      explain: '不確かな情報を伝えず、分からないと認めて職員に助けを求めます。',
    },
    {
      q: 'How did the program affect the student who answered foreign visitors?',
      choices: [
        'She became more confident.',
        'She decided museums were too crowded.',
        'She stopped studying local culture.',
        'She became unwilling to answer questions.',
      ],
      answer: 'She became more confident.',
      explain: '外国人来館者の質問に答えたことで自信がついたと述べています。',
    },
    {
      q: 'How does the museum use the students’ point of view?',
      choices: [
        'It improves labels and plans exhibitions from visitor feedback.',
        'It lets students choose which objects the museum will sell.',
        'It replaces all adult staff members with students.',
        'It writes longer explanations only for history experts.',
      ],
      answer: 'It improves labels and plans exhibitions from visitor feedback.',
      explain: '学生に説明文を読んでもらい、よくある質問の記録を将来の展示にも生かします。',
    },
  ],

  p_pre2plus_repair_cafes: [
    {
      q: 'Why do some usable products become waste?',
      choices: [
        'Buying a new item is often easier than finding someone to repair the old one.',
        'Communities do not allow people to keep old household devices.',
        'Manufacturers always replace broken products without charge.',
        'Repair cafes ask visitors to throw away anything they cannot open.',
      ],
      answer: 'Buying a new item is often easier than finding someone to repair the old one.',
      explain: '新品購入の方が修理先を探すより容易なことが、まだ使える製品の廃棄につながります。',
    },
    {
      q: 'How is a repair cafe different from a normal repair shop?',
      choices: [
        'Visitors are expected to take part in the repair work.',
        'Only manufacturers are allowed to examine broken items.',
        'Every repair is completed without tools or instructions.',
        'Visitors must buy a replacement before asking for help.',
      ],
      answer: 'Visitors are expected to take part in the repair work.',
      explain: '品物を預けるだけでなく、来場者自身もボランティアと一緒に作業します。',
    },
    {
      q: 'What is one environmental benefit of repair cafes?',
      choices: [
        'They reduce waste and demand for resources used in new goods.',
        'They make all modern products cheaper to manufacture.',
        'They prevent older residents from using household machines.',
        'They require families to purchase more replacement parts.',
      ],
      answer: 'They reduce waste and demand for resources used in new goods.',
      explain: '製品寿命を延ばすことで、ごみと新品製造に必要な資源・エネルギー需要を減らします。',
    },
    {
      q: 'What challenge do repair cafes sometimes face?',
      choices: [
        'Parts may be unavailable, and some products are difficult to open.',
        'Young people refuse to search for digital information.',
        'Visitors are never interested in learning practical skills.',
        'Local volunteers are required to accept dangerous jobs.',
      ],
      answer: 'Parts may be unavailable, and some products are difficult to open.',
      explain: '交換部品の不足や価格、特殊な工具なしでは開けにくい設計が障害になります。',
    },
    {
      q: 'What does the author suggest is the greatest value of repair cafes?',
      choices: [
        'They turn broken objects into public lessons about consumption and responsibility.',
        'They can force manufacturers to change every product immediately.',
        'They guarantee that consumers will never need to buy new devices.',
        'They make professional repair shops unnecessary in every community.',
      ],
      answer: 'They turn broken objects into public lessons about consumption and responsibility.',
      explain: '個人的な故障を、ごみ・技能・責任について地域で学ぶ機会へ変える点が結論です。',
    },
  ],

  p_2_quiet_technology: [
    {
      q: 'How do station sensors help passengers?',
      choices: [
        'They show where the platform is less crowded.',
        'They decide which train every passenger must take.',
        'They make trains travel faster between stations.',
        'They prevent parents from traveling with children.',
      ],
      answer: 'They show where the platform is less crowded.',
      explain: '混雑情報を表示板やアプリへ送り、乗客が空いている場所を選べるようにします。',
    },
    {
      q: 'Why does the author mention quiet air-control systems in libraries?',
      choices: [
        'To show that useful technology can improve an experience without attracting attention.',
        'To prove that libraries should replace reading rooms with digital services.',
        'To explain why older equipment always protects privacy better.',
        'To argue that visitors should control public buildings themselves.',
      ],
      answer: 'To show that useful technology can improve an experience without attracting attention.',
      explain: '目立たなくても快適さと省エネルギーに役立つ技術の例として挙げています。',
    },
    {
      q: 'What should officials explain about sensor systems?',
      choices: [
        'What data is collected and how it is protected.',
        'Why every old bus stop must be removed.',
        'How passengers can avoid paying fares.',
        'Which neighborhoods complain the least.',
      ],
      answer: 'What data is collected and how it is protected.',
      explain: 'プライバシーへの懸念に対し、収集内容と保護方法の説明が必要だとしています。',
    },
    {
      q: 'Why have some cities begun small trial programs?',
      choices: [
        'To compare evidence before deciding whether wider introduction is useful.',
        'To make sure only wealthy areas receive new systems.',
        'To hide complaints from residents in different neighborhoods.',
        'To avoid maintaining any technology for more than one year.',
      ],
      answer: 'To compare evidence before deciding whether wider introduction is useful.',
      explain: 'エネルギー使用、待ち時間、苦情を比較し、改善や別案の判断に使います。',
    },
    {
      q: 'Which statement best expresses the author’s main point?',
      choices: [
        'Technology should be judged by the real problems it solves and the people it serves.',
        'The most successful public technology is always the most expensive.',
        'Cities should introduce digital systems before considering simpler repairs.',
        'Invisible technology is useful only when residents do not know it exists.',
      ],
      answer: 'Technology should be judged by the real problems it solves and the people it serves.',
      explain: '見た目の新しさではなく、実際の効果、公平性、維持可能性で評価すべきだという主張です。',
    },
  ],

  p_pre1_resilient_cities: [
    {
      q: 'Why do many planners support a broader framework for city policy?',
      choices: [
        'A measure in one area can create consequences in another.',
        'Floods, heat waves, and energy demand are completely unrelated.',
        'Every district has the same resources and vulnerabilities.',
        'Technical knowledge has become unnecessary for adaptation.',
      ],
      answer: 'A measure in one area can create consequences in another.',
      explain: '洪水対策が下流へ水を押しやる例など、単一目的の対策が別分野へ影響するためです。',
    },
    {
      q: 'Which situation is presented as an example of maladaptation?',
      choices: [
        'A new park raises rents and displaces residents who were meant to benefit.',
        'Residents add blocked drains to a map used by city officials.',
        'Volunteers receive warnings in several languages during an emergency.',
        'A government publishes review dates before revising a policy.',
      ],
      answer: 'A new park raises rents and displaces residents who were meant to benefit.',
      explain: '暑さを減らす公園が家賃上昇と転居を招き、別の不平等を深める例です。',
    },
    {
      q: 'How can local knowledge improve adaptation planning?',
      choices: [
        'It can reveal practical failures that models or official maps overlook.',
        'It eliminates the need for scientific data and additional measurement.',
        'It prevents residents from disagreeing about project priorities.',
        'It guarantees that large infrastructure will be less expensive.',
      ],
      answer: 'It can reveal practical failures that models or official maps overlook.',
      explain: '排水口の詰まりのように、住民の経験がモデルで見えない問題を示します。',
    },
    {
      q: 'Which approach would the author most likely support?',
      choices: [
        'Combining evidence and participation with fair distribution and regular policy review.',
        'Copying a visible project from another city without studying local conditions.',
        'Evaluating a project only in the year when politicians announce it.',
        'Treating later policy revision as proof that the original planners failed.',
      ],
      answer: 'Combining evidence and participation with fair distribution and regular policy review.',
      explain: '地域の証拠、市民参加、費用と恩恵の分配、長期評価、柔軟な見直しを統合する立場です。',
    },
  ],

  p_1_collective_memory: [
    {
      q: 'What paradox of digital abundance does the author identify?',
      choices: [
        'More stored information can coexist with less public attention to demanding material.',
        'The cost of storage inevitably causes institutions to destroy their oldest records.',
        'Digital files become more influential whenever their quantity increases.',
        'Algorithmic recommendations make every historical perspective equally visible.',
      ],
      answer: 'More stored information can coexist with less public attention to demanding material.',
      explain: '保存量は増えても、注意配分や検索順位によって重要資料が見えなくなる逆説です。',
    },
    {
      q: 'Why does the author reject neutrality and participation as automatic solutions?',
      choices: [
        'Selection is unavoidable, and participation can reproduce unequal power.',
        'Archives can preserve every item without making descriptive choices.',
        'Only political institutions are capable of interpreting historical evidence.',
        'Public consultation always prevents organized groups from influencing decisions.',
      ],
      answer: 'Selection is unavoidable, and participation can reproduce unequal power.',
      explain: '保存対象・記述・資源配分の選択は避けられず、公開協議でも声の大きさに格差が生じ得ます。',
    },
    {
      q: 'What intellectual discipline should education cultivate?',
      choices: [
        'Explaining interpretations, confronting contrary evidence, and marking the limits of certainty.',
        'Treating disagreement between historians as proof that evidence is useless.',
        'Replacing difficult historical narratives with a single national consensus.',
        'Rejecting every revision of the past as deliberate political distortion.',
      ],
      answer: 'Explaining interpretations, confronting contrary evidence, and marking the limits of certainty.',
      explain: '異なる解釈の理由を説明し、反証と向き合い、確実性の限界を示す姿勢です。',
    },
    {
      q: 'Which platform policy is most consistent with the author’s argument?',
      choices: [
        'Moderation combined with accessible evidence, independent review, and visible reasoning.',
        'Giving private platforms final authority without requiring explanations.',
        'Removing all disputed historical claims before users can examine them.',
        'Abandoning moderation because any intervention limits public memory.',
      ],
      answer: 'Moderation combined with accessible evidence, independent review, and visible reasoning.',
      explain: '管理を放棄も絶対化もせず、証拠・独立審査・検討可能な説明と組み合わせる立場です。',
    },
  ],
}

export const READING_QUESTION_COUNTS = Object.freeze({
  5: 3,
  4: 5,
  3: 5,
  pre2: 4,
  pre2plus: 5,
  2: 5,
  pre1: 4,
  1: 4,
})

const choiceSeed = (text) => {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (Math.imul(hash, 31) + text.charCodeAt(i)) >>> 0
  }
  return hash
}

const arrangeChoices = (choices, seedText) => {
  const offset = choiceSeed(seedText) % choices.length
  return choices.map((_, index) => choices[(index + offset) % choices.length])
}

export const getReadingQuestions = (passageId) =>
  (READING_QUESTIONS[passageId] ?? []).map((question) => ({
    ...question,
    choices: arrangeChoices(question.choices, `${passageId}:${question.q}`),
  }))
