// 追加8長文の内容理解問題。本文内の根拠へ戻れる説明を全問に付ける。

const freezeQuestions = (questions) => Object.freeze(
  questions.map((question) => Object.freeze({
    ...question,
    choices: Object.freeze(question.choices),
  })),
)

export const EXPANDED_READING_QUESTIONS = Object.freeze({
  p_5_weather_field_trip: freezeQuestions([
    {
      q: 'What should everyone bring to the field trip?',
      choices: ['A hat, a notebook, and some water.', 'A lunch box and indoor shoes.', 'A camera and a train ticket.', 'A map and a blue bag.'],
      answer: 'A hat, a notebook, and some water.',
      explain: '第3文に、全員が帽子、ノート、水を持ってくると書かれています。',
    },
    {
      q: 'What will the class do if it rains?',
      choices: ['Visit the science museum.', 'Stay in the school library.', 'Go to the animal hospital.', 'Meet at the train station.'],
      answer: 'Visit the science museum.',
      explain: '“If it rains” が条件で、その場合は科学博物館を訪れます。',
    },
    {
      q: 'When will the teacher put the final plan on the website?',
      choices: ['Thursday evening.', 'Friday morning.', 'Friday afternoon.', 'Saturday evening.'],
      answer: 'Thursday evening.',
      explain: '最終文の “on Thursday evening” が掲載時刻の根拠です。',
    },
  ]),

  p_4_emergency_map: freezeQuestions([
    {
      q: 'Why did the students make a new walking map?',
      choices: ['Some streets became dangerous during heavy rain.', 'The town wanted more tourists in spring.', 'The community center was moving beside the river.', 'Families could not read the old school website.'],
      answer: 'Some streets became dangerous during heavy rain.',
      explain: '大雨で道路が冠水し、嵐のときに危険になる場所を住民へ聞いたことが活動の出発点です。',
    },
    {
      q: 'What danger did residents describe near the river?',
      choices: ['Water could rise quickly near a low bridge.', 'A large tree could fall on the community center.', 'Bicycles moved too fast after dark.', 'The website stopped working during storms.'],
      answer: 'Water could rise quickly near a low bridge.',
      explain: '低い橋の付近では水位がすぐ上がるため、別の道順が必要でした。',
    },
    {
      q: 'What did families discover when they tested the first map?',
      choices: ['One sign was hidden behind a tree.', 'The map showed the wrong town website.', 'The community center had no lights.', 'The safest route crossed the low bridge.'],
      answer: 'One sign was hidden behind a tree.',
      explain: '実地テストで、一つの標識が大きな木の後ろに隠れていると分かりました。',
    },
    {
      q: 'How did the students make the map easier to use?',
      choices: ['They added larger letters, pictures, and safe waiting places.', 'They removed every route near shops and schools.', 'They asked only young residents for advice.', 'They printed it once and stopped checking it.'],
      answer: 'They added larger letters, pictures, and safe waiting places.',
      explain: '家族の意見を受け、大きな文字、簡単な絵、安全に待てる場所の印を取り入れました。',
    },
    {
      q: 'Why will the class check every route again each spring?',
      choices: ['Streets and buildings can change.', 'The map may become wet in winter.', 'Students must interview a new teacher.', 'The community center opens only in spring.'],
      answer: 'Streets and buildings can change.',
      explain: '最終文のBecause節が、毎年更新する理由を明示しています。',
    },
  ]),

  p_3_multilingual_town_guide: freezeQuestions([
    {
      q: 'What did the first survey change about the guide?',
      choices: ['It made the class choose practical information visitors needed.', 'It made the class list every famous place in town.', 'It removed all Japanese from the guide.', 'It limited the guide to restaurant prices.'],
      answer: 'It made the class choose practical information visitors needed.',
      explain: '旅行者は時刻や給水場所などを求めたため、クラスは名所一覧より実用情報を選びました。',
    },
    {
      q: 'Why did the teams measure each walking time twice?',
      choices: ['Busy summer streets could slow a group.', 'Restaurant owners asked them to walk at night.', 'The first measurement used a wheelchair.', 'The station closed during the first test.'],
      answer: 'Busy summer streets could slow a group.',
      explain: '混雑する夏の道路では歩行時間が変わり得ることが、再測定の理由です。',
    },
    {
      q: 'What problem did the wheelchair user find?',
      choices: ['A short route had many steps.', 'The online map could not open on a phone.', 'The guide used only difficult English.', 'The red bridge was closed every summer.'],
      answer: 'A short route had many steps.',
      explain: '短い道順でも階段が多いと分かり、階段のない長めの道順が追加されました。',
    },
    {
      q: 'Why is a code printed in the paper guide?',
      choices: ['To open the newest online map.', 'To pay restaurant owners.', 'To translate street names automatically.', 'To reserve a seat at the station.'],
      answer: 'To open the newest online map.',
      explain: '印刷版のコードは、スマートフォンで更新後のオンライン地図を開くためのものです。',
    },
    {
      q: 'What did the students learn about good translation?',
      choices: ['It requires imagining what readers need, not only replacing words.', 'It should always make a walking route shorter.', 'It is complete when every place name is listed.', 'It should be written only by hotel workers.'],
      answer: 'It requires imagining what readers need, not only replacing words.',
      explain: '最後の2文が、語の置換に加えて読み手の場面と必要を想像する重要性をまとめています。',
    },
  ]),

  p_pre2_phone_free_focus: freezeQuestions([
    {
      q: 'Why did the school use a phone-free hour instead of an all-day ban?',
      choices: ['It wanted to test a limited way to protect attention.', 'It wanted students to stop contacting families.', 'It had no lockers for phones after lunch.', 'It planned to replace every phone with a computer.'],
      answer: 'It wanted to test a limited way to protect attention.',
      explain: '全面禁止ではなく1時間の試行にし、集中への影響を比較できるようにしました。',
    },
    {
      q: 'Why did the school wait until the trial ended before revealing the comparison group?',
      choices: ['To reduce the effect of expectations on students’ reports.', 'To prevent teachers from giving reading tasks.', 'To hide emergency phone numbers from families.', 'To allow one group to use easier questions.'],
      answer: 'To reduce the effect of expectations on students’ reports.',
      explain: '自分が比較対象だという期待だけで集中の報告が変わる可能性を小さくするためです。',
    },
    {
      q: 'What exception did the school add to the phone-free rule?',
      choices: ['Teachers could approve necessary learning tools.', 'Every student could answer messages at any time.', 'Only health messages were permanently blocked.', 'Assignments no longer required steady attention.'],
      answer: 'Teachers could approve necessary learning tools.',
      explain: '翻訳や読み上げなど必要な機能があるため、先生が学習ツールを許可できるようにしました。',
    },
    {
      q: 'What is the passage’s main conclusion?',
      choices: ['Reducing interruptions can help, but clear tasks and thoughtful choices are also necessary.', 'Phones are the only reason students lose attention.', 'A few more answers prove that every student learned deeply.', 'Schools should use the same permanent rule without review.'],
      answer: 'Reducing interruptions can help, but clear tasks and thoughtful choices are also necessary.',
      explain: '本文は効果を認めつつ、課題の明確さ、例外、定期的な見直し、自己判断も必要だと限定しています。',
    },
  ]),

  p_pre2plus_clothing_second_life: freezeQuestions([
    {
      q: 'Why can sending donated clothing overseas create a problem?',
      choices: ['It can shift disposal costs to communities that cannot use every item.', 'It always makes local clothing more expensive.', 'It prevents any item from finding a new owner.', 'It makes cotton impossible to reuse as cleaning cloths.'],
      answer: 'It can shift disposal costs to communities that cannot use every item.',
      explain: '受け入れ先で使い切れない品の処分負担が生じる可能性を本文が指摘しています。',
    },
    {
      q: 'What standard did volunteers use to sort the clothes?',
      choices: ['Size and condition rather than price.', 'Color and original shop rather than size.', 'Age of the owner and family income.', 'Environmental benefit alone.'],
      answer: 'Size and condition rather than price.',
      explain: '交換会では価格ではなく、サイズと状態で衣服を分類しました。',
    },
    {
      q: 'Why was counting exchanged items alone not enough?',
      choices: ['An item has little benefit if nobody actually uses it.', 'The organizers did not know how many tables they had.', 'Every exchanged shirt replaced a new purchase.', 'Mixed materials were counted twice.'],
      answer: 'An item has little benefit if nobody actually uses it.',
      explain: '別の戸棚で未使用のままなら環境上の利点が小さいため、後日の着用も調べました。',
    },
    {
      q: 'How did the project protect participants’ dignity?',
      choices: ['It did not require anyone to explain why they wanted low-cost clothing.', 'It separated students from neighbors at different tables.', 'It published the names of everyone who received clothing.', 'It allowed only teachers to choose items.'],
      answer: 'It did not require anyone to explain why they wanted low-cost clothing.',
      explain: '利用理由を説明させず、全員が同じテーブルと選択方法を使いました。',
    },
    {
      q: 'What broader responsibility does the passage identify?',
      choices: ['Manufacturers should use durable, repairable designs as well as local reuse efforts.', 'Volunteers should solve every material problem alone.', 'Consumers should replace clothing whenever styles change.', 'Schools should report only successful exchanges.'],
      answer: 'Manufacturers should use durable, repairable designs as well as local reuse efforts.',
      explain: '結論は交換・修理だけでなく、素材選択、修理可能性、丈夫な設計にも責任を広げています。',
    },
  ]),

  p_2_vertical_farming: freezeQuestions([
    {
      q: 'Why can some vertical farms use less water than field farms?',
      choices: ['They collect and reuse water.', 'They grow only during rainy seasons.', 'They transport water from distant fields.', 'They keep crops outside during storms.'],
      answer: 'They collect and reuse water.',
      explain: '水を回収して再利用する循環型の仕組みが、水使用量を下げます。',
    },
    {
      q: 'Why does the source of electricity matter?',
      choices: ['Fossil-fuel electricity may cancel some transport savings.', 'Renewable power prevents every crop from growing.', 'Electricity changes the distance between cities.', 'Field farms do not use any form of energy.'],
      answer: 'Fossil-fuel electricity may cancel some transport savings.',
      explain: '照明や冷却の電力が化石燃料由来なら、短距離輸送の利点を相殺し得ます。',
    },
    {
      q: 'Which crops are currently most suitable for vertical farms?',
      choices: ['Fast-growing leafy vegetables and herbs.', 'Wheat, rice, and large fruit trees.', 'Only crops that need outdoor pollinators.', 'All crops with low value per shelf.'],
      answer: 'Fast-growing leafy vegetables and herbs.',
      explain: '棚を効率よく使える成長の早い葉物野菜とハーブが適するとあります。',
    },
    {
      q: 'What should a fair comparison include?',
      choices: ['The same crop, season, destination, and full life of the system.', 'Only photographs of a new city farm.', 'Only construction cost and no social effects.', 'A city farm and an unrelated distant average.'],
      answer: 'The same crop, season, destination, and full life of the system.',
      explain: 'ライフサイクル全体を、作物・季節・目的地など同条件で比べる必要があります。',
    },
    {
      q: 'What role does the author support for vertical farming?',
      choices: ['Supplying certain crops where its measured strengths fit local needs.', 'Replacing all ordinary farms as quickly as possible.', 'Growing every crop without regard to energy cost.', 'Receiving public support without transparent evidence.'],
      answer: 'Supplying certain crops where its measured strengths fit local needs.',
      explain: '全面代替ではなく、土地・輸送・天候の条件に応じて他の農法を補う役割を提案しています。',
    },
  ]),

  p_pre1_dark_sky_policy: freezeQuestions([
    {
      q: 'Why would a policy treating every lamp as equally harmful lose trust?',
      choices: ['People have legitimate safety, work, and business needs for some light.', 'Every lamp produces exactly the same environmental effect.', 'Residents want all public spaces closed after sunset.', 'Researchers cannot measure brightness or energy use.'],
      answer: 'People have legitimate safety, work, and business needs for some light.',
      explain: '歩道の安全、夜勤の移動、営業中の表示など、光が必要な場面を無視するからです。',
    },
    {
      q: 'What does the author say is the relevant policy question?',
      choices: ['Where, how much, what color, and when light is useful.', 'Whether communities must choose complete light or complete darkness.', 'How to sell darkness only in tourist areas.', 'Which single measure can prove every policy successful.'],
      answer: 'Where, how much, what color, and when light is useful.',
      explain: '光か暗闇かの二者択一ではなく、場所・量・色・時間を調整する問いへ置き換えています。',
    },
    {
      q: 'Why do communities begin with small trials?',
      choices: ['To measure several effects and reveal trade-offs before wider rules.', 'To avoid listening to residents who work late.', 'To keep all crossings dark after the last bus.', 'To prove that tourism is the only useful goal.'],
      answer: 'To measure several effects and reveal trade-offs before wider rules.',
      explain: '小規模試行なら安全、快適さ、エネルギー、生態系などを測り、調整できます。',
    },
    {
      q: 'What principle best summarizes the author’s preferred standards?',
      choices: ['Set goals for useful light, allow justified exceptions, and keep monitoring.', 'Demand darkness for its own sake in every neighborhood.', 'Protect only places where darkness can be sold.', 'Replace equipment once and never review the results.'],
      answer: 'Set goals for useful light, allow justified exceptions, and keep monitoring.',
      explain: '最終段落は、有用な光を目標に、例外と継続的な監視を組み合わせる基準を支持しています。',
    },
  ]),

  p_1_choice_architecture: freezeQuestions([
    {
      q: 'Why are choice architectures described as unavoidable?',
      choices: ['Every form, screen, and procedure must arrange alternatives somehow.', 'Researchers can remove every influence from a decision.', 'People make choices only after conscious comparison.', 'Public institutions never use defaults.'],
      answer: 'Every form, screen, and procedure must arrange alternatives somehow.',
      explain: '選択肢の順序や何もしない場合の結果を、どの設計も何らかの形で決める必要があります。',
    },
    {
      q: 'What ethical problem does the subscription example illustrate?',
      choices: ['A formally available choice can be weakened by unequal friction.', 'Automatic renewal always improves customer autonomy.', 'Transparency makes difficult cancellation harmless.', 'Commercial designers never benefit from defaults.'],
      answer: 'A formally available choice can be weakened by unequal friction.',
      explain: '解約だけに複数画面の手間を課すと、形式上の選択はあっても実質的に一方が有利になります。',
    },
    {
      q: 'Why is transparency alone insufficient?',
      choices: ['Hidden or unusable information may not create awareness or remove unequal burdens.', 'People should never be told that a default was chosen.', 'Every user reads long policy documents carefully.', 'Transparency automatically provides an easy refusal.'],
      answer: 'Hidden or unusable information may not create awareness or remove unequal burdens.',
      explain: '長い方針内の一文や技術的に入手可能なだけの情報では、理解・行動・負担の公平性を保証できません。',
    },
    {
      q: 'Which set of conditions makes choice architecture ethically defensible according to the author?',
      choices: ['A legitimate goal, real exit, distribution review, limited data, and revision.', 'Maximum convenience with no review or public challenge.', 'A strong default that vulnerable minorities cannot refuse.', 'Commercial benefit, hidden burdens, and permanent data collection.'],
      answer: 'A legitimate goal, real exit, distribution review, limited data, and revision.',
      explain: '最終段落が、正当な目的、退出手段、配分、データ制限、見直しを責任ある設計の条件として列挙しています。',
    },
  ]),
})
