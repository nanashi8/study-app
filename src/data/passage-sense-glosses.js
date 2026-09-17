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
  'After the talk, children will work in small groups to build a paper model of the station.': words({ talk: sense('talk', '話・講演') }),
  'Parents may help, but each child should write a name on the model and take it home at noon.': words({ may: MAY_PERMISSION }),

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
  'The older residents shared recipes and suggested vegetables that the class could plant in autumn.': words({ shared: sense('share', '分け合った・伝えた') }),
  'The students used this advice to plan a second garden, which made the project continue beyond one school term.': words({ used: sense('use', '使った') }),

  // p_pre2_museum_volunteers（博物館の若いボランティア）
  'They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.': words({
    may: MAY,
    answer: sense('answer', '答え'),
    help: sense('help', '助け・手助け'),
  }),
  'This approach is more useful than giving visitors information that may be incorrect.': words({ may: MAY }),
  'Staff members used to write long explanations for adults, but they now ask student volunteers to read the labels first.': words({
    used: sense('use', '（used to で）以前は〜していた'),
  }),
  'The program shows that learning about the past can help people build stronger relationships in the present.': words({ learning: sense('learn', '学ぶこと') }),

  // p_pre2plus_repair_cafes（リペアカフェが教えてくれること）
  'Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.': words({
    finding: sense('find', '見つけること'),
  }),
  'In response, communities in several countries have started events called repair cafes.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'A repair cafe is different from a normal repair shop.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.': words({ may: MAY }),
  'Older residents may know how older machines were built, while younger participants may be more comfortable finding digital information.': words({
    may: MAY,
    finding: sense('find', '見つけること・探すこと'),
  }),
  'Supporters say repair cafes offer both environmental and social benefits.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'Families may also save money, which is especially valuable when prices are rising.': words({ may: MAY }),
  'Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.': words({ may: MAY }),
  'However, repair cafes are not a complete solution.': words({ repair: sense('repair', '修理（repair cafe でリペアカフェ）') }),
  'Repair cafes cannot change product design by themselves, but they can show consumers what prevents repairs.': words({
    repair: sense('repair', '修理（repair cafe でリペアカフェ）'),
    repairs: sense('repair', '修理（複数）'),
  }),
  'Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.': words({
    may: MAY,
  }),

  // p_2_quiet_technology（公共空間の静かなテクノロジー）
  'Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.': words({
    may: MAY,
    becoming: sense('become', '〜になること'),
  }),
  'For that reason, officials should explain clearly what kind of data is collected and how it will be protected.': words({
    collected: sense('collect', '集められる'),
  }),
  'If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.': words({ may: MAY }),
  'City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.': words({
    left: sense('leave', '取り残された（leave outの過去分詞）'),
  }),
  'In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.': words({
    repair: sense('repair', '修理'),
    stop: sense('stop', '停留所（bus stop でバス停）'),
    may: MAY,
  }),
  'They compare energy use, waiting times, and complaints in different neighborhoods and then publish the results.': words({
    use: sense('use', '使用（energy use でエネルギー使用量）'),
  }),

  // p_pre1_resilient_cities（不確かな天候に備える都市設計）
  'In the past, local governments often treated floods, heat waves, and water shortages as separate problems.': words({
    separate: sense('separate', '別々の・独立した'),
  }),
  'For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.': words({
    building: sense('build', '建てること'),
    may: MAY,
  }),
  'Similarly, installing powerful air conditioners in public buildings may protect residents during heat waves, yet it can increase energy demand when the power supply is already under pressure.': words({
    may: MAY,
    supply: sense('supply', '供給（power supply で電力供給）'),
  }),
  'A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.': words({
    needs: sense('need', '必要なこと・ニーズ（複数）'),
  }),
  'This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.': words({
    attempt: sense('attempt', '試み'),
  }),
  'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.': words({
    cools: sense('cool', '涼しくする・冷やす'),
    may: MAY,
  }),
  'Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.': words({
    map: sense('map', '地図に記す・地図にする'),
  }),
  'This process takes time, and it may reveal disagreements about which projects should come first.': words({ may: MAY }),
  'Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.': words({
    trust: sense('trust', '信頼'),
  }),
  'A drainage map may look complete, yet residents may know that blocked street drains regularly send water into a particular apartment building.': words({
    may: MAY,
  }),
  'Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.': words({
    training: sense('train', '訓練すること'),
    may: MAY,
    lives: sense('life', '命（複数）'),
  }),
  "A project that performs well under today's conditions may be inadequate if migration, land use, or rainfall patterns change.": words({
    may: MAY,
    use: sense('use', '利用（land use で土地利用）'),
  }),
  'Setting review dates and publishing results allow governments to revise policies without treating revision as failure.': words({
    setting: sense('set', '定めること・設けること'),
  }),

  // p_1_collective_memory（集合的記憶のもろさ）
  'When search results, short videos, and algorithmic recommendations compete for attention, materials that require slow reading or moral reflection may become almost invisible.': words({
    search: sense('search', '検索（search results で検索結果）'),
    may: MAY,
  }),
  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
    presented: sense('present', '提示される（presentの過去分詞）'),
  }),
  'A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    may: MAY,
  }),
  'Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.': words({
    calls: sense('call', '求める声・呼びかけ（複数）'),
  }),
  'A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.': words({
    may: MAY,
    trust: sense('trust', '信頼'),
  }),
  'A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.': words({
    may: MAY,
  }),
  'Two historians may accept the same evidence yet assign different significance to it because they ask different questions.': words({ may: MAY }),
  'The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.': words({
    lies: sense('lie_2', '（〜に）ある'),
  }),
  "A rumor that confirms a community's self-image may travel farther than a well-documented study that complicates it.": words({ may: MAY }),
  'Some observers respond by demanding that platforms remove misleading historical claims more aggressively.': words({
    demanding: sense('demand', '要求すること・求めること'),
  }),
  "A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens' judgment.": words({ may: MAY }),

  // p_5_school_open_day（学校公開日の案内）
  'Please bring your own drinks.': words({ own: sense('own', '自分自身の') }),

  // p_4_bicycle_safety（安全な自転車週間）
  'It begins with a short talk at the community center on Monday evening.': words({ talk: sense('talk', '話・講演') }),
  'They must use bicycle lights because drivers may not notice them after dark.': words({ may: MAY }),
  'The week ends with a practice ride on Saturday morning.': words({ ride: sense('ride', '走行（practice ride で練習走行）') }),
  'Parents should join the ride too, so they can practice the rules with their children.': words({ ride: sense('ride', '走行') }),

  // p_3_lunch_food_waste（小さな皿から始まる大きな変化）
  'Students at one junior high school noticed that a lot of food was left in the cafeteria after lunch.': words({ left: sense('left_2', '残された・残っている') }),
  'The class then measured the amount of rice, vegetables, and bread left each day for two weeks.': words({ left: sense('left_2', '残った・残っている') }),
  'They discovered that waste was greatest on days when every student received the same large portion.': words({ discovered: sense('discover', '発見した・分かった') }),
  'The students suggested offering two plate sizes at the start of lunch.': words({ start: sense('start', '始め') }),
  'The students now share their results with nearby schools and encourage them to measure their own waste.': words({ own: sense('own', '自分たちの') }),

  // p_pre2_later_school_start（学校の始業時刻を遅らせるべきか）
  'Many teenagers arrive at school feeling tired, even when they try to go to bed at a reasonable time.': words({ feeling: sense('feel', '感じながら・感じている') }),
  'Sleep researchers explain that the body clock often changes during the teenage years.': words({ sleep: sense('sleep', '睡眠') }),
  'A later start, however, can cause practical problems for families and communities.': words({ start: sense('start', '開始・始業') }),
  'School buses may need new schedules, which can increase transportation costs.': words({ may: MAY }),
  'Sports practice and music activities may finish after dark, especially in winter.': words({ may: MAY }),
  'Some parents also depend on older children to care for younger family members after school.': words({ care: sense('care', '世話をする（care for）') }),
  'At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.': words({
    sleep: sense('sleep', '睡眠'),
  }),
  'Schools need to examine bus routes, club times, and family needs before choosing a new schedule.': words({ needs: sense('need', '必要なこと・ニーズ（複数）') }),
  'They should also teach students that a later start is not an invitation to stay online longer at night.': words({ start: sense('start', '開始・始業') }),
  'It is that school policies should take evidence about teenage sleep seriously.': words({ sleep: sense('sleep', '睡眠') }),
  'A community can then balance health benefits with local challenges and test whether its plan is effective.': words({
    balance: sense('balance', '両立させる・釣り合わせる'),
  }),
  'Careful changes are more useful than keeping an old schedule simply because it is familiar, especially when schools review them regularly.': words({
    review: sense('review', '見直す'),
  }),

  // p_pre2plus_city_bird_count（鳥を数えて科学を支える）
  'For example, the records may show that a species is arriving earlier in spring or disappearing from certain neighborhoods.': words({ may: MAY }),
  'An experienced observer may identify a bird by its song, while a beginner may confuse two similar species.': words({ may: MAY }),
  'They may ask participants to watch for the same length of time and to report visits when no birds appeared.': words({
    may: MAY,
    visits: sense('visit', '訪問（複数）'),
  }),
  'Some projects also send several volunteers the same observation task and compare their answers to estimate how often mistakes occur.': words({
    answers: sense('answer', '答え（複数）・回答'),
  }),
  'Researchers can then compare similar observations and estimate where the data may be incomplete.': words({ may: MAY }),
  'Together, they can follow changes in biodiversity and identify places that may need conservation.': words({ may: MAY }),

  // p_2_online_health_claims（オンラインの健康情報をどう読むか）
  'A short video claims that a certain drink improves memory, and thousands of users share it within a day.': words({ claims: sense('claim', '主張する') }),
  'The speaker may sound confident and may even mention a scientific study.': words({ may: MAY }),
  'Readers still need to examine how the study was designed and whether other researchers found similar results.': words({ found: sense('find', '見つけた・得た') }),
  'A result from twelve volunteers may be interesting, but it may not apply to people of different ages or health conditions.': words({ may: MAY }),
  'Without such a comparison, improvement may come from sleep, diet, expectation, or simple chance.': words({ may: MAY, sleep: sense('sleep', '睡眠') }),
  'Company funding does not automatically make research false, but readers should check whether the company sells the product being tested.': words({
    being: sense('be', '〜されている（beの-ing形）'),
  }),

  // p_pre1_cashless_inclusion（キャッシュレスの便利さが排除を生むとき）
  'Cash usually leaves no detailed record linking a person to a particular purchase, whereas digital payment creates data that may be stored, combined, or sold.': words({
    may: MAY,
  }),
  'Such records can detect fraud and improve services, yet they can also reveal medical needs, political interests, or daily movements.': words({
    needs: sense('need', '必要なこと・ニーズ（複数）'),
  }),
  'People with little economic or political power may be especially vulnerable when they cannot choose a private alternative.': words({ may: MAY }),
  'A fixed amount in an envelope stays visible, while digital balances may be divided across several apps and delayed transactions.': words({ may: MAY }),
  'Some governments therefore require essential businesses to accept cash while encouraging digital innovation elsewhere.': words({
    encouraging: sense('encourage', '促しながら・後押ししながら'),
  }),
  'Cash may sometimes appear inefficient as an option, just as backup power can appear wasteful on an ordinary day.': words({ may: MAY }),

  // p_1_metric_fixation（測定値と本来の目的）
  'A reading test captures some forms of comprehension, for example, but not every capacity that makes someone a thoughtful reader.': words({
    reading: sense('read', '読解（reading test で読解テスト）'),
  }),
  'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.': words({
    may: MAY,
  }),
  'A hospital may transfer difficult patients or redefine when the waiting-time clock officially starts.': words({ may: MAY }),
  'A narrow target may consequently punish the very risk taking required for genuine learning.': words({ may: MAY }),
  'Judgment can remain informed and humane, but it can also become inconsistent, biased, and difficult for outsiders to challenge.': words({
    challenge: sense('challenge', '異議を唱える'),
  }),
  'Without records, leaders may celebrate a program’s intentions while ignoring evidence that it repeatedly fails particular communities.': words({ may: MAY }),
  'Graduation rates may be considered alongside student surveys, samples of actual work, and information about what graduates can do later.': words({
    may: MAY,
  }),
  'Meaningful transparency explains why a measure was chosen, what it omits, how uncertainty was handled, and who can question its use.': words({
    use: sense('use', '使用・使い方'),
  }),
  'There is also a political question about who bears the burden of being measured.': words({
    bears: sense('bear', '負う・引き受ける'),
    being: sense('be', '〜されること（beの-ing形）'),
  }),
  'If measurement increases surveillance below but accountability does not increase above, the system may weaken rather than strengthen legitimacy.': words({
    may: MAY,
  }),
  'Institutions cannot precisely measure trust, intellectual courage, dignity, and social repair, yet they cannot responsibly ignore these values.': words({
    trust: sense('trust', '信頼'),
    repair: sense('repair', '修復'),
  }),
  'Institutions can strengthen trust by publicly stating that limit because this prevents precision from being mistaken for certainty.': words({
    trust: sense('trust', '信頼'),
    being: sense('be', '〜されること（beの-ing形）'),
    mistaken: sense('mistake', '取り違えられる（mistakeの過去分詞）'),
  }),
  'When a measure becomes a substitute for that mission, apparent precision can conceal institutional drift.': words({ drift: sense('drift', '漂流・ずれ') }),

  // p_5_weather_field_trip（遠足の二つの予定）
  'If it rains, we visit the science museum instead.': words({ rains: sense('rain', '雨が降る') }),

  // p_4_emergency_map（雨の日のための安全マップ）
  'They found that one sign was hidden behind a large tree.': words({ found: sense('find', '気づいた・分かった') }),

  // p_3_multilingual_town_guide（旅行者が使える街歩きガイド）
  'Next, exchange students used the first version without help from the class.': words({ used: sense('use', '使った'), help: sense('help', '助け・手助け') }),
  'They understood the English but sometimes missed a turn shown only by a street name.': words({ turn: sense('turn', '曲がり角') }),
  'One student in a wheelchair also found that a short route had many steps.': words({ found: sense('find', '気づいた・分かった') }),
  'The students learned that good translation requires more than replacing words.': words({ learned: sense('learn', '学んだ') }),

  // p_pre2_phone_free_focus（学校の「スマホなしの1時間」）
  'Teachers used the time for reading, writing, or problems that required steady attention.': words({ used: sense('use', '使った') }),
  'Both groups completed the same short reading tasks each Friday.': words({ reading: sense('read', '読解（reading tasks で読解課題）') }),
  'This reduced the chance that expectations alone would change how students described their focus.': words({
    reduced: sense('reduce', '減らした・小さくした'),
    focus: sense('focus', '集中'),
  }),
  'The school compared completion rates but did not treat a few extra answers as proof of deeper learning.': words({ answers: sense('answer', '答え（複数）・解答') }),
  'Others needed translation or reading tools that were available on their phones.': words({ reading: sense('read', '読むための（reading tools で読むのを助けるツール）') }),
  'The school now keeps the hour but reviews the rules every term.': words({ reviews: sense('review', '見直す') }),
  'At home, students can silence alerts or place a device out of reach while studying.': words({
    silence: sense('silence', '（通知を）消す・静かにさせる'),
    alerts: sense('alert', '通知・警報（複数）'),
    reach: sense('reach', '（out of reach で）手の届かない所'),
  }),

  // p_pre2plus_clothing_second_life（服に役立つ「二度目の生」を与える）
  'A group of schools created a clothing exchange with a repair station.': words({ repair: sense('repair', '修理（repair station で修理コーナー）') }),
  'At the repair table, visitors learned to replace buttons and close simple tears.': words({
    repair: sense('repair', '修理（repair table で修理テーブル）'),
    learned: sense('learn', '学んだ・身につけた'),
  }),
  'A repair did not need to look perfect; it needed to make the item safe and useful.': words({ repair: sense('repair', '修理') }),
  'Some cotton shirts became cleaning cloths, while artists used colorful material in school projects.': words({ used: sense('use', '使った') }),
  'The organizers wanted to know whether the exchange truly reduced waste.': words({ reduced: sense('reduce', '減らした') }),
  'Counting exchanged items alone would give an incomplete answer.': words({ answer: sense('answer', '答え') }),
  'Students, teachers, and neighbors all used the same tables and choice system.': words({ used: sense('use', '使った') }),
  'A useful second life begins with exchange and repair, but it also depends on durable design and fewer unnecessary purchases.': words({
    repair: sense('repair', '修理'),
  }),

  // p_2_vertical_farming（垂直農場にできること・できないこと）
  'Because water is collected and used again, some systems use far less water than field farming.': words({ collected: sense('collect', '集められる・回収される') }),
  'Artificial lights and cooling systems may require large amounts of electricity.': words({ may: MAY }),
  'If that electricity comes from fossil fuels, saved transport may not balance the extra energy use.': words({
    may: MAY,
    balance: sense('balance', '埋め合わせる・釣り合わせる'),
    use: sense('use', '使用（energy use でエネルギー使用量）'),
  }),
  'Farms that buy renewable power or use waste heat from nearby buildings may produce a different balance.': words({ may: MAY }),
  'The answer depends on the local climate, power supply, building, and crop.': words({
    answer: sense('answer', '答え'),
    supply: sense('supply', '供給（power supply で電力供給）'),
  }),
  'A farm may produce excellent vegetables and still fail if debt and electricity costs remain high.': words({ may: MAY }),
  'Public support should therefore be based on transparent evidence rather than exciting images alone.': words({ support: sense('support', '支援') }),
  'It may instead supply certain crops where land is scarce, transport is difficult, or weather is unstable.': words({ may: MAY }),

  // p_pre1_dark_sky_policy（人々を暗闇に残さずに夜空を守る）
  'Modern lighting has extended working hours, made travel easier, and allowed public spaces to remain active after sunset.': words({
    extended: sense('extend', '延ばした・広げた'),
    travel: sense('travel', '移動・旅行'),
  }),
  'Light entering homes may disturb sleep, while constant illumination changes the behavior of insects, birds, and other animals.': words({
    may: MAY,
    sleep: sense('sleep', '睡眠'),
  }),
  'Migrating birds can lose direction, and insects may circle lamps until they are exhausted.': words({ may: MAY, circle: sense('circle', '（〜の周りを）回る') }),
  'Calls to reduce night lighting often meet an immediate objection about safety.': words({ calls: sense('call', '求める声・呼びかけ（複数）') }),
  'Residents may reasonably fear darker sidewalks, and workers may need visible routes during late shifts.': words({ may: MAY }),
  'A policy that treats every lamp as equally harmful will therefore lose public trust.': words({ trust: sense('trust', '信頼') }),
  'Warmer-colored lamps may affect wildlife less than blue-rich white light.': words({ may: MAY }),
  'Timers and motion sensors can provide brightness when people are present without maintaining it all night.': words({
    present: sense('present', '（その場に）いる'),
  }),
  'Officials first need a map of current lighting, including ownership, energy use, brightness, direction, and hours of operation.': words({
    use: sense('use', '使用（energy use でエネルギー使用量）'),
  }),
  'An empty park at midnight may be a necessary path for a nurse returning from work.': words({ may: MAY }),
  "Researchers can then measure sky brightness, energy use, traffic incidents, wildlife activity, and residents' reported comfort.": words({
    use: sense('use', '使用（energy use でエネルギー使用量）'),
  }),
  'The trial should also record complaints and near misses, since average comfort may hide risks faced by a small group.': words({
    may: MAY,
    faced: sense('face', '直面している（faceの過去分詞）'),
  }),
  'Dark-sky tourism may bring visitors to rural areas, and lower electricity use can save public money.': words({
    may: MAY,
    use: sense('use', '使用（electricity use で電力使用量）'),
  }),
  'People in ordinary neighborhoods also deserve sleep, visible stars, and healthy local ecosystems.': words({ sleep: sense('sleep', '睡眠') }),
  'The strongest standards set goals for useful light rather than demanding darkness for its own sake.': words({
    demanding: sense('demand', '要求すること・求めること'),
    own: sense('own', '（for its own sake で）それ自体のために'),
  }),
  'They also require monitoring because new buildings, new technologies, and changing travel patterns can alter local needs.': words({
    travel: sense('travel', '移動（travel patterns で移動の傾向）'),
    needs: sense('need', '必要なこと・ニーズ（複数）'),
  }),
  'Protecting the night is therefore not a return to the past but a more disciplined use of modern light.': words({
    return: sense('return', '戻ること・回帰'),
    use: sense('use', '使い方・使用'),
  }),

  // p_1_choice_architecture（便利さが静かに選択を形づくるとき）
  'In practice, decisions are also shaped by which option appears first, which action requires effort, and what happens when someone does nothing.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
  }),
  'Diners may select healthier food more often when it is easy to see and reach, even though less healthy choices remain available.': words({ may: MAY }),
  'Households may use less electricity when bills compare their use with that of similar homes.': words({ may: MAY }),
  'Their appeal is clear in settings where information is complex, attention is limited, and delay carries real costs.': words({
    appeal: sense('appeal', '魅力'),
  }),
  'A well-designed default may help people carry out an intention they already have but repeatedly postpone.': words({ may: MAY }),
  "That judgment may reflect good evidence and a legitimate public goal, but it may also serve the designer's interests.": words({ may: MAY }),
  'If architecture is unavoidable, they argue, it should be designed to advance welfare rather than left to accident or commercial power.': words({
    left: sense('leave', '任された・ゆだねられた（leaveの過去分詞）'),
  }),
  'This response is persuasive as far as it goes, yet inevitability does not settle who may design, for whom, or toward what end.': words({
    may: MAY_PERMISSION,
  }),
  'Otherwise, convenience for the majority may be purchased by creating barriers for a vulnerable minority.': words({ may: MAY }),
  'Average improvement can hide the fact that a policy helps people who were already secure while confusing or excluding others.': words({
    confusing: sense('confuse', '混乱させること'),
  }),
  'Collecting such data creates its own privacy risks, so evaluation must use only what is necessary and protect it carefully.': words({
    own: sense('own', 'それ自身の・固有の'),
  }),
  'People learn, markets adapt, technologies change, and a once-helpful default may become irrelevant or exploitable.': words({ may: MAY }),
  'A scheduled review can also reveal whether people have learned to avoid or exploit the original design.': words({
    scheduled: sense('schedule', '予定された（scheduleの過去分詞）'),
    learned: sense('learn', '身につけた・学んだ'),
  }),
  'Scheduled reviews also make failure informative rather than allowing an ineffective design to survive through habit.': words({
    scheduled: sense('schedule', '予定された・定期的な（scheduleの過去分詞）'),
  }),
  'Citizens need not vote on every button or sentence, but they should be able to challenge goals, evidence, and hidden burdens.': words({
    challenge: sense('challenge', '異議を唱える'),
  }),
  'Independent review can test whether claimed benefits are real and whether commercial or political interests have shaped the design.': words({
    shaped: sense('shape', '形づくった（shapeの過去分詞）'),
  }),
  'Convenience becomes ethically defensible only when the people whose behavior is shaped can understand, refuse, and contest the terms of that convenience.': words({
    shaped: sense('shape', '形づくられる（shapeの過去分詞）'),
  }),

  // p_5_hot_summer_school（涼しい教室をつくる）
  'The plants make a cool wall of leaves.': words({ leaves: sense('leaf', '葉（複数）') }),

  // p_4_school_solar_roof（電気をつくる屋根）
  'We learned that the panels made the most electricity in May.': words({ learned: sense('learn', '知った・学んだ') }),
  'In June, clouds and rain lowered the number for two weeks.': words({ lowered: sense('lower', '下げた') }),
  'Some students thought the panels were broken, but the weather was the real reason.': words({ thought: sense('think', '思った') }),
  'Now students talk about energy at home, and some families check their own use.': words({ own: sense('own', '自分たちの'), use: sense('use', '使用（量）') }),

  // p_3_ai_class_rules（自分たちで作ったルール）
  'Some used them to check spelling, and others asked for ideas before writing.': words({ used: sense('use', '使った') }),
  'A few students copied whole answers and did not read them carefully.': words({ copied: sense('copy', '写した・まねた'), answers: sense('answer', '答え（複数）') }),
  'One teacher noticed that several reports used the same unusual phrase.': words({ used: sense('use', '使っていた') }),
  'Instead, the school asked each class to write its own rules.': words({ own: sense('own', '自分たちの') }),
  'Our class first collected examples of good and bad use.': words({ collected: sense('collect', '集めた'), use: sense('use', '使い方') }),
  'The class found that a list of ideas was often helpful.': words({ found: sense('find', '分かった・気づいた') }),
  'The class also found that copying a finished report was not honest work.': words({ found: sense('find', '分かった・気づいた') }),
  'A student pointed out that the tools sometimes give confident but wrong answers.': words({ answers: sense('answer', '答え（複数）') }),
  'Half of the class wrote a summary alone, and the other half used AI first.': words({ used: sense('use', '使った') }),
  'Two answers even included a fact that no other source mentioned.': words({ answers: sense('answer', '答え（複数）') }),
  'Some students still think that any use of AI is unfair.': words({ use: sense('use', '使用') }),
  'Our teacher told us that learning to judge information is the real skill.': words({ learning: sense('learn', '学ぶこと・身につけること') }),

  // p_pre2_crowded_town_tourism（写真が広まった町で）
  'Shops and restaurants welcomed the change because many young families had left the town.': words({ left: sense('leave', '去った・離れた') }),
  'Litter increased near the bus stop, and neighbors collected it themselves every Monday.': words({
    stop: sense('stop', '停留所（bus stop でバス停）'),
    collected: sense('collect', '集めた・拾い集めた'),
  }),
  'The town council did not want to stop tourism, so it looked for practical answers.': words({ answers: sense('answer', '答え（複数）・解決策') }),

  // p_pre2plus_rural_bus_future（村のバスは誰が動かすのか）
  'Some companies used to run several routes, but today they cannot fill even one bus.': words({ used: sense('use', '（used to で）以前は〜していた') }),
  'They discovered that most trips were short and happened at predictable times.': words({ discovered: sense('discover', '発見した・分かった') }),
  'Very few people used the full route from end to end.': words({ used: sense('use', '使った') }),
  'The village then tested a small bus that comes only when someone books it.': words({ books: sense('book', '予約する') }),
  'Drivers reported that the work was less stressful than following a fixed schedule.': words({ following: sense('follow', '従うこと') }),
  'Some older residents disliked booking and preferred a bus that always came at the same time.': words({ booking: sense('book', '予約すること') }),
  'The office therefore kept a telephone line and trained volunteers to help with the first booking.': words({ booking: sense('book', '予約') }),
  'A neighboring town chose a different answer and paid taxi companies to carry passengers.': words({ answer: sense('answer', '答え・対応策') }),
  'Whether such support arrives in time will depend on decisions made in the next few years.': words({ support: sense('support', '支援') }),

  // p_2_space_debris（混み合う軌道）
  'Those fragments may then strike other objects and produce still more debris.': words({ may: MAY }),
  'Removing a few large objects each year may be far cheaper than removing thousands of fragments later.': words({ may: MAY }),
  'Meanwhile, the number of launches continues to rise each year.': words({ launches: sense('launch', '打ち上げ（複数）') }),
  'Yet enforcement remains weak, because no authority can inspect every launch.': words({ launch: sense('launch', '打ち上げ') }),

  // p_pre1_ai_and_work（仕事ではなく作業が変わる）
  'Each generation has produced confident forecasts, and most of them have been wrong in interesting ways.': words({ forecasts: sense('forecast', '予測（複数）') }),
  'Public discussion often moves between two extremes, promising mass unemployment or effortless wealth.': words({ promising: sense('promise', '約束すること') }),
  'The whole service may then attract more demand rather than less.': words({ may: MAY }),
  'Cash machines reduced the routine work of bank clerks.': words({ reduced: sense('reduce', '減らした') }),
  'The adjustment was slow, and individual workers still lost income during it.': words({ lost: sense('lose', '失った') }),
  'That effect could narrow wage gaps, or it could reduce the reward for long training.': words({ narrow: sense('narrow', '縮める・狭める') }),
  'Education systems face a related difficulty.': words({ face: sense('face', '直面する') }),
  'Others discuss shorter working hours, wage insurance, or support for regions losing employers.': words({ support: sense('support', '支援') }),
  'Each proposal carries costs, and none removes the need for continuous adjustment.': words({ need: sense('need', '必要・必要性') }),

  // p_1_synthetic_media_trust（見ることが信じることでなくなるとき）
  'Synthetic media has weakened this assumption rather than destroyed it outright.': words({ weakened: sense('weaken', '弱めた') }),
  'A single convincing file can reach millions of people long before any expert examines it.': words({ file: sense('file', 'ファイル（データのまとまり）') }),
  'A subtler danger works in the opposite direction and may prove more damaging.': words({ may: MAY }),
  'Detection software is usually proposed as the first answer, and it is genuinely useful.': words({ answer: sense('answer', '答え・対策') }),
  'Their accuracy falls sharply when a file is compressed, cropped, or recorded again from a screen.': words({ file: sense('file', 'ファイル（データのまとまり）') }),
  'Detection therefore deserves continued investment, but it cannot carry the whole burden of public trust.': words({ trust: sense('trust', '信頼') }),
  'A second approach records where a file originated instead of asking what it looks like.': words({ file: sense('file', 'ファイル（データのまとまり）') }),
  'A file without such a record is then treated as unverified rather than false, so the approach fails safely.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
  }),
  'Provenance systems carry their own risks, and those risks deserve equal attention.': words({ own: sense('own', 'それ自身の・固有の') }),
  'Signing equipment is expensive, so the poorest witnesses are least able to prove what they saw.': words({ saw: sense('see', '見た') }),
  'Metadata that establishes authenticity may also reveal the location, the device, and the identity of a source.': words({ may: MAY }),
  'Courts have handled disputed evidence for centuries without assuming that documents prove themselves.': words({
    disputed: sense('dispute', '争われている（disputeの過去分詞）'),
  }),
  'Trust of this kind is harder to destroy than trust resting on the appearance of a single file.': words({
    trust: sense('trust', '信頼'),
    resting: sense('rest', '（〜に）頼る・基づく（rest on）'),
    file: sense('file', 'ファイル（データのまとまり）'),
  }),
  'Warning labels can help, yet unlabeled material may then seem verified by default.': words({ may: MAY }),
  'Communities with the fewest resources therefore face the highest risk of manufactured evidence.': words({ face: sense('face', '直面する・さらされる') }),
  'A single file is rarely decisive on its own, whether it happens to be genuine or not.': words({
    file: sense('file', 'ファイル（データのまとまり）'),
    own: sense('own', '（on its own で）それだけで・単独で'),
  }),
  'Belief never rested on the image alone, and the present task is to rebuild the arrangements that made evidence trustworthy.': words({
    rested: sense('rest', '（〜に）支えられていた・基づいていた（rest on）'),
  }),

  // p_pre2_pond_comeback（学校の裏の池）
  'The volunteers placed nets on Saturdays and weighed the catch carefully.': words({ catch: sense('catch', 'とれた魚・漁獲') }),
  'The students also cleared the weeds along the bank and planted local grasses.': words({ bank: sense('bank_2', '岸・土手') }),

  // p_pre2_morning_market（駅前の朝市）
  'At the start, five producers and a few customers came.': words({ start: sense('start', '始め・始まり') }),
  'This direct contact builds confidence, and it lowers complaints about the goods.': words({ contact: sense('contact', '接触・直接のやりとり') }),
  'A survey last year showed that a high percentage of visitors welcomed this contact.': words({ contact: sense('contact', '接触・やりとり') }),
  'Accuracy is more important than speed in this check.': words({ check: sense('check', '確認・点検') }),
  'The club studies the stalls and turns each visit into an assignment.': words({ visit: sense('visit', '訪問') }),

  // p_2_injury_free_practice（痛みを数えた部活）
  'Last spring, four members of our track club were injured within a single month.': words({ track: sense('track', '陸上競技（track club で陸上部）') }),
  'Most damage appeared after a sudden rise in weekly distance.': words({ rise: sense('rise', '増加・上昇') }),
  'High humidity raised the risk further, and the water breaks were too short.': words({ raised: sense('raise', '高めた・上げた') }),
  'Many students had hidden small pains from the teacher.': words({ hidden: sense('hide', '隠していた（hideの過去分詞）') }),
  'This policy lowered the pressure and raised the accuracy of the records.': words({ lowered: sense('lower', '下げた'), raised: sense('raise', '高めた・上げた') }),
  'Results in races improved, although nobody trained more hours.': words({ races: sense('race', 'レース・競走（複数）') }),
  'The benefit soon reached students outside the track club.': words({ track: sense('track', '陸上競技（track club で陸上部）') }),
  'A team can act early when it measures its own practice.': words({ own: sense('own', '自分たちの') }),

  // p_2_factory_museum（町が残した建物）
  'They collected old photographs, order books and letters from families.': words({ collected: sense('collect', '集めた') }),
  'Two hundred people came to a talk about local history.': words({ talk: sense('talk', '講演・話') }),
  'Repair of the roof and the metal walls demanded a large budget.': words({ repair: sense('repair', '修理') }),
  'Old paint and chemical waste raised the expense further.': words({ raised: sense('raise', '押し上げた・上げた') }),
  'The offer would have removed the debt of the town in one step.': words({ offer: sense('offer', '申し出') }),
  'The plan also promised a slow repair over ten years.': words({ repair: sense('repair', '修理') }),

  // p_pre2_school_radio（廊下に流れる声）
  'A new adviser asked the club to study its own audience.': words({ own: sense('own', '自分たちの') }),
  'The members wrote a short survey and collected two hundred answers.': words({ collected: sense('collect', '集めた'), answers: sense('answer', '答え（複数）・回答') }),
  'They express their own opinions briefly and leave the rest to the audience.': words({ own: sense('own', '自分の'), rest: sense('rest_2', '残り') }),

  // p_2_disaster_translators（読めなかった警報）
  'The message used old official words and a difficult grammar form.': words({ used: sense('use', '使っていた') }),
  'The office had followed its own manual, and the message still failed.': words({ own: sense('own', '自分たちの') }),
  'Twelve residents joined a training course after their own working hours.': words({ own: sense('own', '自分の') }),
  'They practice the phrases for medical help, food and lost family members.': words({ help: sense('help', '助け・支援') }),
  'Most of the foreign residents left their homes on time.': words({ left: sense('leave', '出た・離れた') }),
  'Some elderly Japanese neighbors also used the easy notices.': words({ used: sense('use', '使った') }),
  'An urgent message may reach a person who cannot read the local script.': words({ may: MAY }),
  'They argue that real safety grows from contact between people in ordinary times.': words({ contact: sense('contact', '接触・交流') }),

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
