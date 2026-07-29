// 長文データ。英検の級ごと。
// 各文： en（英文）/ ja（自然な和訳）/ chunks（区切り直訳：スラッシュリーディング）
// vocab： まとめで学習する重要語（src/data/words.js にある単語の id）
//
// 本試験の素材感に近づけるため、低い級は身近な生活・案内文、高い級は社会・科学・
// 論説調の説明文にし、級が上がるほど語数と文構造を段階的に重くしている。

import { EXAM_PASSAGES } from './passages-exam.js'

const s = (en, ja, chunks, paragraphStart = false) => ({
  en,
  ja,
  chunks: chunks ?? [{ en, ja }],
  gloss: {},
  paragraphStart,
})
const p = (en, ja, chunks) => s(en, ja, chunks, true)

const CORE_PASSAGES = [
  {
    id: 'p_5_lost_notebook',
    level: '5',
    emoji: '📘',
    title: 'A Notebook for Rina',
    titleJa: 'リナのノート',
    blurb: '5級の短文・会話文をつないで読む、アプリ独自の読解入門。',
    vocab: [
      'junior', 'student', 'school', 'bus', 'class', 'teacher',
      'picture', 'notebook', 'friend', 'story', 'happy',
    ],
    sentences: [
      p('Rina is a junior high school student.', 'リナは中学生です。', [
        { en: 'Rina is', ja: 'リナは〜です' },
        { en: 'a junior high school student', ja: '中学生' },
      ]),
      s('She goes to school by bus every morning.', '彼女は毎朝バスで学校へ行きます。'),
      s('On Monday, she has English, music, and science classes.', '月曜日、彼女は英語、音楽、理科の授業があります。'),
      s('She likes English because her teacher uses many pictures.', '先生がたくさんの絵を使うので、彼女は英語が好きです。'),
      p('After lunch, Rina cannot find her blue notebook.', '昼食後、リナは青いノートを見つけることができません。'),
      s('Her friend Ken looks under the desks with her.', '友達のケンが彼女と一緒に机の下を探します。'),
      s('Then Ken sees the notebook near the classroom door.', 'それからケンは教室のドアの近くにそのノートを見つけます。'),
      p('Rina says thank you and writes a short story in it.', 'リナはお礼を言い、そのノートに短い物語を書きます。'),
      s('She is happy because she can use the story in English class.', '英語の授業でその物語を使えるので、彼女はうれしいです。'),
    ],
  },

  {
    id: 'p_4_library_event',
    level: '4',
    emoji: '📚',
    title: 'The Library Weekend',
    titleJa: '図書館の週末イベント',
    blurb: '公共施設のお知らせを含む、英検4級本試験程度の説明文。',
    vocab: [
      'library', 'special', 'event', 'borrow', 'topic', 'local', 'history',
      'librarian', 'station', 'river', 'pay', 'message', 'website', 'popular',
      'provide', 'material',
    ],
    sentences: [
      p('Green Town Library has a special event on the first Saturday of every month.', 'グリーンタウン図書館では毎月第一土曜日に特別なイベントがあります。'),
      s('Children can listen to stories, make small cards, and borrow books about the month\'s topic.', '子どもたちは物語を聞いたり、小さなカードを作ったり、その月のテーマに関する本を借りたりできます。'),
      p('This month, the topic is local history.', '今月のテーマは地域の歴史です。'),
      s('Ms. Brown, one of the librarians, will show old pictures of the town.', '司書の一人であるブラウンさんが、町の古い写真を見せてくれます。'),
      s('She will also talk about the old station that stood near the river fifty years ago.', '彼女はまた、50年前に川の近くにあった古い駅についても話します。'),
      p('After the talk, children will work in small groups to build a paper model of the station.', '話の後、子どもたちは小さなグループで駅の紙模型を作ります。'),
      s('The library will provide paper and glue, so families do not need to bring craft materials.', '図書館が紙とのりを用意するので、家族は工作材料を持参する必要はありません。'),
      s('Parents may help, but each child should write a name on the model and take it home at noon.', '保護者は手伝ってもかまいませんが、子どもは一人ずつ模型に名前を書き、正午に持ち帰ります。'),
      p('The event starts at ten in the morning and ends before lunch.', 'イベントは午前10時に始まり、昼食前に終わります。'),
      s('People do not have to pay, but they should bring a pencil.', '参加者はお金を払う必要はありませんが、鉛筆を持ってくるべきです。'),
      s('Many families come early because the room is not very large.', '部屋があまり広くないので、多くの家族は早く来ます。'),
      s('If it becomes full, the library will put a message on its website.', '満員になった場合、図書館はウェブサイトにお知らせを載せます。'),
      p('The event is popular because children can learn about their town in a fun way.', '子どもたちが楽しく自分たちの町について学べるので、このイベントは人気があります。'),
    ],
  },

  {
    id: 'p_3_school_garden',
    level: '3',
    emoji: '🌿',
    title: 'A Garden Behind the School',
    titleJa: '学校の裏の菜園',
    blurb: '学校活動と地域交流を扱う、英検3級本試験程度の物語・説明文。',
    vocab: [
      'vegetable', 'garden', 'simple', 'careful', 'attention', 'choose',
      'remove', 'soil', 'schedule', 'temperature', 'affect', 'community',
      'experience', 'protect', 'environment', 'action', 'result',
      'research', 'chemical', 'attract', 'damage', 'harvest',
    ],
    sentences: [
      p('Last spring, the students at Maple Junior High started a vegetable garden behind their school.', '昨年の春、メープル中学校の生徒たちは学校の裏に野菜畑を作り始めました。'),
      s('At first, many students thought the work would be simple, but they soon learned that plants need careful attention.', '最初、多くの生徒はその作業は簡単だと思っていましたが、植物には注意深い世話が必要だとすぐに学びました。'),
      s('They had to choose a sunny place, remove stones from the soil, and water the young plants every day.', '彼らは日当たりのよい場所を選び、土から石を取り除き、若い苗に毎日水をやらなければなりませんでした。'),
      p('Some students forgot their jobs during the first week, so the tomatoes did not grow well.', '最初の週には仕事を忘れる生徒もいたため、トマトはうまく育ちませんでした。'),
      s('Their science teacher asked each group to make a schedule and write short notes about the weather.', '理科の先生は各グループに予定表を作り、天気について短いメモを書くよう求めました。'),
      s('After that, the garden changed quickly.', 'その後、畑は急速に変わりました。'),
      s('The students began to understand how temperature, rain, and insects affected the vegetables.', '生徒たちは気温、雨、昆虫が野菜にどのような影響を与えるかを理解し始めました。'),
      p('In June, the students noticed that insects were eating the leaves of several plants.', '6月、生徒たちは虫がいくつかの植物の葉を食べていることに気づきました。'),
      s('Some wanted to use a strong chemical spray, but the teacher asked them to research safer choices first.', '強い薬品のスプレーを使いたい生徒もいましたが、先生はまず、より安全な選択肢を調べるよう求めました。'),
      s('They learned that certain flowers attract insects that eat garden pests without harming the vegetables.', '彼らは、ある種の花が、野菜を傷つけずに害虫を食べる虫を引き寄せると学びました。'),
      s('The class planted those flowers around the garden, and the number of damaged leaves soon decreased.', 'クラスはその花を菜園の周りに植え、傷んだ葉の数はすぐに減りました。'),
      p('In July, they picked enough cucumbers and tomatoes to share with people at a nearby community center.', '7月には、近くのコミュニティセンターの人々と分け合えるだけのきゅうりとトマトを収穫しました。'),
      s('Instead of simply giving the food away, the students visited the center and explained how they had grown it.', 'ただ食べ物を渡すのではなく、生徒たちはセンターを訪れ、どのように育てたのかを説明しました。'),
      s('The older residents shared recipes and suggested vegetables that the class could plant in autumn.', '年配の住民はレシピを教え、クラスが秋に植えられる野菜を提案しました。'),
      s('The students used this advice to plan a second garden, which made the project continue beyond one school term.', '生徒たちはこの助言を使って二つ目の菜園を計画し、活動は一学期を越えて続くことになりました。'),
      p('The experience taught them that protecting the environment can begin with small daily actions.', 'その経験は、環境を守ることは日々の小さな行動から始められると彼らに教えました。'),
      s('It also gave them a chance to talk with older people who knew many useful farming tips.', 'また、役に立つ農業の知恵をたくさん知っている年配の人々と話す機会も与えてくれました。'),
      s('By the end of the project, even the students who had disliked gardening were proud of the result.', 'プロジェクトの終わりには、園芸が嫌いだった生徒でさえ、その結果を誇りに思っていました。'),
    ],
  },

  {
    id: 'p_pre2_museum_volunteers',
    level: 'pre2',
    emoji: '🏛️',
    title: 'Young Volunteers at the Museum',
    titleJa: '博物館の若いボランティア',
    blurb: '地域社会と職業体験を扱う、英検準2級本試験程度の説明文。',
    vocab: [
      'museum', 'volunteer', 'object', 'culture', 'exhibition', 'prepare',
      'practice', 'explain', 'display', 'communicate', 'responsibility',
      'discover', 'confident', 'benefit', 'willing', 'explanation', 'relationship',
      'uncertainty', 'record', 'feedback',
    ],
    sentences: [
      p('Many museums are trying to become places where teenagers can do more than simply look at objects behind glass.', '多くの博物館は、10代の若者がガラスの向こうの展示物をただ見るだけではない場所になろうとしています。'),
      s('One city museum recently began a volunteer program for high school students who are interested in local culture.', 'ある市立博物館は最近、地域文化に関心のある高校生のためのボランティアプログラムを始めました。'),
      p('Before the museum opens on Saturdays, the students meet a staff member and learn about the day\'s exhibition.', '土曜日に博物館が開く前、生徒たちは職員と会い、その日の展示について学びます。'),
      s('They check maps, prepare simple worksheets, and practice explaining the displays in easy words.', '彼らは地図を確認し、簡単なワークシートを準備し、展示をやさしい言葉で説明する練習をします。'),
      s('During the afternoon, they help families who have small children or visitors who are not used to museums.', '午後には、小さな子ども連れの家族や博物館に慣れていない来館者を手助けします。'),
      p('The work is not always easy because volunteers must communicate politely even when the building is crowded.', '建物が混雑しているときでも丁寧に対応しなければならないため、その仕事はいつも簡単とは限りません。'),
      s('They may not know the answer to every question, so they are taught to admit uncertainty and ask a staff member for help.', 'すべての質問への答えを知っているとは限らないため、分からないことを認め、職員に助けを求めるよう教えられます。'),
      s('This approach is more useful than giving visitors information that may be incorrect.', 'この姿勢は、来館者に誤っているかもしれない情報を与えるより役に立ちます。'),
      s('However, many students say the program gives them a useful sense of responsibility.', 'しかし、多くの生徒はこのプログラムが役に立つ責任感を与えてくれると言います。'),
      s('They also discover that a museum is connected to schools, shops, parks, and many other parts of the community.', '彼らはまた、博物館が学校、商店、公園、その他多くの地域の場所とつながっていることに気づきます。'),
      p('One student said she had become more confident after answering questions from foreign visitors.', 'ある生徒は、外国人来館者からの質問に答えた後、以前より自信がついたと言いました。'),
      s('Another student decided to study history at college because he wanted to protect old buildings in his town.', '別の生徒は、自分の町の古い建物を守りたいと思い、大学で歴史を学ぶことに決めました。'),
      p('For the museum, the benefit is clear as well.', '博物館にとっても、その利点は明らかです。'),
      s('When young people take part, exhibitions feel more open, and visitors are more willing to ask questions.', '若者が参加すると、展示はより開かれたものに感じられ、来館者はより質問しやすくなります。'),
      s('The museum has also changed the way it prepares labels for new displays.', '博物館は新しい展示の説明文を準備する方法も変えました。'),
      s('Staff members used to write long explanations for adults, but they now ask student volunteers to read the labels first.', '職員は以前、大人向けの長い説明を書いていましたが、今ではまず学生ボランティアにその説明を読んでもらいます。'),
      s('If the students cannot understand an important point, the staff try to make the language clearer without removing the main idea.', '生徒が重要な点を理解できない場合、職員は中心となる考えを削らずに表現をより分かりやすくしようとします。'),
      s('The students also record the questions visitors ask most often, and the museum uses this feedback when planning future exhibitions.', '生徒たちは来館者がよく尋ねる質問も記録し、博物館は将来の展示を計画するときにその意見を活用します。'),
      p('The program shows that learning about the past can help people build stronger relationships in the present.', 'このプログラムは、過去について学ぶことが現在の人間関係をより強くする助けになることを示しています。'),
    ],
  },

  {
    id: 'p_pre2plus_repair_cafes',
    level: 'pre2plus',
    emoji: '🛠️',
    title: 'What Repair Cafes Can Teach Us',
    titleJa: 'リペアカフェが教えてくれること',
    blurb: '持続可能な消費と地域活動を扱う、英検準2級プラス本試験程度の説明文。',
    vocab: [
      'repair', 'device', 'waste', 'replace', 'community', 'volunteer',
      'examine', 'instruction', 'practical', 'confidence', 'benefit',
      'resource', 'demand', 'ownership', 'manufacturer', 'consumer',
      'responsibility', 'available', 'encourage', 'reduce',
    ],
    sentences: [
      p('People replace phones, lamps, and other household devices for many reasons.', '人々はさまざまな理由で、電話やランプなどの家庭用機器を買い替えます。'),
      s('Sometimes a product is badly damaged, but in other cases only a small part has stopped working.', '製品がひどく壊れていることもありますが、小さな部品だけが動かなくなっている場合もあります。'),
      s('Because buying a new item is often easier than finding someone to fix the old one, usable products become waste.', '古い物を直してくれる人を見つけるより新品を買う方が簡単なことが多いため、まだ使える製品がごみになります。'),
      s('In response, communities in several countries have started events called repair cafes.', 'これに応じて、いくつかの国の地域社会はリペアカフェと呼ばれる催しを始めました。'),
      s('At these events, local volunteers help visitors examine broken things and, when possible, repair them.', 'そこでは地域のボランティアが、来場者と一緒に壊れた物を調べ、可能であれば修理します。'),

      p('A repair cafe is different from a normal repair shop.', 'リペアカフェは普通の修理店とは異なります。'),
      s('Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.', '来場者は品物を受付に預けるだけでなく、ボランティアと一緒に座って作業に参加することが求められます。'),
      s('A volunteer may show someone how to open a lamp safely, replace a worn wire, or search for instructions online.', 'ボランティアは、ランプを安全に開ける方法、古くなった電線を交換する方法、オンラインで説明書を探す方法などを教えます。'),
      s('This process allows participants to gain practical skills and confidence.', 'この過程を通して、参加者は実用的な技能と自信を身につけられます。'),
      s('It also creates conversations between people of different ages.', 'また、異なる年代の人々の間に会話が生まれます。'),
      s('Older residents may know how older machines were built, while younger participants may be more comfortable finding digital information.', '年配の住民は古い機械の作りを知っているかもしれず、若い参加者はデジタル情報を探すことに慣れているかもしれません。'),

      p('Supporters say repair cafes offer both environmental and social benefits.', '支持者は、リペアカフェには環境面と社会面の両方の利点があると言います。'),
      s('Extending the life of a product reduces waste and lowers demand for the energy and resources required to make new goods.', '製品の寿命を延ばすことは、ごみを減らし、新しい製品を作るためのエネルギーや資源への需要を下げます。'),
      s('Families may also save money, which is especially valuable when prices are rising.', '家庭はお金も節約でき、物価が上がっているときには特に価値があります。'),
      s('In addition, the events encourage people to think differently about ownership.', 'さらに、この催しは所有することについて人々に別の考え方を促します。'),
      s('A device no longer seems like a closed box that only its manufacturer understands.', '機器はもはや、製造業者だけが理解できる閉ざされた箱のようには見えなくなります。'),
      s('Even when an object cannot be repaired, a visitor may learn why it failed and how to choose a longer-lasting replacement.', '物を修理できない場合でも、来場者は壊れた理由や、より長持ちする代替品の選び方を学べます。'),

      p('However, repair cafes are not a complete solution.', 'しかし、リペアカフェは完全な解決策ではありません。'),
      s('Volunteers must refuse jobs that could be dangerous, and replacement parts are sometimes unavailable or too expensive.', 'ボランティアは危険になり得る作業を断らなければならず、交換部品が手に入らなかったり高すぎたりすることもあります。'),
      s('Some modern products are also designed so that they are difficult to open without special tools.', '現代の製品には、特殊な道具がないと開けにくいよう設計されたものもあります。'),
      s('Critics therefore argue that manufacturers should make parts and instructions easier to obtain.', 'そのため批判する人々は、製造業者が部品や説明書をもっと入手しやすくすべきだと主張します。'),
      s('Repair cafes cannot change product design by themselves, but they can show consumers what prevents repairs.', 'リペアカフェだけで製品設計を変えることはできませんが、何が修理を妨げているかを消費者に示せます。'),
      s('Their greatest value may be that they turn a private problem, a broken object, into a public lesson about waste, skills, and responsibility.', '最大の価値は、壊れた物という個人的な問題を、ごみ、技能、責任についての社会的な学びへ変えることにあるのかもしれません。'),
    ],
  },

  {
    id: 'p_2_quiet_technology',
    level: '2',
    emoji: '🔋',
    title: 'Quiet Technology in Public Spaces',
    titleJa: '公共空間の静かなテクノロジー',
    blurb: '技術と社会生活の関係を扱う、英検2級本試験程度の論説文。',
    vocab: [
      'technology', 'dramatic', 'invisible', 'sensor', 'measure', 'platform',
      'passenger', 'source', 'reduce', 'stress', 'equipment', 'affect',
      'factor', 'consider', 'maintain', 'privacy', 'concern', 'behavior',
      'overlook', 'unequal', 'resident', 'effect', 'evidence', 'efficient',
      'policy',
    ],
    sentences: [
      p('When people discuss technology, they often imagine large machines, bright screens, or dramatic changes in daily life.', '人々がテクノロジーについて話すとき、大きな機械、明るい画面、日常生活の劇的な変化を想像しがちです。'),
      s('In recent years, however, some of the most useful technologies have been designed to be almost invisible.', 'しかし近年、最も役に立つ技術の中には、ほとんど目立たないように設計されたものがあります。'),
      p('For example, several train stations have introduced sensors that measure how crowded each platform is.', '例えば、いくつかの駅では各ホームの混雑度を測るセンサーが導入されています。'),
      s('The information is sent to signs and phone apps, so passengers can choose a less crowded area before the train arrives.', 'その情報は表示板やスマートフォンアプリに送られるため、乗客は電車が到着する前に混雑の少ない場所を選べます。'),
      s('The system does not tell people what to do, but it gives them a better source of information.', 'その仕組みは人々に何をすべきか命令するのではなく、より良い情報源を与えます。'),
      s('This small difference can reduce stress, especially for elderly passengers or parents traveling with children.', 'この小さな違いは、特に高齢の乗客や子ども連れの親のストレスを減らすことができます。'),
      p('Another example can be found in public libraries.', '別の例は公共図書館に見られます。'),
      s('Some libraries now use quiet air-control systems that keep rooms comfortable while using less energy than older equipment.', '現在、一部の図書館では、古い設備より少ないエネルギーで部屋を快適に保つ静かな空調システムを使用しています。'),
      s('Visitors may not notice the system at all, yet it affects how long they can read or study without becoming tired.', '来館者はそのシステムにまったく気づかないかもしれませんが、疲れずに読書や勉強を続けられる時間に影響します。'),
      p('These cases suggest that successful technology is not always the technology that attracts the most attention.', 'これらの例は、成功したテクノロジーが必ずしも最も注目を集めるものではないことを示しています。'),
      p('Cost is still an important factor, and cities must consider whether new systems can be maintained for many years.', '費用はいまだに重要な要因であり、都市は新しいシステムを何年も維持できるかを考慮しなければなりません。'),
      s('Privacy is another concern because sensors can collect data about public behavior.', 'センサーは公共の場での行動に関するデータを集める可能性があるため、プライバシーも別の懸念です。'),
      s('For that reason, officials should explain clearly what kind of data is collected and how it will be protected.', 'そのため、行政担当者はどのようなデータが集められ、どのように保護されるのかを明確に説明すべきです。'),
      p('There is also a social problem that is easy to overlook.', '見落とされやすい社会的な問題もあります。'),
      s('If only wealthy areas receive the newest systems, technology may make public services more unequal instead of more convenient.', '裕福な地域だけが最新のシステムを受け取るなら、テクノロジーは公共サービスをより便利にするのではなく、より不平等にするかもしれません。'),
      s('City leaders therefore need to ask where a new system will have the greatest effect and who might be left out.', 'したがって都市の指導者は、新しいシステムがどこで最大の効果を持つのか、そして誰が取り残される可能性があるのかを問う必要があります。'),
      s('In some cases, a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service.', '場合によっては、古いバス停の簡単な修理やより分かりやすい標識の方が、高価なデジタルサービスより住民の役に立つこともあります。'),
      p('Several cities have therefore begun small trial programs before introducing a system everywhere.', 'そのため、いくつかの都市はシステムを全域に導入する前に、小規模な試験運用を始めています。'),
      s('They compare energy use, waiting times, and complaints in different neighborhoods, then publish the results.', '都市は地域ごとのエネルギー使用量、待ち時間、苦情を比較し、その結果を公表します。'),
      s('This evidence makes it easier to improve a design or decide that a simpler solution would work better.', 'この証拠によって、設計を改善したり、より単純な解決策の方がうまくいくと判断したりしやすくなります。'),
      p('Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.', 'テクノロジーは、どれほど現代的に見えるかではなく、その空間を使う人々にとって実際の問題を解決するかどうかで判断されるべきです。'),
      s('If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.', 'これらの問題が慎重に扱われれば、静かなテクノロジーは人々に支配されていると感じさせずに公共空間を改善できます。'),
    ],
  },

  {
    id: 'p_pre1_resilient_cities',
    level: 'pre1',
    emoji: '🏙️',
    title: 'Designing Cities for Uncertain Weather',
    titleJa: '不確かな天候に備える都市設計',
    blurb: '都市政策と気候適応を扱う、英検準1級本試験程度の論説文。',
    vocab: [
      'challenge', 'extreme', 'occur', 'framework', 'measure', 'consequence',
      'district', 'demand', 'resilient', 'assess', 'vulnerable', 'resource',
      'maintenance', 'policy', 'evidence', 'process', 'reveal', 'adaptation',
      'infrastructure', 'evaluate', 'participation', 'maladaptation',
      'intervention', 'inequality', 'drainage',
    ],
    sentences: [
      p('Cities have always had to respond to weather, but the challenge has become more complicated as extreme heat and sudden storms occur more frequently.', '都市は常に天候に対応しなければなりませんでしたが、猛暑や突然の嵐がより頻繁に起こるにつれて、その課題はより複雑になっています。'),
      s('In the past, local governments often treated floods, heat waves, and water shortages as separate problems.', 'かつて地方自治体は、洪水、熱波、水不足を別々の問題として扱うことがよくありました。'),
      s('Today, many planners argue that cities need a broader framework that connects transportation, housing, energy, and public health.', '今日、多くの都市計画者は、交通、住宅、エネルギー、公衆衛生を結びつけるより広い枠組みが都市には必要だと主張しています。'),
      p('One reason is that a measure designed for a single purpose can have unexpected consequences in another area.', 'その理由の一つは、単一の目的のために設計された対策が、別の分野で予期しない結果をもたらす可能性があるからです。'),
      s('For instance, building higher concrete walls along a river may reduce flooding in one district while pushing water toward a poorer neighborhood downstream.', '例えば、川沿いにより高いコンクリート壁を建てることは、ある地区の洪水を減らす一方で、下流のより貧しい地域へ水を押しやるかもしれません。'),
      s('Similarly, installing powerful air conditioners in public buildings may protect residents during heat waves, yet it can increase energy demand when the power supply is already under pressure.', '同様に、公共施設に強力なエアコンを設置することは熱波の間に住民を守るかもしれませんが、電力供給がすでに逼迫しているときにエネルギー需要を増やす可能性があります。'),
      p('A more resilient city therefore begins by assessing who is most vulnerable and which resources can serve several needs at once.', 'したがって、より回復力のある都市は、誰が最も弱い立場にあり、どの資源が複数の必要に同時に役立つかを評価することから始まります。'),
      s('Trees are a useful example.', '樹木は有用な例です。'),
      s('They provide shade, absorb rainwater, improve air quality, and make streets more pleasant for walking.', '樹木は日陰を作り、雨水を吸収し、空気の質を改善し、通りを歩きやすくします。'),
      s('However, planting trees is not a simple solution if maintenance money is limited or if sidewalks are too narrow for roots to grow safely.', 'しかし、維持費が限られていたり、歩道が根を安全に伸ばすには狭すぎたりする場合、植樹は単純な解決策ではありません。'),
      s('This illustrates a problem that researchers call maladaptation: an attempt to reduce one risk can create a new risk or deepen an old inequality.', 'これは研究者が不適応と呼ぶ問題を示しています。ある危険を減らそうとする試みが、新しい危険を生んだり、既存の不平等を深めたりすることがあるのです。'),
      s('A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.', '例えば裕福な地区を涼しくする公園が、周辺の家賃を上げ、低所得の住民が恩恵を受ける前に転居を迫ることもあります。'),
      s('Planners must therefore examine not only whether an intervention works physically but also how its costs and benefits are distributed.', 'したがって計画者は、対策が物理的に機能するかだけでなく、その費用と恩恵がどのように分配されるかも検討しなければなりません。'),
      p('Good policy must be based on evidence from the actual community rather than on attractive ideas copied from other cities.', '良い政策は、他都市から借りてきた魅力的なアイデアではなく、実際の地域から得られた証拠に基づくべきです。'),
      s('Some cities have begun to invite residents to map dangerous intersections, hot streets, and places where water remains after heavy rain.', '一部の都市は、危険な交差点、暑い通り、大雨の後に水が残る場所を住民に地図化してもらい始めています。'),
      s('This process takes time, and it may reveal disagreements about which projects should come first.', 'この過程には時間がかかり、どの事業を優先すべきかについて意見の相違が明らかになるかもしれません。'),
      s('Nevertheless, it can build trust because residents see that their daily experience is treated as valuable information.', 'それでも、住民は自分たちの日常経験が価値ある情報として扱われていると分かるため、信頼を築くことができます。'),
      s('Local knowledge also helps officials identify failures that computer models miss.', '地域の知識は、コンピューターモデルが見落とす不具合を行政担当者が見つける助けにもなります。'),
      s('A drainage map may look complete, yet residents may know that blocked street drains regularly send water into a particular apartment building.', '排水地図が完全に見えても、住民は道路の排水口の詰まりによって特定の集合住宅へ繰り返し水が流れ込むことを知っているかもしれません。'),
      s('Such observations do not replace scientific data; they reveal where additional measurement is needed.', 'そのような観察は科学的データに代わるものではなく、追加の測定がどこで必要かを明らかにします。'),
      p('The financial side of adaptation is equally difficult.', '適応の財政面も同じように難しいものです。'),
      s('Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.', '大規模なインフラ事業は目に見えやすく、決定的な行動として発表できるため、政治家にとって魅力的です。'),
      s('Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives during an emergency.', 'しかし、地域ボランティアの訓練や複数の言語での警告メッセージ改善のような小規模な投資の方が、緊急時により多くの命を救うかもしれません。'),
      s('Because these measures are less dramatic, they are often the first to be reduced when budgets become tight.', 'これらの対策は劇的ではないため、予算が厳しくなると最初に削られることがよくあります。'),
      s('A city that takes resilience seriously must therefore evaluate projects over a long period rather than only during the year in which they are introduced.', 'したがって回復力を真剣に考える都市は、事業を導入された年だけでなく長期にわたって評価しなければなりません。'),
      s('It must also recognize that the absence of disaster is not proof that preparation was unnecessary.', 'また、災害が起こらなかったことは準備が不要だった証拠ではないと認識しなければなりません。'),
      p('Finally, adaptation plans must remain flexible.', '最後に、適応計画は柔軟であり続けなければなりません。'),
      s('A project that performs well under today\'s conditions may be inadequate if migration, land use, or rainfall patterns change.', '現在の条件でうまく機能する事業でも、人口移動、土地利用、降雨パターンが変われば不十分になるかもしれません。'),
      s('Setting review dates and publishing results allows governments to revise policies without treating revision as failure.', '見直しの日程を定めて結果を公表すれば、政府は修正を失敗とみなさずに政策を改められます。'),
      p('As climate conditions remain uncertain, the cities that adapt most successfully will probably be those that combine technical knowledge with public participation.', '気候条件が不確かなままである中、最もうまく適応する都市は、おそらく専門的知識と市民参加を組み合わせる都市でしょう。'),
    ],
  },

  {
    id: 'p_1_collective_memory',
    level: '1',
    emoji: '🧠',
    title: 'The Fragility of Collective Memory',
    titleJa: '集合的記憶のもろさ',
    blurb: '記憶・制度・社会的合意を扱う、英検1級本試験程度の評論文。',
    vocab: [
      'collective', 'fragile', 'phenomenon', 'archive', 'preservation',
      'mechanism', 'abundance', 'algorithmic', 'integrity', 'institution',
      'autonomy', 'scrutiny', 'accountability', 'ambiguous', 'heritage',
      'exclusion', 'consensus', 'perspective', 'sustain', 'narrative',
      'skepticism', 'cynicism', 'distinguish', 'intensify', 'uncertainty',
      'retention', 'intelligible', 'discoverable', 'neutrality',
      'consultation', 'transparent', 'fabrication', 'moderation',
      'circulation', 'obligation',
    ],
    sentences: [
      p('Societies often assume that important events will be remembered simply because they are recorded in books, archives, or digital databases.', '社会はしばしば、重要な出来事は本、記録保管所、デジタルデータベースに記録されているために記憶され続けると考えます。'),
      s('Yet collective memory is a far more fragile phenomenon than the existence of records might suggest.', 'しかし集合的記憶は、記録が存在することから想像されるよりもはるかにもろい現象です。'),
      s('A document can survive for centuries and still fail to influence how later generations understand the past.', '文書は何世紀も残ることができますが、それでも後の世代が過去を理解する方法に影響を与えないことがあります。'),
      s('The reason is that memory depends not only on preservation but also on repeated interpretation within families, schools, media, and political institutions.', 'その理由は、記憶が保存だけでなく、家庭、学校、メディア、政治制度の中で繰り返し解釈されることにも依存しているからです。'),
      s('When these mechanisms weaken, the past becomes a collection of isolated facts rather than a resource for judgment.', 'これらの仕組みが弱まると、過去は判断のための資源ではなく、孤立した事実の集まりになります。'),
      p('This problem has become more urgent in the digital age.', 'この問題はデジタル時代においてより差し迫ったものになっています。'),
      s('It is now possible to store enormous amounts of information at little cost, and many people therefore believe that forgetting has become less likely.', '現在では膨大な量の情報をわずかな費用で保存できるため、多くの人は忘却が起こりにくくなったと考えています。'),
      s('In practice, however, abundance can produce a different kind of loss.', 'しかし実際には、豊富さは別の種類の喪失を生み出すことがあります。'),
      s('When search results, short videos, and algorithmic recommendations compete for attention, materials that require slow reading or moral reflection may become almost invisible.', '検索結果、短い動画、アルゴリズムによる推薦が注意を奪い合うと、ゆっくり読むことや道徳的考察を必要とする資料はほとんど見えなくなるかもしれません。'),
      s('The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.', 'そのとき公共的記憶の完全性は、何が入手可能かよりも、何が繰り返し関連あるものとして提示されるかによって形づくられます。'),
      s('Digital records also depend on technical systems whose apparent permanence can be misleading.', 'デジタル記録は技術的な仕組みにも依存しており、その見かけ上の永続性は誤解を招くことがあります。'),
      s('A file may still exist but become unreadable when software changes, while a searchable collection can effectively disappear if its indexing system is neglected.', 'ファイルが残っていてもソフトウェアが変われば読めなくなることがあり、検索可能な資料群も索引の仕組みが放置されれば実質的に消えてしまいます。'),
      s('More subtly, platforms can revise the categories and rankings through which users encounter material without deleting a single record.', 'さらに見えにくい形では、プラットフォームは記録を一つも削除せずに、利用者が資料と出会う際の分類や順位を変更できます。'),
      s('Preservation, therefore, is not merely the retention of data; it includes maintaining the pathways that make data intelligible and discoverable.', 'したがって保存とは、単にデータを保持することではなく、データを理解可能で発見可能にする経路を維持することも含みます。'),
      p('This raises a difficult question about institutional responsibility.', 'これは制度的責任に関する難しい問いを提起します。'),
      s('Libraries, museums, universities, and news organizations have traditionally claimed a degree of autonomy so that they can protect records from temporary political pressure.', '図書館、博物館、大学、報道機関は伝統的に、記録を一時的な政治的圧力から守るために一定の自律性を主張してきました。'),
      s('That autonomy remains essential, but it can also be misused if institutions avoid scrutiny by describing all criticism as interference.', 'その自律性は依然として不可欠ですが、制度がすべての批判を干渉だと表現して検証を避けるなら、悪用される可能性もあります。'),
      s('A healthy culture of memory therefore requires both independence and accountability.', 'したがって健全な記憶の文化には、独立性と説明責任の両方が必要です。'),
      s('Institutions must be free to preserve uncomfortable evidence, while citizens must be able to ask how decisions about selection, description, and access are made.', '制度は不都合な証拠を自由に保存できなければなりませんが、市民は選択、記述、アクセスに関する決定がどのようになされるのかを問える必要があります。'),
      s('Calls for complete neutrality do not resolve the problem, since every archive must decide what to collect, how to describe it, and which materials receive scarce conservation resources.', '完全な中立性を求めても問題は解決しません。どの記録保管所も、何を収集し、どう記述し、限られた保存資源をどの資料に与えるかを決めなければならないからです。'),
      s('Nor does greater participation automatically guarantee fairness.', '参加を増やせば自動的に公平さが保証されるわけでもありません。'),
      s('A public consultation may reproduce existing inequalities if organized groups can speak more loudly than communities with less time, money, or trust in institutions.', '組織化された集団が、時間や資金、制度への信頼が乏しい共同体より大きな声を上げられるなら、公開協議は既存の不平等を再生産しかねません。'),
      s('Accountability must consequently include transparent reasons, opportunities for challenge, and continuing efforts to hear people who were absent from the original decision.', 'そのため説明責任には、透明な理由、異議を申し立てる機会、最初の決定に参加できなかった人々の声を聞き続ける努力が含まれなければなりません。'),
      p('Such debates are rarely simple because historical meaning is often ambiguous.', '歴史的意味はしばしば曖昧であるため、そのような議論はめったに単純ではありません。'),
      s('A photograph may reveal suffering to one group and national achievement to another; a monument may be seen as heritage by some and as exclusion by others.', '一枚の写真がある集団には苦しみを示し、別の集団には国家的達成を示すかもしれません。記念碑はある人々には遺産と見なされ、別の人々には排除と見なされるかもしれません。'),
      s('The aim should not be to force a single consensus that erases conflict.', '目標は、対立を消し去る単一の合意を強制することであってはなりません。'),
      s('Rather, a mature society keeps multiple perspectives in conversation while refusing to treat evidence as optional.', 'むしろ成熟した社会は、証拠を任意のものとして扱うことを拒みながら、複数の視点を対話の中に保ちます。'),
      p('Education plays a central role in sustaining that discipline, but the task is more demanding than adding a few historical dates to a curriculum.', '教育はその規律を維持する上で中心的な役割を果たしますが、その課題はカリキュラムにいくつかの歴史的な日付を加えるよりもはるかに難しいものです。'),
      s('Students must learn how narratives are constructed, why certain voices were ignored, and how apparently neutral categories can reflect older relations of power.', '生徒は、物語がどのように構成されるのか、なぜ特定の声が無視されたのか、そして一見中立的な分類がどのように古い権力関係を反映しうるのかを学ばなければなりません。'),
      s('Comparing conflicting accounts can help students see that disagreement is not the same as ignorance.', '対立する説明を比較することで、生徒は意見の相違が無知と同じではないと理解できます。'),
      s('Two historians may accept the same evidence yet assign different significance to it because they ask different questions.', '二人の歴史家が同じ証拠を受け入れながら、異なる問いを立てるために別の重要性を与えることもあります。'),
      s('The discipline lies in explaining those choices, confronting contrary evidence, and stating where certainty ends.', '重要なのは、その選択を説明し、反対の証拠と向き合い、確実性がどこで終わるかを示す規律です。'),
      s('At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.', '同時に、懐疑が冷笑へと変わるのを防ぐ知的習慣も必要です。'),
      s('If every account of the past is dismissed as merely political, citizens lose the capacity to distinguish careful revision from deliberate distortion.', '過去についてのすべての説明が単なる政治的なものとして退けられるなら、市民は慎重な見直しと意図的な歪曲を区別する能力を失います。'),
      p('Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation.', 'デジタルプラットフォームは、粘り強い調査よりも速さ、感情的な確信、集団への忠誠を報いやすいため、この危険を強めます。'),
      s('A rumor that confirms a community\'s self-image may travel farther than a well-documented study that complicates it.', '共同体の自己イメージを裏づけるうわさは、それを複雑にする十分に文書化された研究より遠くまで広がるかもしれません。'),
      p('Some observers respond by demanding that platforms remove misleading historical claims more aggressively.', 'これに対し、プラットフォームが誤解を招く歴史的主張をもっと積極的に削除すべきだと求める人々もいます。'),
      s('Although such action can limit obvious fabrications, it also gives private companies substantial authority over public memory.', 'そのような行動は明らかな捏造を抑えられる一方で、民間企業に公共的記憶への大きな権限を与えます。'),
      s('The alternative is not to abandon moderation, but to combine it with accessible evidence, independent review, and explanations that users can examine rather than merely obey.', '代案は管理を放棄することではなく、利用者がただ従うのではなく検討できる、入手しやすい証拠、独立した審査、説明と組み合わせることです。'),
      s('A warning label without a visible chain of reasoning may suppress circulation while doing little to strengthen citizens\' judgment.', '根拠の流れが見えない警告表示は、情報の流通を抑えても、市民の判断力をほとんど強めないかもしれません。'),
      p('For this reason, public memory cannot be protected by experts alone.', 'このため、公共的記憶は専門家だけで守ることはできません。'),
      s('It also requires citizens who are willing to read beyond headlines, tolerate uncertainty, and revise their views when stronger evidence appears.', '見出しを越えて読み、不確実性に耐え、より強い証拠が現れたときに自分の見解を修正する意思のある市民も必要です。'),
      s('This civic dimension explains why collective memory cannot be measured only by the number of documents preserved or people reached.', 'この市民的な側面により、集合的記憶は保存された文書数や情報が届いた人数だけでは測れないことが分かります。'),
      s('Its quality depends on whether a society can use records to question comfortable stories, recognize obligations, and deliberate about future choices.', 'その質は、社会が記録を使って都合のよい物語を問い、義務を認識し、将来の選択を熟議できるかどうかにかかっています。'),
      p('Remembering, in this sense, is not a passive act of storage but an active practice of civic discipline.', 'この意味で記憶することは、保存という受動的行為ではなく、市民的規律の能動的実践です。'),
      s('If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.', 'その実践が衰えれば、完璧な記録保管所でさえ、社会がかつて知っていたことから学ぶ能力を失うのを防げないでしょう。'),
    ],
  },
]

