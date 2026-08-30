// 長文の節・句・文法ブロックを、英語の語順のまま理解するための講師監修シナリオ。
//
// en は reading-grammar.js が作るブロックとの照合キー。orderedJa は、英語に現れる
// 意味単位を「／」で区切り、必ず前から同じ順に並べる。表示では「→」、音声では
// 「次に」に変換する。tip は、その読み方で特に伝えたい補足だけを書く。
// 文全体の自然な和訳（passages.js の sentence.ja）とは役割を分けている。

import { INTERMEDIATE_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-intermediate.js'
import { UPPER_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-upper.js'
import { ADVANCED_READING_TRANSLATION_SCENARIOS } from './reading-translation-scenarios-advanced.js'
import { EXPANDED_READING_TRANSLATION_SCENARIOS } from './reading-expansion-translation-scenarios.js'
import { CURRENT_AFFAIRS_READING_TRANSLATION_SCENARIOS } from './reading-current-affairs-translation-scenarios.js'
import { EXTENDED_READING_TRANSLATION_SCENARIOS } from './reading-extended-translation-scenarios.js'

const b = (en, orderedJa, tip = '', orderedEn = '') => {
  const jaSegments = Object.freeze(orderedJa.split('／').map((segment) => segment.trim()))
  const enSegments = orderedEn
    ? Object.freeze(orderedEn.split('／').map((segment) => segment.trim()))
    : null
  return Object.freeze({
    en,
    ja: jaSegments.join(' → '),
    jaSegments,
    enSegments,
    speechJa: jaSegments.join('。次に、'),
    tip,
  })
}
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const READING_TRANSLATION_SCENARIOS = Object.freeze({
  ...INTERMEDIATE_READING_TRANSLATION_SCENARIOS,
  ...UPPER_READING_TRANSLATION_SCENARIOS,
  ...ADVANCED_READING_TRANSLATION_SCENARIOS,
  ...EXPANDED_READING_TRANSLATION_SCENARIOS,
  ...CURRENT_AFFAIRS_READING_TRANSLATION_SCENARIOS,
  ...EXTENDED_READING_TRANSLATION_SCENARIOS,
  p_5_lost_notebook: passage([
    [
      b('Rina is', 'リナは／〜です（内容は次へ）'),
      b('a junior high school student', '一人の中学生'),
    ],
    [
      b(
        'She goes to school',
        '彼女は／行きます／学校へ',
        'goes で「行きます」と動作をつかみ、to school で行き先の「学校へ」を足します。',
      ),
      b(
        'by bus every morning',
        'バスで／毎朝',
        'by bus は手段の「バスで」、every morning は時を表す「毎朝」です。',
      ),
    ],
    [
      b('On Monday', '月曜日に'),
      b(
        'she has English, music, and science classes',
        '彼女には／あります／英語・音楽・理科の授業が',
        '',
        'she／has／English, music, and science classes',
      ),
    ],
    [
      b('She likes English', '彼女は／好きです／英語が'),
      b('because her teacher uses many pictures', 'なぜなら／先生が／使うからです／たくさんの絵を'),
    ],
    [
      b('After lunch', '昼食のあとに'),
      b('Rina cannot find her blue notebook', 'リナは／見つけられません／青いノートを'),
    ],
    [
      b('Her friend Ken looks under the desks', '友達のケンは／探します／机の下を'),
      b('with her', '彼女と一緒に'),
    ],
    [
      b('Then Ken sees the notebook', 'それから／ケンは／見つけます／そのノートを'),
      b('near the classroom door', '教室のドアの近くで'),
    ],
    [
      b(
        'Rina says thank you and writes a short story',
        'リナは／お礼を言います／そして書きます／短い物語を',
        '',
        'Rina／says thank you／and writes／a short story',
      ),
      b('in it', 'そのノートの中に'),
    ],
    [
      b('She is happy', '彼女は／うれしいです'),
      b('because she can use the story', 'なぜなら／彼女は／使えるからです／その物語を'),
      b('in English class', '英語の授業で'),
    ],
  ]),

  p_5_school_open_day: passage([
    [
      b('Our school has an open day next Saturday', '私たちの学校では／あります／学校公開日が／次の土曜日に'),
    ],
    [
      b('Students come at nine', '生徒は／来ます／9時に'),
      b('with a parent', '保護者と一緒に'),
    ],
    [
      b('First, families visit classrooms and watch a science class', 'まず／家族は／訪れます／教室を／そして見ます／理科の授業を'),
    ],
    [
      b('At ten', '10時に'),
      b('the music club sings', '音楽部が／歌います'),
      b('in the school hall', '学校のホールで'),
    ],
    [
      b('After that', 'そのあとに'),
      b('families eat lunch', '家族は／食べます／昼食を'),
      b('in the garden', '庭で'),
    ],
    [
      b('Please bring your own drinks', 'どうぞ／持ってきてください／自分の飲み物を'),
    ],
    [
      b('At one', '1時に'),
      b('the sports club meets', '運動部が／集まります'),
      b('in the gym', '体育館に'),
    ],
    [
      b('Students wear indoor shoes and join some games', '生徒は／履きます／上履きを／そして参加します／いくつかのゲームに'),
    ],
    [
      b('Please ask a teacher', 'どうぞ／尋ねてください／先生に'),
      b('near the front door', '正面のドアの近くにいる'),
      b('if you have any questions', 'もし／あなたに／何か質問があれば'),
    ],
    [
      b('The open day will end', '学校公開日は／終わります'),
      b('at three', '3時に'),
    ],
  ]),

  p_4_library_event: passage([
    [
      b('Green Town Library has a special event', 'グリーンタウン図書館では／あります／特別な催しが'),
      b('on the first Saturday of every month', '毎月の第1土曜日に'),
    ],
    [
      b('Children can listen to stories, make small cards', '子どもたちは／できます／聞くことが／物語を／作ることが／小さなカードを'),
      b('and borrow books', 'そして／借りることもできます／本を'),
      b(
        'about the month\'s topic',
        '〜について（対象は次へ）／その月のテーマ',
        '',
        'about／the month\'s topic',
      ),
    ],
    [
      b('This month, the topic is local history', '今月は／テーマは／〜です／地域の歴史'),
    ],
    [
      b('Ms. Brown', 'ブラウンさんは'),
      b('one of the librarians', '司書の一人で'),
      b('will show old pictures of the town', '見せてくれます／町の古い写真を'),
    ],
    [
      b('She will also talk', '彼女は／さらに話します'),
      b('about the old station', 'その古い駅について'),
      b('that stood', 'そしてその駅は／建っていました'),
      b('near the river fifty years ago', '川の近くに／50年前'),
    ],
    [
      b('After the talk', '話のあとに'),
      b('children will work', '子どもたちは／作業します'),
      b('in small groups', '小さなグループで'),
      b(
        'to build a paper model of the station',
        '作るために／一つの紙模型を／その駅の',
        '',
        'to build／a paper model／of the station',
      ),
    ],
    [
      b('The library will provide paper and glue', '図書館は／用意します／紙とのりを'),
      b('so families do not need', 'ですから／家族は／必要ありません'),
      b('to bring craft materials', '持ってくることが／工作材料を'),
    ],
    [
      b('Parents may help', '保護者は／手伝ってもかまいません'),
      b('but each child should write a name on the model and take it home', 'しかし／子どもは一人ずつ／書くべきです／名前を／模型に／そして持ち帰るべきです／それを／家へ'),
      b('at noon', '正午に'),
    ],
    [
      b('The event starts at ten in the morning and ends', '催しは／始まります／午前10時に／そして終わります'),
      b('before lunch', '昼食の前に'),
    ],
    [
      b(
        'People do not have to pay',
        '参加者は／〜する必要はありません／支払うこと（参加費を）',
        '',
        'People／do not have to／pay',
      ),
      b('but they should bring a pencil', 'しかし／参加者は／持ってくるべきです／鉛筆を'),
    ],
    [
      b('Many families come early', '多くの家族は／来ます／早く'),
      b('because the room is not very large', 'なぜなら／部屋が／あまり広くないからです'),
    ],
    [
      b('If it becomes full', 'もし／会場が／満員になれば'),
      b('the library will put a message', '図書館は／載せます／お知らせを'),
      b('on its website', '図書館のウェブサイトに'),
    ],
    [
      b('The event is popular', 'その催しは／人気があります'),
      b('because children can learn about their town', 'なぜなら／子どもたちは／学べるからです／自分たちの町について'),
      b('in a fun way', '楽しい方法で'),
    ],
  ]),

  p_4_bicycle_safety: passage([
    [
      b('Next month, our town will hold a bicycle safety week', '来月／私たちの町は／開きます／自転車安全週間を'),
      b('for children and their families', '子どもたちとその家族のために'),
    ],
    [
      b('The program will teach simple traffic rules and show people how to prevent common bicycle accidents', 'その催しは／教えます／簡単な交通ルールを／そして示します／人々に／どのように防ぐかを／よくある自転車事故を'),
    ],
    [
      b('It begins with a short talk at the community center', 'その催しは／始まります／短い話から／コミュニティセンターでの'),
      b('on Monday evening', '月曜日の夕方に'),
    ],
    [
      b('A police officer will explain', '警察官が／説明します'),
      b('why every rider should wear a helmet', 'なぜ／自転車に乗る人は皆／着けるべきなのかを／ヘルメットを'),
    ],
    [
      b('Children will also learn the correct place', '子どもたちは／さらに学びます／正しい場所を'),
      b('to stop', '止まるための'),
      b(
        'before they cross a busy road',
        'その前に／子どもたちが／渡る／交通量の多い道路を',
        '',
        'before／they／cross／a busy road',
      ),
    ],
    [
      b('They must use bicycle lights', '子どもたちは／使わなければなりません／自転車のライトを'),
      b('because drivers may not notice them', 'なぜなら／運転手が／気づかないかもしれないからです／子どもたちに'),
      b('after dark', '暗くなったあとには'),
    ],
    [
      b('On Wednesday', '水曜日に'),
      b('families can bring their bicycles to the park', '家族は／持ってくることができます／自転車を／公園へ'),
    ],
    [
      b('Local shop workers will check the brakes, seats, and lights', '地域の自転車店の人が／点検します／ブレーキ・座席・ライトを'),
      b('for free', '無料で'),
    ],
    [
      b('They can repair small problems', '店の人は／修理できます／小さな不具合なら'),
      b('but they cannot replace expensive parts', 'しかし／店の人は／交換できません／高価な部品を'),
    ],
    [
      b('The week ends with a practice ride', 'その安全週間は／終わります／練習走行で'),
      b('on Saturday morning', '土曜日の朝に'),
    ],
    [
      b('Volunteers will ride with small groups', 'ボランティアは／走ります／小さなグループと一緒に'),
      b('through quiet streets', '静かな通りを通って'),
    ],
    [
      b('Parents should join the ride too', '保護者も／参加するべきです／その走行に'),
      b(
        'so they can practice the rules',
        'そうすれば／保護者は／練習できます／そのルールを',
        '',
        'so／they／can practice／the rules',
      ),
      b('with their children', '自分の子どもたちと一緒に'),
    ],
    [
      b('The town believes', '町は／考えています'),
      b('that careful riding will protect everyone', '注意深い運転が／守るだろうと／すべての人を'),
      b(
        'who uses the road',
        'そしてその人たちは／使います／道路を',
        'who 以下は直前の everyone を説明します。everyone を受けてから、「その人たちは → 使います → 道路を」と前へ進みます。',
      ),
    ],
  ]),
})
