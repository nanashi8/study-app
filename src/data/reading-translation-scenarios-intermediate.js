// 中級長文の講師監修・語順訳シナリオ。「／」の各意味単位を英語の出現順に並べる。

const b = (en, orderedJa, tip = '') => {
  const jaSegments = Object.freeze(orderedJa.split('／').map((segment) => segment.trim()))
  return Object.freeze({
    en,
    ja: jaSegments.join(' → '),
    jaSegments,
    speechJa: jaSegments.join('。次に、'),
    tip,
  })
}
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const INTERMEDIATE_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_3_school_garden: passage([
    [
      b('Last spring, the students at Maple Junior High started a vegetable garden', '昨年の春／生徒たちは／メープル中学校の／作り始めました／野菜畑を'),
      b('behind their school', '自分たちの学校の裏に'),
    ],
    [
      b('At first', '最初は'),
      b('many students thought the work would be simple', '多くの生徒は／考えました／その作業は／簡単だろうと'),
      b('but they soon learned', 'しかし／生徒たちは／すぐに学びました'),
      b('that plants need careful attention', '植物は／必要としているということを／注意深い世話を'),
    ],
    [
      b('They had to choose a sunny place, remove stones', '生徒たちは／しなければなりませんでした／選ぶことを／日当たりのよい場所を／そして取り除くことを／石を'),
      b('from the soil', '土の中から'),
      b('and water the young plants every day', 'そして／水をやらなければなりませんでした／若い苗に／毎日'),
    ],
    [
      b('Some students forgot their jobs', '何人かの生徒は／忘れました／自分の仕事を'),
      b('during the first week', '最初の1週間に'),
      b('so the tomatoes did not grow well', 'そのため／トマトは／育ちませんでした／うまく'),
    ],
    [
      b('Their science teacher asked each group', '理科の先生は／求めました／各グループに'),
      b('to make a schedule and write short notes', '作るように／予定表を／そして書くように／短いメモを'),
      b('about the weather', '天気について'),
    ],
    [
      b('After that', 'そのあと'),
      b('the garden changed quickly', 'その畑は／変わりました／急速に'),
    ],
    [
      b('The students began', '生徒たちは／始めました'),
      b('to understand', '理解することを'),
      b('how temperature, rain', 'どのように／気温や雨が'),
      b('and insects affected the vegetables', 'そして昆虫が／影響を与えるのかを／野菜に'),
    ],
    [
      b('In June', '6月に'),
      b('the students noticed', '生徒たちは／気づきました'),
      b('that insects were eating the leaves of several plants', '虫が／食べていることに／葉を／いくつかの植物の'),
    ],
    [
      b('Some wanted', '何人かの生徒は／望みました'),
      b('to use a strong chemical spray', '使うことを／強い薬品のスプレーを'),
      b('but the teacher asked them to research safer choices first', 'しかし／先生は／求めました／生徒たちに／調べるように／より安全な選択肢を／まず'),
    ],
    [
      b('They learned', '生徒たちは／学びました'),
      b('that certain flowers attract insects', 'ある種の花が／引き寄せるということを／昆虫を'),
      b('that eat garden pests', 'そしてその昆虫は／食べます／庭の害虫を'),
      b('without harming the vegetables', '傷つけることなく／野菜を'),
    ],
    [
      b('The class planted those flowers', 'クラスは／植えました／その花を'),
      b('around the garden', '畑の周りに'),
      b('and the number of damaged leaves soon decreased', 'そして／傷んだ葉の数は／すぐに減りました'),
    ],
    [
      b('In July', '7月に'),
      b('they picked enough cucumbers and tomatoes', '生徒たちは／収穫しました／十分な量のキュウリとトマトを'),
      b('to share with people at a nearby community center', '分け合えるほど／人々と／近くのコミュニティセンターにいる'),
    ],
    [
      b('Instead of simply giving the food away', '〜する代わりに／ただ渡してしまう／食べ物を'),
      b('the students visited the center and explained', '生徒たちは／訪れました／そのセンターを／そして説明しました'),
      b('how they had grown it', 'どのように／自分たちが／育てたのかを／それを'),
    ],
    [
      b('The older residents shared recipes and suggested vegetables', '年配の住民は／教えてくれました／レシピを／そして提案しました／野菜を'),
      b('that the class could plant', 'そしてその野菜を／クラスは／植えることができます'),
      b('in autumn', '秋に'),
    ],
    [
      b('The students used this advice to plan a second garden', '生徒たちは／使いました／この助言を／計画するために／二つ目の畑を'),
      b('which made the project continue', 'そしてそのことが／続かせました／この活動を'),
      b('beyond one school term', '一つの学期を越えて'),
    ],
    [
      b('The experience taught them', 'その経験は／教えました／生徒たちに'),
      b('that protecting the environment can begin', '守ることは／環境を／始められるということを'),
      b('with small daily actions', '日々の小さな行動から'),
    ],
    [
      b('It also gave them a chance', 'その経験は／さらに与えました／生徒たちに／機会を'),
      b('to talk with older people', '話すための／年配の人々と'),
      b('who knew many useful farming tips', 'そしてその人々は／知っていました／役立つ農業の知恵をたくさん'),
    ],
    [
      b('By the end of the project', 'その活動が終わるころまでには'),
      b('even the students', '〜でさえ／その生徒たちは'),
      b('who had disliked gardening', 'そしてその生徒たちは／以前は嫌っていた／園芸を'),
      b('were proud of the result', '誇りに思っていました／その結果を'),
    ],
  ]),

  p_3_lunch_food_waste: passage([
    [
      b('Students at one junior high school noticed', '生徒たちは／ある中学校の／気づきました'),
      b('that a lot of food was left in the cafeteria', 'たくさんの食べ物が／残されていることに／食堂に'),
      b('after lunch', '昼食のあとに'),
    ],
    [
      b('The cooking staff had to throw the leftovers away', '調理スタッフは／捨てなければなりませんでした／残り物を'),
      b('even though most of the food was still fresh', 'にもかかわらず／食べ物のほとんどは／まだ新鮮でした'),
    ],
    [
      b('A science class decided', 'ある理科のクラスは／決めました'),
      b('to study the problem instead of simply asking everyone to eat more', '調べることを／その問題を／ただ頼むことの代わりに／全員に／もっと食べるように'),
    ],
    [
      b('First, the students gave the other classes a short survey', 'まず／生徒たちは／渡しました／ほかのクラスに／短いアンケートを'),
    ],
    [
      b('Many younger students said the usual portions were too large', '多くの下級生は／言いました／いつもの量は／多すぎると'),
      b('while some older students wanted more food', '一方で／何人かの上級生は／欲しがりました／もっと食べ物を'),
      b('after sports practice', '運動部の練習のあとに'),
    ],
    [
      b('The class then measured the amount of rice, vegetables', 'そこで／クラスは／測りました／量を／ご飯と野菜の'),
      b('and bread left each day', 'そしてパンも／毎日残された分を'),
      b('for two weeks', '2週間にわたって'),
    ],
    [
      b('They discovered', '生徒たちは／発見しました'),
      b('that waste was greatest', '食品廃棄の量が／最も多かったことを'),
      b('on days', 'その日には'),
      b('when every student received the same large portion', 'そのとき／すべての生徒が／受け取っていました／同じ大盛りを'),
    ],
    [
      b('The students suggested offering two plate sizes', '生徒たちは／提案しました／用意することを／二つの皿サイズを'),
      b('at the start of lunch', '昼食の始めに'),
    ],
    [
      b('Anyone', 'だれでも'),
      b('who chose the smaller plate', 'そしてその人が／選んだなら／小さい皿を'),
      b('could return', '戻ることができました'),
      b('for more food later', 'さらに食べ物を取りに／あとで'),
    ],
    [
      b('The cafeteria also put pictures of both portions', '食堂は／さらに置きました／写真を／二つの量の'),
      b('near the entrance so students could choose', '入口の近くに／その結果、生徒は／選べました'),
      b('before reaching the counter', '〜する前に／配膳台へ着く'),
    ],
    [
      b('After one month', '1か月後には'),
      b('food waste was almost half of the earlier amount', '食品廃棄は／〜になっていました／ほぼ半分に／以前の量の'),
    ],
    [
      b('More students finished their meals', 'より多くの生徒が／食べ終えました／自分の食事を'),
      b('but nobody had to remain hungry', 'しかし／だれも／いる必要はありませんでした／空腹のままで'),
    ],
    [
      b('Daily records helped the cooking staff', '毎日の記録は／助けました／調理スタッフが'),
      b('to prepare a better amount', '用意することを／より適切な量を'),
      b('for each menu', 'それぞれの献立に合わせて'),
    ],
    [
      b('The project taught them', 'その活動は／教えました／生徒たちに'),
      b('that reducing food waste does not require one perfect rule', '減らすことは／食品ロスを／必要としないということを／一つの完璧な規則を'),
      b('for everyone', '対象が／全員となる'),
    ],
    [
      b('It can begin', 'それは／始められます'),
      b('by giving people clear information and a useful choice', '与えることによって／人々に／明確な情報と役立つ選択肢を'),
    ],
    [
      b('The students now share their results', '生徒たちは／今、共有しています／自分たちの結果を'),
      b('with nearby schools and encourage them', '近くの学校と／そして勧めています／その学校に'),
      b('to measure their own waste', '測るように／自分たちの食品廃棄を'),
    ],
    [
      b('They explain', '生徒たちは／説明しています'),
      b('that every meal uses water, energy', 'どの食事も／使うということを／水とエネルギーを'),
      b('and work', 'そして／人の労力も'),
      b('before it reaches a plate', '〜する前に／その食事が／届く／皿へ'),
      b('so even a small improvement can protect valuable resources', 'だから／小さな改善でさえ／守ることができます／大切な資源を'),
    ],
  ]),

  p_pre2_museum_volunteers: passage([
    [
      b('Many museums are trying', '多くの博物館は／取り組んでいます'),
      b('to become places', 'なることに／場所に'),
      b('where teenagers can do more than simply look at objects', 'そこでは／10代の若者が／できます／ただ見ることより多くのことが／展示物を'),
      b('behind glass', 'ガラスの向こうにある'),
    ],
    [
      b('One city museum recently began a volunteer program', 'ある市立博物館は／最近始めました／ボランティアプログラムを'),
      b('for high school students', '高校生のための'),
      b('who are interested', 'そしてその高校生たちは／関心があります'),
      b('in local culture', '地域の文化に'),
    ],
    [
      b('Before the museum opens', '〜する前に／博物館が／開館する'),
      b('on Saturdays', '毎週土曜日に'),
      b('the students meet a staff member and learn', '生徒たちは／会います／職員に／そして学びます'),
      b('about the day\'s exhibition', 'その日の展示について'),
    ],
    [
      b('They check maps, prepare simple worksheets', '生徒たちは／確認します／地図を／準備します／簡単なワークシートを'),
      b('and practice explaining the displays', 'そして／練習します／説明することを／展示を'),
      b('in easy words', 'やさしい言葉で'),
    ],
    [
      b('During the afternoon', '午後の間は'),
      b('they help families', '生徒たちは／手助けします／家族を'),
      b('who have small children or visitors', 'そしてその家族には／小さな子どもがいます／また生徒たちは来館者も手助けします'),
      b('who are not used to museums', 'そしてその来館者は／慣れていません／博物館に'),
    ],
    [
      b('The work is not always easy', 'その仕事は／いつも簡単とは限りません'),
      b('because volunteers must communicate politely', 'なぜなら／ボランティアは／応対しなければならないからです／丁寧に'),
      b('even when the building is crowded', '〜するときでさえ／館内が／混雑している'),
    ],
    [
      b('They may not know the answer to every question', '生徒たちは／知らないかもしれません／答えを／すべての質問への'),
      b('so they are taught', 'そのため／生徒たちは／教えられます'),
      b('to admit uncertainty and ask a staff member', '認めるように／分からないことを／そして尋ねるように／職員に'),
      b('for help', '助けを求めて'),
    ],
    [
      b('This approach is more useful than giving visitors information', 'この姿勢は／より役立ちます／与えることより／来館者に／情報を'),
      b('that may be incorrect', 'そしてその情報は／誤っているかもしれません'),
    ],
    [
      b('However', 'しかし'),
      b('many students say the program gives them a useful sense of responsibility', '多くの生徒は／言います／そのプログラムが／与えてくれると／自分たちに／有益な責任感を'),
    ],
    [
      b('They also discover', '生徒たちは／さらに気づきます'),
      b('that a museum is connected to schools, shops, parks, and many other parts of the community', '博物館が／つながっていることに／学校・商店・公園・地域のほかの多くの場所と'),
    ],
    [
      b('One student said she had become more confident after answering questions', 'ある生徒は／言いました／自分は／より自信を持つようになったと／答えたあとで／質問に'),
      b('from foreign visitors', 'その質問は／外国からの来館者からの'),
    ],
    [
      b('Another student decided', '別の生徒は／決めました'),
      b('to study history at college', '学ぶことを／歴史を／大学で'),
      b('because he wanted', 'なぜなら／その生徒は／望んだからです'),
      b('to protect old buildings in his town', '守ることを／古い建物を／自分の町の'),
    ],
    [
      b('For the museum', '博物館にとって'),
      b('the benefit is clear as well', 'その利点は／やはり明らかです'),
    ],
    [
      b('When young people take part', '〜すると／若者が／参加する'),
      b('exhibitions feel more open', '展示は／より開かれたものに感じられます'),
      b('and visitors are more willing', 'そして／来館者は／もっと進んで行おうとします'),
      b('to ask questions', '尋ねることを／質問を'),
    ],
    [
      b('The museum has also changed the way it prepares labels', '博物館は／さらに変えました／方法を／博物館が／準備する／説明文を'),
      b('for new displays', '新しい展示のための'),
    ],
    [
      b('Staff members used to write long explanations', '職員は／以前は書いていました／長い説明を'),
      b('for adults', '大人向けに'),
      b('but they now ask student volunteers', 'しかし／職員は今では／頼みます／学生ボランティアに'),
      b('to read the labels first', '読むように／その説明文を／最初に'),
    ],
    [
      b('If the students cannot understand an important point', 'もし／生徒たちが／理解できなければ／重要な点を'),
      b('the staff try', '職員は／努めます'),
      b('to make the language clearer without removing the main idea', 'より明確にすることに／表現を／中心となる考えを削ることなく'),
    ],
    [
      b('The students also record the questions visitors ask most often', '生徒たちは／さらに記録します／質問を／来館者が最もよく尋ねる'),
      b('and the museum uses this feedback when planning future exhibitions', 'そして／博物館は／利用します／この意見を／計画するときに／今後の展示を'),
    ],
    [
      b('The program shows', 'そのプログラムは／示しています'),
      b('that learning about the past can help people build stronger relationships', '過去について学ぶことが／助けになり得るということを／人々が／築く／より強い関係を'),
      b('in the present', '現在において'),
    ],
  ]),

  p_pre2_later_school_start: passage([
    [
      b('Many teenagers arrive', '多くの10代の生徒は／到着します'),
      b('at school feeling tired', '学校に／疲れを感じながら'),
      b('even when they try', 'たとえ〜するときでも／生徒たちが／努力する'),
      b('to go to bed at a reasonable time', '寝ることを／適切な時刻に'),
    ],
    [
      b('Sleep researchers explain', '睡眠の研究者は／説明します'),
      b('that the body clock often changes', '体内時計は／変化することが多いと'),
      b('during the teenage years', '10代の時期に'),
    ],
    [
      b('The brain begins', '脳は／始めます'),
      b('to feel sleepy later at night', '眠気を感じることを／より遅く／夜に'),
      b('but students must still wake up early', 'しかし／生徒は／それでも起きなければなりません／早く'),
      b('for school', '学校へ行くために'),
    ],
    [
      b('For this reason', 'この理由から'),
      b('some schools have moved their starting time', 'いくつかの学校は／移しました／始業時刻を'),
      b('from eight o’clock to a later hour', '8時から／もっと遅い時刻へ'),
    ],
    [
      b('Several studies report', 'いくつかの研究は／報告しています'),
      b('that students at these schools sleep longer', '生徒は／こうした学校の／眠ると／より長く'),
      b('on ordinary weekdays', '通常の平日に'),
    ],
    [
      b('Teachers have also seen greater attention and fewer late arrivals', '教師たちは／さらに確認しています／より高い集中と、より少ない遅刻を'),
      b('in morning classes', '朝の授業で'),
    ],
    [
      b('In one experiment', 'ある実験では'),
      b('attendance and mood improved', '出席状況と気分が／改善しました'),
      b('although test scores did not rise immediately', '〜ではあるものの／テストの点数は／上がりませんでした／すぐには'),
    ],
    [
      b('A later start', 'より遅い始業時刻は'),
      b('however, can cause practical problems', 'しかし／引き起こすことがあります／現実的な問題を'),
      b('for families and communities', '家庭や地域にとって'),
    ],
    [
      b('School buses may need new schedules', 'スクールバスは／必要とするかもしれません／新しい運行予定を'),
      b('which can increase transportation costs', 'そしてそのことが／増やす可能性があります／交通費を'),
    ],
    [
      b('Sports practice and music activities may finish after dark, especially', '運動部の練習や音楽活動は／終わるかもしれません／暗くなったあとに／特に'),
      b('in winter', '冬には'),
    ],
    [
      b('Some parents also depend on older children to care for younger family members', '一部の保護者は／さらに頼っています／年上の子どもに／世話をしてもらうことを／年下の家族の'),
      b('after school', '放課後に'),
    ],
    [
      b('At one school', 'ある学校では'),
      b('students helped design the change', '生徒たちは／手伝いました／設計することを／その変更を'),
      b('and their suggestions produced a bus timetable', 'そして／生徒たちの提案が／生み出しました／バスの時刻表を'),
      b('that protected both sleep and afternoon activities', 'そしてその時刻表は／守りました／睡眠と午後の活動の両方を'),
    ],
    [
      b('This cooperation made families more willing', 'この協力は／させました／家庭を／もっと前向きに'),
      b('to try the new schedule for a full year', '試すことに／新しい予定を／丸1年間'),
    ],
    [
      b('Because each community is different', 'なぜなら／地域はそれぞれ／異なるからです'),
      b('changing the clock alone', '変えることは／時刻だけを'),
      b('is not a complete solution', '〜ではありません／完全な解決策'),
    ],
    [
      b('Schools need', '学校は／必要としています'),
      b('to examine bus routes, club times', '調べることを／バス路線・部活動の時間を'),
      b('and family needs', 'そして／家庭の必要も'),
      b('before choosing a new schedule', '〜する前に／選ぶ／新しい予定を'),
    ],
    [
      b('They should also teach students', '学校は／さらに教えるべきです／生徒たちに'),
      b('that a later start is not an invitation', 'より遅い始業は／合図ではないと／〜してよいという'),
      b('to stay online longer at night', 'オンラインで過ごすことを／もっと長く／夜に'),
    ],
    [
      b('The strongest argument for change does not demand one starting time', '最も強い主張は／変更を支持する／求めてはいません／一つの始業時刻を'),
      b('for every school', 'すべての学校に対して'),
    ],
    [
      b('It is', 'その主張は／〜です（内容は次へ）'),
      b('that school policies should take evidence', '学校の方針は／受け止めるべきだということ／証拠を'),
      b('about teenage sleep seriously', '10代の睡眠について／真剣に'),
    ],
    [
      b(
        'A community can then balance health benefits',
        '地域は／その上で釣り合わせられます／健康上の利点を',
        'balance A with B は「AとBの釣り合いを取る」。Aに当たる health benefits を先に押さえ、Bは次へ待ちます。',
      ),
      b(
        'with local challenges and test',
        '地域の課題と／そして検証できます／その計画を',
        'with local challenges が釣り合いを取る相手です。and test から二つ目の動作「確かめる」へ進みます。',
      ),
      b('whether its plan is effective', '〜かどうかを／その計画が／効果的である'),
    ],
    [
      b('Careful changes are more useful than keeping an old schedule simply', '慎重な変更は／より役立ちます／古い予定をただ保ち続けることより'),
      b(
        'because it is familiar, especially when schools review them regularly',
        'それが／慣れているというだけで／特に／学校が／それらの変更を定期的に見直すときには',
        'because はここでは「変更が役立つ理由」ではなく、古い予定を保つ理由です。simply because で「ただ〜だからというだけで」と取ります。',
      ),
    ],
  ]),

  p_pre2plus_repair_cafes: passage([
    [
      b('People replace phones, lamps, and other household devices', '人々は／買い替えます／電話・ランプ・ほかの家庭用機器を'),
      b('for many reasons', 'さまざまな理由で'),
    ],
    [
      b('Sometimes a product is badly damaged', 'ときには／製品が／ひどく壊れています'),
      b('but in other cases only a small part has stopped working', 'しかし／別の場合には／小さな部品だけが／動かなくなっています'),
    ],
    [
      b('Because buying a new item is often easier than finding someone', 'なぜなら／買うことは／新しい品物を／しばしばより簡単だからです／見つけることより／人を'),
      b('to fix the old one', 'その人は／直してくれる／古い品物を'),
      b('usable products become waste', 'まだ使える製品が／ごみになります'),
    ],
    [
      b('In response', 'それに応じて'),
      b('communities in several countries have started events called repair cafes', '地域社会は／いくつかの国の／始めました／催しを／リペアカフェと呼ばれる'),
    ],
    [
      b('At these events', 'こうした催しでは'),
      b('local volunteers help visitors examine broken things and', '地域のボランティアは／手助けします／来場者が／調べることを／壊れた物を／そして'),
      b('when possible, repair them', '可能なときには／修理します／それらを'),
    ],
    [
      b('A repair cafe is different', 'リペアカフェは／異なります'),
      b('from a normal repair shop', '普通の修理店とは'),
    ],
    [
      b('Visitors are expected', '来場者は／求められています'),
      b('to sit with volunteers and take part in the work instead of simply leaving an item', '座ることを／ボランティアと／そして参加することを／作業に／ただ預けることの代わりに／品物を'),
      b('at a counter', '受付に'),
    ],
    [
      b('A volunteer may show someone', 'ボランティアは／示すことがあります／だれかに'),
      b('how to open a lamp safely, replace a worn wire', 'どのように開けるかを／ランプを／安全に／交換するかを／摩耗した電線を'),
      b('or search', 'あるいは／探すかを'),
      b('for instructions online', '説明書を／オンラインで'),
    ],
    [
      b('This process allows participants', 'この過程は／できるようにします／参加者が'),
      b('to gain practical skills and confidence', '身につけることを／実用的な技能と自信を'),
    ],
    [
      b('It also creates conversations', 'それは／さらに生み出します／会話を'),
      b('between people of different ages', '異なる年代の人々の間に'),
    ],
    [
      b('Older residents may know', '年配の住民は／知っているかもしれません'),
      b('how older machines were built', 'どのように／古い機械が／作られていたのかを'),
      b('while younger participants may be more comfortable finding digital information', '一方／若い参加者は／より慣れているかもしれません／探すことに／デジタル情報を'),
    ],
    [
      b('Supporters say repair cafes offer both environmental and social benefits', '支持者は／言います／リペアカフェは／もたらすと／環境面と社会面の両方の利点を'),
    ],
    [
      b('Extending the life of a product', '延ばすことは／寿命を／製品の'),
      b('reduces waste and lowers demand', '減らします／ごみを／そして下げます／需要を'),
      b('for the energy and resources required', 'エネルギーと資源への／そしてそれらは／必要とされます'),
      b('to make new goods', '作るために／新しい製品を'),
    ],
    [
      b('Families may also save money', '家庭は／さらに節約できるかもしれません／お金を'),
      b('which is especially valuable', 'そしてそのことは／特に価値があります'),
      b('when prices are rising', '〜するときには／物価が／上がっている'),
    ],
    [
      b('In addition', 'さらに'),
      b('the events encourage people', 'その催しは／促します／人々に'),
      b('to think differently about ownership', '考えるように／違う見方で／所有について'),
    ],
    [
      b('A device no longer seems like a closed box', '機器は／もはや見えません／閉ざされた箱のようには'),
      b('that only its manufacturer understands', 'そしてその箱を／製造業者だけが／理解しています'),
    ],
    [
      b('Even when an object cannot be repaired', '〜するときでさえ／物が／修理できない'),
      b('a visitor may learn', '来場者は／学べるかもしれません'),
      b('why it failed and how to choose a longer-lasting replacement', 'なぜ／それが／壊れたのか／そしてどのように／選ぶかを／より長持ちする代替品を'),
    ],
    [
      b('However', 'しかし'),
      b('repair cafes are not a complete solution', 'リペアカフェは／完全な解決策ではありません'),
    ],
    [
      b('Volunteers must refuse jobs', 'ボランティアは／断らなければなりません／作業を'),
      b('that could be dangerous', 'そしてその作業は／危険になるおそれがあります'),
      b('and replacement parts are sometimes unavailable or too expensive', 'そして／交換部品は／ときに入手できないか、高すぎます'),
    ],
    [
      b('Some modern products are also designed so', '現代の製品の一部は／さらに設計されています／そのように'),
      b('that they are difficult', 'つまりその製品は／難しいのです（内容は次へ）'),
      b('to open without special tools', '開けることが／特殊な道具なしで'),
    ],
    [
      b('Critics therefore argue', 'そのため／批判する人々は／主張します'),
      b('that manufacturers should make parts and instructions easier', '製造業者は／するべきだと／部品と説明書を／より容易に（内容は次へ）'),
      b('to obtain', '入手することを'),
    ],
    [
      b('Repair cafes cannot change product design', 'リペアカフェは／変えられません／製品設計を'),
      b('by themselves', 'それだけの力では'),
      b('but they can show consumers', 'しかし／リペアカフェは／示すことができます／消費者に'),
      b('what prevents repairs', '何が／妨げているのかを／修理を'),
    ],
    [
      b('Their greatest value may be', 'その最大の価値は／〜かもしれません（内容は次へ）'),
      b('that they turn a private problem', '活動が／変えること／個人的な問題を'),
      b('a broken object', 'つまり、壊れた物という問題を'),
      b('into a public lesson about waste, skills, and responsibility', '社会全体の学びへ／ごみ・技能・責任についての'),
    ],
  ]),

  p_pre2plus_city_bird_count: passage([
    [
      b('Professional scientists cannot be everywhere', '専門の科学者は／いることができません／あらゆる場所に'),
      b('at once, especially', '同時には、特に'),
      b('when they study animals', '〜するときには／科学者が／研究する／動物を'),
      b('that move', 'そしてその動物は／移動します'),
      b('across wide areas', '広い地域を横切って'),
    ],
    [
      b('Many research groups need more information', '多くの研究団体は／必要としています／さらに多くの情報を'),
      b('so they invite ordinary people', 'そのため／研究団体は／招きます／一般の人々を'),
      b('to join projects known as citizen science', '参加するように／活動へ／市民科学として知られる'),
    ],
    [
      b('One common project asks participants', 'よくある活動の一つは／求めます／参加者に'),
      b('to observe birds in gardens, parks, and school grounds', '観察するように／鳥を／庭・公園・校庭で'),
    ],
    [
      b('Volunteers record each species they see, the number of birds, the location, and the time', 'ボランティアは／記録します／それぞれの種を／自分が見た／鳥の数・場所・時刻を'),
    ],
    [
      b('When thousands of people send reports', '〜すると／何千人もの人々が／送る／報告を'),
      b('researchers can discover patterns', '研究者は／発見できます／傾向を'),
      b('that a small team might miss', 'そしてその傾向を／小さなチームなら／見落とすかもしれません'),
    ],
    [
      b('For example', '例えば'),
      b('the records may show', 'その記録は／示すかもしれません'),
      b('that a species is arriving earlier in spring or disappearing', 'ある種が／飛来していることを／より早く／春に／あるいは姿を消していることを'),
      b('from certain neighborhoods', '特定の地域から'),
    ],
    [
      b('Such changes can suggest', 'そのような変化は／示すことがあります'),
      b('that weather, food', '天候や食べ物が'),
      b('or habitat conditions are affecting bird populations', 'あるいは生息環境が／影響していることを／鳥の個体数に'),
    ],
    [
      b('However', 'しかし'),
      b('large numbers of reports cannot automatically ensure reliable data', '大量の報告は／自動的に保証できるわけではありません／信頼できるデータを'),
      b('in practice', '実際には'),
    ],
    [
      b('An experienced observer may identify a bird', '経験豊かな観察者は／見分けられるかもしれません／鳥を'),
      b('by its song', 'その鳴き声によって'),
      b('while a beginner may confuse two similar species', '一方／初心者は／混同するかもしれません／似た二つの種を'),
    ],
    [
      b('People also visit places', '人々は／さらに訪れます／場所を'),
      b(
        'that are easy',
        'そしてその場所は／容易です（内容は次へ）',
        'that 以下は places を説明しています。easy の具体的な内容は、次の to reach と結び付けて「行きやすい」です。',
      ),
      b(
        'to reach more often than distant or unsafe locations',
        '到達することが（容易です）／そして人々はより頻繁に訪れます／遠い場所や危険な場所よりも',
        'to reach は easy の内容です。more often than 以下は visit に戻して、「遠い場所などより頻繁に訪れる」と読みます。',
      ),
    ],
    [
      b('This creates a bias', 'このことが／生み出します／偏りを'),
      b('because some habitats receive many reports and others receive few', 'なぜなら／一部の生息地は／受け取ります／多くの報告を／一方、別の生息地は／わずかしか受け取らないからです'),
    ],
    [
      b('Good projects reduce these problems', 'よい活動は／減らします／こうした問題を'),
      b('through clear training and careful design', '分かりやすい訓練と慎重な設計によって'),
    ],
    [
      b('They provide pictures and recordings', 'その活動は／提供します／写真と録音を'),
      b('that help volunteers identify species correctly', 'そしてそれらが／助けます／ボランティアが／特定することを／鳥の種を／正しく'),
    ],
    [
      b('They may ask participants', '活動の運営者は／求めることがあります／参加者に'),
      b('to watch for the same length of time and to report visits', '観察するように／同じ長さの時間／そして報告するように／観察に出かけたことを'),
      b('when no birds appeared', 'そのときに／鳥が一羽も／現れなかった場合も'),
    ],
    [
      b('Experts often check unusual reports', '専門家は／よく確認します／珍しい報告を'),
      b('before the records enter the main database', '〜する前に／その記録が／入る／主要なデータベースへ'),
    ],
    [
      b('Some projects also send several volunteers the same observation task and compare their answers', '一部の活動は／さらに送ります／複数のボランティアに／同じ観察課題を／そして比較します／その回答を'),
      b('to estimate', '推定するために'),
      b('how often mistakes occur', 'どのくらい頻繁に／間違いが／起こるのかを'),
    ],
    [
      b('Researchers can then compare similar observations and estimate', '研究者は／そうすれば比較できます／似た観察結果を／そして推定できます'),
      b('where the data may be incomplete', 'どこで／データが／不完全かもしれないのかを'),
    ],
    [
      b('Citizen science is valuable not', '市民科学は／価値があります／次の理由ではなく'),
      b('because volunteers replace professionals', 'ボランティアが／専門家に取って代わるからではなく'),
      b('but', 'そうではなく'),
      b('because the two groups contribute different strengths', '二つの集団が／提供するからです／異なる強みを'),
    ],
    [
      b('The public contributes time, local knowledge, and a large number of observations', '一般の人々は／提供します／時間・地域の知識・多数の観察結果を'),
    ],
    [
      b('Scientists contribute research methods', '科学者は／提供します／研究方法を'),
      b('that turn those observations', 'そしてその方法が／変えます／そうした観察結果を'),
      b('into careful conclusions', '慎重に導かれた結論へ'),
    ],
    [
      b('Together, they can follow changes', '両者は／協力すれば追うことができます／変化を'),
      b('in biodiversity and identify places', '生物多様性の／そして特定できます／場所を'),
      b('that may need conservation', 'そしてその場所は／必要とするかもしれません／保全を'),
    ],
    [
      b('The partnership also shows', 'この協力関係は／さらに示しています'),
      b('that useful science depends', '役立つ科学は／かかっていると'),
      b('on recording uncertainty as honestly as discovery', '記録することに／不確実性を／発見を記録するのと同じくらい正直に'),
    ],
  ]),
})
