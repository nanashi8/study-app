// 基礎長文・4級の構造台帳（本文の順に1文ずつ）。書き方は entry.js と長文の構造台帳を見る。
import { bs } from './entry.js'

export const BASIC_READING_STRUCTURES_4 = Object.freeze({
  br4_autumn_event: Object.freeze([
    bs('[独 Autumn Event {前| at Minami Junior High School}]', {
      fragment: true,
      chunks: [
        ['Autumn Event', '秋のイベント'],
        ['at Minami Junior High School', '南中学校の'],
      ],
      notes: {
        'Autumn Event': '動詞のない見出しです。題名と形から、学校行事の案内文だと見当をつけます。',
      },
      rules: ['purpose-first'],
    }),
    bs('[S Our school] [V will have] [O a special event {前| for {並列| students, | families, | and neighbors}}].', {
      chunks: [
        ['Our school will have', '本校は行います'],
        ['a special event', '特別なイベントを'],
        ['for students, families, and neighbors.', '生徒・家族・近所の方々のための'],
      ],
    }),
    bs('[独 Date]: [独 Saturday, October 18]', {
      fragment: true,
      chunks: [
        ['Date:', '日にち'],
        ['Saturday, October 18', '10月18日の土曜日'],
      ],
      marks: [[':', '「日にち」という項目名のあとに、その中身（10月18日の土曜日）を示します。']],
    }),
    bs('[独 Time]: [独 9:30 {前| to 15:00}]', {
      fragment: true,
      chunks: [
        ['Time:', '時間'],
        ['9:30 to 15:00', '9時30分から15時まで'],
      ],
      marks: [
        [':', '「時間」という項目名のあとに、その中身（9時30分から15時まで）を示します。'],
        [':', '時刻の「時」と「分」を区切る記号で、9:30 は9時30分です。'],
        [':', '時刻の「時」と「分」を区切る記号で、15:00 は15時ちょうどです。'],
      ],
    }),
    bs('[独 Place]: [独 {並列| the gym | and the music room}]', {
      fragment: true,
      chunks: [
        ['Place:', '場所'],
        ['the gym and the music room', '体育館と音楽室'],
      ],
      marks: [[':', '「場所」という項目名のあとに、その中身（体育館と音楽室）を示します。']],
    }),
    bs('[M There] [V are] [S three main programs: {同格>three main programs| {並列| a singing contest, | a science show, | and a cafe}}].', {
      chunks: [
        ['There are three main programs:', 'おもなプログラムが三つあります'],
        ['a singing contest,', '歌のコンテスト'],
        ['a science show, and a cafe.', '科学ショー、そしてカフェです'],
      ],
      marks: [[':', '前の「おもなプログラムは三つ」の中身を、コロンの後ろで具体的に挙げます。']],
      rules: ['punctuation-map'],
    }),
    bs('[S The singing contest] [V starts] [M {前| at 10:00}] [M {前| in the gym}].', {
      chunks: [
        ['The singing contest starts', '歌のコンテストは始まります'],
        ['at 10:00', '10時に'],
        ['in the gym.', '体育館で'],
      ],
      marks: [[':', '時刻の「時」と「分」を区切る記号で、10:00 は10時ちょうどです。']],
    }),
    bs('[M {前| At the cafe}], [S the cooking club] [V sells] [O {並列| cookies | and juice}] [M {前| for 100 yen each}].', {
      chunks: [
        ['At the cafe,', 'カフェでは'],
        ['the cooking club sells', '料理部が売ります'],
        ['cookies and juice', 'クッキーとジュースを'],
        ['for 100 yen each.', '1つ100円で'],
      ],
    }),
    bs('[M Please] [V do not] [V {並列| eat | or drink}] [M {前| in the music room}].', {
      chunks: [
        ['Please do not eat or drink', '飲んだり食べたりしないでください'],
        ['in the music room.', '音楽室では'],
      ],
      notes: {
        'Please do not eat or drink': 'Please do not＋動詞の原形で、ていねいに禁止を伝えます。案内文の条件の一つです。',
      },
    }),
    bs('[M {副詞節:条件| [接 If] [S you] [V want] [O {to:名詞| [V to see] [O the science show]}]}], [M please] [V get] [O a ticket] [M {前| at the entrance}] [M {前| before 11:00}].', {
      chunks: [
        ['If you want to see', 'もし見たいなら'],
        ['the science show,', '科学ショーを'],
        ['please get a ticket', '券を受け取ってください'],
        ['at the entrance', '入口で'],
        ['before 11:00.', '11時より前に'],
      ],
      notes: {
        'If you want to see': '条件を表す if の節で始まる文は、設問の根拠になりやすいので、ペースを落として読みます。',
      },
      marks: [[':', '時刻の「時」と「分」を区切る記号で、11:00 は11時ちょうどです。']],
      rules: ['reading-mode'],
    }),
    bs('[S We] [V hope] [O {to:名詞| [V to see] [O you] [M there]}]!', {
      chunks: [
        ['We hope to see you there!', '会場でお会いできるのを楽しみにしています'],
      ],
    }),
  ]),
  br4_new_captain: Object.freeze([
    bs('[S Riku] [V is] [C a member {前| of the tennis club {前| at his junior high school}}].', {
      chunks: [
        ['Riku is a member', 'リクは部員です'],
        ['of the tennis club', 'テニス部の'],
        ['at his junior high school.', '自分の中学校の'],
      ],
    }),
    bs('[M Last month], [S the teacher] [V chose] [O him] [M {前| as the new captain}].', {
      chunks: [
        ['Last month,', '先月'],
        ['the teacher chose him', '先生はリクを選びました'],
        ['as the new captain.', '新しいキャプテンとして'],
      ],
    }),
    bs('[S Riku] [V was] [C surprised] [M {副詞節:理由| [接 because] [S he] [V was not] [C the best player {前| on the team}]}].', {
      chunks: [
        ['Riku was surprised', 'リクは驚きました'],
        ['because he was not', 'なぜなら、リクは〜ではなかったからです'],
        ['the best player on the team.', 'チームでいちばんうまい選手'],
      ],
    }),
    bs('[M {前| At first}], [S Riku] [V tried] [M hard] [M {to:副詞(目的)| [V to be] [C a good leader]}], [接 but] [S the other members] [V did not listen] [M {前| to him}].', {
      chunks: [
        ['At first,', '最初は'],
        ['Riku tried hard', 'リクは一生けんめい努力しました'],
        ['to be a good leader,', 'よいリーダーになるために'],
        ['but the other members', 'しかし、ほかの部員は'],
        ['did not listen to him.', 'リクの言うことを聞きませんでした'],
      ],
      notes: {
        'did not listen to him.': 'あとの「みんなが信頼している」と食い違うように見えたら、時を表す語（At first・After that）を見直します。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[S He] [V felt] [C lonely].', {
      chunks: [
        ['He felt lonely.', 'リクはさびしく思いました'],
      ],
    }),
    bs('[M One day], [S he] [V saw] [O a first-year student] [C {現在分詞:補語| [V hitting] [O balls]}] [M {副詞節:時| [接 after] [S everyone] [V went] [M home]}].', {
      chunks: [
        ['One day,', 'ある日'],
        ['he saw a first-year student', 'リクは1年生を見ました'],
        ['hitting balls', 'ボールを打っているのを'],
        ['after everyone went home.', 'みんなが帰ったあとで'],
      ],
      notes: {
        'hitting balls': 'hitting の前に be 動詞がないので進行形ではありません。saw の目的語 a first-year student の様子を説明しています。',
      },
      rules: ['ing-ed-role'],
    }),
    bs('[S Riku] [V helped] [O him] [M {前| with his swing}] [M {前| for an hour}].', {
      chunks: [
        ['Riku helped him', 'リクはその生徒を手伝いました'],
        ['with his swing', 'スイングのことで'],
        ['for an hour.', '1時間'],
      ],
    }),
    bs('[M {前| After that}], [S many members] [V started] [O {to:名詞| [V to come] [M {前| to Riku}] [M {前| with questions}]}].', {
      chunks: [
        ['After that,', 'そのあと'],
        ['many members started to come', '多くの部員が来るようになりました'],
        ['to Riku', 'リクのところへ'],
        ['with questions.', '質問を持って'],
      ],
      notes: {
        'After that,': '前の文の「1年生を手伝った」出来事を受けて、部員の様子が変わったことを示す合図です。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[S Riku] [V is] [M still] [M not] [C the strongest player], [接 but] [M now] [S everyone {前| on the team}] [V trusts] [O him].', {
      chunks: [
        ['Riku is still not', 'リクは今でも〜ではありません'],
        ['the strongest player,', 'いちばん強い選手'],
        ['but now everyone on the team', 'しかし今では、チームのみんなが'],
        ['trusts him.', 'リクを信頼しています'],
      ],
      notes: {
        'but now everyone on the team': 'but の前の「強くない」より、後ろの「みんなが信頼している」が、書き手が重く見る内容です。',
      },
      rules: ['contrast-concession'],
    }),
  ]),
  br4_himeji_trip: Object.freeze([
    bs('[M Last summer], [S {並列| Yuki | and her family}] [V took] [O a trip] [M {前| to Himeji}].', {
      chunks: [
        ['Last summer,', '去年の夏'],
        ['Yuki and her family', 'ユキと家族は'],
        ['took a trip to Himeji.', '姫路へ旅行しました'],
      ],
      notes: {
        'Last summer,': '時を表す語句から始まり、人物が出てくるので、物語だと分かります。物語では気持ちの変化を追います。',
      },
      rules: ['genre-prediction'],
    }),
    bs('[S They] [V wanted] [O {to:名詞| [V to see] [O Himeji Castle, {同格>Himeji Castle| a famous castle {前| with a long history}}]}].', {
      chunks: [
        ['They wanted to see', '一家は見たいと思っていました'],
        ['Himeji Castle,', '姫路城を'],
        ['a famous castle', 'つまり有名な城で'],
        ['with a long history.', '長い歴史を持つ'],
      ],
    }),
    bs('[M {前| On the first day}], [S it] [V rained] [M hard], [接 so] [S they] [V could not go] [M outside].', {
      chunks: [
        ['On the first day,', '1日目は'],
        ['it rained hard,', '雨が強く降りました'],
        ['so they could not go outside.', 'だから一家は外に出られませんでした'],
      ],
      notes: {
        'so they could not go outside.': 'so の前の「雨が強く降った」が原因、後ろが結果です。',
      },
      rules: ['cause-result', 'genre-prediction'],
    }),
    bs('[S They] [V stayed] [M {前| at the hotel}] [接 and] [V played] [O cards].', {
      chunks: [
        ['They stayed at the hotel', '一家はホテルにいました'],
        ['and played cards.', 'そしてトランプをしました'],
      ],
    }),
    bs('[S Yuki] [V was] [C bored], [接 but] [S her grandfather] [V told] [O1 her] [O2 old stories {前| about {並列| the lord {前| of the castle} | and his soldiers}}].', {
      chunks: [
        ['Yuki was bored,', 'ユキは退屈していました'],
        ['but her grandfather told her', 'しかし祖父がユキに話してくれました'],
        ['old stories', '昔の話を'],
        ['about the lord of the castle', '城の殿様についての'],
        ['and his soldiers.', 'そして家来についての'],
      ],
      notes: {
        'but her grandfather told her': 'tell＋人＋もので「人にものを話す」。her が間接目的語、old stories が直接目的語です。',
      },
    }),
    bs('[S They] [V were] [C very interesting], [接 and] [S Yuki] [V wanted] [O {to:名詞| [V to visit] [O it]}] [M more] [M {前| than before}].', {
      chunks: [
        ['They were very interesting,', 'その話はとてもおもしろかったです'],
        ['and Yuki wanted to visit it', 'そしてユキはそこを訪れたくなりました'],
        ['more than before.', '前よりももっと'],
      ],
      notes: {
        'They were very interesting,': 'They は前の文の複数の名詞のうち、意味が通る old stories を指します。',
        'and Yuki wanted to visit it': 'it は単数で、訪れる場所なので the castle を指します。',
      },
      rules: ['reference-chain'],
    }),
    bs('[S The next day] [V was] [C sunny].', {
      chunks: [
        ['The next day was sunny.', '次の日は晴れました'],
      ],
    }),
    bs('[M {副詞節:時| [接 When] [S they] [V arrived] [M {前| at the castle}]}], [S Yuki] [V thought] [M {前| about the people {関係>the people| [S who] [V lived] [M there] [M four hundred years ago]}}].', {
      chunks: [
        ['When they arrived', '一家が着いたとき'],
        ['at the castle,', '城に'],
        ['Yuki thought about the people', 'ユキは人々のことを思いました'],
        ['who lived there', 'そこに住んでいた'],
        ['four hundred years ago.', '400年前に'],
      ],
    }),
    bs('[S It] [V was] [C the best trip {前| of her life}].', {
      chunks: [
        ['It was the best trip', 'それはいちばんの旅行でした'],
        ['of her life.', 'ユキの人生で'],
      ],
    }),
  ]),
  br4_email_emma: Object.freeze([
    bs('[独 Hi Sora],', {
      fragment: true,
      chunks: [
        ['Hi Sora,', 'ソラへ'],
      ],
      notes: {
        'Hi Sora,': 'Eメールの書き出しの呼びかけで、動詞のない語句です。',
      },
    }),
    bs('[V Thank] [O you] [M {前| for {並列| your e-mail | and the photos {前| of your school}}}].', {
      chunks: [
        ['Thank you', 'ありがとう'],
        ['for your e-mail', '電子メールを'],
        ['and the photos of your school.', 'そして学校の写真を'],
      ],
    }),
    bs('[S I] [V was] [C surprised] [M {that節| [接 that] [S students {前| in Japan}] [V clean] [O their own classrooms]}].', {
      chunks: [
        ['I was surprised', 'わたしは驚きました'],
        ['that students in Japan', '日本の生徒が'],
        ['clean their own classrooms.', '自分たちの教室をそうじすることに'],
      ],
      notes: {
        'that students in Japan': 'that の後ろが主語と動詞のそろった文なので「〜ということ」の節で、驚いた中身を表します。',
      },
      rules: ['that-diagnosis'],
    }),
    bs('[M {前| In my school {前| in Australia}}], [S workers] [V do] [O that] [M {前| after school}].', {
      chunks: [
        ['In my school in Australia,', 'オーストラリアのわたしの学校では'],
        ['workers do that', '職員の人がそれをします'],
        ['after school.', '放課後に'],
      ],
      notes: {
        'workers do that': 'that は前の文の「教室をそうじすること」を指します。',
      },
    }),
    bs('[M Next month], [S I] [V will visit] [O Japan] [M {前| with my parents}].', {
      chunks: [
        ['Next month,', '来月'],
        ['I will visit Japan', 'わたしは日本を訪れます'],
        ['with my parents.', '両親といっしょに'],
      ],
    }),
    bs('[S We] [V will stay] [M {前| in Osaka}] [M {前| for a week}], [接 and] [S I] [V want] [O {to:名詞| [V to know] [O {疑問詞節| [O what] [S I] [V should see] [M there]}]}].', {
      chunks: [
        ['We will stay in Osaka', 'わたしたちは大阪に滞在します'],
        ['for a week,', '1週間'],
        ['and I want to know', 'そして、わたしは知りたいです'],
        ['what I should see there.', 'そこで何を見ればよいかを'],
      ],
      notes: {
        'what I should see there.': 'what から there までがひとかたまりの名詞で、know の目的語です。中は I should see のふつうの語順です。',
      },
      rules: ['wh-clause'],
    }),
    bs('[V Could] [S you] [V tell] [O1 me] [O2 {疑問詞節| [M how] [S I] [V can get] [M {前| to your town}] [M {前| from Osaka}]}]?', {
      chunks: [
        ['Could you tell me', '教えてくれませんか'],
        ['how I can get to your town', 'どうやってあなたの町へ行けるかを'],
        ['from Osaka?', '大阪から'],
      ],
      notes: {
        'Could you tell me': 'Could you …? はていねいなお願いです。エマがソラに頼んでいることの根拠になる文です。',
      },
      rules: ['evidence-backtrack', 'wh-clause'],
    }),
    bs('[S I] [V would] [M also] [V like] [O {to:名詞| [V to try] [O the food {前| of your town}]}].', {
      chunks: [
        ['I would also like to try', 'わたしは食べてみたくもあります'],
        ['the food of your town.', 'あなたの町の食べ物を'],
      ],
      notes: {
        'I would also like to try': 'would like to do で「〜したい」。want to より、ていねいな言い方です。',
      },
    }),
    bs('[M Please] [V write] [M back] [M soon].', {
      chunks: [
        ['Please write back soon.', 'すぐに返事をください'],
      ],
    }),
    bs('[独 Your friend, Emma]', {
      fragment: true,
      chunks: [
        ['Your friend, Emma', 'あなたの友達、エマより'],
      ],
    }),
  ]),
  br4_birthday_cake: Object.freeze([
    bs("[S Next Sunday] [V is] [C Dad's birthday], [接 so] [S {並列| Haruto | and his sister Mei}] [V planned] [O {to:名詞| [V to make] [O a cake] [M {前| for him}]}].", {
      chunks: [
        ["Next Sunday is Dad's birthday,", '次の日曜日はお父さんの誕生日です'],
        ['so Haruto and his sister Mei', 'だからハルトと妹のメイは'],
        ['planned to make a cake', 'ケーキを作ることにしました'],
        ['for him.', 'お父さんのために'],
      ],
    }),
    bs('[S Haruto] [V has] [M never] [V made] [O a cake] [M before].', {
      chunks: [
        ['Haruto has never made a cake', 'ハルトはケーキを作ったことがありません'],
        ['before.', '今までに'],
      ],
      notes: {
        'Haruto has never made a cake': 'have never＋過去分詞で「一度も〜したことがない」（経験の現在完了）です。',
      },
    }),
    bs('[S They] [V found] [O a recipe] [M {前| in a cooking magazine}].', {
      chunks: [
        ['They found a recipe', '二人は作り方を見つけました'],
        ['in a cooking magazine.', '料理雑誌で'],
      ],
    }),
    bs('[S They] [V went] [M {前| to the supermarket}] [M {to:副詞(目的)| [V to buy] [O {並列| eggs, | sugar, | and strawberries}]}].', {
      chunks: [
        ['They went to the supermarket', '二人はスーパーマーケットへ行きました'],
        ['to buy', '買うために'],
        ['eggs, sugar, and strawberries.', '卵と砂糖といちごを'],
      ],
      notes: {
        'to buy': 'They went to the supermarket で文が完成しているので、to buy は「買うために」と目的を表します。',
      },
      rules: ['infinitive-role'],
    }),
    bs('[M {前| At home}], [S they] [V mixed] [O {並列| the eggs, | sugar, | and butter}] [M well] [接 and] [V cooked] [O the cake] [M {前| for forty minutes}].', {
      chunks: [
        ['At home,', '家で'],
        ['they mixed the eggs, sugar, and butter', '二人は卵と砂糖とバターを混ぜました'],
        ['well', 'よく'],
        ['and cooked the cake', 'そしてケーキを焼きました'],
        ['for forty minutes.', '40分間'],
      ],
    }),
    bs('[S The strawberries {前| on the cake}] [V were chosen] [M {前| by Mei}].', {
      chunks: [
        ['The strawberries on the cake', 'ケーキの上のいちごは'],
        ['were chosen', '選ばれました'],
        ['by Mei.', 'メイによって'],
      ],
      notes: {
        'were chosen': 'be＋過去分詞の受け身です。by Mei を主語にすると「メイがいちごを選んだ」となります。',
      },
      rules: ['passive-active'],
    }),
    bs('[M {副詞節:時| [接 When] [S Dad] [V came] [M home] [接 and] [V saw] [O the cake] [M {前| on the table}]}], [S he] [V smiled] [接 and] [V thanked] [O them].', {
      chunks: [
        ['When Dad came home', 'お父さんが帰ってきて'],
        ['and saw the cake', 'そしてケーキを見たとき'],
        ['on the table,', 'テーブルの上の'],
        ['he smiled', 'お父さんはにっこりしました'],
        ['and thanked them.', 'そして二人にお礼を言いました'],
      ],
      notes: {
        'When Dad came home': '動詞は came・saw・smiled・thanked の四つですが、When の節と he で始まる節の二つに分かれます。',
      },
      rules: ['finite-verb-check'],
    }),
    bs('[S He] [V said], [O {引用| "[S This] [V is] [C the best cake {前| in the world}]!"}]', {
      chunks: [
        ['He said,', 'お父さんは言いました'],
        ['"This is the best cake', 'これはいちばんのケーキだ'],
        ['in the world!"', '世界で'],
      ],
    }),
  ]),
  br4_reading_club: Object.freeze([
    bs('[独 Summer Reading Club {前| at Green City Library}]', {
      fragment: true,
      chunks: [
        ['Summer Reading Club', '夏の読書クラブ'],
        ['at Green City Library', 'グリーン市立図書館の'],
      ],
    }),
    bs('[V Do] [S you] [V like] [O books]?', {
      chunks: [
        ['Do you like books?', '本は好きですか'],
      ],
    }),
    bs('[V Join] [O our Summer Reading Club] [M this year]!', {
      chunks: [
        ['Join our Summer Reading Club', '夏の読書クラブに入りましょう'],
        ['this year!', '今年は'],
      ],
    }),
    bs('[S The club] [V is] [M {前| for students {前| from 10} {前| to 15 years old}}].', {
      chunks: [
        ['The club is for students', 'クラブは生徒が対象です'],
        ['from 10 to 15 years old.', '10歳から15歳の'],
      ],
    }),
    bs('[S Members] [V can borrow] [O ten books] [M {前| at a time}].', {
      chunks: [
        ['Members can borrow ten books', '会員は10冊の本を借りられます'],
        ['at a time.', '一度に'],
      ],
    }),
    bs('[S They] [V can] [M also] [V join] [O a book talk] [M every Friday afternoon].', {
      chunks: [
        ['They can also join a book talk', '会員は本について話す会にも参加できます'],
        ['every Friday afternoon.', '毎週金曜日の午後に'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S you] [V read] [O twenty books] [M {前| during the summer}]}], [S you] [V will get] [O a special prize].', {
      chunks: [
        ['If you read twenty books', 'もし20冊の本を読めば'],
        ['during the summer,', '夏の間に'],
        ['you will get a special prize.', '特別な賞品がもらえます'],
      ],
      rules: ['distractor-strength'],
    }),
    bs('[M Not] [S every book {前| in the library}] [V can be borrowed].', {
      chunks: [
        ['Not every book in the library', '図書館のすべての本が〜というわけではありません'],
        ['can be borrowed.', '借りられる'],
      ],
      notes: {
        'Not every book in the library': 'Not every は「すべてが〜というわけではない」という部分否定です。借りられない本もある、という意味です。',
      },
      rules: ['negation-scope'],
    }),
    bs('[S New magazines] [V must stay] [M {前| in the library}].', {
      chunks: [
        ['New magazines must stay', '新しい雑誌は置いておかなければなりません'],
        ['in the library.', '図書館の中に'],
      ],
    }),
    bs('[S The reading room {前| on the second floor}] [V is] [C open] [M {前| from Tuesday} {前| to Sunday}].', {
      chunks: [
        ['The reading room', '閲覧室は'],
        ['on the second floor', '2階の'],
        ['is open', '開いています'],
        ['from Tuesday to Sunday.', '火曜日から日曜日まで'],
      ],
      notes: {
        'The reading room': 'The を目印に読み進めると、中心の名詞は room です。後ろの on the second floor が説明を足しています。',
      },
      rules: ['noun-boundary'],
    }),
    bs('[M {to:副詞(目的)| [V To join] [O the club]}], [M please] [V come] [M {前| to the front desk}] [M {前| with one {前| of your parents}}].', {
      chunks: [
        ['To join the club,', 'クラブに入るには'],
        ['please come to the front desk', '受付へ来てください'],
        ['with one of your parents.', '保護者の方のどちらかといっしょに'],
      ],
    }),
  ]),
  br4_piano: Object.freeze([
    bs('[S Kaito] [V started] [O {動名詞| [V taking] [O piano lessons]}] [M {副詞節:時| [接 when] [S he] [V was] [C eight]}].', {
      chunks: [
        ['Kaito started taking piano lessons', 'カイトはピアノのレッスンを受け始めました'],
        ['when he was eight.', '8歳のときに'],
      ],
    }),
    bs('[S His teacher] [V was] [C an old woman {関係>an old woman| [S who] [V lived] [M next door]}].', {
      chunks: [
        ['His teacher was an old woman', 'カイトの先生はおばあさんでした'],
        ['who lived next door.', 'となりに住んでいる'],
      ],
      notes: {
        'who lived next door.': 'who の直前の an old woman が先行詞です。節の中で主語が欠けていて、その主語がおばあさんです。',
      },
      rules: ['relative-clause'],
    }),
    bs('[S She] [V was] [C kind], [接 but] [S she] [V was] [M also] [C very serious {前| about music}].', {
      chunks: [
        ['She was kind,', '先生はやさしかったです'],
        ['but she was also very serious', 'しかし、とてもきびしくもありました'],
        ['about music.', '音楽については'],
      ],
    }),
    bs('[S The music {関係>The music| [O that] [S she] [V gave] [O him]}] [V was] [C difficult] [M {前| at first}].', {
      chunks: [
        ['The music', 'その曲は'],
        ['that she gave him', '先生がカイトにくれた'],
        ['was difficult at first.', '最初はむずかしかったです'],
      ],
      notes: {
        'that she gave him': 'that から him までを（ ）に入れると、The music … was difficult という骨組みが残ります。',
      },
      rules: ['main-clause-skeleton'],
    }),
    bs('[M Also], [S he] [V wanted] [O {to:名詞| [V to play] [O soccer] [M {前| with his friends}] [M {前| after school}]}].', {
      chunks: [
        ['Also,', 'それに'],
        ['he wanted to play soccer', 'カイトはサッカーをしたいと思っていました'],
        ['with his friends', '友達と'],
        ['after school.', '放課後に'],
      ],
      notes: {
        'Also,': 'Also は前の内容に、同じ向きの内容（ピアノが大変な理由）をもう一つ足す接続語です。',
      },
      rules: ['logic-connectors'],
    }),
    bs('[接 But] [S his teacher] [M always] [V said], [O {引用| "[V Play] [M a little] [M every day]."}]', {
      chunks: [
        ['But his teacher always said,', 'でも、先生はいつも言いました'],
        ['"Play a little every day."', '毎日少しずつひきなさい'],
      ],
    }),
    bs('[接 So] [S Kaito] [V played] [O the piano] [M {前| for twenty minutes}] [M every night].', {
      chunks: [
        ['So Kaito played the piano', 'そこでカイトはピアノをひきました'],
        ['for twenty minutes', '20分間'],
        ['every night.', '毎晩'],
      ],
    }),
    bs('[M Now] [S Kaito] [V is] [C fifteen], [接 and] [S he] [V plays] [O the piano] [M {前| at the school music event}] [M every year].', {
      chunks: [
        ['Now Kaito is fifteen,', '今カイトは15歳です'],
        ['and he plays the piano', 'そしてピアノをひいています'],
        ['at the school music event', '学校の音楽のイベントで'],
        ['every year.', '毎年'],
      ],
    }),
    bs('[S He] [V is] [C glad] [M {that節| [接 that] [S he] [V did not stop] [O his lessons]}].', {
      chunks: [
        ['He is glad', 'カイトはよかったと思っています'],
        ['that he did not stop his lessons.', 'レッスンをやめなかったことを'],
      ],
    }),
    bs('[M Someday], [S he] [V wants] [O {to:名詞| [V to become] [C a {並列| kind | but serious} teacher {前| like her}]}].', {
      chunks: [
        ['Someday,', 'いつか'],
        ['he wants to become', 'カイトはなりたいと思っています'],
        ['a kind but serious teacher', 'やさしくてきびしい先生に'],
        ['like her.', '先生のような'],
      ],
    }),
  ]),
  br4_helping_home: Object.freeze([
    bs('[S Many children {前| in Japan}] [V help] [O their families] [M {前| at home}].', {
      chunks: [
        ['Many children in Japan', '日本の多くの子どもは'],
        ['help their families', '家族の手伝いをしています'],
        ['at home.', '家で'],
      ],
    }),
    bs('[M {前| For example}], [S they] [V wash] [O the dishes], [V take out] [O the garbage], [接 or] [V clean] [O the bathroom].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['they wash the dishes,', '子どもたちは皿を洗います'],
        ['take out the garbage,', 'ごみを出します'],
        ['or clean the bathroom.', 'あるいはふろ場をそうじします'],
      ],
      notes: {
        'For example,': 'For example の後ろは、前の文の help their families at home の具体例です。',
      },
      rules: ['example-restatement'],
    }),
    bs('[S My classmate Nana] [V does] [O the shopping] [M {前| for her family}] [M every Saturday].', {
      chunks: [
        ['My classmate Nana', 'クラスメートのナナは'],
        ['does the shopping', '買い物をします'],
        ['for her family', '家族のために'],
        ['every Saturday.', '毎週土曜日に'],
      ],
    }),
    bs('[S She] [V carries] [O heavy bags] [M {前| from the supermarket}].', {
      chunks: [
        ['She carries heavy bags', 'ナナは重いふくろを運びます'],
        ['from the supermarket.', 'スーパーマーケットから'],
      ],
    }),
    bs('[S She] [V says] [O {that省略| [S the work] [V makes] [O her] [C tired]}].', {
      chunks: [
        ['She says', 'ナナは言います'],
        ['the work makes her tired.', 'その仕事は自分を疲れさせると'],
      ],
      notes: {
        'the work makes her tired.': 'make＋人＋状態で「人を〜の状態にする」。her が目的語、tired が補語です。',
      },
      rules: ['svoc-core'],
    }),
    bs('[接 But] [S she] [V is] [C proud {前| of it}], [M {副詞節:理由| [接 because] [S her parents] [V are] [C very busy]}].', {
      chunks: [
        ['But she is proud of it,', 'でも、ナナはそれをほこりに思っています'],
        ['because her parents are very busy.', 'なぜなら、両親がとても忙しいからです'],
      ],
    }),
    bs('[S {動名詞| [V Helping] [M {前| at home}]}] [V teaches] [O children] [C {並列| {to:名詞| [V to be] [C careful]} | and {to:名詞| [V to think] [M {前| about other people}]}}].', {
      chunks: [
        ['Helping at home', '家の手伝いは'],
        ['teaches children', '子どもに教えます'],
        ['to be careful', '注意深くなることを'],
        ['and to think about other people.', 'そしてほかの人のことを考えることを'],
      ],
      notes: {
        'and to think about other people.': 'and の後ろの to think と同じ形を前にさかのぼると、to be が見つかります。教えてくれる二つのことが並んでいます。',
      },
      rules: ['parallel-shape'],
    }),
    bs('[S It] [V is] [M also] [C a good way {to:形容詞>a good way| [V to learn] [O useful skills]}].', {
      chunks: [
        ['It is also a good way', 'それはよい方法でもあります'],
        ['to learn useful skills.', '役に立つ技術を身につける'],
      ],
    }),
    bs('[S Some children] [M also] [V cook] [O dinner] [M {前| for their families}].', {
      chunks: [
        ['Some children also cook dinner', '夕食を作る子どももいます'],
        ['for their families.', '家族のために'],
      ],
    }),
    bs('[接 So] [S children] [V should try] [O {to:名詞| [V to help] [M {前| at home}] [M a little] [M every day]}].', {
      chunks: [
        ['So children should try', 'だから子どもはやってみるとよいでしょう'],
        ['to help at home', '家の手伝いを'],
        ['a little every day.', '毎日少しずつ'],
      ],
    }),
  ]),
  br4_my_uncle: Object.freeze([
    bs('[S Many students] [V cannot answer] [O the question {同格>the question| {引用| "[O What] [V do] [S you] [V want] [O {to:名詞| [V to be]}]?"}}]', {
      chunks: [
        ['Many students cannot answer', '多くの生徒は答えられません'],
        ['the question', 'という質問に'],
        ['"What do you want to be?"', '何になりたいですか'],
      ],
      notes: {
        'the question': 'the question の中身を、引用符の中の文が言いかえています。',
      },
    }),
    bs('[S My uncle, {同格>My uncle| a pilot {前| at a big airport}},] [V says] [O {that省略| [S that] [V is] [C all right]}].', {
      chunks: [
        ['My uncle,', 'わたしのおじは'],
        ['a pilot at a big airport,', '大きな空港のパイロットである'],
        ['says that is all right.', 'それでかまわないと言います'],
      ],
      notes: {
        'a pilot at a big airport,': '二つのコンマにはさまれた補足で、My uncle を言いかえています。外すと My uncle says that is all right. が残ります。',
      },
      rules: ['insertion', 'author-stance'],
    }),
    bs('[M {副詞節:時| [接 When] [S he] [V was] [C a junior high school student]}], [S he] [V wanted] [O {to:名詞| [V to be] [C a baseball player]}].', {
      chunks: [
        ['When he was', 'おじが〜だったとき'],
        ['a junior high school student,', '中学生'],
        ['he wanted to be a baseball player.', '野球選手になりたいと思っていました'],
      ],
      notes: {
        'When he was': 'この段落は、おじの体験を時の順に語って、前の段落の「それでかまわない」を支える例の役割をしています。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[接 But] [S he] [V was not] [C good {前| at sports}], [接 so] [S he] [V gave up] [O that wish].', {
      chunks: [
        ['But he was not good at sports,', 'でも、おじはスポーツが得意ではありませんでした'],
        ['so he gave up that wish.', 'だからその望みをあきらめました'],
      ],
      notes: {
        'so he gave up that wish.': 'give up で「あきらめる」。that wish は前の文の「野球選手になりたいという望み」を指します。',
      },
    }),
    bs('[M {前| In high school}], [S he] [V visited] [O an airport] [M {前| on a school trip}] [接 and] [V became] [C interested {前| in airplanes}].', {
      chunks: [
        ['In high school,', '高校で'],
        ['he visited an airport', 'おじは空港を訪れました'],
        ['on a school trip', '修学旅行で'],
        ['and became interested in airplanes.', 'そして飛行機に興味を持ちました'],
      ],
    }),
    bs('[S I] [V think] [O {that省略| [S we] [V do not have to choose] [O our work] [M now]}].', {
      chunks: [
        ['I think', 'わたしは思います'],
        ['we do not have to choose our work', '仕事を選ばなくてもよいと'],
        ['now.', '今は'],
      ],
      notes: {
        'I think': 'I think から筆者自身の意見が始まります。前の段落のおじの意見と分けて読みます。',
      },
      rules: ['author-stance'],
    }),
    bs('[S We] [V should try] [O many things] [接 and] [V find] [O {what節| [O what] [S we] [M really] [V like]}].', {
      chunks: [
        ['We should try many things', 'わたしたちはいろいろなことをやってみるべきです'],
        ['and find what we really like.', 'そして本当に好きなものを見つけるべきです'],
      ],
      notes: {
        'We should try many things': 'should は「〜すべきだ」と、筆者の考えをやや強く伝えます。',
      },
      rules: ['author-stance'],
    }),
  ]),
  br4_elephants: Object.freeze([
    bs('[S Elephants] [V are] [C the largest animals {現在分詞>the largest animals| [V living] [M {前| on land}]}].', {
      chunks: [
        ['Elephants are the largest animals', 'ゾウはいちばん大きな動物です'],
        ['living on land.', '陸にすむ'],
      ],
      notes: {
        'living on land.': '名詞 the largest animals を後ろから「陸にすむ」と説明しています。',
      },
      rules: ['postmodifier'],
    }),
    bs('[S A big African elephant] [V is] [C heavier {前| than four cars}].', {
      chunks: [
        ['A big African elephant is heavier', '大きなアフリカゾウはより重いです'],
        ['than four cars.', '車4台よりも'],
      ],
      notes: {
        'A big African elephant is heavier': 'heavier than で比べています。比べているのはアフリカゾウと車4台、比べる点は重さです。',
      },
      rules: ['comparison-pairs'],
    }),
    bs('[S Elephants] [V use] [O their long noses, {過去分詞>their long noses| [V called] [C trunks]},] [M {前| in many ways}].', {
      chunks: [
        ['Elephants use their long noses,', 'ゾウは長い鼻を使います'],
        ['called trunks,', 'トランクと呼ばれる'],
        ['in many ways.', 'いろいろなやり方で'],
      ],
      notes: {
        'called trunks,': 'called は「〜と呼ばれる」。知らない語 trunks は、前の their long noses の言いかえだと推測できます。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[S They] [V pick up] [O food] [M {前| with their trunks}], [V drink] [O water] [M {前| with them}], [接 and] [V touch] [O their friends] [M {前| with them}].', {
      chunks: [
        ['They pick up food', 'ゾウは食べ物をつまみ上げます'],
        ['with their trunks,', '鼻で'],
        ['drink water with them,', 'それで水を飲みます'],
        ['and touch their friends with them.', 'そしてそれで仲間にふれます'],
      ],
      notes: {
        'drink water with them,': 'them は their trunks を指します。',
      },
    }),
    bs('[S Elephants] [V eat] [O a lot {前| of {並列| grass | and leaves}}] [M every day].', {
      chunks: [
        ['Elephants eat a lot of grass and leaves', 'ゾウはたくさんの草や葉を食べます'],
        ['every day.', '毎日'],
      ],
    }),
    bs('[S They] [V spend] [O sixteen hours] [M a day] [M {動名詞| [V eating]}].', {
      chunks: [
        ['They spend sixteen hours', 'ゾウは16時間を使います'],
        ['a day', '1日に'],
        ['eating.', '食べることに'],
      ],
      notes: {
        'eating.': 'spend＋時間＋-ing で「〜して時間を過ごす」という決まった形です。',
      },
    }),
    bs('[S Many zoos {前| in Japan}] [V have] [O elephants], [接 but] [S they] [V need] [O a lot {前| of space}], [接 so] [仮S it] [V is not] [C easy] [真S {to:名詞| [V to keep] [O them]}].', {
      chunks: [
        ['Many zoos in Japan have elephants,', '日本の多くの動物園にはゾウがいます'],
        ['but they need a lot of space,', 'しかし、ゾウには広い場所が必要です'],
        ['so it is not easy', 'だから簡単ではありません'],
        ['to keep them.', 'ゾウを飼うことは'],
      ],
      notes: {
        'so it is not easy': 'it は形式主語で、中身は後ろの to keep them（ゾウを飼うこと）です。',
      },
    }),
    bs('[S Some zoos] [V are building] [O larger homes] [M {前| for their elephants}].', {
      chunks: [
        ['Some zoos are building larger homes', 'もっと広いすみかを作っている動物園もあります'],
        ['for their elephants.', 'ゾウのために'],
      ],
    }),
    bs('[M {副詞節:時| [接 Next time] [S you] [V visit] [O a zoo]}], [V watch] [O {疑問詞節| [M how] [S the elephants] [V use] [O their trunks]}].', {
      chunks: [
        ['Next time you visit a zoo,', '今度動物園へ行ったら'],
        ['watch', '見てみましょう'],
        ['how the elephants use their trunks.', 'ゾウがどのように鼻を使うかを'],
      ],
      notes: {
        'Next time you visit a zoo,': 'next time＋主語＋動詞で「今度〜するとき」。接続詞の働きをする言い方です。',
      },
    }),
  ]),
})
