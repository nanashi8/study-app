// 長文の本文で語をタップしたときの語義を、一文ずつ読んで決めた台帳。
// leaves（leaf の複数形か leave の三単現か）、saw（see の過去形か「のこぎり」か）、
// may（助動詞か「5月」か）のように、同じつづりで見出し語や品詞が割れる形は、
// つづりから引くだけでは文脈に合わない意味になる。そうした箇所だけをここに置く。
// キーは本文の英文そのもの。値は本文の語（小文字）→ 見出し語 id とその文での意味。
// passages.js が各文の sentence.gloss へ入れ、resolvePassageWord が最優先で使う。
// 本文の英文を書き換えたら、この台帳のキーも合わせる（check-data が照合する）。

const sense = (id, ja) => Object.freeze({ id, ja })
const words = (entries) => Object.freeze(entries)

// may は本文ではほぼ助動詞。見出し語 may は「5月」なので、助動詞の文はすべてここで指定する。
const MAY = sense('may_2', '〜かもしれない・〜することがある（助動詞）')
const MAY_PERMISSION = sense('may_2', '〜してよい・〜できる（助動詞）')

export const PASSAGE_SENSE_GLOSSES = Object.freeze({
  // p_4_library_event（図書館の週末イベント）
  'After the talk, children will work in small groups to build a paper model of the station.': words({
    talk: sense('talk', '話・講演'),
    work: sense('work', '作業する・取り組む'),
    build: sense('build', '組み立てる・作る'),
  }),
  'The library will provide paper and glue, so families do not need to bring craft materials.': words({
    provide: sense('provide', '用意する・提供する'),
    craft: sense('craft', '工作（craft materials で工作の材料）'),
  }),
  'Parents may help, but each child should write a name on the model and take it home at noon.': words({ may: MAY_PERMISSION }),
  'The event starts at ten in the morning and ends before lunch.': words({
    starts: sense('start', '始まる'),
    ends: sense('end', '終わる'),
  }),

  // p_3_school_garden（学校の裏の菜園）
  'At first, many students thought the work would be simple, but they soon learned that plants need careful attention.': words({
    thought: sense('think', '思った・考えた'),
    learned: sense('learn', '学んだ・分かった'),
  }),
  'In June, the students noticed that insects were eating the leaves of several plants.': words({ leaves: sense('leaf', '葉（複数）') }),
  'Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.': words({ research: sense('research', '調べる・研究する') }),
  'They learned that certain flowers attract insects that eat garden pests without harming the vegetables.': words({
    learned: sense('learn', '学んだ'),
    harming: sense('harm', '害を与える・傷つける'),
  }),
  'The class planted those flowers around the garden, and the number of damaged leaves soon decreased.': words({ leaves: sense('leaf', '葉（複数）') }),
  'Instead of simply giving the food away, the students visited the center and explained how they had grown it.': words({
    giving: sense('give', '（give 〜 away で）配ること'),
    away: sense('away', '（give 〜 away で）人に渡して・手放して'),
  }),
  'The older residents shared recipes and suggested vegetables that the class could plant in autumn.': words({ shared: sense('share', '分け合った・伝えた') }),
  'The students used this advice to plan a second garden, which made the project continue beyond one school term.': words({ used: sense('use', '使った') }),
  'It also gave them a chance to talk with older people who knew many useful farming tips.': words({ farming: sense('farm', '農業（の）') }),
  'By the end of the project, even the students who had disliked gardening were proud of the result.': words({ gardening: sense('garden', '庭仕事・畑仕事（gardening）') }),

  // p_pre2_museum_volunteers（博物館の若いボランティア）
  "Before the museum opens on Saturdays, the students meet a staff member and learn about the day's exhibition.": words({ opens: sense('open', '開く・開館する') }),
  'The work is not always easy because volunteers must communicate politely even when the building is crowded.': words({ politely: sense('polite', '礼儀正しく・丁寧に（politely）') }),
  'They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.': words({
    may: MAY,
    answer: sense('answer', '答え'),
    help: sense('help', '助け・手助け'),
  }),
  'This approach is more useful than giving visitors information that may be incorrect.': words({ may: MAY }),
  'For the museum, the benefit is clear as well.': words({ well: sense('well', '（as well で）〜もまた') }),
  'When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.': words({
    take: sense('take', '（take part で）参加する'),
    part: sense('part', '（take part で）参加する'),
    feel: sense('feel', '（〜に）感じられる'),
    open: sense('open', '開かれた・入りやすい'),
  }),
  'Staff members used to write long explanations for adults, but they now ask student volunteers to read the labels first.': words({ used: sense('use', '（used to で）以前は〜していた') }),
  'If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.': words({
    make: sense('make', '（O を C に）する'),
    clearer: sense('clear', 'より分かりやすい（clearの比較級）'),
  }),
  'The program shows that learning about the past can help people build stronger relationships in the present.': words({ learning: sense('learn', '学ぶこと') }),

  // p_pre2plus_repair_cafes（リペアカフェが教えてくれること）
  'Sometimes a product is badly damaged, but in other cases only a small part has stopped working.': words({
    badly: sense('bad', 'ひどく（badly）'),
    working: sense('work', '（機械が）動くこと'),
  }),
  'Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.': words({ finding: sense('find', '見つけること') }),
  'In response, communities in several countries have started events called repair cafes.': words({
    repair: sense('repair', '修理（repair cafe でリペアカフェ）'),
    called: sense('call', '〜と呼ばれる（called）'),
  }),
  'A repair cafe is different from a normal repair shop.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.': words({
    expected: sense('expect', '（be expected to 〜 で）〜することを求められる'),
    take: sense('take', '（take part で）参加する'),
    part: sense('part', '（take part で）参加する'),
    leaving: sense('leave', '置いていくこと'),
  }),
  'A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.': words({ may: MAY }),
  'Older residents may know how older machines were built, while younger participants may be more comfortable finding digital information.': words({
    may: MAY,
    finding: sense('find', '見つけること・探すこと'),
  }),
  'Supporters say repair cafes offer both environmental and social benefits.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.': words({ life: sense('life', '寿命（the life of a product で製品の寿命）') }),
  'Families may also save money, which is especially valuable when prices are rising.': words({ may: MAY }),
  'In addition, the events encourage people to think differently about ownership.': words({ addition: sense('addition', '（in addition で）さらに・加えて') }),
  'A device no longer seems like a closed box that only its manufacturer understands.': words({
    longer: sense('long', '（no longer で）もはや〜ない'),
    closed: sense('close', '閉じた・閉ざされた'),
  }),
  'Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.': words({
    may: MAY,
    'longer-lasting': sense('last', 'より長持ちする（longer-lasting）'),
  }),
  'However, repair cafes are not a complete solution.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'Critics therefore argue that manufacturers should make parts and instructions easier to obtain.': words({ make: sense('make', '（O を C に）する') }),
  'Repair cafes cannot change product design by themselves, but they can show consumers what prevents repairs.': words({
    repair: sense('repair', '修理（repair cafe でリペアカフェ）'),
    repairs: sense('repair', '修理（複数）'),
  }),
  'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.': words({
    may: MAY,
    turn: sense('turn', '（turn A into B で）AをBに変える'),
  }),

  // p_2_quiet_technology（公共空間の静かなテクノロジー）
  'When people discuss technology, they often imagine large machines, bright screens, or dramatic changes in daily life.': words({ changes: sense('change', '変化（複数）') }),
  'The system does not tell people what to do, but it gives them a better source of information.': words({ system: sense('system', '仕組み・システム') }),
  'Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.': words({
    'air-control': sense('air', '空調の（air-control）'),
    systems: sense('system', '仕組み・システム（複数）'),
  }),
  'Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.': words({
    may: MAY,
    becoming: sense('become', '〜になること'),
    system: sense('system', '仕組み・システム'),
  }),
  'Cost is still an important factor, and cities must consider whether new systems can be maintained for many years.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'For that reason, officials should explain clearly what kind of data is collected and how it will be protected.': words({ collected: sense('collect', '集められる') }),
  'If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.': words({
    may: MAY,
    make: sense('make', '（O を C に）する'),
    systems: sense('system', '仕組み・システム（複数）'),
  }),
  'City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.': words({
    left: sense('leave', '取り残された（leave outの過去分詞）'),
    system: sense('system', '仕組み・システム'),
  }),
  'In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.': words({
    repair: sense('repair', '修理'),
    stop: sense('stop', '停留所（bus stop でバス停）'),
    may: MAY,
  }),
  'Several cities have therefore begun small trial programs before introducing a system everywhere.': words({ system: sense('system', '仕組み・システム') }),
  'They compare energy use, waiting times, and complaints in different neighborhoods and then publish the results.': words({ use: sense('use', '使用（energy use でエネルギー使用量）') }),
  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': words({
    makes: sense('make', '（O を C に）する'),
    work: sense('work', 'うまくいく・役に立つ'),
  }),
  'Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.': words({ judged: sense('judge', '判断される・評価される') }),

  // p_pre1_resilient_cities（不確かな天候に備える都市設計）
  'In the past, local governments often treated floods, heat waves, and water shortages as separate problems.': words({ separate: sense('separate', '別々の・独立した') }),
  'For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.': words({
    building: sense('build', '建てること'),
    may: MAY,
  }),
  'Similarly, installing powerful air conditioners in public buildings may protect residents during heat waves, yet it can increase energy demand when the power supply is already under pressure.': words({
    may: MAY,
    supply: sense('supply', '供給（power supply で電力供給）'),
    air: sense('air', '空気（air conditioner でエアコン）'),
    under: sense('under', '（under pressure で）圧力を受けて・ひっ迫して'),
  }),
  'A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.': words({
    needs: sense('need', '必要なこと・ニーズ（複数）'),
    serve: sense('serve', '役立つ・（必要を）満たす'),
    once: sense('once', '（at once で）同時に'),
  }),
  'They provide shade, absorb rainwater, improve air quality, and make streets more pleasant for walking.': words({ make: sense('make', '（O を C に）する') }),
  'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.': words({ attempt: sense('attempt', '試み') }),
  'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.': words({
    cools: sense('cool', '涼しくする・冷やす'),
    may: MAY,
    'lower-income': sense('income', '所得の低い（lower-income）'),
  }),
  'Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.': words({ works: sense('work', '効果がある・うまくいく') }),
  'Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.': words({ map: sense('map', '地図に記す・地図にする') }),
  'This process takes time, and it may reveal disagreements about which projects should come first.': words({
    may: MAY,
    takes: sense('take', '（時間が）かかる'),
  }),
  'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.': words({ trust: sense('trust', '信頼') }),
  'Local knowledge also helps officials identify failures that computer models miss.': words({
    miss: sense('miss', '見落とす・とらえ損なう'),
    models: sense('model', '（computer model で）計算で予測するモデル'),
  }),
  'A drainage map may look complete, yet residents may know that blocked street drains regularly send water into a particular apartment building.': words({ may: MAY }),
  'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.': words({
    training: sense('train', '訓練すること'),
    may: MAY,
    lives: sense('life', '命（複数）'),
  }),
  'A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.': words({
    takes: sense('take', '（take 〜 seriously で）〜を真剣に受け止める'),
    over: sense('over', '〜にわたって'),
  }),
  "A project that performs well under today's conditions may be inadequate if migration, land use, or rainfall patterns change.": words({
    may: MAY,
    use: sense('use', '利用（land use で土地利用）'),
    performs: sense('perform', '機能する・成果を上げる'),
  }),
  'Setting review dates and publishing results allow governments to revise policies without treating revision as failure.': words({ setting: sense('set', '定めること・設けること') }),
  'As climate conditions remain uncertain, the cities that adapt most successfully will probably be those that combine technical knowledge with public participation.': words({ successfully: sense('successful', 'うまく・首尾よく（successfully）') }),

  // p_1_collective_memory（集合的記憶のもろさ）
  'Societies often assume that important events will be remembered simply because they are recorded in books, archives, or digital databases.': words({
    remembered: sense('remember', '覚えられる・記憶される（受け身）'),
    recorded: sense('record', '記録される（受け身）'),
  }),
  'Yet collective memory is a far more fragile phenomenon than the existence of records might suggest.': words({ far: sense('far', 'はるかに（比較級を強める）') }),
  'A document can survive for centuries and still fail to influence how later generations understand the past.': words({ fail: sense('fail', '（fail to 〜 で）〜しない・〜できない') }),
  'In practice, however, abundance can produce a different kind of loss.': words({ practice: sense('practice', '実際（in practice で実際には）') }),
  'When search results, short videos, and algorithmic recommendations compete for attention, materials that require slow reading or moral reflection may become almost invisible.': words({
    search: sense('search', '検索（search results で検索結果）'),
    may: MAY,
  }),
  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
    presented: sense('present', '提示される（presentの過去分詞）'),
  }),
  'Digital records also depend on technical systems whose apparent permanence can be misleading.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    may: MAY,
    system: sense('system', '仕組み・システム'),
    neglected: sense('neglect', '放置される・手入れされない（受け身）'),
  }),
  'More subtly, platforms can revise the categories and rankings through which users encounter material without deleting a single record.': words({
    platforms: sense('platform', '（ネット上の）サービス・プラットフォーム'),
    through: sense('through', '〜を通して'),
  }),
  'Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.': words({ make: sense('make', '（O を C に）する') }),
  'This raises a difficult question about institutional responsibility.': words({ raises: sense('raise', '（問題を）提起する・投げかける') }),
  'Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so that they can protect records from temporary political pressure.': words({ traditionally: sense('traditional', '伝統的に・昔から（traditionally）') }),
  'Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.': words({ made: sense('make', '（決定が）なされる（受け身）') }),
  'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.': words({ calls: sense('call', '求める声・呼びかけ（複数）') }),
  'A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.': words({
    may: MAY,
    trust: sense('trust', '信頼'),
    loudly: sense('loud', '大きな声で（loudly）'),
  }),
  'Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.': words({
    challenge: sense('challenge', '異議（を唱えること）'),
    hear: sense('hear', '（意見を）聞く'),
  }),
  'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.': words({
    may: MAY,
    others: sense('other', 'ほかの人々（others）'),
  }),
  'Education plays a central role in sustaining that discipline, but the task is more demanding than adding a few historical dates to a curriculum.': words({ plays: sense('play', '（役割を）果たす') }),
  'Comparing conflicting accounts can help students see that disagreement is not the same as ignorance.': words({ accounts: sense('account', '（出来事の）説明・記述') }),
  'Two historians may accept the same evidence yet assign different significance to it because they ask different questions.': words({ may: MAY }),
  'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.': words({
    lies: sense('lie_2', '（〜に）ある'),
    stating: sense('state', '述べること'),
    ends: sense('end', '終わる'),
  }),
  'At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.': words({
    turning: sense('turn', '（turn into 〜 で）〜に変わること'),
    time: sense('time', '（at the same time で）同時に'),
  }),
  'If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.': words({ account: sense('account', '（出来事の）説明・記述') }),
  'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.': words({ platforms: sense('platform', '（ネット上の）サービス・プラットフォーム') }),
  "A rumor that confirms a community's self-image may travel farther than a well-documented study that complicates it.": words({
    may: MAY,
    'self-image': sense('image', '自己像（self-image）'),
    travel: sense('travel', '（うわさが）広まる・伝わる'),
    'well-documented': sense('document', '十分な記録に基づく（well-documented）'),
  }),
  'Some observers respond by demanding that platforms remove misleading historical claims more aggressively.': words({
    demanding: sense('demand', '要求すること・求めること'),
    platforms: sense('platform', '（ネット上の）サービス・プラットフォーム'),
    aggressively: sense('aggressive', '強硬に・積極的に（aggressively）'),
  }),
  'Although such action can limit obvious fabrications, it also gives private companies substantial authority over public memory.': words({ over: sense('over', '〜に対する（権限など）') }),
  'The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.': words({ moderation: sense('moderation', '（投稿の）管理・監視') }),
  "A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens' judgment.": words({
    may: MAY,
    circulation: sense('circulation', '（情報の）広まり・流通'),
  }),
  'This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.': words({ reached: sense('reach', '（情報が）届いた（人々）') }),
  'Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.': words({ deliberate: sense('deliberate', '話し合って考える・熟議する（動詞）') }),
  'Remembering, in this sense, is not a passive act of storage but an active practice of civic discipline.': words({
    act: sense('act', '行為'),
    sense: sense('sense', '意味（in this sense でこの意味で）'),
  }),
  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': words({ declines: sense('decline', '衰える・弱まる') }),

  // p_5_school_open_day（学校公開日の案内）
  'Our school has an open day next Saturday.': words({ open: sense('open', '公開の（open day で学校公開日）') }),
  'At ten, the music club sings in the school hall.': words({ hall: sense('hall', '講堂・ホール') }),
  'Please bring your own drinks.': words({ own: sense('own', '自分自身の') }),
  'At one, the sports club meets in the gym.': words({ meets: sense('meet', '集まる') }),
  'The open day will end at three.': words({
    open: sense('open', '公開の（open day で学校公開日）'),
    end: sense('end', '終わる'),
  }),

  // p_4_bicycle_safety（安全な自転車週間）
  'It begins with a short talk at the community center on Monday evening.': words({ talk: sense('talk', '話・講演') }),
  'Children will also learn the correct place to stop before they cross a busy road.': words({
    stop: sense('stop', '止まる'),
    busy: sense('busy', '（道路が）交通量の多い・にぎやかな'),
  }),
  'They must use bicycle lights because drivers may not notice them after dark.': words({
    may: MAY,
    lights: sense('light', 'ライト・明かり（複数）'),
    dark: sense('dark', '（after dark で）暗くなってから'),
  }),
  'Local shop workers will check the brakes, seats, and lights for free.': words({
    lights: sense('light', 'ライト・明かり（複数）'),
    free: sense('free', '（for free で）無料で'),
  }),
  'The week ends with a practice ride on Saturday morning.': words({
    ride: sense('ride', '走行（practice ride で練習走行）'),
    ends: sense('end', '終わる'),
    practice: sense('practice', '練習（の）'),
  }),
  'Parents should join the ride too, so they can practice the rules with their children.': words({ ride: sense('ride', '走行') }),

  // p_3_lunch_food_waste（小さな皿から始まる大きな変化）
  'Students at one junior high school noticed that a lot of food was left in the cafeteria after lunch.': words({ left: sense('left_2', '残された・残っている') }),
  'The cooking staff had to throw the leftovers away, even though most of the food was still fresh.': words({
    throw: sense('throw', '（throw away で）捨てる'),
    away: sense('away', '（throw away で）捨てる'),
  }),
  'A science class decided to study the problem instead of simply asking everyone to eat more.': words({ study: sense('study', '調べる') }),
  'The class then measured the amount of rice, vegetables, and bread left each day for two weeks.': words({ left: sense('left_2', '残った・残っている') }),
  'They discovered that waste was greatest on days when every student received the same large portion.': words({
    discovered: sense('discover', '発見した・分かった'),
    greatest: sense('great', '最も多い・最大の（greatの最上級）'),
  }),
  'The students suggested offering two plate sizes at the start of lunch.': words({ start: sense('start', '始め') }),
  'The cafeteria also put pictures of both portions near the entrance so students could choose before reaching the counter.': words({ reaching: sense('reach', '（〜に）着くこと') }),
  'The students now share their results with nearby schools and encourage them to measure their own waste.': words({ own: sense('own', '自分たちの') }),
  'They explain that every meal uses water, energy, and work before it reaches a plate, so even a small improvement can protect valuable resources.': words({
    work: sense('work', '労力・手間'),
    reaches: sense('reach', '（〜に）届く'),
  }),

  // p_pre2_later_school_start（学校の始業時刻を遅らせるべきか）
  'Many teenagers arrive at school feeling tired, even when they try to go to bed at a reasonable time.': words({ feeling: sense('feel', '感じながら・感じている') }),
  'Sleep researchers explain that the body clock often changes during the teenage years.': words({ sleep: sense('sleep', '睡眠') }),
  'The brain begins to feel sleepy later at night, but students must still wake up early for school.': words({ up: sense('up', '（wake up で）目を覚ます・起きる') }),
  'For this reason, some schools have moved their starting time from eight o’clock to a later hour.': words({ starting: sense('start', '開始の（starting time で始業時刻）') }),
  'Several studies report that students at these schools sleep longer on ordinary weekdays.': words({ longer: sense('long', 'より長く（longの比較級）') }),
  'Teachers have also seen greater attention and fewer late arrivals in morning classes.': words({ greater: sense('great', 'より大きな・より高い（greatの比較級）') }),
  'A later start, however, can cause practical problems for families and communities.': words({
    start: sense('start', '開始・始業'),
    later: sense('later', 'より遅い（lateの比較級）'),
  }),
  'School buses may need new schedules, which can increase transportation costs.': words({ may: MAY }),
  'Sports practice and music activities may finish after dark, especially in winter.': words({
    may: MAY,
    dark: sense('dark', '（after dark で）暗くなってから'),
  }),
  'Some parents also depend on older children to care for younger family members after school.': words({ care: sense('care', '世話をする（care for）') }),
  'At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.': words({
    sleep: sense('sleep', '睡眠'),
    change: sense('change', '変更・変化'),
  }),
  'This cooperation made families more willing to try the new schedule for a full year.': words({ made: sense('make', '（O を C に）した') }),
  'Schools need to examine bus routes, club times, and family needs before choosing a new schedule.': words({ needs: sense('need', '必要なこと・ニーズ（複数）') }),
  'They should also teach students that a later start is not an invitation to stay online longer at night.': words({
    start: sense('start', '開始・始業'),
    later: sense('later', 'より遅い（lateの比較級）'),
    invitation: sense('invitation', '誘い・（〜してよいという）きっかけ'),
    longer: sense('long', 'より長く（longの比較級）'),
  }),
  'The strongest argument for change does not demand one starting time for every school.': words({
    strongest: sense('strong', '最も説得力のある（strongの最上級）'),
    change: sense('change', '変更・変化'),
    starting: sense('start', '開始の（starting time で始業時刻）'),
  }),
  'It is that school policies should take evidence about teenage sleep seriously.': words({
    sleep: sense('sleep', '睡眠'),
    take: sense('take', '（take 〜 seriously で）〜を真剣に受け止める'),
  }),
  'A community can then balance health benefits with local challenges and test whether its plan is effective.': words({ balance: sense('balance', '両立させる・釣り合わせる') }),
  'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.': words({
    review: sense('review', '見直す'),
    changes: sense('change', '変更（複数）'),
  }),

  // p_pre2plus_city_bird_count（鳥を数えて科学を支える）
  'Professional scientists cannot be everywhere at once, especially when they study animals that move across wide areas.': words({
    once: sense('once', '（at once で）同時に'),
    across: sense('across', '〜にわたって・〜じゅうを'),
  }),
  'One common project asks participants to observe birds in gardens, parks, and school grounds.': words({ grounds: sense('ground', '（school grounds で）校庭・敷地') }),
  'When thousands of people send reports, researchers can discover patterns that a small team might miss.': words({ miss: sense('miss', '見落とす・とらえ損なう') }),
  'For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.': words({ may: MAY }),
  'Such changes can suggest that weather, food, or habitat conditions are affecting bird populations.': words({
    changes: sense('change', '変化（複数）'),
    populations: sense('population', '（生き物の）数・個体数（複数）'),
  }),
  'However, large numbers of reports cannot automatically ensure reliable data in practice.': words({ practice: sense('practice', '実際（in practice で実際には）') }),
  'An experienced observer may identify a bird by its song, while a beginner may confuse two similar species.': words({
    may: MAY,
    song: sense('song', '（鳥の）さえずり・鳴き声'),
  }),
  'People also visit places that are easy to reach more often than distant or unsafe locations.': words({ reach: sense('reach', '（場所に）たどり着く') }),
  'This creates a bias because some habitats receive many reports and others receive few.': words({ others: sense('other', 'ほかのもの（others）') }),
  'Good projects reduce these problems through clear training and careful design.': words({ through: sense('through', '〜によって・〜を通して') }),
  'They may ask participants to watch for the same length of time and to report visits when no birds appeared.': words({
    may: MAY,
    visits: sense('visit', '訪問（複数）'),
  }),
  'Some projects also send several volunteers the same observation task and compare their answers to estimate how often mistakes occur.': words({ answers: sense('answer', '答え（複数）・回答') }),
  'Researchers can then compare similar observations and estimate where the data may be incomplete.': words({ may: MAY }),
  'Scientists contribute research methods that turn those observations into careful conclusions.': words({ turn: sense('turn', '（turn A into B で）AをBに変える') }),
  'Together, they can follow changes in biodiversity and identify places that may need conservation.': words({
    may: MAY,
    follow: sense('follow', '（変化を）追う・見守る'),
    changes: sense('change', '変化（複数）'),
  }),
  'The partnership also shows that useful science depends on recording uncertainty as honestly as discovery.': words({ honestly: sense('honest', '正直に（honestly）') }),

  // p_2_online_health_claims（オンラインの健康情報をどう読むか）
  'A short video claims that a certain drink improves memory, and thousands of users share it within a day.': words({ claims: sense('claim', '主張する') }),
  'The speaker may sound confident and may even mention a scientific study.': words({ may: MAY }),
  'Readers can check a university report that describes its methods more easily than a video with no named source.': words({ named: sense('name', '名前の示された（named）') }),
  'Readers still need to examine how the study was designed and whether other researchers found similar results.': words({ found: sense('find', '見つけた・得た') }),
  'A result from twelve volunteers may be interesting, but it may not apply to people of different ages or health conditions.': words({
    may: MAY,
    apply: sense('apply', '当てはまる（apply to 〜）'),
  }),
  'Without such a comparison, improvement may come from sleep, diet, expectation, or simple chance.': words({
    may: MAY,
    sleep: sense('sleep', '睡眠'),
    come: sense('come', '（〜から）生じる'),
    chance: sense('chance', '偶然'),
  }),
  'Income, working hours, and social habits might influence both tea drinking and stress as well.': words({
    working: sense('work', '働く（working hours で勤務時間）'),
    well: sense('well', '（as well で）〜もまた'),
  }),
  'Readers should also distinguish an early report from a review that considers many studies.': words({
    early: sense('early', '初期の・早い段階の'),
    review: sense('review', '（多くの研究をまとめた）総説・まとめ'),
  }),
  'Company funding does not automatically make research false, but readers should check whether the company sells the product being tested.': words({
    being: sense('be', '〜されている（beの-ing形）'),
    make: sense('make', '（O を C に）する'),
  }),
  'Independent review and a clear statement of possible conflicts make the evidence easier to evaluate.': words({ make: sense('make', '（O を C に）する') }),
  'Instead, they help readers to judge how strong a conclusion can reasonably be.': words({ judge: sense('judge', '判断する') }),
  'When a decision involves serious health risks, online reading should support, not replace, advice from a qualified professional.': words({ qualified: sense('qualify', '資格のある（qualified）') }),
  'Responsible readers are not people who doubt everything; they are people who match their confidence to the quality of the evidence.': words({ match: sense('match', '（〜に）合わせる') }),

  // p_pre1_cashless_inclusion（キャッシュレスの便利さが排除を生むとき）
  'Cashless payment has recently moved from a convenient option to the expected form of payment in many shops, transport systems, and public facilities.': words({
    moved: sense('move', '（〜から〜へ）変わった・移った'),
    expected: sense('expect', '当然とされる・求められる（expected）'),
    systems: sense('system', '（交通の）仕組み・機関（複数）'),
  }),
  'Supporters cite faster transactions, lower handling costs, and reduced risk of theft for merchants.': words({
    lower: sense('lower', 'より低い（lowの比較級）'),
    handling: sense('handle', '取り扱い（handling costs で取り扱いにかかる費用）'),
  }),
  'Digital records can also help consumers follow their spending and allow small businesses to sell goods online.': words({ follow: sense('follow', '（支出を）追う・把握する') }),
  'These benefits are real, but they are not shared equally.': words({ shared: sense('share', '分け合われる（受け身）') }),
  'Others can use digital services but struggle with small fees, complex passwords, or interfaces that were not designed for disabilities.': words({ others: sense('other', 'ほかの人々（others）') }),
  'Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.': words({
    may: MAY,
    stored: sense('store', '保存される（受け身）'),
  }),
  'Such records can detect fraud and improve services, yet they can also reveal medical needs, political interests, or daily movements.': words({ needs: sense('need', '必要なこと・ニーズ（複数）') }),
  'People with little economic or political power may be especially vulnerable when they cannot choose a private alternative.': words({ may: MAY }),
  'A common response is to teach digital skills and provide low-cost accounts.': words({ 'low-cost': sense('cost', '安い・低価格の（low-cost）') }),
  'Training provides only limited value in rural areas with weak mobile service or during payment system failures after serious natural disasters and emergencies.': words({ system: sense('system', '仕組み・システム') }),
  'Nor should inclusion mean forcing everyone into a system simply because institutions find it efficient.': words({
    forcing: sense('force', '（無理に）〜させること'),
    system: sense('system', '仕組み・システム'),
    find: sense('find', '（O を C だと）思う・感じる'),
  }),
  'Cash can also provide a simple budgeting tool for households whose income changes from week to week.': words({ budgeting: sense('budget', 'やりくり・家計の管理（budgeting）') }),
  'A fixed amount in an envelope stays visible, while digital balances may be divided across several apps and delayed transactions.': words({
    may: MAY,
    stays: sense('stay', '（〜の）ままである'),
    across: sense('across', '（いくつもの〜に）またがって'),
  }),
  'This does not make cash universally superior, but it shows why a preferred tool can depend on a person’s circumstances rather than technical knowledge alone.': words({
    make: sense('make', '（O を C に）する'),
    universally: sense('universal', 'どんな場合でも・例外なく（universally）'),
  }),
  'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.': words({ encouraging: sense('encourage', '促しながら・後押ししながら') }),
  'Critics argue that such rules create costs for merchants who must maintain two payment systems.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'Policy can reduce the burden through shared cash services, tax incentives, or exemptions for clearly defined cases.': words({ through: sense('through', '〜によって・〜を通して') }),
  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': words({ judged: sense('judge', '判断される・評価される') }),
  'A payment system is part of social infrastructure, and infrastructure must remain usable under varied human and technical conditions.': words({ system: sense('system', '仕組み・システム') }),
  'Cash may sometimes appear inefficient as an option, just as backup power can appear wasteful on an ordinary day.': words({ may: MAY }),
  'The goal need not be to stop the transition toward digital payment.': words({ need: sense('need', '（need not で）〜である必要はない') }),
  'A genuinely modern system is not one that eliminates older tools as quickly as possible, but one that combines convenience, privacy, inclusion, and flexibility in practice.': words({
    system: sense('system', '仕組み・システム'),
    practice: sense('practice', '実際（in practice で実際には）'),
  }),

  // p_1_metric_fixation（測定値と本来の目的）
  'Modern institutions measure almost everything they hope to improve in complex systems with competing public purposes.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'Such indicators give institutions a common language for judging performance across places and over time.': words({
    judging: sense('judge', '判断すること・評価すること'),
    across: sense('across', '（いくつもの〜に）またがって'),
    over: sense('over', '（over time で）時間とともに・長い期間にわたって'),
  }),
  'The difficulty begins when a useful measure becomes the institution’s practical definition of success.': words({ measure: sense('measure', '尺度・指標') }),
  'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.': words({
    reading: sense('read', '読解（reading test で読解テスト）'),
    makes: sense('make', '（O を C に）する'),
  }),
  'Once rewards or penalties depend heavily on the score, people have an incentive to optimize the proxy rather than pursue the underlying mission.': words({ once: sense('once', 'いったん〜すると（接続詞）') }),
  'This response need not involve obvious cheating.': words({ need: sense('need', '（need not で）〜する必要はない') }),
  'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.': words({
    may: MAY,
    tested: sense('test', 'テストされる（easily tested で簡単にテストできる）'),
  }),
  'A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.': words({
    may: MAY,
    'waiting-time': sense('wait', '待ち時間の（waiting-time）'),
    starts: sense('start', '始まる'),
  }),
  'Each action can improve the reported number without producing an equivalent improvement in education or care.': words({
    reported: sense('report', '報告された（reported）'),
    care: sense('care', '（病院での）ケア・医療'),
  }),
  'Less visible distortions arise when workers avoid experiments whose uncertain outcomes could damage an otherwise strong record.': words({ otherwise: sense('otherwise', 'それ以外の点では') }),
  'A narrow target may consequently punish the very risk taking required for genuine learning.': words({
    may: MAY,
    taking: sense('take', '（risk taking で）あえて危険を冒すこと'),
  }),
  'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.': words({
    trusted: sense('trust', '信頼される（受け身）'),
    exercise: sense('exercise', '（判断力を）働かせる・用いる'),
  }),
  'That position underestimates why measurement became attractive in the first place.': words({ place: sense('place', '（in the first place で）そもそも') }),
  'Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.': words({
    challenge: sense('challenge', '異議を唱える'),
    informed: sense('inform', '情報に基づいた（informed）'),
  }),
  'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.': words({
    may: MAY,
    fails: sense('fail', '（人の）役に立たない・見捨てる'),
  }),
  'Better systems treat indicators as evidence within a process of judgment rather than as automatic verdicts.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'First, decision makers should use multiple measures that illuminate different parts of the mission.': words({
    makers: sense('maker', '（decision makers で）決定をする人'),
    measures: sense('measure', '尺度・指標（複数）'),
  }),
  'Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.': words({
    may: MAY,
    work: sense('work', '（生徒が作った）作品・課題'),
  }),
  'No collection of measures eliminates judgment, but plural indicators make it harder for one narrow target to dominate behavior.': words({
    measures: sense('measure', '尺度・指標（複数）'),
    make: sense('make', '（O を C に）する'),
  }),
  'Missed medical appointments could indicate irresponsibility, but interviews might reveal that a new transport schedule made the clinic inaccessible.': words({
    missed: sense('miss', '（予約に）来なかった・すっぽかされた'),
    made: sense('make', '（O を C に）した'),
  }),
  'Context does not excuse every poor result; it helps institutions distinguish causes that demand different responses.': words({ poor: sense('poor', '悪い・低い（成績などが）') }),
  'Third, organizations must examine how people adapt once a measure carries consequences.': words({
    once: sense('once', 'いったん〜すると（接続詞）'),
    measure: sense('measure', '尺度・指標'),
    carries: sense('carry', '（結果を）伴う'),
  }),
  'Regular audits should look not only for false reports but also for neglected tasks, displaced risks, and groups that disappear from the data.': words({
    look: sense('look', '（look for で）探す'),
    neglected: sense('neglect', 'おろそかにされた（neglected）'),
  }),
  'Evaluation systems must be adaptive because the behavior they observe changes in response to observation.': words({ systems: sense('system', '仕組み・システム（複数）') }),
  'A dashboard can appear open while hiding decisions about definitions, missing cases, statistical adjustments, and acceptable thresholds.': words({ open: sense('open', '開かれた・公開された') }),
  'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.': words({
    use: sense('use', '使用・使い方'),
    measure: sense('measure', '尺度・指標'),
  }),
  'There is also a political question about who bears the burden of being measured.': words({
    bears: sense('bear', '負う・引き受ける'),
    being: sense('be', '〜されること（beの-ing形）'),
  }),
  'Frontline workers and vulnerable citizens often supply detailed data, while senior institutions retain discretion over how the numbers are interpreted.': words({ over: sense('over', '〜について（の権限）') }),
  'If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.': words({
    may: MAY,
    below: sense('below', '下の立場で（below）'),
    above: sense('above', '上の立場で（above）'),
    system: sense('system', '仕組み・システム'),
  }),
  'Institutions cannot precisely measure trust, intellectual courage, dignity, and social repair, yet they cannot responsibly ignore these values.': words({
    trust: sense('trust', '信頼'),
    repair: sense('repair', '修復'),
  }),
  'The inability to assign a clean number is not evidence that a value is unreal; it is a warning that judgment must remain visible and contestable.': words({ clean: sense('clean', 'すっきりした・はっきりした（数値など）') }),
  'Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.': words({
    trust: sense('trust', '信頼'),
    being: sense('be', '〜されること（beの-ing形）'),
    mistaken: sense('mistake', '取り違えられる（mistakeの過去分詞）'),
    stating: sense('state', '述べること'),
  }),
  'They should direct attention toward patterns that require explanation, provide feedback for revision, and reveal whether policies serve their stated mission.': words({
    direct: sense('direct', '（注意を）向ける'),
    serve: sense('serve', '役立つ・（目的に）かなう'),
    stated: sense('state', '掲げられた・明言された（stated）'),
  }),
  'When a measure becomes a substitute for that mission, apparent precision can conceal institutional drift.': words({
    drift: sense('drift', '漂流・ずれ'),
    measure: sense('measure', '尺度・指標'),
  }),
  'When it remains one disciplined source of evidence among others, measurement can support both learning and democratic accountability across changing circumstances and competing interpretations of public value over time.': words({
    disciplined: sense('discipline', 'きちんとした手順に基づく（disciplined）'),
    others: sense('other', 'ほかのもの（others）'),
    across: sense('across', '（さまざまな〜を）通じて'),
    over: sense('over', '（over time で）時間とともに・長い期間にわたって'),
  }),

  // p_5_weather_field_trip（遠足の二つの予定）
  'We meet at school at eight in the morning.': words({ meet: sense('meet', '集まる') }),
  'First, a guide shows us the new animal hospital.': words({ guide: sense('guide', '案内係・ガイド') }),
  'If it rains, we visit the science museum instead.': words({ rains: sense('rain', '雨が降る') }),

  // p_4_emergency_map（雨の日のための安全マップ）
  'Heavy rain sometimes covers streets in our town with water.': words({ heavy: sense('heavy', '激しい（heavy rain で大雨）') }),
  'They first interviewed residents about places that became dangerous during storms.': words({ interviewed: sense('interview', '話を聞いた・インタビューした') }),
  'Water can rise there quickly, so the students marked another route to the community center.': words({ marked: sense('mark', '（地図に）印をつけた・示した') }),
  'An older resident also showed them a narrow street without lights.': words({ lights: sense('light', '明かり・街灯（複数）') }),
  'The map tells walkers to avoid that street after dark.': words({ dark: sense('dark', '（after dark で）暗くなってから') }),
  'When the first map was ready, families tested it on a rainy afternoon.': words({ tested: sense('test', '試した') }),
  'They found that one sign was hidden behind a large tree.': words({ found: sense('find', '気づいた・分かった') }),
  'They also asked for larger letters and simple pictures.': words({ asked: sense('ask', '（ask for で）求めた') }),
  'Families suggested marking places where people could wait safely if the rain grew stronger.': words({ grew: sense('grow', '（〜に）なった（grow stronger で強まった）') }),

  // p_3_multilingual_town_guide（旅行者が使える街歩きガイド）
  'Local students wanted to help them explore the town without getting lost.': words({ getting: sense('get', '（get lost で）道に迷うこと') }),
  'They decided to create a walking guide in Japanese and easy English.': words({ guide: sense('guide', '案内（書）・ガイド') }),
  'Others wanted to know where they could refill water bottles or leave trash.': words({
    others: sense('other', 'ほかの人々（others）'),
    leave: sense('leave', '（ごみを）置いていく・捨てる'),
  }),
  'They tested the walking times twice because busy summer streets could slow a group.': words({
    tested: sense('test', '試した'),
    busy: sense('busy', 'にぎやかな・人通りの多い'),
    slow: sense('slow', '遅くする（動詞）'),
  }),
  'Restaurant owners checked names, prices, and business hours for mistakes.': words({ business: sense('business', '営業（business hours で営業時間）') }),
  'Next, exchange students used the first version without help from the class.': words({
    used: sense('use', '使った'),
    help: sense('help', '助け・手助け'),
    exchange: sense('exchange', '交換（exchange student で交換留学生）'),
  }),
  'They understood the English but sometimes missed a turn shown only by a street name.': words({
    turn: sense('turn', '曲がり角'),
    missed: sense('miss', '見落とした・見逃した'),
  }),
  'One student in a wheelchair also found that a short route had many steps.': words({ found: sense('find', '気づいた・分かった') }),
  'The finished guide is now available at the station and on the town website.': words({
    finished: sense('finish', '完成した（finished）'),
    guide: sense('guide', '案内（書）・ガイド'),
  }),
  'A small note asks users to report information that is no longer correct.': words({ longer: sense('long', '（no longer で）もはや〜ない') }),
  'The students learned that good translation requires more than replacing words.': words({ learned: sense('learn', '学んだ') }),

  // p_pre2_phone_free_focus（学校の「スマホなしの1時間」）
  'Many students say that phones help them organize homework and contact their families.': words({ organize: sense('organize', '整理する・計画的に進める') }),
  'The same phones, however, can interrupt study with messages that feel urgent.': words({ feel: sense('feel', '（〜に）感じられる') }),
  'One high school tested a daily phone-free hour instead of banning phones all day.': words({
    tested: sense('test', '試した'),
    'phone-free': sense('phone', 'スマホを使わない（phone-free）'),
  }),
  'At the beginning of the hour, students placed phones in their bags or lockers.': words({ placed: sense('place', '置いた') }),
  'The office kept a number that families could call in an emergency.': words({ office: sense('office', '（学校の）事務室・職員室') }),
  'Teachers used the time for reading, writing, or problems that required steady attention.': words({ used: sense('use', '使った') }),
  'Both groups completed the same short reading tasks each Friday.': words({ reading: sense('read', '読解（reading tasks で読解課題）') }),
  'Students also reported how often their attention moved away from the work.': words({ work: sense('work', '（取り組んでいる）課題・作業') }),
  'The school revealed the comparison group only after the four-week trial ended.': words({
    'four-week': sense('week', '4週間の（four-week）'),
    ended: sense('end', '終わった'),
  }),
  'This reduced the chance that expectations alone would change how students described their focus.': words({
    reduced: sense('reduce', '減らした・小さくした'),
    focus: sense('focus', '集中'),
    chance: sense('chance', '可能性・見込み'),
  }),
  'The phone-free classes finished slightly more questions and reported fewer interruptions.': words({ 'phone-free': sense('phone', 'スマホを使わない（phone-free）') }),
  'The school compared completion rates but did not treat a few extra answers as proof of deeper learning.': words({ answers: sense('answer', '答え（複数）・解答') }),
  'Others needed translation or reading tools that were available on their phones.': words({
    reading: sense('read', '読むための（reading tools で読むのを助けるツール）'),
    others: sense('other', 'ほかの人々（others）'),
  }),
  'The school now keeps the hour but reviews the rules every term.': words({ reviews: sense('review', '見直す') }),
  'At home, students can silence alerts or place a device out of reach while studying.': words({
    silence: sense('silence', '（通知を）消す・静かにさせる'),
    alerts: sense('alert', '通知・警報（複数）'),
    reach: sense('reach', '（out of reach で）手の届かない所'),
    place: sense('place', '置く'),
  }),
  'The goal is not simply to remove phones, but to build habits that protect attention.': words({ build: sense('build', '（習慣を）つくる・身につける') }),

  // p_pre2plus_clothing_second_life（服に役立つ「二度目の生」を与える）
  'Producing clothing requires water, energy, labor, and transportation across long distances.': words({ across: sense('across', '〜を越えて・〜にわたって') }),
  'Yet many useful clothes are thrown away because styles change or small parts break.': words({
    away: sense('away', '（throw away で）捨てる'),
    break: sense('break', '壊れる'),
  }),
  'A group of schools created a clothing exchange with a repair station.': words({
    repair: sense('repair', '修理（repair station で修理コーナー）'),
    exchange: sense('exchange', '交換会・交換の場'),
    station: sense('station', '（repair station で）修理コーナー'),
  }),
  'Families brought clean items and described any damage on a small card.': words({ damage: sense('damage', '傷み・損傷') }),
  'At the repair table, visitors learned to replace buttons and close simple tears.': words({
    repair: sense('repair', '修理（repair table で修理テーブル）'),
    learned: sense('learn', '学んだ・身につけた'),
    close: sense('close', '（裂け目を）ふさぐ・縫い合わせる'),
  }),
  'A repair did not need to look perfect; it needed to make the item safe and useful.': words({
    repair: sense('repair', '修理'),
    make: sense('make', '（O を C に）する'),
  }),
  'Clothes that could not be worn were not automatically counted as useless.': words({
    worn: sense('wear', '着られる（wear の過去分詞）'),
    counted: sense('count', '（〜と）みなされた・数えられた'),
  }),
  'Some cotton shirts became cleaning cloths, while artists used colorful material in school projects.': words({
    used: sense('use', '使った'),
    cleaning: sense('clean', '掃除用の（cleaning cloth で雑巾）'),
  }),
  'Items made from one clearly labeled material were easier to sort than items with hidden mixtures.': words({
    labeled: sense('label', 'ラベルで表示された'),
    made: sense('make', '作られた（made from 〜 で〜から作られた）'),
  }),
  'The organizers wanted to know whether the exchange truly reduced waste.': words({ reduced: sense('reduce', '減らした') }),
  'Counting exchanged items alone would give an incomplete answer.': words({
    answer: sense('answer', '答え'),
    exchanged: sense('exchange', '交換された（exchanged）'),
  }),
  'A shirt has little environmental benefit if it remains unused in another closet.': words({ little: sense('little', 'ほとんど〜ない（little＋名詞）') }),
  'The survey asked whether an exchanged item replaced a planned purchase, since that choice could reduce new production.': words({
    exchanged: sense('exchange', '交換された（exchanged）'),
    planned: sense('plan', '予定していた（planned）'),
  }),
  'The project also had to consider hygiene, personal taste, and dignity.': words({ taste: sense('taste', '好み') }),
  'Nobody was required to explain why they wanted free or low-cost clothing.': words({ 'low-cost': sense('cost', '安い・低価格の（low-cost）') }),
  'Students, teachers, and neighbors all used the same tables and choice system.': words({
    used: sense('use', '使った'),
    system: sense('system', '仕組み・方式'),
  }),
  'The exchange showed that local action can extend the life of many products.': words({ life: sense('life', '寿命・使える期間') }),
  'A useful second life begins with exchange and repair, but it also depends on durable design and fewer unnecessary purchases.': words({
    repair: sense('repair', '修理'),
    life: sense('life', '（second life で）第二の使い道・再利用'),
  }),

  // p_2_vertical_farming（垂直農場にできること・できないこと）
  'Vertical farms grow crops on stacked shelves inside buildings rather than across wide fields.': words({
    stacked: sense('stack', '積み重ねられた（stacked）'),
    grow: sense('grow', '育てる・栽培する'),
    across: sense('across', '〜一面に・〜じゅうで'),
    fields: sense('field', '畑（複数）'),
  }),
  'Plants receive carefully controlled light, water, temperature, and nutrients without ordinary soil.': words({ controlled: sense('control', '管理された（controlled）') }),
  'Because water is collected and used again, some systems use far less water than field farming.': words({
    collected: sense('collect', '集められる・回収される'),
    systems: sense('system', '仕組み・設備（複数）'),
    far: sense('far', 'はるかに（比較級を強める）'),
    field: sense('field', '畑（field farming で畑での農業）'),
    farming: sense('farm', '農業（farming）'),
  }),
  'Shorter transport can reduce damaged produce and allow growers to harvest food when it is ready.': words({ produce: sense('produce', '農産物') }),
  'These advantages, however, do not make every vertical farm environmentally efficient.': words({ make: sense('make', '（O を C に）する') }),
  'Artificial lights and cooling systems may require large amounts of electricity.': words({
    may: MAY,
    cooling: sense('cool', '冷却の・冷房の（cooling）'),
    systems: sense('system', '仕組み・設備（複数）'),
  }),
  'If that electricity comes from fossil fuels, saved transport may not balance the extra energy use.': words({
    may: MAY,
    balance: sense('balance', '埋め合わせる・釣り合わせる'),
    use: sense('use', '使用（energy use でエネルギー使用量）'),
    comes: sense('come', '（〜から）得られる・来る'),
    saved: sense('save', '節約された（saved）'),
  }),
  'Farms that buy renewable power or use waste heat from nearby buildings may produce a different balance.': words({
    may: MAY,
    waste: sense('waste', '廃棄の（waste heat で廃熱）'),
  }),
  'The answer depends on the local climate, power supply, building, and crop.': words({
    answer: sense('answer', '答え'),
    supply: sense('supply', '供給（power supply で電力供給）'),
  }),
  'Wheat, rice, and fruit trees need more space or have lower value for each shelf.': words({ lower: sense('lower', 'より低い（lowの比較級）') }),
  'Some crops also depend on pollinators or complex seasonal changes that indoor systems must copy.': words({
    changes: sense('change', '変化（複数）'),
    systems: sense('system', '仕組み・設備（複数）'),
  }),
  'A farm may produce excellent vegetables and still fail if debt and electricity costs remain high.': words({ may: MAY }),
  'Public support should therefore be based on transparent evidence rather than exciting images alone.': words({ support: sense('support', '支援') }),
  'Useful comparisons examine the whole life of a system.': words({
    life: sense('life', '（設備などの）一生・使われる全期間'),
    system: sense('system', '仕組み・設備'),
  }),
  'They include construction materials, water, electricity, transport, food waste, and the useful life of equipment.': words({ life: sense('life', '（useful life で）使える期間・耐用年数') }),
  'Vertical farming is unlikely to replace ordinary farming, and replacement is the wrong goal.': words({ farming: sense('farm', '農業（farming）') }),
  'It may instead supply certain crops where land is scarce, transport is difficult, or weather is unstable.': words({ may: MAY }),
  'Field farms, greenhouses, and indoor farms can then contribute different strengths to a more resilient food system.': words({
    field: sense('field', '畑（field farm で畑の農場）'),
    system: sense('system', '仕組み・システム'),
  }),

  // p_pre1_dark_sky_policy（人々を暗闇に残さずに夜空を守る）
  'Modern lighting has extended working hours, made travel easier, and allowed public spaces to remain active after sunset.': words({
    extended: sense('extend', '延ばした・広げた'),
    travel: sense('travel', '移動・旅行'),
    working: sense('work', '働く（working hours で勤務時間・働ける時間）'),
    made: sense('make', '（O を C に）した'),
  }),
  'Yet artificial light now reaches places and times where it serves little clear purpose.': words({
    reaches: sense('reach', '（〜に）届く'),
    serves: sense('serve', '（目的に）役立つ'),
    little: sense('little', 'ほとんど〜ない（little＋名詞）'),
  }),
  'Sky glow makes stars difficult to see far beyond the streets that produce it.': words({ makes: sense('make', '（O を C に）する') }),
  'Glare from a poorly aimed lamp can reduce visibility even while increasing brightness.': words({
    poorly: sense('poor', 'うまく〜されていない・下手に（poorly）'),
    aimed: sense('aim', '（光を）向けられた（aimed）'),
  }),
  'Light entering homes may disturb sleep, while constant illumination changes the behavior of insects, birds, and other animals.': words({
    may: MAY,
    sleep: sense('sleep', '睡眠'),
  }),
  'Migrating birds can lose direction, and insects may circle lamps until they are exhausted.': words({
    may: MAY,
    circle: sense('circle', '（〜の周りを）回る'),
  }),
  'Calls to reduce night lighting often meet an immediate objection about safety.': words({
    calls: sense('call', '求める声・呼びかけ（複数）'),
    meet: sense('meet', '（反対などに）あう・直面する'),
  }),
  'Residents may reasonably fear darker sidewalks, and workers may need visible routes during late shifts.': words({
    may: MAY,
    shifts: sense('shift', '（交代制の）勤務時間（複数）'),
  }),
  'A policy that treats every lamp as equally harmful will therefore lose public trust.': words({ trust: sense('trust', '信頼') }),
  'It is where light is needed, how much is useful, what color it should be, and when it should operate.': words({ operate: sense('operate', '作動する・（明かりが）つく') }),
  'A shield can direct light toward the ground instead of allowing it to escape into the sky or nearby windows.': words({ direct: sense('direct', '（光を）向ける') }),
  'Warmer-colored lamps may affect wildlife less than blue-rich white light.': words({
    may: MAY,
    'warmer-colored': sense('warm', 'より暖かい色の（warmer-colored）'),
    'blue-rich': sense('blue', '青みの強い（blue-rich）'),
  }),
  'Timers and motion sensors can provide brightness when people are present without maintaining it all night.': words({ present: sense('present', '（その場に）いる') }),
  'These changes sound simple, but good policy requires more than replacing equipment.': words({ changes: sense('change', '変更（複数）') }),
  'Officials first need a map of current lighting, including ownership, energy use, brightness, direction, and hours of operation.': words({
    use: sense('use', '使用（energy use でエネルギー使用量）'),
    operation: sense('operation', '稼働・動作（hours of operation で点灯している時間）'),
  }),
  'An empty park at midnight may be a necessary path for a nurse returning from work.': words({ may: MAY }),
  'Several communities have begun with small trials rather than immediate town-wide rules.': words({ 'town-wide': sense('town', '町全体の（town-wide）') }),
  "Researchers can then measure sky brightness, energy use, traffic incidents, wildlife activity, and residents' reported comfort.": words({
    use: sense('use', '使用（energy use でエネルギー使用量）'),
    reported: sense('report', '報告された（reported）'),
  }),
  'No single measure proves success, but several forms of evidence can reveal trade-offs.': words({
    measure: sense('measure', '尺度・指標'),
    'trade-offs': sense('trade', '（一方を得ると他方を失う）かね合い（trade-offs）'),
  }),
  'The trial should also record complaints and near misses, since average comfort may hide risks faced by a small group.': words({
    may: MAY,
    faced: sense('face', '直面している（faceの過去分詞）'),
    near: sense('near', '（near miss で）あと少しで事故になる'),
    misses: sense('miss', '（near misses で）事故になりかけた出来事'),
  }),
  'Economic arguments can strengthen the case for careful lighting, but they can also distort it.': words({ case: sense('case', '（〜を支持する）主張・論拠') }),
  'Dark-sky tourism may bring visitors to rural areas, and lower electricity use can save public money.': words({
    may: MAY,
    use: sense('use', '使用（electricity use で電力使用量）'),
    'dark-sky': sense('dark', '暗い夜空を楽しむ（dark-sky）'),
    lower: sense('lower', 'より少ない・より低い（lowの比較級）'),
  }),
  'People in ordinary neighborhoods also deserve sleep, visible stars, and healthy local ecosystems.': words({ sleep: sense('sleep', '睡眠') }),
  'The strongest standards set goals for useful light rather than demanding darkness for its own sake.': words({
    demanding: sense('demand', '要求すること・求めること'),
    own: sense('own', '（for its own sake で）それ自体のために'),
    strongest: sense('strong', '最も優れた・最も説得力のある（strongの最上級）'),
    set: sense('set', '（目標を）定める'),
  }),
  'They specify direction, intensity, color, and timing while allowing justified exceptions.': words({
    timing: sense('time', '時間の設定・タイミング（timing）'),
    justified: sense('justify', '正当な理由のある（justified）'),
  }),
  'They also require monitoring because new buildings, new technologies, and changing travel patterns can alter local needs.': words({
    travel: sense('travel', '移動（travel patterns で移動の傾向）'),
    needs: sense('need', '必要なこと・ニーズ（複数）'),
  }),
  'Public reports allow residents to see whether promised improvements actually occur.': words({ promised: sense('promise', '約束された（promised）') }),
  'Protecting the night is therefore not a return to the past but a more disciplined use of modern light.': words({
    return: sense('return', '戻ること・回帰'),
    use: sense('use', '使い方・使用'),
    disciplined: sense('discipline', '節度のある・よく考えられた（disciplined）'),
  }),

  // p_1_choice_architecture（便利さが静かに選択を形づくるとき）
  'People often describe choice as if it begins only when a person consciously compares several options.': words({ consciously: sense('conscious', '意識して・自覚して（consciously）') }),
  'In practice, decisions are also shaped by which option appears first, which action requires effort, and what happens when someone does nothing.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
    practice: sense('practice', '実際（in practice で実際には）'),
  }),
  'These features form a choice architecture: the environment within which people decide.': words({ within: sense('within', '〜の中で') }),
  'Behavioral researchers have shown that small changes in this environment can influence large numbers of decisions.': words({ changes: sense('change', '変化（複数）') }),
  'Employees save more for retirement when enrollment is automatic but can be canceled than when they must complete a form to join.': words({
    save: sense('save', '（お金を）貯める'),
    complete: sense('complete', '（用紙に）記入する・すべて書き込む'),
  }),
  'Diners may select healthier food more often when it is easy to see and reach, even though less healthy choices remain available.': words({ may: MAY }),
  'Households may use less electricity when bills compare their use with that of similar homes.': words({
    may: MAY,
    use: sense('use', '使う・使用（量）'),
  }),
  'Such interventions are sometimes called nudges because they alter behavior without formally removing options.': words({ called: sense('call', '（〜と）呼ばれる（called）') }),
  'Their appeal is clear in settings where information is complex, attention is limited, and delay carries real costs.': words({
    appeal: sense('appeal', '魅力'),
    carries: sense('carry', '（損失などを）伴う'),
  }),
  'A well-designed default may help people carry out an intention they already have but repeatedly postpone.': words({
    may: MAY,
    'well-designed': sense('design', 'よく考えて作られた（well-designed）'),
    carry: sense('carry', '（carry out で）実行する'),
    out: sense('out', '（carry out で）実行する'),
  }),
  'It can also reduce the advantage enjoyed by people who have more time, confidence, or expert assistance for navigating procedures.': words({ enjoyed: sense('enjoy', '（利点を）持っている・享受している（enjoyed）') }),
  'The person or institution that selects a default makes a judgment about which outcome should occur most easily.': words({ makes: sense('make', '（判断を）下す') }),
  "That judgment may reflect good evidence and a legitimate public goal, but it may also serve the designer's interests.": words({
    may: MAY,
    serve: sense('serve', '（利益に）役立つ・かなう'),
  }),
  'A subscription company, for example, benefits when cancellation requires several screens while renewal occurs automatically.': words({ benefits: sense('benefit', '得をする・利益を得る') }),
  'Formally, customers retain a choice; practically, friction has been distributed to protect one side.': words({
    practically: sense('practical', '実際には（practically）'),
    distributed: sense('distribute', '割り振られた（受け身）'),
  }),
  'A form must place one question before another, and a digital service must decide what happens when users ignore a notice.': words({ place: sense('place', '置く・配置する') }),
  'If architecture is unavoidable, they argue, it should be designed to advance welfare rather than left to accident or commercial power.': words({
    left: sense('leave', '任された・ゆだねられた（leaveの過去分詞）'),
    advance: sense('advance', '増進する・前に進める'),
  }),
  'This response is persuasive as far as it goes, yet inevitability does not settle who may design, for whom, or toward what end.': words({
    may: MAY_PERMISSION,
    far: sense('far', '（as far as it goes で）その範囲では'),
    goes: sense('go', '（as far as it goes で）その範囲では'),
    end: sense('end', '目的（toward what end で何のために）'),
  }),
  'Transparency is often proposed as the first safeguard.': words({ proposed: sense('propose', '提案される（受け身）') }),
  'Disclosure matters, but a sentence hidden in a long policy does not create meaningful awareness.': words({
    matters: sense('matter', '重要である'),
    policy: sense('policy', '（サービスの）規約・方針'),
  }),
  'Researchers also distinguish information that is technically available from information that ordinary users can notice and act on.': words({ technically: sense('technical', '形式の上では・技術的には（technically）') }),
  'An alternative is not meaningful if it is difficult to find, requires expert knowledge, or carries a punishment unrelated to the policy goal.': words({ carries: sense('carry', '（罰などを）伴う') }),
  'The burden of opting out should be compared with the burden that the default removes.': words({
    opting: sense('opt', '（opt out で）抜けること・参加しない選択'),
    out: sense('out', '（opt out で）抜ける'),
  }),
  'Otherwise, convenience for the majority may be purchased by creating barriers for a vulnerable minority.': words({
    may: MAY,
    purchased: sense('purchase', '（代償を払って）手に入れられる（受け身）'),
  }),
  'Average improvement can hide the fact that a policy helps people who were already secure while confusing or excluding others.': words({
    confusing: sense('confuse', '混乱させること'),
    others: sense('other', 'ほかの人々（others）'),
  }),
  'Collecting such data creates its own privacy risks, so evaluation must use only what is necessary and protect it carefully.': words({ own: sense('own', 'それ自身の・固有の') }),
  'Even a successful intervention should not become permanent without review.': words({ review: sense('review', '見直し') }),
  'People learn, markets adapt, technologies change, and a once-helpful default may become irrelevant or exploitable.': words({
    may: MAY,
    'once-helpful': sense('helpful', 'かつては役に立った（once-helpful）'),
  }),
  'Review dates force institutions to restate the goal, publish results, examine unequal effects, and consider less intrusive alternatives.': words({ review: sense('review', '見直し') }),
  'A scheduled review can also reveal whether people have learned to avoid or exploit the original design.': words({
    scheduled: sense('schedule', '予定された（scheduleの過去分詞）'),
    learned: sense('learn', '身につけた・学んだ'),
    review: sense('review', '見直し'),
  }),
  'Scheduled reviews also make failure informative rather than allowing an ineffective design to survive through habit.': words({
    scheduled: sense('schedule', '予定された・定期的な（scheduleの過去分詞）'),
    reviews: sense('review', '見直し（複数）'),
    make: sense('make', '（O を C に）する'),
    through: sense('through', '〜によって・〜のせいで'),
  }),
  'Citizens need not vote on every button or sentence, but they should be able to challenge goals, evidence, and hidden burdens.': words({
    challenge: sense('challenge', '異議を唱える'),
    need: sense('need', '（need not で）〜する必要はない'),
  }),
  'Independent review can test whether claimed benefits are real and whether commercial or political interests have shaped the design.': words({
    shaped: sense('shape', '形づくった（shapeの過去分詞）'),
    review: sense('review', '検証・点検'),
  }),
  'Public explanation should describe not only what the system does but why that architecture was chosen over plausible alternatives.': words({
    system: sense('system', '仕組み・システム'),
    over: sense('over', '〜よりも（優先して）'),
  }),
  'A responsible design pursues a legitimate goal, preserves a real exit, examines distribution, limits data, and remains open to revision.': words({ open: sense('open', '（〜を）受け入れる余地がある（open to 〜）') }),
  'Convenience becomes ethically defensible only when the people whose behavior is shaped can understand, refuse, and contest the terms of that convenience.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
    ethically: sense('ethical', '倫理的に（ethically）'),
    contest: sense('contest', '異議を唱える'),
  }),

  // p_5_hot_summer_school（涼しい教室をつくる）
  'Summers in our town are hotter than before.': words({ hotter: sense('hot', 'より暑い（hotの比較級）') }),
  'The curtains stop strong sunlight in the afternoon.': words({ stop: sense('stop', '（日差しを）さえぎる・止める') }),
  'Our class also keeps green plants by the windows.': words({ keeps: sense('keep', '（植物を）置いている・育てている') }),
  'The plants make a cool wall of leaves.': words({ leaves: sense('leaf', '葉（複数）') }),

  // p_4_school_solar_roof（電気をつくる屋根）
  'Last spring, workers put solar panels on the roof of our school.': words({ panels: sense('panel', '（太陽光）パネル（複数）') }),
  'The panels change sunlight into electricity for the classrooms.': words({ panels: sense('panel', '（太陽光）パネル（複数）') }),
  'A screen near the office reports the power that the school makes each day.': words({
    office: sense('office', '（学校の）事務室・職員室'),
    reports: sense('report', '（数値を）表示する・知らせる'),
  }),
  'We learned that the panels made the most electricity in May.': words({
    learned: sense('learn', '知った・学んだ'),
    panels: sense('panel', '（太陽光）パネル（複数）'),
  }),
  'In June, clouds and rain lowered the number for two weeks.': words({ lowered: sense('lower', '下げた') }),
  'Some students thought the panels were broken, but the weather was the real reason.': words({
    thought: sense('think', '思った'),
    panels: sense('panel', '（太陽光）パネル（複数）'),
  }),
  'The school also uses the panels in an emergency.': words({ panels: sense('panel', '（太陽光）パネル（複数）') }),
  'A battery in the gym can store power for lights and phones.': words({ lights: sense('light', '明かり・照明（複数）') }),
  'Families came to the gym because the lights there were still on.': words({ lights: sense('light', '明かり・照明（複数）') }),
  'The panels do not solve every problem.': words({ panels: sense('panel', '（太陽光）パネル（複数）') }),
  'Now students talk about energy at home, and some families check their own use.': words({
    own: sense('own', '自分たちの'),
    use: sense('use', '使用（量）'),
  }),

  // p_3_ai_class_rules（自分たちで作ったルール）
  'Some used them to check spelling, and others asked for ideas before writing.': words({
    used: sense('use', '使った'),
    spelling: sense('spell', 'つづり'),
    others: sense('other', 'ほかの人たち（others）'),
    asked: sense('ask', '（ask for で）求めた'),
  }),
  'A few students copied whole answers and did not read them carefully.': words({
    copied: sense('copy', '写した・まねた'),
    answers: sense('answer', '答え（複数）'),
  }),
  'One teacher noticed that several reports used the same unusual phrase.': words({ used: sense('use', '使っていた') }),
  'Instead, the school asked each class to write its own rules.': words({ own: sense('own', '自分たちの') }),
  'Our class first collected examples of good and bad use.': words({
    collected: sense('collect', '集めた'),
    use: sense('use', '使い方'),
  }),
  'The class found that a list of ideas was often helpful.': words({ found: sense('find', '分かった・気づいた') }),
  'The class also found that copying a finished report was not honest work.': words({
    found: sense('find', '分かった・気づいた'),
    finished: sense('finish', '完成した（finished）'),
    work: sense('work', '（自分でする）取り組み・勉強'),
  }),
  'A student pointed out that the tools sometimes give confident but wrong answers.': words({
    pointed: sense('point', '指摘した（point out で「指摘する」）'),
    answers: sense('answer', '答え（複数）'),
    out: sense('out', '（point out で）指摘する'),
  }),
  'Then we ran a short experiment with the tools.': words({ ran: sense('run', '行った（run an experiment で「実験を行う」）') }),
  'Half of the class wrote a summary alone, and the other half used AI first.': words({ used: sense('use', '使った') }),
  'Two answers even included a fact that no other source mentioned.': words({ answers: sense('answer', '答え（複数）') }),
  'Teachers can then compare the draft with the finished report.': words({ finished: sense('finish', '完成した（finished）') }),
  'Some students still think that any use of AI is unfair.': words({ use: sense('use', '使用') }),
  'Others say that people will use these tools at work in the future.': words({ others: sense('other', 'ほかの人たち（others）') }),
  'Our teacher told us that learning to judge information is the real skill.': words({
    told: sense('tell', '言った・伝えた'),
    learning: sense('learn', '学ぶこと・身につけること'),
    judge: sense('judge', '判断する・見分ける'),
  }),

  // p_pre2_crowded_town_tourism（写真が広まった町で）
  'Photographs shared online showed a quiet street with old wooden houses and a view of the valley.': words({
    shared: sense('share', '共有された（share の過去分詞）'),
    view: sense('view', '眺め・景色'),
  }),
  'Shops and restaurants welcomed the change because many young families had left the town.': words({
    change: sense('change', '変化'),
    left: sense('leave', '去った・離れた'),
  }),
  'Some visitors entered private gardens because the path to the shrine was not clearly marked.': words({ marked: sense('mark', '示された（mark の過去分詞。was marked で「示されていた」）') }),
  'Litter increased near the bus stop, and neighbors collected it themselves every Monday.': words({
    stop: sense('stop', '停留所（bus stop でバス停）'),
    collected: sense('collect', '集めた・拾い集めた'),
  }),
  'The town council did not want to stop tourism, so it looked for practical answers.': words({
    looked: sense('look', '探した（look for で「探す」）'),
    answers: sense('answer', '答え（複数）・解決策'),
  }),
  'Officials first counted visitors at three points and recorded the busiest hours.': words({
    officials: sense('official', '職員・役人'),
    points: sense('point', '地点・場所'),
    busiest: sense('busy', 'いちばん混み合う（busy の最上級）'),
  }),
  'The money would pay for cleaning, toilets, and translation.': words({ cleaning: sense('clean', '清掃（すること）') }),
  'Large tour buses put more pressure on narrow roads than private cars do.': words({
    put: sense('put', 'かける（put pressure on 〜 で「〜に負担をかける」）'),
    pressure: sense('pressure', '負担・圧力'),
  }),
  'Some shop owners disagreed because they feared that fewer buses would mean fewer customers.': words({
    feared: sense('fear', '心配した・恐れた'),
    fewer: sense('few', 'より少ない（few の比較級）'),
  }),
  'Residents said that the new buses helped older people most.': words({ older: sense('old', '年配の（old の比較級）') }),
  'The mayor said that tourism must serve the people who live there every day.': words({ serve: sense('serve', '（人々の）役に立つ') }),

  // p_pre2plus_rural_bus_future（村のバスは誰が動かすのか）
  'In many rural areas, the local bus is the only way for people without cars to reach a hospital.': words({ reach: sense('reach', '（場所に）たどり着く・行く') }),
  'Some companies used to run several routes, but today they cannot fill even one bus.': words({
    used: sense('use', '（used to で）以前は〜していた'),
    run: sense('run', '運行する（run a route で「路線を走らせる」）'),
  }),
  'A further problem is that many drivers are close to retirement age.': words({ close: sense('close', '近い（be close to 〜 で「〜に近い」）') }),
  'One village ended its afternoon service last spring, and the effect appeared quickly.': words({
    ended: sense('end', 'やめた・終わらせた'),
    service: sense('service', '（バスの）便・運行'),
  }),
  'An elderly resident had to change three appointments because no bus reached the clinic.': words({ reached: sense('reach', '（〜まで）行った・着いた') }),
  'A high school student began cycling nine kilometers in the rain.': words({ cycling: sense('cycle', '自転車で走ること') }),
  'The village office received complaints, but simply restoring the old timetable was too expensive.': words({
    restoring: sense('restore', '元に戻すこと'),
    office: sense('office', '役場（village office で村役場）'),
  }),
  'Officials therefore studied how residents actually traveled during one ordinary week.': words({
    officials: sense('official', '職員・役人'),
    studied: sense('study', '調べた'),
  }),
  'They discovered that most trips were short and happened at predictable times.': words({
    discovered: sense('discover', '発見した・分かった'),
    trips: sense('trip', '（1回の）移動・外出'),
  }),
  'Very few people used the full route from end to end.': words({
    used: sense('use', '使った'),
    full: sense('full', '全体の・まるごとの'),
    end: sense('end', '（from end to end で）始点から終点まで'),
  }),
  'The evening bus, for example, often carried a single passenger.': words({ carried: sense('carry', '（乗客を）乗せた・運んだ') }),
  'The village then tested a small bus that comes only when someone books it.': words({
    tested: sense('test', '試した'),
    books: sense('book', '予約する'),
  }),
  'Drivers reported that the work was less stressful than following a fixed schedule.': words({ following: sense('follow', '従うこと') }),
  'However, the system created new difficulties that planners had not expected.': words({ system: sense('system', '仕組み・方式') }),
  'Some older residents disliked booking and preferred a bus that always came at the same time.': words({
    older: sense('old', '年配の（old の比較級）'),
    disliked: sense('dislike', 'いやがった・嫌った'),
    booking: sense('book', '予約すること'),
  }),
  'Others could not use the app because the mobile signal was weak in the mountains.': words({
    signal: sense('signal', '電波（mobile signal で「携帯電話の電波」）'),
    others: sense('other', 'ほかの人たち（others）'),
  }),
  'The office therefore kept a telephone line and trained volunteers to help with the first booking.': words({
    line: sense('line', '（電話の）回線'),
    trained: sense('train', '育てた・訓練した'),
    booking: sense('book', '予約'),
    office: sense('office', '役場（village office で村役場）'),
  }),
  'A neighboring town chose a different answer and paid taxi companies to carry passengers.': words({ answer: sense('answer', '答え・対応策') }),
  'That plan started faster, but the cost for each passenger stayed higher.': words({
    stayed: sense('stay', '〜のままだった（stay ＋ 形容詞）'),
    started: sense('start', '始まった'),
  }),
  'Neither approach can succeed if no one is willing to drive.': words({ approach: sense('approach', 'やり方・取り組み方') }),
  'Whether such support arrives in time will depend on decisions made in the next few years.': words({
    support: sense('support', '支援'),
    time: sense('time', '（in time で）間に合って'),
    made: sense('make', 'なされる（make の過去分詞）'),
  }),

  // p_2_space_debris（混み合う軌道）
  'More than ten thousand satellites now travel around the Earth, and thousands more are planned.': words({ planned: sense('plan', '計画されている（are planned で受け身）') }),
  'They carry weather data, navigation signals, and internet service to remote communities.': words({ carry: sense('carry', '（情報を）伝える・運ぶ') }),
  'However, the same orbits also hold used rocket parts, broken satellites, and countless small fragments.': words({
    hold: sense('hold', '（中に）抱えている・含む'),
    used: sense('use', '使い終わった・使用済みの'),
  }),
  'Even a fragment one centimeter wide is faster than a bullet.': words({ wide: sense('wide', '幅が〜の（one centimeter wide で「幅1センチの」）') }),
  'Operators already move satellites several times a year to avoid possible collisions.': words({
    operators: sense('operator', '（衛星を）運用する人・会社'),
    times: sense('time', '〜回（several times で「数回」）'),
  }),
  'Each of these movements uses fuel and shortens the useful life of the satellite.': words({ life: sense('life', '（使える）期間・寿命') }),
  'Ground teams must also track objects continuously, which requires expensive radar and staff.': words({
    ground: sense('ground', '地上の'),
    continuously: sense('continuous', '絶えず・途切れなく'),
  }),
  'Those fragments may then strike other objects and produce still more debris.': words({
    may: MAY,
    strike: sense('strike', 'ぶつかる・当たる'),
  }),
  'The consequences would not stop at space companies.': words({ stop: sense('stop', 'とどまる（stop at 〜 で「〜で止まる」）') }),
  'Farmers, pilots, and emergency services all depend on satellite information.': words({ services: sense('service', '（救急などの）機関（emergency services）') }),
  'Several solutions have been proposed, and none of them is simple.': words({ proposed: sense('propose', '提案された（受け身）') }),
  'Some engineers argue that every satellite should carry enough fuel to leave orbit at the end of its mission.': words({ carry: sense('carry', '積んでいる・載せている') }),
  'A successful test does not show that the method works at a useful scale.': words({ works: sense('work', 'うまくいく・機能する') }),
  'Removing a few large objects each year may be far cheaper than removing thousands of fragments later.': words({
    may: MAY,
    far: sense('far', 'はるかに（比較級を強める）'),
  }),
  'A company that spends money on careful design gains no direct advantage if others ignore the risk.': words({ others: sense('other', 'ほかのもの・ほかの会社（others）') }),
  'Rules therefore need international agreement, and such agreements take years.': words({ take: sense('take', '（時間が）かかる') }),
  'Meanwhile, the number of launches continues to rise each year.': words({ launches: sense('launch', '打ち上げ（複数）') }),
  'Some progress has already been made.': words({ made: sense('make', 'なされた（make progress の受け身）') }),
  'Several agencies now set a fixed period for leaving crowded orbits.': words({ set: sense('set', '定める・決める') }),
  'Yet enforcement remains weak, because no authority can inspect every launch.': words({ launch: sense('launch', '打ち上げ') }),
  'These measures show that the problem is understood, not that it is solved.': words({
    measures: sense('measure', '対策（複数）'),
    understood: sense('understand', '理解されている（受け身）'),
    solved: sense('solve', '解決された（受け身）'),
  }),
  'The orbits around the Earth are a shared resource, and shared resources fail when each user acts alone.': words({ fail: sense('fail', 'うまくいかなくなる・だめになる') }),

  // p_pre1_ai_and_work（仕事ではなく作業が変わる）
  'Predictions about machines replacing human work are older than the machines themselves.': words({ work: sense('work', '仕事・労働') }),
  'Each generation has produced confident forecasts, and most of them have been wrong in interesting ways.': words({ forecasts: sense('forecast', '予測（複数）') }),
  'Recent systems that generate text, images, and computer code have revived the debate with unusual intensity.': words({
    systems: sense('system', 'システム（仕組み）'),
    code: sense('code', '（コンピューターの）プログラム・コード'),
  }),
  'Public discussion often moves between two extremes, promising mass unemployment or effortless wealth.': words({
    extremes: sense('extreme', '極端（な考え）'),
    promising: sense('promise', '〜が来ると請け合って（promise の -ing 形）'),
  }),
  'The current technology differs from earlier automation in one important respect.': words({ respect: sense('respect', '点（in … respect で「…の点で」）') }),
  'The newer systems produce drafts, summaries, and designs that resemble skilled office work.': words({
    systems: sense('system', 'システム（仕組み）'),
    office: sense('office', '事務（office work で事務の仕事）'),
  }),
  'Programmers, translators, designers, and junior analysts have all noticed changes in demand.': words({
    junior: sense('junior', '若手の・下の立場の'),
    changes: sense('change', '変化（複数）'),
    demand: sense('demand', '需要'),
  }),
  'Careful studies describe change at the level of tasks rather than whole occupations.': words({ change: sense('change', '変化') }),
  'A hospital doctor reads images, but also explains results, weighs uncertainty, and decides what to do next.': words({ weighs: sense('weigh', 'よく考えて見きわめる') }),
  'When one task becomes cheaper, the value of the remaining tasks often rises.': words({ remaining: sense('remain', '残りの（remain の -ing 形）') }),
  'The whole service may then attract more demand rather than less.': words({
    may: MAY,
    demand: sense('demand', '需要'),
  }),
  'This pattern has appeared before in other fields.': words({ before: sense('before', '以前に（副詞）') }),
  'Cash machines reduced the routine work of bank clerks.': words({ reduced: sense('reduce', '減らした') }),
  'Branches became cheaper to operate, so banks opened more of them, and staff moved toward advice and sales.': words({
    branches: sense('branch', '支店（複数）'),
    operate: sense('operate', '運営する'),
  }),
  'The adjustment was slow, and individual workers still lost income during it.': words({ lost: sense('lose', '失った') }),
  'Aggregate stability can hide serious harm to particular regions and age groups.': words({ aggregate: sense('aggregate', '全体をまとめた・総計の') }),
  'A worker of fifty-five rarely benefits from jobs created ten years later in another city.': words({
    benefits: sense('benefit', '得をする（benefit from 〜 で「〜から得をする」）'),
    'fifty-five': sense('fifty', '55（歳）（fifty-five）'),
  }),
  'The distribution of gains is therefore a central question.': words({ gains: sense('gain', '利益（複数）') }),
  'If productivity rises but wages do not, the benefit reaches owners rather than workers.': words({ reaches: sense('reach', '（〜に）行き渡る・届く') }),
  'Early evidence suggests that assistance tools help less experienced staff more than expert staff.': words({ early: sense('early', '初期の') }),
  'That effect could narrow wage gaps, or it could reduce the reward for long training.': words({ narrow: sense('narrow', '縮める・狭める') }),
  'Employment law, union strength, and public investment decide how any productivity gain is shared.': words({
    union: sense('union', '労働組合'),
    gain: sense('gain', '増えた分・向上'),
  }),
  'Education systems face a related difficulty.': words({
    face: sense('face', '直面する'),
    related: sense('relate', '関連した（related）'),
  }),
  'Students who only learn to produce text that a machine can also produce are poorly prepared.': words({
    poorly: sense('poor', '不十分に・うまくできずに'),
    prepared: sense('prepare', '備えができている（be prepared）'),
  }),
  'Questioning sources and judging quality remain valuable skills.': words({
    questioning: sense('question', '疑うこと・疑問視すること'),
    judging: sense('judge', '見きわめること・判断すること'),
  }),
  'Yet those abilities are difficult to measure, and examinations reward what is easy to score.': words({ score: sense('score', '点をつける') }),
  'Policy responses fall into several groups.': words({ fall: sense('fall', '分かれる（fall into 〜 で「〜に分類される」）') }),
  'Some governments emphasize retraining, though programs often reach the workers who need them least.': words({ reach: sense('reach', '（支援が人に）届く') }),
  'Others discuss shorter working hours, wage insurance, or support for regions losing employers.': words({
    support: sense('support', '支援'),
    others: sense('other', 'ほかの政府・ほかの人たち（others）'),
    working: sense('work', '働く（working hours で労働時間）'),
  }),
  'Each proposal carries costs, and none removes the need for continuous adjustment.': words({
    carries: sense('carry', '（費用などを）伴う'),
    need: sense('need', '必要・必要性'),
  }),
  'Evaluation is as important as ambition, since untested programs consume budgets that could support proven ones.': words({ ones: sense('one', 'もの（前の名詞 programs の代わり）') }),
  'The most misleading question asks whether machines will take our jobs.': words({ take: sense('take', '奪う・取る') }),
  'Work is not a fixed quantity waiting to be divided.': words({ work: sense('work', '仕事・労働') }),
  'It is more useful to ask who decides how these systems are used and who is protected during the transition.': words({
    systems: sense('system', 'システム（仕組み）'),
    used: sense('use', '使われる（受け身）'),
  }),

  // p_1_synthetic_media_trust（見ることが信じることでなくなるとき）
  'For most of the last century, a photograph or a sound recording carried a special kind of authority in public argument.': words({
    recording: sense('record', '録音'),
    carried: sense('carry', '持っていた（carry authority で「権威を持つ」）'),
    kind: sense('kind', '種類'),
  }),
  'That authority never came from the image alone, and it was never absolute.': words({ came: sense('come', '（〜から）生じた・来た') }),
  'Ordinary readers could therefore treat a published photograph as reasonable evidence without examining it closely.': words({
    reasonable: sense('reasonable', 'もっともな・妥当な'),
    closely: sense('close', '詳しく・注意深く（closely）'),
    published: sense('publish', '（新聞などに）掲載された（published）'),
  }),
  'Synthetic media has weakened this assumption rather than destroyed it outright.': words({ weakened: sense('weaken', '弱めた') }),
  'The necessary tools are widely available, and each improvement lowers the effort required again.': words({ widely: sense('wide', '広く') }),
  'A single convincing file can reach millions of people long before any expert examines it.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    long: sense('long', 'ずっと（long before で「〜よりずっと前に」）'),
    reach: sense('reach', '（人々に）届く'),
  }),
  'The obvious concern is that false material will be believed by people who have no reason to doubt it.': words({
    believed: sense('believe', '信じられる（受け身）'),
    material: sense('material', '（映像・記事などの）内容・素材'),
  }),
  'A fabricated recording released the night before an election can cause damage that no later correction repairs.': words({
    recording: sense('record', '録音'),
    repairs: sense('repair', '（損害を）元に戻す・修復する'),
  }),
  'Corrections travel more slowly than the material they answer, and they reach a much smaller audience.': words({
    travel: sense('travel', '（情報が）広まる・伝わる'),
    material: sense('material', '（映像・記事などの）内容・素材'),
    reach: sense('reach', '（人々に）届く'),
  }),
  'A subtler danger works in the opposite direction and may prove more damaging.': words({
    may: MAY,
    works: sense('work', '作用する・働く'),
  }),
  'Once audiences know that anything can be faked, genuine evidence can be dismissed at will.': words({
    once: sense('once', 'いったん〜すると（接続詞）'),
    faked: sense('fake', '偽造される（受け身）'),
  }),
  'An official can simply claim that a recording of a bribe was generated.': words({
    official: sense('official', '役人・職員'),
    recording: sense('record', '録音'),
    generated: sense('generate', '（AIで）作られた・生成された（受け身）'),
  }),
  'Accountability weakens whenever an inconvenient record can be denied without any supporting argument.': words({
    record: sense('record', '記録'),
    supporting: sense('support', '裏付けとなる（supporting）'),
  }),
  'Detection software is usually proposed as the first answer, and it is genuinely useful.': words({
    answer: sense('answer', '答え・対策'),
    proposed: sense('propose', '提案される（受け身）'),
  }),
  'Such tools search for statistical traces that generation leaves behind in pixels or sound.': words({
    traces: sense('trace', '跡・痕跡（複数）'),
    generation: sense('generation', '（機械による）生成'),
  }),
  'Their accuracy falls sharply when a file is compressed, cropped, or recorded again from a screen.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    cropped: sense('crop', '（画像の端を）切り取られた（crop の過去分詞）'),
    falls: sense('fall', '下がる・落ちる'),
  }),
  'Every published detector also teaches the next generation of systems precisely what to avoid.': words({
    systems: sense('system', 'システム（仕組み）'),
    published: sense('publish', '公開された（published）'),
  }),
  'The contest is asymmetric, since one success is enough for an attacker while a verifier needs consistent reliability.': words({
    contest: sense('contest', '争い・競い合い'),
    attacker: sense('attack', '攻撃する側・攻撃者（attacker）'),
    verifier: sense('verify', '検証する側（verifier）'),
  }),
  'Detection therefore deserves continued investment, but it cannot carry the whole burden of public trust.': words({
    carry: sense('carry', '背負う'),
    trust: sense('trust', '信頼'),
    continued: sense('continue', '継続的な（continued）'),
  }),
  'A second approach records where a file originated instead of asking what it looks like.': words({
    approach: sense('approach', 'やり方・取り組み方'),
    file: sense('file', 'ファイル（データのまとまり）'),
  }),
  'A camera can sign an image at the moment of capture, and later edits can be added to the same record.': words({
    sign: sense('sign', '署名する'),
    capture: sense('capture', '撮影（すること）'),
    record: sense('record', '記録'),
  }),
  'A file without such a record is then treated as unverified rather than false, so the approach fails safely.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    record: sense('record', '記録'),
    approach: sense('approach', 'やり方・取り組み方'),
    fails: sense('fail', '（うまくいかないときも）安全な側に倒れる（fail safely）'),
  }),
  'Provenance systems carry their own risks, and those risks deserve equal attention.': words({
    systems: sense('system', 'システム（仕組み）'),
    carry: sense('carry', '（危険などを）伴う'),
    own: sense('own', 'それ自身の・固有の'),
  }),
  'Signing equipment is expensive, so the poorest witnesses are least able to prove what they saw.': words({
    signing: sense('sign', '署名する（ための）'),
    saw: sense('see', '見た'),
  }),
  'Metadata that establishes authenticity may also reveal the location, the device, and the identity of a source.': words({ may: MAY }),
  'A system designed to protect the public can therefore endanger the people who expose wrongdoing.': words({
    system: sense('system', 'システム（仕組み）'),
    designed: sense('design', '（〜のために）作られた（design の過去分詞）'),
  }),
  'Any serious design must allow selective disclosure, so that a claim can be verified without exposing a person.': words({ verified: sense('verify', '確かめられる（受け身）') }),
  'Technical measures are less important than the institutions that interpret and apply them.': words({ measures: sense('measure', '手段・対策（複数）') }),
  'Courts have handled disputed evidence for centuries without assuming that documents prove themselves.': words({ disputed: sense('dispute', '争われている（disputeの過去分詞）') }),
  'Newsrooms that publish their verification steps allow readers to judge the strength of a report.': words({
    steps: sense('step', '手順（複数）'),
    judge: sense('judge', '判断する'),
    report: sense('report', '記事・報道'),
  }),
  'Trust of this kind is harder to destroy than trust resting on the appearance of a single file.': words({
    trust: sense('trust', '信頼'),
    kind: sense('kind', '種類'),
    resting: sense('rest', '（〜に）頼る・基づく（rest on）'),
    file: sense('file', 'ファイル（データのまとまり）'),
  }),
  'Platform labels are a weaker instrument than they first appear to be.': words({
    platform: sense('platform', '（ネット上の）サービス・プラットフォーム'),
    instrument: sense('instrument', '手段・道具'),
  }),
  'Warning labels can help, yet unlabeled material may then seem verified by default.': words({
    may: MAY,
    verified: sense('verify', '確認済みの（verified）'),
    default: sense('default', '（by default で）特に何もしなければ・自動的に'),
  }),
  'Researchers describe this as the implied truth effect, and it grows stronger as labeling expands.': words({ grows: sense('grow', '（だんだん）〜になる（grow stronger で「強くなる」）') }),
  'Labels must therefore describe what was actually checked, not merely announce that something was checked.': words({ checked: sense('check', '確かめられた（受け身）') }),
  'Education is often recommended, and it is genuinely necessary rather than merely fashionable.': words({ recommended: sense('recommend', '勧められる（受け身）') }),
  'Useful teaching shows students how to ask who published a claim and what independent evidence supports it.': words({ teaching: sense('teach', '教えること・指導') }),
  'The burden of this new work is distributed very unevenly across the world.': words({
    work: sense('work', '仕事'),
    distributed: sense('distribute', '割り振られている・かかっている（受け身）'),
    across: sense('across', '〜じゅうで'),
  }),
  'Large newsrooms can employ verification teams, while a local reporter covering a rural election cannot.': words({ covering: sense('cover', '取材している（cover の -ing 形）') }),
  'Most detection tools and training materials are produced for a few widely spoken languages.': words({ widely: sense('wide', '広く（widely）') }),
  'Communities with the fewest resources therefore face the highest risk of manufactured evidence.': words({
    fewest: sense('few', 'いちばん少ない（few の最上級）'),
    face: sense('face', '直面する・さらされる'),
    manufactured: sense('manufacture', '（にせ物として）作られた'),
  }),
  'A better approach asks what supports a claim rather than whether an image is real.': words({ approach: sense('approach', 'やり方・取り組み方') }),
  'A single file is rarely decisive on its own, whether it happens to be genuine or not.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    own: sense('own', '（on its own で）それだけで・単独で'),
  }),
  'Independent records, consistent testimony, and institutions that can be questioned carry far more weight together.': words({
    records: sense('record', '記録（複数）'),
    questioned: sense('question', '問いただされる（受け身）'),
    carry: sense('carry', '（重みを）持つ'),
    far: sense('far', 'はるかに（比較級を強める）'),
    weight: sense('weight', '重み・説得力'),
  }),
  'Belief never rested on the image alone, and the present task is to rebuild the arrangements that made evidence trustworthy.': words({
    rested: sense('rest', '（〜に）支えられていた・基づいていた（rest on）'),
    present: sense('present', '今の・現在の'),
    made: sense('make', '（O を C に）した'),
  }),

  // p_pre2_pond_comeback（学校の裏の池）
  'Elderly residents remembered clear water with frogs, insects and green plants.': words({
    clear: sense('clear', '澄んだ・透きとおった'),
    plants: sense('plant', '植物（複数）'),
  }),
  'The students measured the water level and recorded the temperature every week.': words({ level: sense('level', '（水の）高さ（water level で「水位」）') }),
  'The results showed that the pond itself was not badly polluted.': words({ badly: sense('bad', 'ひどく') }),
  'Residents had released a foreign fish into the pond many years before.': words({ before: sense('before', '（それより）前に（副詞）') }),
  'This species eats the young of local frogs, and it destroys the water plants.': words({
    young: sense('young', '（動物の）子（the young）'),
    plants: sense('plant', '植物（複数）'),
  }),
  'The volunteers placed nets on Saturdays and weighed the catch carefully.': words({
    placed: sense('place', '置いた・仕掛けた'),
    catch: sense('catch', 'とれた魚・漁獲'),
  }),
  'The data from six months revealed a steady decline in the foreign population.': words({ population: sense('population', '（生きものの）数・個体数') }),
  'The students also cleared the weeds along the bank and planted local grasses.': words({
    cleared: sense('clear', '取り除いた・片づけた'),
    bank: sense('bank_2', '岸・土手'),
  }),
  'The members had expected a faster recovery, but the work demanded patience.': words({
    work: sense('work', '仕事・作業'),
    demanded: sense('demand', '必要とした'),
  }),
  'The project changed the way the town sees the land behind the school.': words({
    project: sense('project', '計画・活動'),
    sees: sense('see', '見る・とらえる'),
    land: sense('land', '土地'),
  }),
  'The city office now provides tools, and a nearby company pays for the nets.': words({ office: sense('office', '役所（city office で市役所）') }),
  'Younger children visit the pond with real curiosity about the frogs and the plants.': words({
    younger: sense('young', '年下の（young の比較級）'),
    plants: sense('plant', '植物（複数）'),
  }),
  'The students say that it is much harder to protect a habitat than to damage one.': words({ damage: sense('damage', '傷める・壊す') }),

  // p_pre2_morning_market（駅前の朝市）
  'On Sunday mornings, a small market opens in front of our town station.': words({ opens: sense('open', '開く・開かれる（店などが）') }),
  'At the start, five producers and a few customers came.': words({ start: sense('start', '始め・始まり') }),
  'Today about thirty suppliers join, and the number of visitors keeps rising.': words({
    about: sense('about', '約・およそ'),
    suppliers: sense('supplier', '（品物を）出す人・出店者'),
    keeps: sense('keep', '（〜し）続ける（keep ＋ -ing）'),
    rising: sense('rise', '増える・上がる'),
  }),
  'They find the quality reliable and return every week.': words({ find: sense('find', '（O が C だと）感じる・分かる') }),
  'This direct contact builds confidence, and it lowers complaints about the goods.': words({ contact: sense('contact', '接触・直接のやりとり') }),
  'A survey last year showed that a high percentage of visitors welcomed this contact.': words({
    showed: sense('show', '示した・明らかにした'),
    contact: sense('contact', '接触・やりとり'),
  }),
  'The producers read this feedback and learn the preference of local families.': words({ learn: sense('learn', '知る・分かる') }),
  'The cheerful scene hides much quiet work.': words({
    quiet: sense('quiet', '目立たない・静かな'),
    work: sense('work', '仕事'),
  }),
  'The town office and the producers share a list of requirements.': words({
    office: sense('office', '役場・役所（town office で町役場）'),
    requirements: sense('requirement', '守るべき条件・要件（複数）'),
  }),
  'Local rules regulate the handling of fresh food, and the market follows them closely.': words({
    handling: sense('handle', '取り扱い'),
    closely: sense('close', '厳密に・注意深く（closely）'),
  }),
  'A representative of the producers reports these records to the government office.': words({
    records: sense('record', '記録（複数）'),
    office: sense('office', '役所（government office）'),
  }),
  'Accuracy is more important than speed in this check.': words({ check: sense('check', '確認・点検') }),
  'Money is the hardest part of the routine.': words({ routine: sense('routine', '決まった仕事・日課') }),
  'Each producer pays a small fee, and that payment covers cleaning and transportation.': words({
    covers: sense('cover', '（費用を）まかなう'),
    cleaning: sense('clean', '清掃・掃除'),
  }),
  'In a wet climate, few households come, and the sellers carry the loss themselves.': words({ carry: sense('carry', '（損失を）負う・背負う') }),
  'High humidity spoils leaf vegetables before noon.': words({ spoils: sense('spoil', 'だめにする・傷める') }),
  'The producers therefore keep a priority list of goods with a long life.': words({
    keep: sense('keep', '（用意して）持っておく'),
    life: sense('life', '（品物の）もち・寿命（a long life で「日持ちのする」）'),
  }),
  'A high school club runs a cooking workshop near the stalls.': words({ runs: sense('run', '（会を）開く・運営する') }),
  'The club studies the stalls and turns each visit into an assignment.': words({
    studies: sense('study', '調べる・研究する'),
    turns: sense('turn', '（A を B に）変える（turn A into B）'),
    visit: sense('visit', '訪問'),
  }),
  'Young children learn the names of vegetables and the season of each crop.': words({ season: sense('season', '季節・旬（作物がとれる季節）') }),
  'For older residents, the mild Sunday morning has become a routine meeting.': words({ routine: sense('routine', 'いつもの・決まった') }),
  'They explain that a market brings people together, and goods come second.': words({
    brings: sense('bring', '（一つに）集める・結びつける（bring 〜 together）'),
    come: sense('come', '（come second で）二の次になる'),
  }),

  // p_2_injury_free_practice（痛みを数えた部活）
  'Last spring, four members of our track club were injured within a single month.': words({ track: sense('track', '陸上競技（track club で陸上部）') }),
  'The teacher called each case bad luck.': words({
    called: sense('call', '（O を C だと）言った・呼んだ'),
    case: sense('case', '（けがなどの）一件・事例'),
  }),
  'She asked every member to keep a simple record after practice.': words({
    keep: sense('keep', '（記録を）つける・続ける'),
    record: sense('record', '記録'),
    practice: sense('practice', '練習'),
  }),
  'Each card showed the distance, the weather and the pain.': words({ showed: sense('show', '示した・書き表した') }),
  'The records revealed a clear pattern within eight weeks.': words({
    records: sense('record', '記録（複数）'),
    pattern: sense('pattern', '傾向・決まった型'),
  }),
  'Most damage appeared after a sudden rise in weekly distance.': words({
    damage: sense('damage', '（体の）損傷・傷み'),
    rise: sense('rise', '増加・上昇'),
    weekly: sense('week', '週ごとの（weekly）'),
  }),
  'High humidity raised the risk further, and the water breaks were too short.': words({
    raised: sense('raise', '高めた・上げた'),
    breaks: sense('break', '休憩（water break で水分補給の休憩）'),
  }),
  'Tired muscles lose their shape, and the load moves to the joints.': words({
    lose: sense('lose', "失う（lose one's shape で「形が崩れる」）"),
    load: sense('load', '（体にかかる）負荷'),
    moves: sense('move', '移る・動く'),
    joints: sense('joint', '関節（複数）'),
  }),
  'A body under such stress becomes vulnerable to small accidents.': words({ stress: sense('stress', '（体への）負担・ストレス') }),
  'The club then changed three daily habits.': words({ changed: sense('change', '変えた') }),
  'Members now increase the weekly distance by a small percentage.': words({ weekly: sense('week', '週ごとの（weekly）') }),
  'The team moved practice to the early morning during the hot season.': words({
    moved: sense('move', '移した・動かした'),
    practice: sense('practice', '練習'),
  }),
  'A cheap device shows the temperature and the humidity at the field.': words({
    shows: sense('show', '示す・表示する'),
    field: sense('field', 'グラウンド・競技場'),
  }),
  'The leader stops the practice when the numbers pass a fixed line.': words({
    practice: sense('practice', '練習'),
    numbers: sense('number', '数値（複数）'),
    pass: sense('pass', '（線を）超える'),
  }),
  'The hardest change was not physical.': words({ change: sense('change', '変化') }),
  'Many students had hidden small pains from the teacher.': words({ hidden: sense('hide', '隠していた（hideの過去分詞）') }),
  'They felt anxiety about losing a place in the team.': words({ place: sense('place', '（チームでの）座・地位') }),
  'The mentor therefore separated the report of pain from the choice of members.': words({ separated: sense('separate', '切り離した・分けた') }),
  'The team keeps the place of any student who reports pain early.': words({
    keeps: sense('keep', '守る・そのままにしておく'),
    place: sense('place', '（チームでの）座・地位'),
  }),
  'This policy lowered the pressure and raised the accuracy of the records.': words({
    lowered: sense('lower', '下げた'),
    raised: sense('raise', '高めた・上げた'),
    records: sense('record', '記録（複数）'),
  }),
  'Awareness of the body became part of the ordinary practice.': words({ practice: sense('practice', '練習') }),
  'In the second year, the club counted one hurt member.': words({ hurt: sense('hurt', 'けがをした（形容詞）') }),
  'Results in races improved, although nobody trained more hours.': words({
    races: sense('race', 'レース・競走（複数）'),
    trained: sense('train', '練習した・訓練した'),
  }),
  'A small budget covered the device and a short course for the leaders.': words({
    covered: sense('cover', '（費用を）まかなった'),
    course: sense('course', '講習・講座'),
  }),
  'The benefit soon reached students outside the track club.': words({
    reached: sense('reach', '届いた・及んだ'),
    track: sense('track', '陸上競技（track club で陸上部）'),
  }),
  'Records cannot predict every accident, and some damage comes from old wounds.': words({
    records: sense('record', '記録（複数）'),
    damage: sense('damage', '（体の）損傷・傷み'),
    comes: sense('come', '（〜から）生じる'),
  }),
  'The idea behind the whole change is simple.': words({ change: sense('change', '変化') }),
  'A team can act early when it measures its own practice.': words({
    own: sense('own', '自分たちの'),
    practice: sense('practice', '練習'),
  }),

  // p_2_factory_museum（町が残した建物）
  'An old industrial building beside the canal closed thirty years ago.': words({ closed: sense('close', '閉まった・閉鎖された（工場などが）') }),
  'After that, the windows were broken and young families moved to the suburb.': words({ moved: sense('move', '移った・引っ越した') }),
  'The town council first planned to pull the building down.': words({
    council: sense('council', '議会（town council で町議会）'),
    pull: sense('pull', '引く（pull 〜 down で「取り壊す」）'),
    down: sense('down', '（pull 〜 down で「取り壊す」）'),
  }),
  'Former workers asked for a delay of one year.': words({ delay: sense('delay', '猶予・延期') }),
  'They collected old photographs, order books and letters from families.': words({
    collected: sense('collect', '集めた'),
    order: sense('order', '注文（order book で注文帳）'),
    books: sense('book', '帳簿（order book で注文帳）'),
  }),
  'The material showed the daily process inside the building in clear detail.': words({
    material: sense('material', '資料'),
    showed: sense('show', '示した'),
    process: sense('process', '工程・作業の流れ'),
  }),
  'Two hundred people came to a talk about local history.': words({ talk: sense('talk', '講演・話') }),
  'The council then accepted a study of the costs.': words({
    council: sense('council', '議会（ここでは町議会）'),
    study: sense('study', '調査'),
  }),
  'The numbers were not encouraging at first.': words({ numbers: sense('number', '数字（複数）') }),
  'Repair of the roof and the metal walls demanded a large budget.': words({
    repair: sense('repair', '修理'),
    demanded: sense('demand', '必要とした'),
  }),
  'Old paint and chemical waste raised the expense further.': words({
    paint: sense('paint', '塗料・ペンキ'),
    waste: sense('waste', '廃棄物'),
    raised: sense('raise', '押し上げた・上げた'),
  }),
  'A private company offered to buy the land for a car park.': words({
    private: sense('private', '民間の'),
    land: sense('land', '土地'),
    park: sense('park', '（car park で）駐車場'),
  }),
  'The offer would have removed the debt of the town in one step.': words({
    offer: sense('offer', '申し出'),
    removed: sense('remove', '（借金を）消す・なくす'),
    step: sense('step', '（in one step で）一度に'),
  }),
  'The citizens group answered with a different plan.': words({
    group: sense('group', '団体（citizens group で市民団体）'),
    answered: sense('answer', '（提案に）応えた'),
  }),
  'The other half would hold small workshops for young makers.': words({
    hold: sense('hold', '（中に）収める・入れる'),
    workshops: sense('workshop', '工房・作業場（複数）'),
    makers: sense('maker', '作り手（複数）'),
  }),
  'Rent from those workshops would produce a steady revenue.': words({ workshops: sense('workshop', '工房・作業場（複数）') }),
  'The plan also promised a slow repair over ten years.': words({
    repair: sense('repair', '修理'),
    over: sense('over', '〜にわたって'),
  }),
  'The council accepted the second plan by a narrow vote.': words({
    council: sense('council', '議会（ここでは町議会）'),
    narrow: sense('narrow', '（差が）わずかな'),
  }),
  'Work began on the safest wing of the building.': words({
    work: sense('work', '工事・作業'),
    wing: sense('wing', '（建物の）棟'),
  }),
  'Volunteers cleaned the machines, and a company gave the paint.': words({
    cleaned: sense('clean', 'きれいにした・掃除した'),
    paint: sense('paint', '塗料・ペンキ'),
  }),
  'The museum opened four years later with a small staff.': words({ opened: sense('open', '開館した・開いた') }),
  'A local organization now runs the tours and the small shop.': words({ runs: sense('run', '運営する') }),
  'Visitors report a strong emotion inside the old halls.': words({ report: sense('report', '（感じたことを）話す・伝える') }),
  'Former workers lead the tours and explain each machine.': words({ lead: sense('lead', '案内する・導く') }),
  'Their memory turns a quiet room into a place of real work.': words({
    turns: sense('turn', '（A を B に）変える（turn A into B）'),
    work: sense('work', '仕事'),
  }),
  'The ancestors of many students appear in the old photographs.': words({ appear: sense('appear', '（写真に）写っている') }),
  'Young visitors gain a different perception of the town.': words({ perception: sense('perception', '見方・受け止め方') }),
  'The building has become a monument to ordinary work.': words({ work: sense('work', '仕事') }),
  'The result is not a complete success.': words({ complete: sense('complete', '完全な') }),
  'One wing is still closed, and the roof leaks in heavy rain.': words({
    wing: sense('wing', '（建物の）棟'),
    closed: sense('close', '閉じた（ままの）'),
    heavy: sense('heavy', '激しい（heavy rain で大雨）'),
  }),
  'The group therefore starts each project with a hard question.': words({ project: sense('project', '計画・企画') }),

  // p_pre2_school_radio（廊下に流れる声）
  'The radio club at our school almost stopped two years ago.': words({
    stopped: sense('stop', '止まった'),
    radio: sense('radio', '放送・ラジオ（radio club で放送部）'),
  }),
  'Three members remained, and the lunch program ran for four minutes.': words({ ran: sense('run', '（番組が）続いた・流れた') }),
  'Most students paid no attention to the sound in the halls.': words({
    paid: sense('pay', '（注意を）払った'),
    halls: sense('hall', '廊下（複数）'),
  }),
  'A new adviser asked the club to study its own audience.': words({
    study: sense('study', '調べる'),
    own: sense('own', '自分たちの'),
  }),
  'The members wrote a short survey and collected two hundred answers.': words({
    collected: sense('collect', '集めた'),
    answers: sense('answer', '答え（複数）・回答'),
  }),
  'The comments were direct and sometimes painful.': words({ direct: sense('direct', '率直な・直接的な') }),
  'The topics felt far from daily life.': words({ felt: sense('feel', '（〜に）感じられた') }),
  'One comment asked for news about the student council election.': words({ council: sense('council', '会議・評議会（student council で生徒会）') }),
  'The club changed the program in three ways.': words({ changed: sense('change', '変えた') }),
  'Each member now writes a script and reads it slowly before lunch.': words({ script: sense('script', '原稿・台本') }),
  'An older student checks the speed and the volume.': words({
    older: sense('old', '年上の（older）'),
    volume: sense('volume', '音量'),
  }),
  'The topics changed too.': words({ changed: sense('change', '変わった') }),
  'Reporters now visit the school nurse and the cooking staff.': words({ nurse: sense('nurse', '看護師（school nurse で保健の先生）') }),
  'The librarian joins a monthly program about new books.': words({ monthly: sense('month', '毎月の（monthly）') }),
  'A weekly part of the program explains one English word or one old local word.': words({ weekly: sense('week', '毎週の（weekly）') }),
  'A short weather report follows the news every day.': words({
    report: sense('report', '報告（weather report で天気予報）'),
    follows: sense('follow', '〜のあとに続く'),
  }),
  'An official from the town office talked about the disaster practice in early summer.': words({
    official: sense('official', '職員・役人'),
    office: sense('office', '役所（town office で町役場）'),
    practice: sense('practice', '訓練・練習'),
    early: sense('early', '初めの（early summer で初夏）'),
  }),
  'The audience grew, but the work became heavier.': words({
    grew: sense('grow', '増えた'),
    heavier: sense('heavy', 'より重い（heavyの比較級）'),
  }),
  'The club admits a mistake and moves on.': words({ moves: sense('move', '（move on で）先へ進む') }),
  'They express their own opinions briefly and leave the rest to the audience.': words({
    own: sense('own', '自分たちの'),
    leave: sense('leave', '（leave A to B で）AをBにゆだねる'),
    rest: sense('rest_2', '残り'),
  }),
  'If a disaster stops the school bell, the radio room carries the announcement.': words({
    bell: sense('bell', 'チャイム・ベル'),
    carries: sense('carry', '（知らせを）伝える・流す'),
    radio: sense('radio', '放送・ラジオ（radio room で放送室）'),
  }),
  'A battery and a simple device keep the speakers working for two hours.': words({ working: sense('work', '（機械が）動いている') }),
  'They say that a voice in the halls is a small form of communication.': words({ halls: sense('hall', '廊下（複数）') }),

  // p_2_disaster_translators（読めなかった警報）
  'A strong typhoon reached our coastal town three years ago.': words({ reached: sense('reach', '（〜に）着いた・やって来た') }),
  'The local authority sent an evacuation warning at nine in the evening.': words({ evening: sense('evening', '晩・夜（in the evening で夜の）') }),
  'The message reached every phone in the area within a minute.': words({ reached: sense('reach', '（〜に）届いた') }),
  'Foreign residents read the warning but did not move.': words({ read: sense('read', '読んだ（過去形）') }),
  'A later study explained the whole process in clear terms.': words({
    study: sense('study', '研究・調査'),
    terms: sense('term', '言葉・言い方（in clear terms で）'),
  }),
  'The message used old official words and a difficult grammar form.': words({ used: sense('use', '使っていた') }),
  'Machine translation turned one urgent sentence into a polite invitation.': words({ turned: sense('turn', '（turn A into B で）AをBに変えた') }),
  'The warning was accurate in Japanese and useless in practice.': words({ practice: sense('practice', '実際（in practice で実際には）') }),
  'The office had followed its own manual, and the message still failed.': words({
    office: sense('office', '役所・役場'),
    own: sense('own', '自分たちの'),
    manual: sense('manual', '手引き・マニュアル'),
  }),
  'A group of residents and teachers began a small project.': words({ project: sense('project', '取り組み・計画') }),
  'Each notice keeps to one idea, one action and a short sentence.': words({
    notice: sense('notice', '知らせ・お知らせ'),
    keeps: sense('keep', '（keep to 〜 で）〜だけにとどめる'),
  }),
  'The group also tested every notice with new immigrants.': words({
    tested: sense('test', '試した'),
    notice: sense('notice', '知らせ・お知らせ'),
  }),
  'The team then added pictures near the important terms.': words({ terms: sense('term', '語・用語') }),
  'Twelve residents joined a training course after their own working hours.': words({
    course: sense('course', '講座・課程'),
    own: sense('own', '自分の'),
    working: sense('work', '働く（working hours で勤務時間）'),
  }),
  'They practice the phrases for medical help, food and lost family members.': words({
    help: sense('help', '助け・支援'),
    lost: sense('lost', '行方の分からない（lost family members で）・失われた'),
  }),
  'The group visits language classes and local organizations every spring.': words({ classes: sense('class', '教室・授業（language class で語学教室）') }),
  'They confirm the nearest shelter with each family.': words({ nearest: sense('near', 'いちばん近い（nearの最上級）') }),
  'Two years later, a second typhoon tested the new system.': words({
    tested: sense('test', '試した'),
    system: sense('system', '仕組み・システム'),
  }),
  'Most of the foreign residents left their homes on time.': words({
    left: sense('leave', '出た・離れた'),
    time: sense('time', '時間（on time で時間どおりに）'),
  }),
  'Some elderly Japanese neighbors also used the easy notices.': words({ used: sense('use', '使った') }),
  'Awareness of simple wording grew across the whole town.': words({
    grew: sense('grow', '広がった・高まった'),
    across: sense('across', '〜じゅうに・〜の全体に'),
  }),
  'The town office noticed that simple language helps everyone.': words({
    office: sense('office', '役所（town office で町役場）'),
    noticed: sense('notice', '気づいた'),
  }),
  'A phone without power cannot show the translation.': words({ show: sense('show', '（画面に）表示する・示す') }),
  'An urgent message may reach a person who cannot read the local script.': words({
    may: MAY,
    reach: sense('reach', '届く'),
    script: sense('script', '文字（その言語を書き表す文字）'),
  }),
  'The group therefore relies on the network of neighbors in the end.': words({ end: sense('end', '終わり（in the end で最後には）') }),
  'They argue that real safety grows from contact between people in ordinary times.': words({
    contact: sense('contact', '接触・交流'),
    times: sense('time', '時期（in ordinary times でふだんは）'),
  }),

  // p_ext_1000_civic_decisions（公共の決定を読む語彙地図）
  'A town may hold meetings and publish notices, yet still hear only the people who already know how the system works.': words({ may: MAY }),
  'The council may nominate officials, form a coalition, or ask a committee to study a difficult problem.': words({ may: MAY_PERMISSION }),
  'Outside those limits its orders carry no weight at all, however reasonable they may sound.': words({ may: MAY }),
  'Citizens who understand the limits of a rule can also see where their own responsibility begins.': words({ own: sense('own', '自分の') }),
  'Prosecutors must show why the charge fits the facts, and the defense may challenge every provision the state relies on.': words({
    charge: sense('charge', '（罪の）告発・訴え'),
    may: MAY_PERMISSION,
    challenge: sense('challenge', '異議を唱える'),
  }),
  'Openness is therefore not a courtesy that officials may offer but a condition for honest debate.': words({ may: MAY_PERMISSION }),
  'The two problems look alike on a screen, and yet they need completely different answers.': words({ answers: sense('answer', '答え（複数）・対処') }),
  'Every medium shapes what it carries, because a broadcast compresses while a document accumulates.': words({ shapes: sense('shape', '形づくる') }),
  'A reader who is literate in one medium may still be almost helpless in another.': words({ may: MAY }),
  'A budget is the clearest statement that a government ever makes about what it truly values.': words({ values: sense('value', '重んじる・大切にする') }),
  'A policy of austerity may balance the accounts while moving the cost onto families who cannot insure themselves.': words({
    may: MAY,
    balance: sense('balance', '（帳尻を）合わせる・釣り合わせる'),
    moving: sense('move', '移すこと・動かすこと'),
  }),
  'A norm that nobody is allowed to question quietly becomes a threat to the trust that created it.': words({ trust: sense('trust', '信頼') }),
  'A rule about waste, wages, or travel now touches many people who never voted on it.': words({ travel: sense('travel', '移動・旅行') }),
  'Humanitarian and environmental arguments therefore enter debates once thought purely local.': words({ thought: sense('think', '思われていた（thinkの過去分詞）') }),

  // p_ext_2000_customs_across_borders（国境を越える風習）
  'It announces how close two people may stand, how formal the moment must be, and who is expected to speak first.': words({ may: MAY_PERMISSION }),
  'A visitor who has learned this stops reading warmth or coldness into the simple order of two ordinary words.': words({ learned: sense('learn', '学んだ') }),
  'A returnee may bow politely in one country and shake hands in another within a single week of travel.': words({
    may: MAY,
    travel: sense('travel', '移動・旅行'),
  }),
  'Even waiting has a grammar, since a queue may be a straight line, a loose cluster, or a numbered ticket.': words({ may: MAY }),
  'The useful conclusion is not that greetings are arbitrary, but that they are learned, and can therefore be learned again.': words({
    learned: sense('learn', '学ばれた・学ばれる（learnの過去分詞）'),
  }),
  'Both rules are meticulous in their own way, and both remain invisible to anyone who has never been taught them.': words({
    own: sense('own', "（in one's own way で）それぞれのやり方で"),
  }),
  'A host may spend days preparing a gorgeous meal, or may improvise something frugal from anything the kitchen happens to hold.': words({ may: MAY }),
  'Some tables require silence while food is being served, while others treat continuous conversation as the whole point of eating together.': words({
    being: sense('be', '〜されている（beの-ing形）'),
  }),
  'Timing is equally variable, since a main meal may commence at six in one country and at eleven in another.': words({ may: MAY }),
  'Festivals look like exceptions to daily life, and yet they usually restate what a community values most.': words({ values: sense('value', '重んじる・大切にする') }),
  'A ritual repeated for centuries carries meanings that its own participants may no longer be able to explain.': words({
    own: sense('own', 'それ自身の'),
    may: MAY,
  }),
  'A rhythm learned at an early age can resonate long after the theology that once explained it has been lost.': words({
    learned: sense('learn', '覚えた・身につけた（learnの過去分詞）'),
  }),
  'A gesture made for luck may also be a form of respect toward the dead of a particular family.': words({ may: MAY, dead: sense('dead', '死者（the dead）') }),
  'A photogenic ritual can survive because tourism funds it, and can also be changed by that very same attention.': words({
    funds: sense('fund', '資金を出す・支える'),
  }),
  'Whether this counts as preservation or as loss is a genuine disagreement rather than a question with a settled answer.': words({
    answer: sense('answer', '答え'),
  }),
  'A revived custom is not less real, although it may serve purposes that the original version never had and could not have imagined.': words({ may: MAY }),
  'Reading a festival well therefore means asking who keeps it, who pays for it, and who is left out.': words({
    means: sense('mean', '意味する・〜ということだ'),
    left: sense('leave', '取り残された・締め出された（leave outの過去分詞）'),
  }),
  'For the maker it may be an income, while for the buyer it is a compressed memory of a journey.': words({ may: MAY }),
  'The surplus that such a factory creates may later fund the museum that displays what it replaced.': words({ may: MAY, fund: sense('fund', '資金を出す') }),
  'Those decisions quietly shape what a later generation will believe that its own ancestors actually cared about.': words({
    shape: sense('shape', '形づくる'),
    own: sense('own', '自分たちの'),
    cared: sense('care', '大切に思った（care about）'),
  }),
  'A dialect is not a corrupted version of a standard, because it is a variety with a history of its own.': words({ own: sense('own', '（of its own で）それ自身の') }),
  'A family may send one member first, then a second, and only much later consider the move permanent.': words({ may: MAY, move: sense('move', '移住・移動') }),
  'Remittances, return visits, and unfinished plans can keep two distant places connected for several decades at a time.': words({
    return: sense('return', '帰郷の（return visit で里帰り）'),
    visits: sense('visit', '訪問（return visits で里帰り）'),
  }),
  'Trade has always carried words along with the commodities that were being bought and sold across long distances.': words({
    being: sense('be', '〜されている（beの-ing形）'),
  }),
  'Work shapes language quite as directly as geography does, and it often does so rather more quickly.': words({ shapes: sense('shape', '形づくる') }),
  'An entrepreneur, a contractor, and a factory worker in one city may share a vocation without sharing much vocabulary.': words({ may: MAY }),
  'Bilingual communities are frequently described as being trapped somewhere awkwardly between two different worlds.': words({
    being: sense('be', '〜であること（beの-ing形）'),
  }),
  'A stereotype is a compressed observation that has quietly stopped being tested against any new evidence at all.': words({
    being: sense('be', '〜されること（beの-ing形）'),
  }),
  'It usually begins with something a traveller genuinely saw and ends as a claim about millions of people.': words({ saw: sense('see', '見た') }),
  'The error is not the original observation, because the error lies in the range over which it is applied.': words({ lies: sense('lie_2', '（〜に）ある') }),
  'Words such as always and every are among the clearest signals that a description has stopped being precise.': words({
    being: sense('be', '〜であること（beの-ing形）'),
  }),
  'If no answer to that question is available at all, the statement is an attitude rather than a description.': words({ answer: sense('answer', '答え') }),
  'Once those conditions are understood, some practices still deserve criticism, and that criticism rests on something solid.': words({
    rests: sense('rest', '（〜の上に）成り立つ・基づく（rest on）'),
  }),
  'It is to notice that one’s own habits are also local, also learned, and also open to question.': words({
    own: sense('own', '自分自身の'),
    learned: sense('learn', '学ばれた（learnの過去分詞）'),
  }),

  // p_ext_3000_shared_watershed（一つの流域を共有する）
  'Leaves, roots, and the loose floor of a forest all slow the water down and let a large part of it sink into the ground.': words({
    leaves: sense('leaf', '葉（複数）'),
  }),
  'Snow adds a delay of several months that farmers living downstream have depended on for many centuries.': words({ living: sense('live', '暮らしている・住んでいる') }),
  'An anomaly in a single season is quite ordinary, but a long run of them is an indication of something else.': words({
    run: sense('run', '連続（a long run of で長く続くこと）'),
  }),
  'Many aquatic animals are highly susceptible to thermal change because they cannot regulate their own body heat.': words({ own: sense('own', '自分の') }),
  'A rise of only two degrees may be adequate to end reproduction for one species while another becomes more energetic.': words({
    rise: sense('rise', '上昇'),
    may: MAY,
  }),
  'The vegetation along a river bank does far more useful work than its modest appearance suggests.': words({ bank: sense('bank_2', '岸・土手') }),
  'Roots hold the soil in place, shade cools the water, and fallen leaves feed the insects that fish depend on.': words({
    cools: sense('cool', '冷やす'),
    leaves: sense('leaf', '葉（複数）'),
  }),
  'Removing that narrow strip is cheap and quick, while restoring the same function may take several decades.': words({ may: MAY }),
  'This asymmetry between damage and repair is probably the single most important fact about all living systems.': words({ repair: sense('repair', '修復') }),
  'Downstream the very same chemical that raised a yield can feed an enormous growth of water plants and weeds.': words({
    raised: sense('raise', '上げた・高めた'),
    yield: sense('yield', '収量'),
  }),
  'Irrigation raises yields surely and steadily, and yet it also concentrates salt in the very ground that it waters.': words({
    yields: sense('yield', '収量（複数）'),
  }),
  'Every drop of water that evaporates leaves behind any minerals that it happened to be carrying.': words({ drop: sense('drop', 'しずく・一滴') }),
  'A dry region can eat well for many decades by buying what its own rainfall could never support.': words({ own: sense('own', '自らの') }),
  'Reading a food price therefore means reading rainfall, soil, policy, and shipping costs all at the same time.': words({
    means: sense('mean', '意味する・〜ということだ'),
  }),
  'Every later advance in medicine rests on that basic separation rather than replacing it in any way.': words({
    rests: sense('rest', '（〜の上に）成り立つ・基づく（rest on）'),
  }),
  'A place that tests its own people carefully will always appear less healthy than a place that tests rarely.': words({ own: sense('own', '自らの') }),
  'Families that have lost a house carry a strain that lasts long after the water itself has disappeared.': words({
    lost: sense('lose', '失った'),
    lasts: sense('last_2', '続く'),
  }),
  'Telemedicine narrows part of that gap, although it can neither set a fracture nor deliver a vaccine.': words({ narrows: sense('narrow', '狭める・縮める') }),
  'The remaining distance has to be closed by better roads, by more staff, or by moving the service itself closer.': words({
    moving: sense('move', '移すこと・動かすこと'),
  }),
  'A pipe installed a century ago may still work perfectly while the one beside it is close to failure.': words({ may: MAY }),
  'A network full of small leaks loses a fixed share of everything that is ever pumped into its pipes.': words({ share: sense('share', '割合・取り分') }),
  'In some cities that share reaches a third of the total, which is more than any conservation campaign could save.': words({
    share: sense('share', '割合・取り分'),
  }),
  'Finding those leaks is quiet and patient work that produces no photograph worth printing in a newspaper.': words({ finding: sense('find', '見つけること') }),
  'It is also the cheapest new supply that is available to almost every older city in the world.': words({ supply: sense('supply', '供給源') }),
  'Rules that require the second of these uses to sit higher are cheap while a district is still being built.': words({
    uses: sense('use', '用途（複数）'),
    being: sense('be', '〜されている（beの-ing形）'),
  }),
  'Deferring maintenance is not really saving money, because it is borrowing against a repair that only grows larger.': words({
    repair: sense('repair', '修理'),
  }),
  'The interest on that loan is paid by the family that happens to be living there when the pipe finally breaks.': words({ living: sense('live', '住んでいる') }),
  'Water and energy are so closely linked together that neither of them can be planned on its own.': words({ own: sense('own', '（on its own で）単独で') }),
  'Moving water up to a higher place takes electricity, and generating that electricity usually takes a great deal of water.': words({
    moving: sense('move', '動かすこと・運ぶこと'),
  }),
  'Planning either of these two systems without the other guarantees a shortage that nobody in charge predicted.': words({
    charge: sense('charge', '（in charge で）担当している・責任を負う'),
  }),
  'Smaller machines now do a growing share of the work that used to require a large structure.': words({
    share: sense('share', '割合・取り分'),
    used: sense('use', '（used to で）以前は〜していた'),
  }),
  'Control has now moved from valves and levers to software that runs on servers far away.': words({ control: sense('control', '制御・管理') }),
  'Cybersecurity therefore belongs inside a water plan rather than only inside some separate technology plan.': words({
    separate: sense('separate', '別の・独立した'),
  }),
  'Parts stop being made, the engineers who understand it retire, and the records that explain it go missing.': words({
    being: sense('be', '〜されること（beの-ing形）'),
  }),
  'Every claim about a river finally rests on a measurement that someone once chose to make.': words({ rests: sense('rest', '（〜の上に）成り立つ・基づく（rest on）') }),
  'Where the gauge sits, how often it is read, and what it ignores all help to shape the result.': words({ shape: sense('shape', '形づくる') }),
  'Planning for the mean therefore prepares a community for a year that it will only rarely experience.': words({ experience: sense('experience', '経験する') }),
  'None of them is simply wrong, and none of their separate pictures is complete on its own.': words({
    separate: sense('separate', '別々の'),
    own: sense('own', '（on its own で）単独で・それだけで'),
  }),
  'Work across several disciplines is slow precisely because the separate vocabularies have to be reconciled first.': words({
    separate: sense('separate', '別々の'),
  }),
  'A basin that funds that slow work early avoids having to argue about basic definitions during an emergency.': words({ funds: sense('fund', '資金を出す') }),
  'Every treaty about a shared river is an attempt to answer that one basic asymmetry somehow.': words({ attempt: sense('attempt', '試み') }),
  'A workable agreement gives the side near the source something valuable that it cannot obtain on its own.': words({ own: sense('own', '（on its own で）単独で') }),
  'An agreement that only asks the other side for restraint is a request rather than a bargain.': words({ request: sense('request', '要請・お願い') }),
  'Requests hold only while relations are warm and fail at exactly the moment when they are most needed.': words({ requests: sense('request', '要請・お願い（複数）') }),

  // p_ext_4000_generational_city（世代を越えて都市を考える）
  'A city is above all a machine for moving costs and benefits across time, although it is very rarely described in quite those terms.': words({
    moving: sense('move', '移すこと・動かすこと'),
  }),
  'The choice of that single number therefore settles the answer long before any piece of evidence has actually been examined.': words({
    answer: sense('answer', '答え'),
  }),
  'Honest analysis states the rate openly at the very start and then reports how far the conclusion moves when that rate is changed.': words({
    start: sense('start', '最初・始め'),
  }),
  'Households face exactly the same problem on a much smaller scale, and they generally solve it rather badly.': words({ face: sense('face', '直面する・抱える') }),
  'Public argument is shaped by the direction of public attention long before it is shaped by any piece of evidence.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
  }),
  'A problem that nobody at all has noticed cannot be solved, however serious that problem may later turn out to be.': words({ may: MAY }),
  'A problem that everybody has noticed will be answered somehow, even in cases where it is comparatively small and easy to bear.': words({
    bear: sense('bear', '耐える'),
  }),
  'The order in which problems arrive on a public agenda is therefore itself an important political outcome in its own right as well.': words({
    own: sense('own', '（in its own right で）それ自体で'),
  }),
  'Removing it entirely would leave a city perfectly accurate about the present and quite incapable of building anything at all.': words({
    building: sense('build', '造ること・築くこと'),
  }),
  'Trust behaves much more like a stock that is slowly accumulated than like a flow that arrives each year.': words({ trust: sense('trust', '信頼') }),
  'A city with a deep reserve of public trust can attempt reforms that a more suspicious city simply cannot attempt at all.': words({
    trust: sense('trust', '信頼'),
  }),
  'Organizations remember what they have learned through their formal procedures rather than through the memories of their staff.': words({
    learned: sense('learn', '学んだ'),
  }),
  'A job that is made up of ten separate tasks may lose four of them and become a different job with exactly the same title.': words({
    separate: sense('separate', '別々の'),
    may: MAY,
  }),
  'A city that funds retraining only after a large factory has finally closed has already lost several genuinely useful years.': words({
    funds: sense('fund', '資金を出す'),
    lost: sense('lose', '失った'),
  }),
  'The very same money, if it is used earlier, reaches workers while they still have savings, contacts, and a measure of confidence.': words({
    contacts: sense('contact', '人脈・つながり（複数）'),
  }),
  'The difference usually lies in the conditions that surround the decision rather than in the quality of the decision itself at all.': words({
    lies: sense('lie_2', '（〜に）ある'),
  }),
  'Any policy that ignores this asymmetry will end by describing the second of those households as being simply careless.': words({
    being: sense('be', '〜であること（beの-ing形）'),
  }),
  'Savings, family support, and secure housing all widen that distance without ever appearing in any published official figure.': words({
    support: sense('support', '支え・支援'),
  }),
  'Time is the resource that inequality distributes most unevenly and that public policy notices least often.': words({ notices: sense('notice', '気づく') }),
  'Public services designed around the schedules of their own staff exclude exactly those residents most of all in practice.': words({
    own: sense('own', '自分たちの'),
  }),
  'Place multiplies every other condition that a household faces, whether in a favorable direction or in the opposite one.': words({
    faces: sense('face', '直面する'),
  }),
  'Moving a single bus route can change more outcomes for children than an entirely new curriculum in the same district.': words({
    moving: sense('move', '動かすこと・移すこと'),
  }),
  'A city that improves conditions is therefore not excusing anyone, because what it is doing is widening the margin.': words({
    widening: sense('widen', '広げている・広げること'),
  }),
  'Pairing a price signal with a direct payment is usually the cheapest available way to keep both effects at once.': words({
    pairing: sense('pair', '組み合わせること'),
  }),
  'Those two roles pull housing policy in opposite directions, and they cannot both be fully satisfied at the same time.': words({
    satisfied: sense('satisfy', '満たされる（satisfyの過去分詞）'),
  }),
  'Used for ordinary daily expenses, it converts a temporary shortage into a permanent charge on every future month.': words({
    charge: sense('charge', '負担・費用'),
  }),
  'It works by pooling events that are rare for any single individual and reasonably predictable for a whole population.': words({
    pooling: sense('pool', 'まとめること・出し合うこと'),
  }),
  'An institution is essentially a promise that keeps its force even after the people who first made it have left it behind.': words({
    left: sense('leave', '去った・あとに残した'),
  }),
  'Its value comes from being consistently predictable rather than from being clever in any one particular case.': words({
    being: sense('be', '〜であること（beの-ing形）'),
  }),
  'A court that decided every single case purely on its own merits would be entirely fair and completely useless.': words({
    own: sense('own', '（on its own merits で）それ自体の是非で'),
  }),
  'People arrange their whole lives around what they confidently expect an institution to do in the following year.': words({
    lives: sense('life', '生活・人生（複数）'),
  }),
  'Accountability means simply that someone can be identified by name at the point when a decision turns out to be wrong.': words({
    means: sense('mean', '意味する・〜ということだ'),
  }),
  'Transparency is frequently offered to the public as a complete and sufficient answer to every kind of distrust.': words({ answer: sense('answer', '答え') }),
  'Four short sentences of that kind will usually do more for public trust than four hundred pages of technical detail.': words({
    trust: sense('trust', '信頼'),
  }),
  'A body that carries out its routine work extremely well may still be quite incapable of admitting a single error.': words({ may: MAY }),
  'Libraries, places of work, families, and neighbors together carry most of what a resident of a city actually ends up learning.': words({
    learning: sense('learn', '学ぶこと'),
  }),
  'Assessment shapes what is actually taught in a classroom far more powerfully than any curriculum document ever manages to do.': words({
    shapes: sense('shape', '形づくる'),
  }),
  'An adult brings experience, severely limited time, and an immediate practical reason for learning one particular thing.': words({
    learning: sense('learn', '学ぶこと'),
  }),
  'A city that cannot consult its own past will keep on repeating experiments that it has already run once before.': words({ own: sense('own', '自らの') }),
  'A health budget that is used entirely on treatment is therefore being used at the very last stage of the process.': words({
    being: sense('be', '〜されている（beの-ing形）'),
  }),
  'Moving part of that budget earlier is difficult because the benefits then appear in the accounts of some other office.': words({
    moving: sense('move', '移すこと・動かすこと'),
  }),
  'Nobody is ever able to point to the particular illness that a clean water supply did not happen to cause.': words({
    supply: sense('supply', '供給（water supply で水道）'),
  }),
  'A treatment that adds five years of life may equally add five years of dependence on someone else.': words({ may: MAY }),
  'Pretending that no such choice is being made merely hides the choice rather than actually avoiding it in any way.': words({
    being: sense('be', '〜されている（beの-ing形）'),
  }),
  'Planning carefully for that day is the whole difference between a small trouble and a complete stop.': words({ stop: sense('stop', '停止') }),
  'Deciding how much duplication to keep is in the end a judgment about how strange the future may turn out to be.': words({ may: MAY }),
  'Data that is collected for one stated purpose is almost always used later for some quite different one.': words({ collected: sense('collect', '集められる') }),
  'Rules that are agreed later are always shaped by the value of the material that has already been collected.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
    collected: sense('collect', '集められた'),
  }),
  'No plan survives an entire generation completely intact, and the genuinely useful plans are designed from the start to be changed.': words({
    start: sense('start', '最初・始め'),
  }),
  'The distinction that really matters here lies between decisions that can be reversed and decisions that cannot be reversed.': words({
    lies: sense('lie_2', '（〜に）ある'),
  }),
  'A clearly stated review date is much the cheapest instrument for building revision into almost any decision.': words({
    building: sense('build', '組み込むこと・築くこと'),
  }),
  'Any procedure that counts only the voices actually present in the room will systematically favor the people of the present.': words({
    present: sense('present', '（その場に）いる・出席している'),
    favor: sense('favor', '優遇する・ひいきする'),
  }),
  'It leaves physical space, keeps its records, states its assumptions, and schedules the exact moment of the next review.': words({
    schedules: sense('schedule', '予定に組み込む・日程を決める'),
  }),
})
