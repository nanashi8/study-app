// 長文の節・句・文法ブロックを、英語の語順のまま理解するための講師監修シナリオ。
//
// en は reading-grammar.js が作るブロックとの照合キー、ja はそのブロックだけを
// 前から読んだときの自然な語順訳。tip は、その訳し方で特に伝えたい補足だけを書く。
// 文全体の自然な和訳（passages.js の sentence.ja）とは役割を分けている。

import { INTERMEDIATE_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-intermediate.js'
import { UPPER_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-upper.js'
import { ADVANCED_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-advanced.js'

const b = (en, ja, tip = '') => Object.freeze({ en, ja, tip })
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const READING_TRANSLATION_SCENARIOS = Object.freeze({
  ...INTERMEDIATE_READING_TRANSLATION_SCENARIOS,
  ...UPPER_READING_TRANSLATION_SCENARIOS,
  ...ADVANCED_READING_TRANSLATION_SCENARIOS,
  p_5_lost_notebook: passage([
    [
      b('Rina is', 'リナは、〜です'),
      b('a junior high school student', '一人の中学生です'),
    ],
    [
      b(
        'She goes to school',
        '彼女は、行きます、学校に',
        'goes で「行きます」と動作をつかみ、to school で行き先の「学校に」を足します。',
      ),
      b(
        'by bus every morning',
        'バスで、毎朝',
        'by bus は手段の「バスで」、every morning は時を表す「毎朝」です。',
      ),
    ],
    [
      b('On Monday', '月曜日に'),
      b('she has English, music, and science classes', '彼女には、英語と音楽と理科の授業があります'),
    ],
    [
      b('She likes English', '彼女は英語が好きです'),
      b('because her teacher uses many pictures', 'なぜなら、先生がたくさんの絵を使うからです'),
    ],
    [
      b('After lunch', '昼食のあとに'),
      b('Rina cannot find her blue notebook', 'リナは見つけられません、青いノートを'),
    ],
    [
      b('Her friend Ken looks under the desks', '友達のケンが探します、机の下を'),
      b('with her', '彼女と一緒に'),
    ],
    [
      b('Then Ken sees the notebook', 'それからケンは見つけます、そのノートを'),
      b('near the classroom door', '教室のドアの近くで'),
    ],
    [
      b('Rina says thank you and writes a short story', 'リナはお礼を言い、短い物語を書きます'),
      b('in it', 'そのノートの中に'),
    ],
    [
      b('She is happy', '彼女はうれしいです'),
      b('because she can use the story', 'なぜなら、その物語を使えるからです'),
      b('in English class', '英語の授業で'),
    ],
  ]),

  p_5_school_open_day: passage([
    [
      b('Our school has an open day next Saturday', '私たちの学校では学校公開日があります、次の土曜日に'),
    ],
    [
      b('Students come at nine', '生徒は来ます、9時に'),
      b('with a parent', '保護者と一緒に'),
    ],
    [
      b('First, families visit classrooms and watch a science class', 'まず、家族は教室を訪れ、理科の授業を見ます'),
    ],
    [
      b('At ten', '10時に'),
      b('the music club sings', '音楽部が歌います'),
      b('in the school hall', '学校のホールで'),
    ],
    [
      b('After that', 'そのあとに'),
      b('families eat lunch', '家族は昼食を食べます'),
      b('in the garden', '庭で'),
    ],
    [
      b('Please bring your own drinks', '持ってきてください、自分の飲み物を'),
    ],
    [
      b('At one', '1時に'),
      b('the sports club meets', '運動部が集まります'),
      b('in the gym', '体育館に'),
    ],
    [
      b('Students wear indoor shoes and join some games', '生徒は上履きを履き、いくつかのゲームに参加します'),
    ],
    [
      b('Please ask a teacher', '先生に尋ねてください'),
      b('near the front door', '正面のドアの近くにいる'),
      b('if you have any questions', 'もし質問が何かあれば'),
    ],
    [
      b('The open day will end', '学校公開日は終わります'),
      b('at three', '3時に'),
    ],
  ]),

  p_4_library_event: passage([
    [
      b('Green Town Library has a special event', 'グリーンタウン図書館では特別なイベントがあります'),
      b('on the first Saturday of every month', '毎月の第1土曜日に'),
    ],
    [
      b('Children can listen to stories, make small cards', '子どもたちは物語を聞いたり、小さなカードを作ったりできます'),
      b('and borrow books', 'そして、本を借りることもできます'),
      b('about the month\'s topic', 'その月のテーマについての'),
    ],
    [
      b('This month, the topic is local history', '今月は、そのテーマは地域の歴史です'),
    ],
    [
      b('Ms. Brown', 'ブラウンさんは'),
      b('one of the librarians', '司書の一人で'),
      b('will show old pictures of the town', '見せてくれます、町の古い写真を'),
    ],
    [
      b('She will also talk', '彼女はさらに話します'),
      b('about the old station', 'その古い駅について'),
      b('that stood', 'その駅は、建っていました'),
      b('near the river fifty years ago', '川の近くに、50年前'),
    ],
    [
      b('After the talk', '話のあとに'),
      b('children will work', '子どもたちは作業します'),
      b('in small groups', '小さなグループで'),
      b('to build a paper model of the station', '駅の紙模型を作るために'),
    ],
    [
      b('The library will provide paper and glue', '図書館が紙とのりを用意します'),
      b('so families do not need', 'そのため、家族は必要がありません'),
      b('to bring craft materials', '工作材料を持ってくることは'),
    ],
    [
      b('Parents may help', '保護者は手伝ってもかまいません'),
      b('but each child should write a name on the model and take it home', 'しかし、子どもは一人ずつ模型に名前を書き、それを家へ持ち帰るべきです'),
      b('at noon', '正午に'),
    ],
    [
      b('The event starts at ten in the morning and ends', 'イベントは午前10時に始まり、終わります'),
      b('before lunch', '昼食の前に'),
    ],
    [
      b('People do not have to pay', '参加者はお金を払う必要はありません'),
      b('but they should bring a pencil', 'しかし、鉛筆は持ってくるべきです'),
    ],
    [
      b('Many families come early', '多くの家族は早く来ます'),
      b('because the room is not very large', 'なぜなら、部屋があまり広くないからです'),
    ],
    [
      b('If it becomes full', 'もし会場が満員になったら'),
      b('the library will put a message', '図書館はお知らせを載せます'),
      b('on its website', '図書館のウェブサイトに'),
    ],
    [
      b('The event is popular', 'そのイベントは人気があります'),
      b('because children can learn about their town', 'なぜなら、子どもたちが自分たちの町について学べるからです'),
      b('in a fun way', '楽しい方法で'),
    ],
  ]),

  p_4_bicycle_safety: passage([
    [
      b('Next month, our town will hold a bicycle safety week', '来月、私たちの町は自転車安全週間を開きます'),
      b('for children and their families', '子どもたちとその家族のために'),
    ],
    [
      b('The program will teach simple traffic rules and show people how to prevent common bicycle accidents', 'その催しは簡単な交通ルールを教え、よくある自転車事故を防ぐ方法を人々に示します'),
    ],
    [
      b('It begins with a short talk at the community center', 'その催しは、コミュニティセンターでの短い話から始まります'),
      b('on Monday evening', '月曜日の夕方に'),
    ],
    [
      b('A police officer will explain', '警察官が説明します'),
      b('why every rider should wear a helmet', 'なぜ自転車に乗る人は皆ヘルメットを着けるべきなのかを'),
    ],
    [
      b('Children will also learn the correct place', '子どもたちは正しい場所も学びます'),
      b('to stop', '止まるための'),
      b('before they cross a busy road', '交通量の多い道路を渡る前に'),
    ],
    [
      b('They must use bicycle lights', '子どもたちは自転車のライトを使わなければなりません'),
      b('because drivers may not notice them', 'なぜなら、運転手が子どもたちに気づかないかもしれないからです'),
      b('after dark', '暗くなったあとには'),
    ],
    [
      b('On Wednesday', '水曜日に'),
      b('families can bring their bicycles to the park', '家族は自転車を公園へ持ってくることができます'),
    ],
    [
      b('Local shop workers will check the brakes, seats, and lights', '地域の自転車店の人が、ブレーキと座席とライトを点検します'),
      b('for free', '無料で'),
    ],
    [
      b('They can repair small problems', '店の人は小さな問題なら修理できます'),
      b('but they cannot replace expensive parts', 'しかし、高価な部品を交換することはできません'),
    ],
    [
      b('The week ends with a practice ride', 'その安全週間は練習走行で終わります'),
      b('on Saturday morning', '土曜日の朝に行う'),
    ],
    [
      b('Volunteers will ride with small groups', 'ボランティアは小さなグループと一緒に走ります'),
      b('through quiet streets', '静かな通りを通って'),
    ],
    [
      b('Parents should join the ride too', '保護者もその走行に参加するべきです'),
      b('so they can practice the rules', 'そうすれば、そのルールを練習できます'),
      b('with their children', '自分の子どもたちと一緒に'),
    ],
    [
      b('The town believes', '町は考えています'),
      b('that careful riding will protect everyone', '注意深い運転がすべての人を守ると'),
      b(
        'who uses the road',
        'つまり、道路を使う人々です',
        'who 以下は直前の everyone を説明します。「道路を使うすべての人」と後ろから一つにまとめましょう。',
      ),
    ],
  ]),
})
