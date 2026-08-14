// 接続語を先に読んだあと、節末・句末で関係を短く受け直す本文別台帳。
// 一律に括弧を足さず、全接続候補を読んで、英語順では係り先を見失いやすい
// 箇所だけを登録する。括弧内も日本語音声で読む。

const binding = (type, opener, governor, clause) => Object.freeze({
  type,
  opener,
  governor,
  clause,
})

const review = (sentence, connector, target, role, ja, closureBinding) => Object.freeze({
  sentence,
  connector,
  target,
  role,
  ja,
  closureBinding,
  status: 'confirmed',
})

export const READING_CONNECTOR_CLOSURE_REVIEWS = Object.freeze([
  review(
    'Many families come early because the room is not very large.',
    'because', 'very large', 'C', 'とても広い状態（ではないからです）',
    binding('reason-clause', 'because', 'come early', 'the room is not very large'),
  ),
  review(
    "Before the museum opens on Saturdays, the students meet a staff member and learn about the day's exhibition.",
    'Before', 'on Saturdays', 'M', '毎週土曜日に（博物館が開館する前に）',
    binding('time-clause', 'Before', 'meet / learn', 'the museum opens on Saturdays'),
  ),
  review(
    'When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.',
    'When', 'take part', 'V', '参加する（と）',
    binding('time-clause', 'When', 'feel / are more willing', 'young people take part'),
  ),
  review(
    'Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.',
    'Because', 'the old one', 'O', '古い品物を（直す人を見つけるより、新しい品物を買う方が簡単だから）',
    binding('reason-clause', 'Because', 'usable products become waste', 'buying a new item is often easier than finding someone to fix the old one'),
  ),
  review(
    'Families may also save money, which is especially valuable when prices are rising.',
    'when', 'are rising', 'V', '上がっている（ときには）',
    binding('time-clause', 'when', 'is especially valuable', 'prices are rising'),
  ),
  review(
    'Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.',
    'Even when', 'cannot be repaired', 'V', '修理できない（ときでさえ）',
    binding('concessive-time-clause', 'Even when', 'may learn', 'an object cannot be repaired'),
  ),
  review(
    'Some modern products are also designed so that they are difficult to open without special tools.',
    'so that', 'without special tools', 'M', '特殊な道具なしでは（開けることが難しいように）',
    binding('purpose-clause', 'so that', 'are designed', 'they are difficult to open without special tools'),
  ),
  review(
    'When people discuss technology, they often imagine large machines, bright screens, or dramatic changes in daily life.',
    'When', 'technology', 'O', '技術について（話し合うとき）',
    binding('time-clause', 'When', 'often imagine', 'people discuss technology'),
  ),
  review(
    'The information is sent to signs and phone apps, so passengers can choose a less crowded area before the train arrives.',
    'before', 'arrives', 'V', '到着する（前に）',
    binding('time-clause', 'before', 'can choose', 'the train arrives'),
  ),
  review(
    'Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.',
    'while', 'older equipment', 'M', '古い設備と比べて（より少ないエネルギーを使う一方で）',
    binding('contrast-clause', 'while', 'keep rooms comfortable', 'using less energy than older equipment'),
  ),
  review(
    'Several cities have therefore begun small trial programs before introducing a system everywhere.',
    'before', 'everywhere', 'M', 'あらゆる場所へ（システムを導入する前に）',
    binding('time-clause', 'before', 'have therefore begun small trial programs', 'introducing a system everywhere'),
  ),
  review(
    'Cities have always had to respond to weather, but the challenge has become more complicated as extreme heat and sudden storms occur more frequently.',
    'as', 'more frequently', 'M', 'より頻繁に（起こるにつれて）',
    binding('change-clause', 'as', 'has become more complicated', 'extreme heat and sudden storms occur more frequently'),
  ),
  review(
    'For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.',
    'while', 'downstream', 'M', 'さらに下流へ（水を押しやる一方で）',
    binding('contrast-clause', 'while', 'may reduce flooding', 'pushing water toward a poorer neighborhood downstream'),
  ),
  review(
    'Similarly, installing powerful air conditioners in public buildings may protect residents during heat waves, yet it can increase energy demand when the power supply is already under pressure.',
    'when', 'under pressure', 'C', '大きな負担を受けている（ときに）',
    binding('time-clause', 'when', 'can increase energy demand', 'the power supply is already under pressure'),
  ),
  review(
    'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.',
    'before', 'the benefits', 'O', '恩恵を（享受する前に）',
    binding('time-clause', 'before', 'force lower-income residents to move', 'they enjoy the benefits'),
  ),
  review(
    'Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.',
    'Because', 'less dramatic', 'C', '目立ちにくい（ため）',
    binding('reason-clause', 'Because', 'are often the first to be reduced', 'these measures are less dramatic'),
  ),
  review(
    'Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.',
    'when', 'tight', 'C', '厳しい状態に（なるときに）',
    binding('time-clause', 'when', 'to be reduced', 'budgets become tight'),
  ),
  review(
    'As climate conditions remain uncertain, the cities that adapt most successfully will probably be those that combine technical knowledge with public participation.',
    'As', 'uncertain', 'C', '不確かな状態（である中）',
    binding('circumstance-clause', 'As', 'will probably be', 'climate conditions remain uncertain'),
  ),
  review(
    'When these mechanisms weaken, the past becomes a collection of isolated facts rather than a resource for judgment.',
    'When', 'weaken', 'V', '弱まる（と）',
    binding('time-clause', 'When', 'the past becomes', 'these mechanisms weaken'),
  ),
  review(
    'When search results, short videos, and algorithmic recommendations compete for attention, materials that require slow reading or moral reflection may become almost invisible.',
    'When', 'for attention', 'M', '人々の注意を得ようと（競い合うと）',
    binding('time-clause', 'When', 'materials may become almost invisible', 'search results, short videos, and algorithmic recommendations compete for attention'),
  ),
  review(
    'A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.',
    'when', 'changes', 'V', '変わる（と）',
    binding('time-clause', 'when', 'become unreadable', 'software changes'),
  ),
  review(
    'Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so that they can protect records from temporary political pressure.',
    'so that', 'from temporary political pressure', 'M', '一時的な政治的圧力から（記録を守れるように）',
    binding('purpose-clause', 'so that', 'have traditionally claimed a degree of autonomy', 'they can protect records from temporary political pressure'),
  ),
  review(
    'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.',
    'because', 'as valuable information', 'C', '価値ある情報として（扱われていると分かるからです）',
    binding('reason-clause', 'because', 'can build trust', 'residents see that their daily experience is treated as valuable information'),
  ),
  review(
    'Such debates are rarely simple because historical meaning is often ambiguous.',
    'because', 'ambiguous', 'C', '曖昧である（からです）',
    binding('reason-clause', 'because', 'are rarely simple', 'historical meaning is often ambiguous'),
  ),
  review(
    'Although such action can limit obvious fabrications, it also gives private companies substantial authority over public memory.',
    'Although', 'obvious fabrications', 'O', '明らかな捏造を（抑えられるものの）',
    binding('concession-clause', 'Although', 'also gives', 'such action can limit obvious fabrications'),
  ),
  review(
    "A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens' judgment.",
    'while', "citizens' judgment", 'O', '市民の判断力を（ほとんど強めない一方で）',
    binding('contrast-clause', 'while', 'may suppress circulation', "doing little to strengthen citizens' judgment"),
  ),
  review(
    'Children will also learn the correct place to stop before they cross a busy road.',
    'before', 'a busy road', 'O', '交通量の多い道路を（渡る前に）',
    binding('time-clause', 'before', 'the correct place to stop', 'they cross a busy road'),
  ),
  review(
    'The cooking staff had to throw the leftovers away, even though most of the food was still fresh.',
    'even though', 'fresh', 'C', '新鮮な状態（であるにもかかわらず）',
    binding('concession-clause', 'even though', 'had to throw the leftovers away', 'most of the food was still fresh'),
  ),
  review(
    'They discovered that waste was greatest on days when every student received the same large portion.',
    'when', 'the same large portion', 'O', '同じ大盛りを（受け取った日に）',
    binding('relative-time-clause', 'on days / when', 'waste was greatest on days', 'every student received the same large portion'),
  ),
  review(
    'Many teenagers arrive at school feeling tired, even when they try to go to bed at a reasonable time.',
    'even when', 'at a reasonable time', 'M', '適切な時刻に（寝ようとしても）',
    binding('concessive-time-clause', 'even when', 'arrive at school feeling tired', 'they try to go to bed at a reasonable time'),
  ),
  review(
    'In one experiment, attendance and mood improved, although test scores did not rise immediately.',
    'although', 'immediately', 'M', 'すぐには（上がらなかったものの）',
    binding('concession-clause', 'although', 'attendance and mood improved', 'test scores did not rise immediately'),
  ),
  review(
    'Because each community is different, changing the clock alone is not a complete solution.',
    'Because', 'different', 'C', '異なる（ため）',
    binding('reason-clause', 'Because', 'changing the clock alone is not a complete solution', 'each community is different'),
  ),
  review(
    'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.',
    'because', 'familiar', 'C', 'なじみがある（というだけで）',
    binding('reason-clause', 'because', 'keeping an old schedule', 'it is familiar'),
  ),
  review(
    'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.',
    'especially when', 'regularly', 'M', '定期的に（その変更を見直すときには）',
    binding('time-clause', 'especially when', 'are more useful', 'schools review them regularly'),
  ),
  review(
    'Professional scientists cannot be everywhere at once, especially when they study animals that move across wide areas.',
    'especially when', 'across wide areas', 'M', '広い地域を横切って（そのような動物を研究するときには）',
    binding('time-clause', 'especially when', 'cannot be everywhere at once', 'they study animals that move across wide areas'),
  ),
  review(
    'When thousands of people send reports, researchers can discover patterns that a small team might miss.',
    'When', 'reports', 'O', '報告を（送ると）',
    binding('time-clause', 'When', 'researchers can discover patterns', 'thousands of people send reports'),
  ),
  review(
    'This creates a bias because some habitats receive many reports and others receive few.',
    'because', 'few', 'O', 'ごく少数の報告しか受け取らない（からです）',
    binding('reason-clause', 'because', 'creates a bias', 'some habitats receive many reports and others receive few'),
  ),
  review(
    'Experts often check unusual reports before the records enter the main database.',
    'before', 'the main database', 'O', '主要なデータベースに（入る前に）',
    binding('time-clause', 'before', 'often check unusual reports', 'the records enter the main database'),
  ),
  review(
    'A useful study also compares groups so that researchers can separate the treatment from other possible factors.',
    'so that', 'from other possible factors', 'M', 'ほかの考えられる要因から（治療の効果を区別できるように）',
    binding('purpose-clause', 'so that', 'compares groups', 'researchers can separate the treatment from other possible factors'),
  ),
  review(
    'When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.',
    'When', 'serious health risks', 'O', '重大な健康上の危険を（伴うとき）',
    binding('time-clause', 'When', 'online reading should support', 'a decision involves serious health risks'),
  ),
  review(
    'People with little economic or political power may be especially vulnerable when they cannot choose a private alternative.',
    'when', 'a private alternative', 'O', 'プライバシーを守れる代替手段を（選べないときに）',
    binding('time-clause', 'when', 'may be especially vulnerable', 'they cannot choose a private alternative'),
  ),
  review(
    'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.',
    'while', 'elsewhere', 'M', 'ほかの場では（デジタル革新を促す一方で）',
    binding('contrast-clause', 'while', 'require essential businesses to accept cash', 'encouraging digital innovation elsewhere'),
  ),
  review(
    'Cash may sometimes appear inefficient as an option, just as backup power can appear wasteful on an ordinary day.',
    'just as', 'on an ordinary day', 'M', '平常の日には（予備電源が浪費的に見えるのと同じように）',
    binding('analogy-clause', 'just as', 'Cash may sometimes appear inefficient', 'backup power can appear wasteful on an ordinary day'),
  ),
  review(
    'It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.',
    'while', 'freely', 'M', '自由に（選ぶのを妨げる障壁を取り除く一方で）',
    binding('contrast-clause', 'while', 'to preserve meaningful alternatives', 'removing barriers that prevent people from choosing freely'),
  ),
  review(
    'The difficulty begins when a useful measure becomes the institution’s practical definition of success.',
    'when', 'of success', 'M', '成功の（定義になるときに）',
    binding('time-clause', 'when', 'The difficulty begins', 'a useful measure becomes the institution’s practical definition of success'),
  ),
  review(
    'Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.',
    'Once', 'on the score', 'M', 'その得点によって（大きく左右されるようになると）',
    binding('condition-clause', 'Once', 'people have an incentive', 'rewards or penalties depend heavily on the score'),
  ),
  review(
    'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.',
    'while', 'its ranking', 'O', '学校の順位を（その生徒の向上が変える見込みは低く、その生徒を軽視する一方で）',
    binding('contrast-clause', 'while', 'may devote more time', 'neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking'),
  ),
  review(
    'Less visible distortions arise when workers avoid experiments whose uncertain outcomes could damage an otherwise strong record.',
    'when', 'an otherwise strong record', 'O', 'それまでは良好だった記録を（結果が損なうおそれのある実験を職員が避けるときに）',
    binding('time-clause', 'when', 'Less visible distortions arise', 'workers avoid experiments whose uncertain outcomes could damage an otherwise strong record'),
  ),
  review(
    'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.',
    'while', 'particular communities', 'O', '特定の共同体に対して（繰り返し期待に応えられないという証拠を無視する一方で）',
    binding('contrast-clause', 'while', 'may celebrate a program’s intentions', 'ignoring evidence that it repeatedly fails particular communities'),
  ),
  review(
    'A quiet diagnostic metric can become unreliable after promotion, funding, or punishment depends on it.',
    'after', 'on it', 'M', 'その指標によって（昇進・資金・処罰が左右されるようになったあと）',
    binding('time-clause', 'after', 'can become unreliable', 'promotion, funding, or punishment depends on it'),
  ),
  review(
    'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.',
    'while', 'acceptable thresholds', 'M', '許容される基準値についての（決定を隠す一方で）',
    binding('contrast-clause', 'while', 'can appear open', 'hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds'),
  ),
  review(
    'When a measure becomes a substitute for that mission, apparent precision can conceal institutional drift.',
    'When', 'for that mission', 'M', 'その使命の（代わりとなるものになると）',
    binding('time-clause', 'When', 'apparent precision can conceal', 'a measure becomes a substitute for that mission'),
  ),
  review(
    'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.',
    'When', 'among others', 'M', 'ほかの証拠源と並ぶ（規律ある一つの証拠源であり続けるとき）',
    binding('time-clause', 'When', 'measurement can support', 'it remains one disciplined source of evidence among others'),
  ),
  review(
    'If it rains, we visit the science museum instead.',
    'If', 'instead', 'M', '代わりに（雨が降る場合は、科学博物館を訪れます）',
    binding('condition-clause', 'If', 'we visit the science museum instead', 'it rains'),
  ),
  review(
    'The survey asked whether an exchanged item replaced a planned purchase, since that choice could reduce new production.',
    'since', 'new production', 'O', '新たな生産を（その選択なら減らせるからです）',
    binding('reason-clause', 'since', 'asked whether an exchanged item replaced a planned purchase', 'that choice could reduce new production'),
  ),
  review(
    'People often describe choice as if it begins only when a person consciously compares several options.',
    'when', 'several options', 'O', '複数の選択肢を（人が意識的に比較するときだけ、選択が始まるかのように）',
    binding('hypothetical-time-clause', 'as if / when', 'often describe choice', 'it begins only when a person consciously compares several options'),
  ),
  review(
    'Architecture is not merely a metaphor, because every digital screen, form, cafeteria, and public procedure must arrange alternatives somehow.',
    'because', 'somehow', 'M', '何らかの方法で（選択肢を配置しなければならないからです）',
    binding('reason-clause', 'because', 'Architecture is not merely a metaphor', 'every digital screen, form, cafeteria, and public procedure must arrange alternatives somehow'),
  ),
  review(
    'When the first map was ready, families tested it on a rainy afternoon.',
    'When', 'ready', 'C', '完成した状態（になったとき）',
    binding('time-clause', 'When', 'families tested it on a rainy afternoon', 'the first map was ready'),
  ),
])