const CORE_PASSAGE_META = {
  p_5_lost_notebook: {
    theme: '学校生活・身近な物語',
    examFocus: ['人物と持ち物', '出来事の順序', '理由'],
  },
  p_4_library_event: {
    theme: '公共施設・地域の歴史',
    examFocus: ['日時と条件', '行動の順序', '要旨'],
  },
  p_3_school_garden: {
    theme: '環境・地域交流',
    examFocus: ['課題と解決策', '因果関係', '学んだこと'],
  },
  p_pre2_museum_volunteers: {
    theme: '文化・ボランティア',
    examFocus: ['具体例', '複数の利点', '要旨'],
  },
  p_pre2plus_repair_cafes: {
    theme: '持続可能な消費',
    examFocus: ['仕組みの説明', '利点と限界', '筆者の結論'],
  },
  p_2_quiet_technology: {
    theme: '技術・公共空間',
    examFocus: ['具体例の機能', '利点と懸念', '筆者の提案'],
  },
  p_pre1_resilient_cities: {
    theme: '気候変動・都市政策',
    examFocus: ['複数要因の整理', '公平性', '条件付き結論'],
  },
  p_1_collective_memory: {
    theme: '歴史認識・公共制度',
    examFocus: ['抽象概念', '反論への応答', '筆者の主張'],
  },
}

