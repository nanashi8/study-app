const question = ({ id, q, questionJa, choices, answer, explain }) => {
  const englishChoices = choices.map(([en]) => en)
  const translations = Object.freeze(Object.fromEntries(choices))
  return Object.freeze({
    id,
    q,
    questionJa,
    choices: Object.freeze(englishChoices),
    answer,
    answerJa: translations[answer],
    choiceTranslations: translations,
    explain,
  })
}

const freezeQuestions = (items) => Object.freeze(items.map(question))

export const EXTENDED_READING_QUESTIONS = Object.freeze({
  p_ext_1000_civic_decisions: freezeQuestions([
    {
      id: 'erq_civic_01',
      q: 'How does the opening section describe representation?',
      questionJa: '最初の節は「代表」をどのように説明していますか。',
      choices: [
        ['As a practice rather than a title.', '肩書ではなく実践として。'],
        ['As a reward for avoiding public debate.', '公的な議論を避けた報酬として。'],
        ['As a legal status that can never change.', '決して変わらない法的地位として。'],
        ['As a private skill used only at school.', '学校でだけ使う私的な技能として。'],
      ],
      answer: 'As a practice rather than a title.',
      explain: '「声と代表」の導入で representation is a practice rather than a title と対比しています。',
    },
    {
      id: 'erq_civic_02',
      q: 'What happens when important information is hidden or hard to verify?',
      questionJa: '重要な情報が隠され、検証しにくいとどうなりますか。',
      choices: [
        ['Citizens cannot compare proposals.', '市民は提案を比較できません。'],
        ['Every proposal becomes less expensive.', 'どの提案もより安くなります。'],
        ['Legal duties disappear automatically.', '法的義務が自動的になくなります。'],
        ['Media no longer need education.', 'メディアは教育を必要としなくなります。'],
      ],
      answer: 'Citizens cannot compare proposals.',
      explain: '「議論の前に必要な情報」の導入文が、検証できない情報と提案比較の不可能さを直接結び付けています。',
    },
    {
      id: 'erq_civic_03',
      q: 'Why does the text connect budgets with public promises?',
      questionJa: '本文はなぜ予算と公的な約束を結び付けていますか。',
      choices: [
        ['Every promise uses resources that could serve another goal.', 'どの約束も、別の目的に使えた資源を使うから。'],
        ['Public promises never require labor or time.', '公的な約束には労働も時間も必要ないから。'],
        ['Economic examples always prove one slogan correct.', '経済の事例は必ず一つの主張を正しいと証明するから。'],
        ['Money is the only public resource that matters.', '金銭だけが重要な公共資源だから。'],
      ],
      answer: 'Every promise uses resources that could serve another goal.',
      explain: '導入は time, labor, money, or another resource を並べ、他の目的に使えた資源との選択を示しています。',
    },
    {
      id: 'erq_civic_04',
      q: 'What balance should a democratic choice maintain?',
      questionJa: '民主的な選択はどのような均衡を保つべきですか。',
      choices: [
        ['It should guide action and remain open to revision.', '行動を導きつつ、見直しに開かれているべきです。'],
        ['It should remain vague and never guide action.', '曖昧なままで、決して行動を導かないべきです。'],
        ['It should treat every correction as defeat.', 'あらゆる修正を敗北とみなすべきです。'],
        ['It should exclude evidence after a decision.', '決定後は証拠を排除すべきです。'],
      ],
      answer: 'It should guide action and remain open to revision.',
      explain: '最終節は firm enough to guide action と open enough to be revised を and で並べ、両方を条件にしています。',
    },
  ]),

  p_ext_2000_customs_across_borders: freezeQuestions([
    {
      id: 'erq_customs_01',
      q: 'When does a custom often become visible to a visitor?',
      questionJa: '風習は旅行者にとっていつ見えやすくなりますか。',
      choices: [
        ['When the visitor expects people to act differently.', '旅行者が人々に別の振る舞いを予想するとき。'],
        ['When every community follows the same rule.', 'どの共同体も同じ規則に従うとき。'],
        ['When no one notices differences in behavior.', '行動の違いに誰も気づかないとき。'],
        ['When the visitor avoids all local people.', '旅行者が地域の人々をすべて避けるとき。'],
      ],
      answer: 'When the visitor expects people to act differently.',
      explain: '最初の導入文は becomes visible only when ... expects people to act differently と、予想と実際の差を条件にしています。',
    },
    {
      id: 'erq_customs_02',
      q: 'How can one festival be described according to the text?',
      questionJa: '本文によると、一つの祭りはどのように説明できますか。',
      choices: [
        ['It may have several religious, seasonal, historical, or commercial meanings at once.', '宗教的、季節的、歴史的、商業的な意味を同時に複数持ちえます。'],
        ['It must have only one unchanging religious meaning.', '変わらない宗教的意味を一つだけ持たねばなりません。'],
        ['It becomes meaningless when music is included.', '音楽が含まれると意味を失います。'],
        ['It can preserve ideas only through one speech.', '一つの演説によってだけ考えを保存できます。'],
      ],
      answer: 'It may have several religious, seasonal, historical, or commercial meanings at once.',
      explain: '「祭り・信仰・日常生活」の導入が may と several of these at once を使い、複数の性質が重なる可能性を示しています。',
    },
    {
      id: 'erq_customs_03',
      q: 'Why can the meaning of an object change over time?',
      questionJa: '物の意味が時とともに変わるのはなぜですか。',
      choices: [
        ['Different groups may select different parts of the past.', '異なる集団が過去の異なる部分を選ぶことがあるから。'],
        ['Objects always lose all memory after one generation.', '物は一世代後に必ずすべての記憶を失うから。'],
        ['Governments and families always select the same history.', '政府と家族は必ず同じ歴史を選ぶから。'],
        ['Museums prevent art from carrying memory.', '博物館が芸術による記憶の継承を妨げるから。'],
      ],
      answer: 'Different groups may select different parts of the past.',
      explain: '「芸術・物・記憶」の導入は museums, families, and governments が過去の異なる部分を選ぶと意味が変わると述べています。',
    },
    {
      id: 'erq_customs_04',
      q: 'What should careful readers compare before making a cultural claim?',
      questionJa: '注意深い読み手は文化について主張する前に何を比べるべきですか。',
      choices: [
        ['Context, generation, region, and individual choice.', '文脈、世代、地域、個人の選択。'],
        ['Only the most famous national custom.', '最も有名な国の風習だけ。'],
        ['Only what one visitor expected to see.', '一人の旅行者が見ると予想したことだけ。'],
        ['One fixed description of every person.', 'すべての人に対する一つの固定的な説明。'],
      ],
      answer: 'Context, generation, region, and individual choice.',
      explain: '最終節の導入が compare context, generation, region, and individual choice before making a claim と明記しています。',
    },
  ]),

  p_ext_3000_shared_watershed: freezeQuestions([
    {
      id: 'erq_watershed_01',
      q: 'What does understanding the whole water system require?',
      questionJa: '水の仕組み全体を理解するには何が必要ですか。',
      choices: [
        ['Attention to both visible events and slow hidden change.', '目に見える出来事と、ゆっくり進む隠れた変化の両方への注意。'],
        ['Attention only to dramatic floods.', '劇的な洪水だけへの注意。'],
        ['A decision to ignore soil and plants.', '土や植物を無視する決定。'],
        ['One observation made at a single moment.', '一時点で行った一度の観察。'],
      ],
      answer: 'Attention to both visible events and slow hidden change.',
      explain: '最初の節は both visible events and slow hidden change と両方を並列し、全体理解の条件にしています。',
    },
    {
      id: 'erq_watershed_02',
      q: 'Why is one dramatic observation insufficient in an ecosystem?',
      questionJa: '生態系で一度の劇的な観察だけでは不十分なのはなぜですか。',
      choices: [
        ['It cannot represent a habitat that is changing.', '変化している生息地を代表できないから。'],
        ['Every habitat remains exactly the same.', 'どの生息地も完全に同じままだから。'],
        ['Scientific observations never use evidence.', '科学的観察は決して証拠を使わないから。'],
        ['Temperature has no effect on living systems.', '気温は生きた仕組みに影響しないから。'],
      ],
      answer: 'It cannot represent a habitat that is changing.',
      explain: '「生きた仕組み」の導入は one dramatic observation cannot represent a changing habitat と、一回の観察の限界を明言しています。',
    },
    {
      id: 'erq_watershed_03',
      q: 'Why does the text call clean water a medical resource?',
      questionJa: '本文が清潔な水を医療資源と呼ぶ理由は何ですか。',
      choices: [
        ['Public health depends on it even when no hospital is visible.', '病院が見えない場面でも公衆衛生がそれに支えられるから。'],
        ['Water matters only inside hospitals.', '水が重要なのは病院内だけだから。'],
        ['Diagnosis and prevention are unrelated.', '診断と予防は互いに無関係だから。'],
        ['Clean water removes every disease immediately.', '清潔な水がすべての病気をすぐになくすから。'],
      ],
      answer: 'Public health depends on it even when no hospital is visible.',
      explain: '公衆衛生の導入は Clean water is a medical resource even when no hospital appears in the picture と、病院の有無と水の医療的価値を切り離しています。',
    },
    {
      id: 'erq_watershed_04',
      q: 'Under what condition does technology help water management?',
      questionJa: 'どのような条件で、技術は水管理に役立ちますか。',
      choices: [
        ['Operators can understand, repair, and govern it under pressure.', '担当者が緊急時にも理解し、修理し、管理できるとき。'],
        ['Operators depend on systems they cannot understand.', '担当者が理解できない仕組みに依存するとき。'],
        ['Maintenance and access are ignored.', '維持管理と利用可能性が無視されるとき。'],
        ['Software removes every need for judgment.', 'ソフトウェアがすべての判断を不要にするとき。'],
      ],
      answer: 'Operators can understand, repair, and govern it under pressure.',
      explain: '「エネルギーと機械」の導入は Technology helps only when ... と、担当者の理解・修理・管理を必要条件にしています。',
    },
  ]),

  p_ext_4000_generational_city: freezeQuestions([
    {
      id: 'erq_city_01',
      q: 'Why do time words matter in long-term city planning?',
      questionJa: '長期的な都市計画で時間を表す語が重要なのはなぜですか。',
      choices: [
        ['A benefit today may become a cost tomorrow, or the reverse.', '今日の利益が明日の費用になることも、その逆もあるから。'],
        ['Every consequence arrives immediately.', 'すべての結果がすぐに現れるから。'],
        ['Future costs never affect present choices.', '将来の費用は現在の選択に決して影響しないから。'],
        ['Urgent needs should always erase slow consequences.', '緊急の必要は常に遅く現れる結果を無視すべきだから。'],
      ],
      answer: 'A benefit today may become a cost tomorrow, or the reverse.',
      explain: '最初の節は a benefit today may become a cost tomorrow, or the reverse と、時間で評価が反転する可能性を示しています。',
    },
    {
      id: 'erq_city_02',
      q: 'What does the text say shapes public choices besides evidence?',
      questionJa: '本文によると、証拠以外の何が公共の選択を形づくりますか。',
      choices: [
        ['Emotion, memory, habit, and expectation.', '感情、記憶、習慣、予想。'],
        ['Only prices and formal rules.', '価格と正式な規則だけ。'],
        ['Only facts that everyone interprets identically.', 'すべての人が同じように解釈する事実だけ。'],
        ['Technology without any human attention.', '人間の注意を一切必要としない技術。'],
      ],
      answer: 'Emotion, memory, habit, and expectation.',
      explain: '「恐れ・希望・注意」の導入は emotion as well as evidence, memory, habit, and expectation と要因を並べています。',
    },
    {
      id: 'erq_city_03',
      q: 'According to the markets section, what does distribution decide?',
      questionJa: '市場の節によると、分配は何を決めますか。',
      choices: [
        ['Who can turn growth into security and choice.', '誰が成長を安心と選択に変えられるか。'],
        ['Whether growth can be measured at all.', '成長をそもそも測定できるかどうか。'],
        ['Why every household has the same risk.', 'なぜどの家計も同じ危険を持つのか。'],
        ['Why prices no longer affect daily life.', 'なぜ価格が日常生活に影響しなくなったのか。'],
      ],
      answer: 'Who can turn growth into security and choice.',
      explain: '「市場と家計の安定」の導入は distribution decides who can turn growth into security and choice と述べています。',
    },
    {
      id: 'erq_city_04',
      q: 'What must a city preserve while choosing a direction?',
      questionJa: '都市は方向を選ぶ際に何を守らなければなりませんか。',
      choices: [
        ['Evidence, disagreement, and the ability to change course.', '証拠、異論、進路を変える力。'],
        ['One prediction that can never be questioned.', '決して問い直せない一つの予測。'],
        ['Perfect institutions with no correction process.', '修正の手続きがない完璧な制度。'],
        ['Dependence on tools that no one can maintain.', '誰も維持できない道具への依存。'],
      ],
      answer: 'Evidence, disagreement, and the ability to change course.',
      explain: '最終節は while preserving evidence, disagreement, and the ability to change course を、方向選択と同時に守る条件にしています。',
    },
  ]),
})