const noChange = (sentence, connector, occurrence, reason) => Object.freeze({
  sentence,
  connector,
  occurrence,
  reason,
  status: 'confirmed',
})

// 全121候補のうち、既存の節末ですでに関係が完成しているもの、または
// 「一方」のように日本語の独立したつなぎだけで明確なもの。
export const READING_CONNECTOR_NO_BACK_REFERENCE_REVIEWS = Object.freeze([
  noChange('She likes English because her teacher uses many pictures.', 'because', 1, 'already-complete'),
  noChange('She is happy because she can use the story in English class.', 'because', 1, 'already-complete'),
  noChange('If it becomes full, the library will put a message on its website.', 'If', 1, 'already-complete'),
  noChange('The event is popular because children can learn about their town in a fun way.', 'because', 1, 'already-complete'),
  noChange('The work is not always easy because volunteers must communicate politely even when the building is crowded.', 'because', 1, 'already-complete'),
  noChange('The work is not always easy because volunteers must communicate politely even when the building is crowded.', 'even when', 1, 'already-complete'),
  noChange('Another student decided to study history at college because he wanted to protect old buildings in his town.', 'because', 1, 'already-complete'),
  noChange('If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.', 'If', 1, 'already-complete'),
  noChange('Older residents may know how older machines were built, while younger participants may be more comfortable finding digital information.', 'while', 1, 'standalone-link'),
  noChange('Privacy is another concern because sensors can collect data about public behavior.', 'because', 1, 'already-complete'),
  noChange('If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.', 'If', 1, 'already-complete'),
  noChange('If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.', 'If', 1, 'already-complete'),
  noChange('However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.', 'if', 1, 'already-complete'),
  noChange('However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.', 'if', 2, 'already-complete'),
  noChange('Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.', 'because', 1, 'already-complete'),
  noChange("A project that performs well under today's conditions may be inadequate if migration, land use, or rainfall patterns change.", 'if', 1, 'already-complete'),
  noChange('Societies often assume that important events will be remembered simply because they are recorded in books, archives, or digital databases.', 'because', 1, 'already-complete'),
  noChange('A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.', 'while', 1, 'standalone-link'),
  noChange('A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.', 'if', 1, 'already-complete'),
  noChange('That autonomy remains essential, but it can also be misused if institutions avoid scrutiny by describing all criticism as interference.', 'if', 1, 'already-complete'),
  noChange('Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.', 'while', 1, 'standalone-link'),
  noChange('Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.', 'since', 1, 'already-complete'),
  noChange('A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.', 'if', 1, 'already-complete'),
  noChange('Two historians may accept the same evidence yet assign different significance to it because they ask different questions.', 'because', 1, 'already-complete'),
  noChange('If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.', 'If', 1, 'already-complete'),
  noChange('Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.', 'because', 1, 'already-complete'),
  noChange('It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.', 'when', 1, 'already-complete'),
  noChange('If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.', 'If', 1, 'already-complete'),
  noChange('Please ask a teacher near the front door if you have any questions.', 'if', 1, 'already-complete'),
  noChange('They must use bicycle lights because drivers may not notice them after dark.', 'because', 1, 'already-complete'),
  noChange('Many younger students said the usual portions were too large, while some older students wanted more food after sports practice.', 'while', 1, 'standalone-link'),
  noChange('They explain that every meal uses water, energy, and work before it reaches a plate, so even a small improvement can protect valuable resources.', 'before', 1, 'already-complete'),
  noChange('Schools need to examine bus routes, club times, and family needs before choosing a new schedule.', 'before', 1, 'already-complete'),
  noChange('An experienced observer may identify a bird by its song, while a beginner may confuse two similar species.', 'while', 1, 'standalone-link'),
  noChange('They may ask participants to watch for the same length of time and to report visits when no birds appeared.', 'when', 1, 'already-complete'),
  noChange('Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.', 'not because', 1, 'already-complete'),
  noChange('Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.', 'because', 1, 'already-complete'),
  noChange('One experiment can suggest a possibility, whereas repeated studies help show whether an effect appears under different conditions.', 'whereas', 1, 'standalone-link'),
  noChange('Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.', 'whereas', 1, 'standalone-link'),
  noChange('Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.', 'because', 1, 'already-complete'),
  noChange('A fixed amount in an envelope stays visible, while digital balances may be divided across several apps and delayed transactions.', 'while', 1, 'standalone-link'),
  noChange('A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.', 'when', 1, 'already-complete'),
  noChange('The relevant choice is neither perfect numbers nor pure wisdom, because neither exists.', 'because', 1, 'already-complete'),
  noChange('Third, organizations must examine how people adapt once a measure carries consequences.', 'once', 1, 'already-complete'),
  noChange('Evaluation systems must be adaptive because the behavior they observe changes in response to observation.', 'because', 1, 'already-complete'),
  noChange('Frontline workers and vulnerable citizens often supply detailed data, while senior institutions retain discretion over how the numbers are interpreted.', 'while', 1, 'standalone-link'),
  noChange('If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.', 'If', 1, 'already-complete'),
  noChange('Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.', 'because', 1, 'already-complete'),
  noChange('Metrics are most valuable when they create questions rather than close them.', 'when', 1, 'already-complete'),
  noChange('Families suggested marking places where people could wait safely if the rain grew stronger.', 'if', 1, 'already-complete'),
  noChange('Because streets and buildings change, the class will check every route again each spring.', 'Because', 1, 'already-complete'),
  noChange('They tested the walking times twice because busy summer streets could slow a group.', 'because', 1, 'already-complete'),
  noChange('The school revealed the comparison group only after the four-week trial ended.', 'after', 1, 'already-complete'),
  noChange('Some felt anxious because they regularly received health messages from home.', 'because', 1, 'already-complete'),
  noChange('If an assignment was unclear, students became distracted even without a phone nearby.', 'If', 1, 'already-complete'),
  noChange('Because water is collected and used again, some systems use far less water than field farming.', 'Because', 1, 'already-complete'),
  noChange('The technology is most valuable when its limits are measured as carefully as its promises.', 'when', 1, 'already-complete'),
  noChange('The trial should also record complaints and near misses, since average comfort may hide risks faced by a small group.', 'since', 1, 'already-complete'),
  noChange('People often describe choice as if it begins only when a person consciously compares several options.', 'as', 1, 'standalone-link'),
  noChange('People often describe choice as if it begins only when a person consciously compares several options.', 'if', 1, 'standalone-link'),
  noChange('In practice, decisions are also shaped by which option appears first, which action requires effort, and what happens when someone does nothing.', 'when', 1, 'already-complete'),
  noChange('Employees save more for retirement when enrollment is automatic but can be canceled than when they must complete a form to join.', 'when', 1, 'already-complete'),
  noChange('Households may use less electricity when bills compare their use with that of similar homes.', 'when', 1, 'already-complete'),
])