export const PASSAGES = [
  ...CORE_PASSAGES.map((passage) => ({
    ...passage,
    ...CORE_PASSAGE_META[passage.id],
  })),
  ...EXAM_PASSAGES,
]

const PROPER_NAME_GLOSSES = [
  { test: /\bRina\b/, words: { rina: 'リナ（人名）' } },
  { test: /\bKen\b/, words: { ken: 'ケン（人名）' } },
  {
    test: /\bGreen Town Library\b/,
    words: {
      green: 'グリーン（施設名の一部）',
      town: 'タウン（施設名の一部）',
    },
  },
  { test: /\bMs\. Brown\b/, words: { brown: 'ブラウン（人名）' } },
  { test: /\bMaple Junior High\b/, words: { maple: 'メープル（校名の一部）' } },
]

for (const passage of PASSAGES) {
  for (const sentence of passage.sentences) {
    for (const entry of PROPER_NAME_GLOSSES) {
      if (!entry.test.test(sentence.en)) continue
      for (const [key, ja] of Object.entries(entry.words)) {
        sentence.gloss[key] = { ja, proper: true }
      }
    }
  }
}

export const PASSAGES_BY_ID = Object.fromEntries(PASSAGES.map((p) => [p.id, p]))
export const getPassage = (id) => PASSAGES_BY_ID[id]
export const passagesByLevel = (levelId) => PASSAGES.filter((p) => p.level === levelId)
