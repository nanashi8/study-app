// 中級長文の講師監修・語順訳シナリオ。

const b = (en, ja, tip = '') => Object.freeze({ en, ja, tip })
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const INTERMEDIATE_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_3_school_garden: passage([
    [
      b('Last spring, the students at Maple Junior High started a vegetable garden', '昨年の春、メープル中学校の生徒たちは野菜畑を作り始めました'),
      b('behind their school', '自分たちの学校の裏に'),
    ],
    [
      b('At first', '最初は'),
      b('many students thought the work would be simple', '多くの生徒は考えました、その作業は簡単だろうと'),
      b('but they soon learned', 'しかし、生徒たちはすぐに学びました'),
      b('that plants need careful attention', '植物には注意深い世話が必要だということを'),
    ],
    [
      b('They had to choose a sunny place, remove stones', '生徒たちは、日当たりのよい場所を選び、石を取り除かなければなりませんでした'),
      b('from the soil', '土の中から'),
      b('and water the young plants every day', 'そして、若い苗に毎日水をやらなければなりませんでした'),
    ],
    [
      b('Some students forgot their jobs', '何人かの生徒は自分の仕事を忘れました'),
      b('during the first week', '最初の1週間に'),
      b('so the tomatoes did not grow well', 'そのため、トマトはうまく育ちませんでした'),
    ],
    [
      b('Their science teacher asked each group', '理科の先生は各グループに求めました'),
      b('to make a schedule and write short notes', '予定表を作り、短いメモを書くように'),
      b('about the weather', '天気について'),
    ],
    [
      b('After that', 'そのあと'),
      b('the garden changed quickly', 'その畑は急速に変わりました'),
    ],
    [
      b('The students began', '生徒たちは始めました'),
      b('to understand', '理解することを'),
      b('how temperature, rain', '気温や雨がどのように'),
      b('and insects affected the vegetables', 'そして昆虫が、野菜に影響を与えるのかを'),
    ],
    [
      b('In June', '6月に'),
      b('the students noticed', '生徒たちは気づきました'),
      b('that insects were eating the leaves of several plants', '虫がいくつかの植物の葉を食べていることに'),
    ],
    [
      b('Some wanted', '何人かの生徒は望みました'),
      b('to use a strong chemical spray', '強い薬品のスプレーを使うことを'),
      b('but the teacher asked them to research safer choices first', 'しかし先生は生徒たちに、まずもっと安全な選択肢を調べるよう求めました'),
    ],
    [
      b('They learned', '生徒たちは学びました'),
      b('that certain flowers attract insects', 'ある種の花が虫を引き寄せるということを'),
      b('that eat garden pests', 'その虫は害虫を食べます'),
      b('without harming the vegetables', '野菜を傷つけることなく'),
    ],
    [
      b('The class planted those flowers', 'クラスはその花を植えました'),
      b('around the garden', '畑の周りに'),
      b('and the number of damaged leaves soon decreased', 'そして、傷んだ葉の数はすぐに減りました'),
    ],
    [
      b('In July', '7月に'),
      b('they picked enough cucumbers and tomatoes', '生徒たちは十分な量のキュウリとトマトを収穫しました'),
      b('to share with people at a nearby community center', '近くのコミュニティセンターの人々と分け合えるほどの'),
    ],
    [
      b('Instead of simply giving the food away', 'ただ食べ物を渡してしまう代わりに'),
      b('the students visited the center and explained', '生徒たちはそのセンターを訪れ、説明しました'),
      b('how they had grown it', '自分たちがそれをどのように育てたのかを'),
    ],
    [
      b('The older residents shared recipes and suggested vegetables', '年配の住民はレシピを教え、野菜を提案しました'),
      b('that the class could plant', 'その野菜をクラスは植えることができます'),
      b('in autumn', '秋に'),
    ],
    [
      b('The students used this advice to plan a second garden', '生徒たちはこの助言を使って、二つ目の畑を計画しました'),
      b('which made the project continue', 'そのことが、この活動を続かせました'),
      b('beyond one school term', '一つの学期を越えて'),
    ],
    [
      b('The experience taught them', 'その経験は生徒たちに教えました'),
      b('that protecting the environment can begin', '環境を守ることは始められるということを'),
      b('with small daily actions', '日々の小さな行動から'),
    ],
    [
      b('It also gave them a chance', 'その経験はさらに、生徒たちに機会を与えました'),
      b('to talk with older people', '年配の人々と話すための'),
      b('who knew many useful farming tips', 'その人々は役立つ農業の知恵をたくさん知っていました'),
    ],
    [
      b('By the end of the project', 'その活動が終わるころまでには'),
      b('even the students', 'その生徒たちでさえ'),
      b('who had disliked gardening', '以前は園芸が嫌いだった'),
      b('were proud of the result', 'その結果を誇りに思っていました'),
    ],
  ]),

  p_3_lunch_food_waste: passage([
    [
      b('Students at one junior high school noticed', 'ある中学校の生徒たちは気づきました'),
      b('that a lot of food was left in the cafeteria', 'たくさんの食べ物が食堂に残されていることに'),
      b('after lunch', '昼食のあとに'),
    ],
    [
      b('The cooking staff had to throw the leftovers away', '調理スタッフは残り物を捨てなければなりませんでした'),
      b('even though most of the food was still fresh', '食べ物のほとんどはまだ新鮮だったのに'),
    ],
    [
      b('A science class decided', 'ある理科のクラスは決めました'),
      b('to study the problem instead of simply asking everyone to eat more', 'ただ全員にもっと食べるよう頼む代わりに、その問題を調べることを'),
    ],
    [
      b('First, the students gave the other classes a short survey', 'まず、生徒たちはほかのクラスに短いアンケートを渡しました'),
    ],
    [
      b('Many younger students said the usual portions were too large', '多くの下級生は、いつもの量は多すぎると言いました'),
      b('while some older students wanted more food', '一方で、何人かの上級生はもっと食べ物を欲しがりました'),
      b('after sports practice', '運動部の練習のあとに'),
    ],
    [
      b('The class then measured the amount of rice, vegetables', 'そこでクラスは、ご飯と野菜の量を測りました'),
      b('and bread left each day', 'そして、毎日残されたパンの量も'),
      b('for two weeks', '2週間にわたって'),
    ],
    [
      b('They discovered', '生徒たちは発見しました'),
      b('that waste was greatest', 'ごみの量が最も多かったことを'),
      b('on days', 'その日には'),
      b('when every student received the same large portion', 'すべての生徒が同じ大盛りを受け取った'),
    ],
    [
      b('The students suggested offering two plate sizes', '生徒たちは2種類の皿の大きさを用意することを提案しました'),
      b('at the start of lunch', '昼食の始めに'),
    ],
    [
      b('Anyone', 'だれでも'),
      b('who chose the smaller plate', '小さい皿を選んだ人は'),
      b('could return', '戻ることができました'),
      b('for more food later', 'あとでもっと食べ物を取りに'),
    ],
    [
      b('The cafeteria also put pictures of both portions', '食堂は両方の量の写真も置きました'),
      b('near the entrance so students could choose', '入口の近くに、生徒が選べるように'),
      b('before reaching the counter', '配膳台に着く前に'),
    ],
    [
      b('After one month', '1か月後には'),
      b('food waste was almost half of the earlier amount', '食品廃棄は以前の量のほぼ半分になっていました'),
    ],
    [
      b('More students finished their meals', 'より多くの生徒が食事を食べ終えました'),
      b('but nobody had to remain hungry', 'しかし、だれも空腹のままでいる必要はありませんでした'),
    ],
    [
      b('Daily records helped the cooking staff', '毎日の記録は調理スタッフの助けになりました'),
      b('to prepare a better amount', 'より適切な量を用意するための'),
      b('for each menu', 'それぞれの献立に合わせて'),
    ],
    [
      b('The project taught them', 'その活動は生徒たちに教えました'),
      b('that reducing food waste does not require one perfect rule', '食品ロスを減らすのに、一つの完璧な規則は必要ないということを'),
      b('for everyone', '全員に当てはまる'),
    ],
    [
      b('It can begin', 'それは始められます'),
      b('by giving people clear information and a useful choice', '人々に分かりやすい情報と役立つ選択肢を与えることによって'),
    ],
    [
      b('The students now share their results', '生徒たちは今、自分たちの結果を共有しています'),
      b('with nearby schools and encourage them', '近くの学校と、そしてその学校に勧めています'),
      b('to measure their own waste', '自分たちのごみを測るように'),
    ],
    [
      b('They explain', '生徒たちは説明しています'),
      b('that every meal uses water, energy', 'どの食事も水とエネルギーを使うということを'),
      b('and work', 'そして人の労力も'),
      b('before it reaches a plate', 'その食事が皿に届くまでに'),
      b('so even a small improvement can protect valuable resources', 'だから、小さな改善でさえ大切な資源を守ることができます'),
    ],
  ]),

  p_pre2_museum_volunteers: passage([
    [
      b('Many museums are trying', '多くの博物館は取り組んでいます'),
      b('to become places', 'そのような場所になることに'),
      b('where teenagers can do more than simply look at objects', 'そこでは、10代の若者が展示物をただ見るだけでなく、もっと多くのことができます'),
      b('behind glass', 'ガラスの向こうにある'),
    ],
    [
      b('One city museum recently began a volunteer program', 'ある市立博物館は最近、ボランティアプログラムを始めました'),
      b('for high school students', '高校生のための'),
      b('who are interested', 'その高校生たちは関心があります'),
      b('in local culture', '地域の文化に'),
    ],
    [
      b('Before the museum opens', '博物館が開館する前に'),
      b('on Saturdays', '毎週土曜日に'),
      b('the students meet a staff member and learn', '生徒たちは職員と会い、学びます'),
      b('about the day\'s exhibition', 'その日の展示について'),
    ],
    [
      b('They check maps, prepare simple worksheets', '生徒たちは地図を確認し、簡単なワークシートを準備します'),
      b('and practice explaining the displays', 'そして、展示を説明する練習をします'),
      b('in easy words', 'やさしい言葉で'),
    ],
    [
      b('During the afternoon', '午後の間は'),
      b('they help families', '生徒たちは家族を手助けします'),
      b('who have small children or visitors', '小さな子どもがいる家族や、来館者を'),
      b('who are not used to museums', 'その来館者は博物館に慣れていません'),
    ],
    [
      b('The work is not always easy', 'その仕事はいつも簡単とは限りません'),
      b('because volunteers must communicate politely', 'なぜなら、ボランティアは丁寧に応対しなければならないからです'),
      b('even when the building is crowded', '建物が混雑しているときでさえ'),
    ],
    [
      b('They may not know the answer to every question', '生徒たちは、すべての質問への答えを知っているとは限りません'),
      b('so they are taught', 'そのため、生徒たちは教えられます'),
      b('to admit uncertainty and ask a staff member', '分からないことを認め、職員に尋ねるように'),
      b('for help', '助けを求めて'),
    ],
    [
      b('This approach is more useful than giving visitors information', 'この姿勢は、来館者に情報を与えることより役に立ちます'),
      b('that may be incorrect', 'その情報は誤っているかもしれません'),
    ],
    [
      b('However', 'しかし'),
      b('many students say the program gives them a useful sense of responsibility', '多くの生徒は言います、そのプログラムが自分たちに有益な責任感を与えてくれると'),
    ],
    [
      b('They also discover', '生徒たちはさらに気づきます'),
      b('that a museum is connected to schools, shops, parks, and many other parts of the community', '博物館が、学校や商店や公園、そして地域のほかの多くの場所とつながっていることに'),
    ],
    [
      b('One student said she had become more confident after answering questions', 'ある生徒は言いました、質問に答えたあとで以前より自信がついたと'),
      b('from foreign visitors', '外国からの来館者から受けた'),
    ],
    [
      b('Another student decided', '別の生徒は決めました'),
      b('to study history at college', '大学で歴史を学ぶことを'),
      b('because he wanted', 'なぜなら、その生徒は望んだからです'),
      b('to protect old buildings in his town', '自分の町の古い建物を守ることを'),
    ],
    [
      b('For the museum', '博物館にとって'),
      b('the benefit is clear as well', 'その利点はやはり明らかです'),
    ],
    [
      b('When young people take part', '若者が参加すると'),
      b('exhibitions feel more open', '展示はより開かれたものに感じられます'),
      b('and visitors are more willing', 'そして、来館者はもっと進んで行おうとします'),
      b('to ask questions', '質問することを'),
    ],
    [
      b('The museum has also changed the way it prepares labels', '博物館は説明文を準備する方法も変えました'),
      b('for new displays', '新しい展示のための'),
    ],
    [
      b('Staff members used to write long explanations', '職員は以前、長い説明を書いていました'),
      b('for adults', '大人向けに'),
      b('but they now ask student volunteers', 'しかし今では、学生ボランティアに頼みます'),
      b('to read the labels first', 'その説明文を最初に読むように'),
    ],
    [
      b('If the students cannot understand an important point', 'もし生徒たちが重要な点を理解できなければ'),
      b('the staff try', '職員は努めます'),
      b('to make the language clearer without removing the main idea', '中心となる考えを削らずに、表現をもっと分かりやすくすることに'),
    ],
    [
      b('The students also record the questions visitors ask most often', '生徒たちは、来館者が最もよく尋ねる質問も記録します'),
      b('and the museum uses this feedback when planning future exhibitions', 'そして博物館は、今後の展示を計画するときにこの意見を利用します'),
    ],
    [
      b('The program shows', 'そのプログラムは示しています'),
      b('that learning about the past can help people build stronger relationships', '過去について学ぶことが、人々がより強い関係を築く助けになり得るということを'),
      b('in the present', '現在において'),
    ],
  ]),

  p_pre2_later_school_start: passage([
    [
      b('Many teenagers arrive', '多くの10代の生徒は到着します'),
      b('at school feeling tired', '学校に、疲れを感じながら'),
      b('even when they try', 'たとえ努力しても'),
      b('to go to bed at a reasonable time', '適切な時刻に寝ることを'),
    ],
    [
      b('Sleep researchers explain', '睡眠の研究者は説明します'),
      b('that the body clock often changes', '体内時計は変化することが多いと'),
      b('during the teenage years', '10代の時期に'),
    ],
    [
      b('The brain begins', '脳は始めます'),
      b('to feel sleepy later at night', '夜のもっと遅い時刻に眠気を感じることを'),
      b('but students must still wake up early', 'しかし、生徒はそれでも早く起きなければなりません'),
      b('for school', '学校へ行くために'),
    ],
    [
      b('For this reason', 'この理由から'),
      b('some schools have moved their starting time', 'いくつかの学校は始業時刻を移しました'),
      b('from eight o’clock to a later hour', '8時から、もっと遅い時刻へ'),
    ],
    [
      b('Several studies report', 'いくつかの研究は報告しています'),
      b('that students at these schools sleep longer', 'こうした学校の生徒は、より長く眠ると'),
      b('on ordinary weekdays', '通常の平日に'),
    ],
    [
      b('Teachers have also seen greater attention and fewer late arrivals', '教師たちは、より高い集中力と、より少ない遅刻も確認しています'),
      b('in morning classes', '朝の授業で'),
    ],
    [
      b('In one experiment', 'ある実験では'),
      b('attendance and mood improved', '出席状況と気分が改善しました'),
      b('although test scores did not rise immediately', 'テストの点数はすぐには上がらなかったものの'),
    ],
    [
      b('A later start', 'より遅い始業時刻は'),
      b('however, can cause practical problems', 'しかし、現実的な問題を引き起こすことがあります'),
      b('for families and communities', '家庭や地域にとって'),
    ],
    [
      b('School buses may need new schedules', 'スクールバスには新しい運行予定が必要かもしれません'),
      b('which can increase transportation costs', 'そして、そのことが交通費を増やす可能性があります'),
    ],
    [
      b('Sports practice and music activities may finish after dark, especially', '運動部の練習や音楽活動は、暗くなったあとに終わるかもしれません、特に'),
      b('in winter', '冬には'),
    ],
    [
      b('Some parents also depend on older children to care for younger family members', '年上の子どもが年下の家族を世話することに頼っている保護者もいます'),
      b('after school', '放課後に'),
    ],
    [
      b('At one school', 'ある学校では'),
      b('students helped design the change', '生徒たちがその変更の設計を手伝いました'),
      b('and their suggestions produced a bus timetable', 'そして、生徒たちの提案がバスの時刻表を生み出しました'),
      b('that protected both sleep and afternoon activities', 'その時刻表は、睡眠と午後の活動の両方を守りました'),
    ],
    [
      b('This cooperation made families more willing', 'この協力によって、家庭はもっと前向きになりました'),
      b('to try the new schedule for a full year', '新しい予定を丸1年間試すことに'),
    ],
    [
      b('Because each community is different', '地域はそれぞれ異なるため'),
      b('changing the clock alone', '時刻だけを変えることは'),
      b('is not a complete solution', '完全な解決策ではありません'),
    ],
    [
      b('Schools need', '学校には必要があります'),
      b('to examine bus routes, club times', 'バス路線や部活動の時間を調べることが'),
      b('and family needs', 'そして、家庭の必要も'),
      b('before choosing a new schedule', '新しい予定を選ぶ前に'),
    ],
    [
      b('They should also teach students', '学校は生徒たちに教えるべきでもあります'),
      b('that a later start is not an invitation', 'より遅い始業は、してよいという合図ではないと'),
      b('to stay online longer at night', '夜にもっと長くオンラインで過ごすことを'),
    ],
    [
      b('The strongest argument for change does not demand one starting time', '変更を支持する最も強い主張は、一つの始業時刻を求めてはいません'),
      b('for every school', 'すべての学校に対して'),
    ],
    [
      b('It is', 'その主張とは、次のことです'),
      b('that school policies should take evidence', '学校の方針は証拠を受け止めるべきだということです'),
      b('about teenage sleep seriously', '10代の睡眠についての証拠を、真剣に'),
    ],
    [
      b(
        'A community can then balance health benefits',
        'その上で地域は、健康上の利点との釣り合いを取ることができます',
        'balance A with B は「AとBの釣り合いを取る」。Aに当たる health benefits を先に押さえ、Bは次へ待ちます。',
      ),
      b(
        'with local challenges and test',
        '地域の課題との間で。そして、その計画を確かめることができます',
        'with local challenges が釣り合いを取る相手です。and test から二つ目の動作「確かめる」へ進みます。',
      ),
      b('whether its plan is effective', 'その計画が効果的かどうかを'),
    ],
    [
      b('Careful changes are more useful than keeping an old schedule simply', '慎重な変更の方が、ただ古い予定を保つことより役に立ちます'),
      b(
        'because it is familiar, especially when schools review them regularly',
        '「慣れているから」というだけで古い予定を保つよりも。特に、学校がその変更を定期的に見直す場合には',
        'because はここでは「変更が役立つ理由」ではなく、古い予定を保つ理由です。simply because で「ただ〜だからというだけで」と取ります。',
      ),
    ],
  ]),

  p_pre2plus_repair_cafes: passage([
    [
      b('People replace phones, lamps, and other household devices', '人々は、電話やランプなどの家庭用機器を買い替えます'),
      b('for many reasons', 'さまざまな理由で'),
    ],
    [
      b('Sometimes a product is badly damaged', '製品がひどく壊れていることもあります'),
      b('but in other cases only a small part has stopped working', 'しかし別の場合には、小さな部品だけが動かなくなっています'),
    ],
    [
      b('Because buying a new item is often easier than finding someone', '新しい品物を買う方が、人を見つけるより簡単なことが多いため'),
      b('to fix the old one', '古い品物を直してくれる'),
      b('usable products become waste', 'まだ使える製品が、ごみになります'),
    ],
    [
      b('In response', 'それに応じて'),
      b('communities in several countries have started events called repair cafes', 'いくつかの国の地域社会は、リペアカフェと呼ばれる催しを始めました'),
    ],
    [
      b('At these events', 'こうした催しでは'),
      b('local volunteers help visitors examine broken things and', '地域のボランティアは、来場者が壊れた物を調べるのを手伝い、そして'),
      b('when possible, repair them', '可能なときには、それを修理します'),
    ],
    [
      b('A repair cafe is different', 'リペアカフェは異なります'),
      b('from a normal repair shop', '普通の修理店とは'),
    ],
    [
      b('Visitors are expected', '来場者には求められます'),
      b('to sit with volunteers and take part in the work instead of simply leaving an item', '品物をただ預ける代わりに、ボランティアと座って作業に参加することが'),
      b('at a counter', '受付に'),
    ],
    [
      b('A volunteer may show someone', 'ボランティアは人に教えることがあります'),
      b('how to open a lamp safely, replace a worn wire', 'ランプを安全に開ける方法や、古くなった電線を交換する方法を'),
      b('or search', 'または、探す方法を'),
      b('for instructions online', 'オンラインで説明書を'),
    ],
    [
      b('This process allows participants', 'この過程によって、参加者はできるようになります'),
      b('to gain practical skills and confidence', '実用的な技能と自信を身につけることが'),
    ],
    [
      b('It also creates conversations', 'それは会話も生み出します'),
      b('between people of different ages', '異なる年代の人々の間に'),
    ],
    [
      b('Older residents may know', '年配の住民は知っているかもしれません'),
      b('how older machines were built', '古い機械がどのように作られていたのかを'),
      b('while younger participants may be more comfortable finding digital information', '一方、若い参加者はデジタル情報を探すことにもっと慣れているかもしれません'),
    ],
    [
      b('Supporters say repair cafes offer both environmental and social benefits', '支持者は言います、リペアカフェは環境面と社会面の両方の利点をもたらすと'),
    ],
    [
      b('Extending the life of a product', '製品の寿命を延ばすことは'),
      b('reduces waste and lowers demand', 'ごみを減らし、需要を下げます'),
      b('for the energy and resources required', '必要とされるエネルギーや資源への'),
      b('to make new goods', '新しい製品を作るために'),
    ],
    [
      b('Families may also save money', '家庭はお金も節約できるかもしれません'),
      b('which is especially valuable', 'そして、そのことには特に価値があります'),
      b('when prices are rising', '物価が上がっているときには'),
    ],
    [
      b('In addition', 'さらに'),
      b('the events encourage people', 'その催しは人々に促します'),
      b('to think differently about ownership', '物を所有することについて、違う見方で考えるように'),
    ],
    [
      b('A device no longer seems like a closed box', '機器はもはや、閉ざされた箱のようには見えません'),
      b('that only its manufacturer understands', 'その箱は製造業者だけが理解しています'),
    ],
    [
      b('Even when an object cannot be repaired', '物を修理できないときでさえ'),
      b('a visitor may learn', '来場者は学べるかもしれません'),
      b('why it failed and how to choose a longer-lasting replacement', 'なぜそれが壊れたのか、そして、より長持ちする代替品をどう選ぶのかを'),
    ],
    [
      b('However', 'しかし'),
      b('repair cafes are not a complete solution', 'リペアカフェは完全な解決策ではありません'),
    ],
    [
      b('Volunteers must refuse jobs', 'ボランティアは作業を断らなければなりません'),
      b('that could be dangerous', 'その作業は危険になるおそれがあります'),
      b('and replacement parts are sometimes unavailable or too expensive', 'そして、交換部品は手に入らなかったり、高すぎたりすることがあります'),
    ],
    [
      b('Some modern products are also designed so', '現代の製品の中には、そのように設計されているものもあります'),
      b('that they are difficult', 'つまり、その製品は難しいのです'),
      b('to open without special tools', '特殊な道具なしで開けることが'),
    ],
    [
      b('Critics therefore argue', 'そのため批判する人々は主張します'),
      b('that manufacturers should make parts and instructions easier', '製造業者は、部品や説明書をもっと容易なものにすべきだと'),
      b('to obtain', '入手できるように'),
    ],
    [
      b('Repair cafes cannot change product design', 'リペアカフェは製品設計を変えることはできません'),
      b('by themselves', 'それだけの力では'),
      b('but they can show consumers', 'しかし、消費者に示すことはできます'),
      b('what prevents repairs', '何が修理を妨げているのかを'),
    ],
    [
      b('Their greatest value may be', 'その最大の価値は、次のことかもしれません'),
      b('that they turn a private problem', '個人的な問題を変えることです'),
      b('a broken object', 'つまり、壊れた物という問題を'),
      b('into a public lesson about waste, skills, and responsibility', 'ごみや技能や責任についての、社会全体の学びへ'),
    ],
  ]),

  p_pre2plus_city_bird_count: passage([
    [
      b('Professional scientists cannot be everywhere', '専門の科学者は、あらゆる場所にいることはできません'),
      b('at once, especially', '同時には、特に'),
      b('when they study animals', '動物を研究するときには'),
      b('that move', 'その動物は移動します'),
      b('across wide areas', '広い地域を横切って'),
    ],
    [
      b('Many research groups need more information', '多くの研究団体は、さらに多くの情報を必要としています'),
      b('so they invite ordinary people', 'そのため、一般の人々を招きます'),
      b('to join projects known as citizen science', '市民科学として知られる活動に参加するように'),
    ],
    [
      b('One common project asks participants', 'よくある活動の一つは、参加者に求めます'),
      b('to observe birds in gardens, parks, and school grounds', '庭や公園や校庭で鳥を観察するように'),
    ],
    [
      b('Volunteers record each species they see, the number of birds, the location, and the time', 'ボランティアは、目にした鳥の種類、鳥の数、場所、そして時刻を記録します'),
    ],
    [
      b('When thousands of people send reports', '何千人もの人々が報告を送ると'),
      b('researchers can discover patterns', '研究者は傾向を発見できます'),
      b('that a small team might miss', 'その傾向は小さなチームなら見落とすかもしれません'),
    ],
    [
      b('For example', '例えば'),
      b('the records may show', 'その記録は示すかもしれません'),
      b('that a species is arriving earlier in spring or disappearing', 'ある種類が春にもっと早く飛来している、または姿を消していることを'),
      b('from certain neighborhoods', '特定の地域から'),
    ],
    [
      b('Such changes can suggest', 'そのような変化は示すことがあります'),
      b('that weather, food', '天候や食べ物が'),
      b('or habitat conditions are affecting bird populations', 'あるいは生息環境が、鳥の個体数に影響していることを'),
    ],
    [
      b('However', 'しかし'),
      b('large numbers of reports cannot automatically ensure reliable data', '大量の報告があっても、信頼できるデータが自動的に保証されるわけではありません'),
      b('in practice', '実際には'),
    ],
    [
      b('An experienced observer may identify a bird', '経験豊かな観察者は鳥を見分けられるかもしれません'),
      b('by its song', 'その鳴き声によって'),
      b('while a beginner may confuse two similar species', '一方、初心者は似た2種類を混同するかもしれません'),
    ],
    [
      b('People also visit places', '人々はそのような場所も訪れます'),
      b(
        'that are easy',
        'その場所は、行きやすいのです',
        'that 以下は places を説明しています。easy の具体的な内容は、次の to reach と結び付けて「行きやすい」です。',
      ),
      b(
        'to reach more often than distant or unsafe locations',
        'そこへ行くのが。そして、遠い場所や危険な場所よりも頻繁に訪れます',
        'to reach は easy の内容です。more often than 以下は visit に戻して、「遠い場所などより頻繁に訪れる」と読みます。',
      ),
    ],
    [
      b('This creates a bias', 'このことが偏りを生み出します'),
      b('because some habitats receive many reports and others receive few', 'なぜなら、多くの報告が集まる生息地もあれば、ほとんど集まらない所もあるからです'),
    ],
    [
      b('Good projects reduce these problems', 'よい活動は、こうした問題を減らします'),
      b('through clear training and careful design', '分かりやすい訓練と慎重な設計によって'),
    ],
    [
      b('They provide pictures and recordings', 'その活動は写真や録音を提供します'),
      b('that help volunteers identify species correctly', 'それらは、ボランティアが鳥の種類を正しく見分ける助けになります'),
    ],
    [
      b('They may ask participants', '活動の運営者は参加者に求めることがあります'),
      b('to watch for the same length of time and to report visits', '同じ長さの時間観察し、観察に出かけたことを報告するように'),
      b('when no birds appeared', '鳥が一羽も現れなかったときも'),
    ],
    [
      b('Experts often check unusual reports', '専門家は珍しい報告を確認することがよくあります'),
      b('before the records enter the main database', 'その記録が主要なデータベースに入る前に'),
    ],
    [
      b('Some projects also send several volunteers the same observation task and compare their answers', '複数のボランティアに同じ観察課題を送り、その回答を比較する活動もあります'),
      b('to estimate', '推定するために'),
      b('how often mistakes occur', 'どのくらいの頻度で間違いが起こるのかを'),
    ],
    [
      b('Researchers can then compare similar observations and estimate', 'そうすれば研究者は、似た観察結果を比較して推定できます'),
      b('where the data may be incomplete', 'どこでデータが不完全かもしれないのかを'),
    ],
    [
      b('Citizen science is valuable not', '市民科学に価値があるのは、次の理由ではありません'),
      b('because volunteers replace professionals', 'ボランティアが専門家に取って代わるからではなく'),
      b('but', 'そうではなく'),
      b('because the two groups contribute different strengths', '二つの集団が異なる強みを提供するからです'),
    ],
    [
      b('The public contributes time, local knowledge, and a large number of observations', '一般の人々は、時間や地域の知識、そして多数の観察結果を提供します'),
    ],
    [
      b('Scientists contribute research methods', '科学者は研究方法を提供します'),
      b('that turn those observations', 'その方法が、そうした観察結果を変えます'),
      b('into careful conclusions', '慎重に導かれた結論へ'),
    ],
    [
      b('Together, they can follow changes', '両者が協力すれば、変化を追うことができます'),
      b('in biodiversity and identify places', '生物多様性の変化を、そして場所を特定できます'),
      b('that may need conservation', 'その場所は保全を必要とするかもしれません'),
    ],
    [
      b('The partnership also shows', 'この協力関係は、さらに示しています'),
      b('that useful science depends', '役立つ科学は、あることにかかっていると'),
      b('on recording uncertainty as honestly as discovery', '発見と同じくらい正直に、不確実性も記録することに'),
    ],
  ]),
})