const directCorrection = (sentence, target, role, ja, note) => Object.freeze({
  sentence,
  target,
  correction: Object.freeze({
    match: Object.freeze([target]),
    parts: Object.freeze([Object.freeze({ role, en: target, ja })]),
    note,
    occurrence: 1,
  }),
})

// 接続関係をO/C/Mより前で閉じていた箇所。節末の受け直しと対で直す。
export const READING_CONNECTOR_PREMATURE_CLOSURE_FIXES = Object.freeze([
  directCorrection(
    'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.',
    'see', 'V', '分かります（内容は次へ）',
    'because理由節をthat内容節より前で閉じず、内容節末の受け直しまで待ちます。',
  ),
  directCorrection(
    'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.',
    'is treated', 'V', '扱われています（どのようなものとしてかは次へ）',
    '受動態をas補語より前で閉じず、どのような情報として扱われるかを次へ保留します。',
  ),
  directCorrection(
    'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.',
    'must decide', 'V', '決めなければなりません（内容は次へ）',
    'since理由節を三つの埋込み疑問より前で閉じず、最後の疑問節まで待ちます。',
  ),
  directCorrection(
    'Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.',
    'depend heavily', 'V', '大きく左右されます（基準は次へ）',
    'Once節をon the scoreより前で閉じず、基準を読んだあとで条件を完成します。',
  ),
])

const grouped = new Map()

for (const item of READING_CONNECTOR_CLOSURE_REVIEWS) {
  const decisions = grouped.get(item.sentence) ?? []
  decisions.push(Object.freeze({
    match: Object.freeze([item.target]),
    parts: Object.freeze([Object.freeze({
      role: item.role,
      en: item.target,
      ja: item.ja,
      closureBinding: item.closureBinding,
    })]),
    note: `${item.connector}で示した関係をこの節末で括弧内まで読み、英語順のまま完成します。`,
    occurrence: 1,
  }))
  grouped.set(item.sentence, decisions)
}

for (const item of READING_CONNECTOR_PREMATURE_CLOSURE_FIXES) {
  const decisions = grouped.get(item.sentence) ?? []
  decisions.push(item.correction)
  grouped.set(item.sentence, decisions)
}

export const READING_CONNECTOR_CLOSURE_CORRECTIONS = Object.freeze(
  Object.fromEntries(
    [...grouped].map(([sentence, decisions]) => [sentence, Object.freeze(decisions)]),
  ),
)
