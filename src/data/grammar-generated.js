// 3,000問規模で反復できるよう、文法パターンと検品済み語彙スロットから生成する問題群。
// 各問題は決定的なID・4択・和訳・解説・patternを持ち、ランダム生成は行わない。

const pad = (value) => String(value).padStart(3, '0')
const cross = (...lists) =>
  lists.reduce((rows, list) => rows.flatMap((row) => list.map((item) => [...row, item])), [[]])

const fourChoices = (answer, candidates) => {
  const choices = []
  for (const candidate of [answer, ...candidates]) {
    if (typeof candidate === 'string' && candidate.trim() && !choices.includes(candidate)) {
      choices.push(candidate)
    }
  }
  for (const fallback of [`to ${answer}`, `being ${answer}`, `has ${answer}`, `${answer}ing`, `not ${answer}`]) {
    if (choices.length >= 4) break
    if (!choices.includes(fallback)) choices.push(fallback)
  }
  return choices.slice(0, 4)
}

const family = ({ key, level, topic, explain, cases, build }) => {
  const seen = new Set()
  return cases.map((data, index) => {
    const built = build(data, index)
    if (seen.has(built.q)) throw new Error(`文法生成 ${key}: 問題文が重複 (${built.q})`)
    seen.add(built.q)
    return {
      id: `gr_auto_${key}_${pad(index + 1)}`,
      level,
      topic,
      pattern: `auto:${key}`,
      q: built.q,
      choices: fourChoices(built.answer, built.choices),
      answer: built.answer,
      explain: built.explain ?? explain,
      sentence: {
        en: built.q.replace('___', built.answer),
        ja: built.ja,
      },
    }
  })
}

const selectRoundRobin = (level, count, families) => {
  const selected = []
  for (let round = 0; selected.length < count; round++) {
    for (const items of families) {
      if (selected.length >= count) break
      if (!items[round]) {
        throw new Error(`文法生成 英検${level}級: pattern ${items[0]?.pattern ?? '?'} の候補不足`)
      }
      selected.push(items[round])
    }
  }
  return selected
}

const THIRD_SUBJECTS = [
  ['Ken', 'ケン'],
  ['Emi', 'エミ'],
  ['My brother', '私の兄'],
  ['My sister', '私の姉'],
  ['Our teacher', '私たちの先生'],
  ['Mr. Sato', '佐藤先生'],
  ['Ms. Brown', 'ブラウン先生'],
  ['My father', '私の父'],
  ['My mother', '私の母'],
  ['The new student', 'その新入生'],
  ['My best friend', '私の親友'],
  ['The team captain', 'そのチームの主将'],
]

const PLURAL_SUBJECTS = [
  ['My parents', '私の両親'],
  ['Ken and Emi', 'ケンとエミ'],
  ['The students', 'その生徒たち'],
  ['Our neighbors', '私たちの近所の人たち'],
  ['My friends', '私の友人たち'],
  ['The players', 'その選手たち'],
  ['Those children', 'あの子どもたち'],
  ['My classmates', '私のクラスメートたち'],
]

const ACTIONS = [
  { base: 'play', third: 'plays', past: 'played', pp: 'played', ing: 'playing', tail: 'tennis after school', jaStem: '放課後にテニスをし', jaDict: '放課後にテニスをする', neutralTail: 'tennis', jaNeutralStem: 'テニスをし', jaNeutralDict: 'テニスをする' },
  { base: 'visit', third: 'visits', past: 'visited', pp: 'visited', ing: 'visiting', tail: 'the museum on weekends', jaStem: '週末に博物館を訪れ', jaDict: '週末に博物館を訪れる', neutralTail: 'the museum', jaNeutralStem: '博物館を訪れ', jaNeutralDict: '博物館を訪れる' },
  { base: 'study', third: 'studies', past: 'studied', pp: 'studied', ing: 'studying', tail: 'English at the library', jaStem: '図書館で英語を勉強し', jaDict: '図書館で英語を勉強する', neutralTail: 'English', jaNeutralStem: '英語を勉強し', jaNeutralDict: '英語を勉強する' },
  { base: 'carry', third: 'carries', past: 'carried', pp: 'carried', ing: 'carrying', tail: 'the bags upstairs', jaStem: 'かばんを上の階へ運び', jaDict: 'かばんを上の階へ運ぶ', neutralTail: 'the bags upstairs', jaNeutralStem: 'かばんを上の階へ運び', jaNeutralDict: 'かばんを上の階へ運ぶ' },
  { base: 'watch', third: 'watches', past: 'watched', pp: 'watched', ing: 'watching', tail: 'the news after dinner', jaStem: '夕食後にニュースを見', jaDict: '夕食後にニュースを見る', neutralTail: 'the news', jaNeutralStem: 'ニュースを見', jaNeutralDict: 'ニュースを見る' },
  { base: 'cook', third: 'cooks', past: 'cooked', pp: 'cooked', ing: 'cooking', tail: 'dinner for the family', jaStem: '家族の夕食を作り', jaDict: '家族の夕食を作る', neutralTail: 'dinner', jaNeutralStem: '夕食を作り', jaNeutralDict: '夕食を作る' },
  { base: 'clean', third: 'cleans', past: 'cleaned', pp: 'cleaned', ing: 'cleaning', tail: 'the classroom every Friday', jaStem: '毎週金曜日に教室を掃除し', jaDict: '毎週金曜日に教室を掃除する', neutralTail: 'the classroom', jaNeutralStem: '教室を掃除し', jaNeutralDict: '教室を掃除する' },
  { base: 'open', third: 'opens', past: 'opened', pp: 'opened', ing: 'opening', tail: 'the shop at nine', jaStem: '9時に店を開け', jaDict: '9時に店を開ける', neutralTail: 'the shop', jaNeutralStem: '店を開け', jaNeutralDict: '店を開ける' },
  { base: 'use', third: 'uses', past: 'used', pp: 'used', ing: 'using', tail: 'the computer for work', jaStem: '仕事でそのコンピューターを使い', jaDict: '仕事でそのコンピューターを使う', neutralTail: 'the computer', jaNeutralStem: 'コンピューターを使い', jaNeutralDict: 'コンピューターを使う' },
  { base: 'help', third: 'helps', past: 'helped', pp: 'helped', ing: 'helping', tail: 'the neighbors on Sundays', jaStem: '日曜日に近所の人を手伝い', jaDict: '日曜日に近所の人を手伝う', neutralTail: 'the neighbors', jaNeutralStem: '近所の人を手伝い', jaNeutralDict: '近所の人を手伝う' },
  { base: 'call', third: 'calls', past: 'called', pp: 'called', ing: 'calling', tail: 'Grandma in the evening', jaStem: '夕方に祖母へ電話し', jaDict: '夕方に祖母へ電話する', neutralTail: 'Grandma', jaNeutralStem: '祖母へ電話し', jaNeutralDict: '祖母へ電話する' },
  { base: 'walk', third: 'walks', past: 'walked', pp: 'walked', ing: 'walking', tail: 'the dog before breakfast', jaStem: '朝食前に犬を散歩させ', jaDict: '朝食前に犬を散歩させる', neutralTail: 'the dog', jaNeutralStem: '犬を散歩させ', jaNeutralDict: '犬を散歩させる' },
  { base: 'practice', third: 'practices', past: 'practiced', pp: 'practiced', ing: 'practicing', tail: 'the piano every day', jaStem: '毎日ピアノを練習し', jaDict: '毎日ピアノを練習する', neutralTail: 'the piano', jaNeutralStem: 'ピアノを練習し', jaNeutralDict: 'ピアノを練習する' },
  { base: 'write', third: 'writes', past: 'wrote', pp: 'written', ing: 'writing', tail: 'a report at the office', jaStem: '事務所で報告書を書き', jaDict: '事務所で報告書を書く', neutralTail: 'a report', jaNeutralStem: '報告書を書き', jaNeutralDict: '報告書を書く' },
  { base: 'take', third: 'takes', past: 'took', pp: 'taken', ing: 'taking', tail: 'pictures in the park', jaStem: '公園で写真を撮り', jaDict: '公園で写真を撮る', neutralTail: 'pictures', jaNeutralStem: '写真を撮り', jaNeutralDict: '写真を撮る' },
  { base: 'buy', third: 'buys', past: 'bought', pp: 'bought', ing: 'buying', tail: 'groceries after work', jaStem: '仕事後に食料品を買い', jaDict: '仕事後に食料品を買う', neutralTail: 'groceries', jaNeutralStem: '食料品を買い', jaNeutralDict: '食料品を買う' },
  { base: 'teach', third: 'teaches', past: 'taught', pp: 'taught', ing: 'teaching', tail: 'math at school', jaStem: '学校で数学を教え', jaDict: '学校で数学を教える', neutralTail: 'math', jaNeutralStem: '数学を教え', jaNeutralDict: '数学を教える' },
  { base: 'choose', third: 'chooses', past: 'chose', pp: 'chosen', ing: 'choosing', tail: 'a seat near the window', jaStem: '窓の近くの席を選び', jaDict: '窓の近くの席を選ぶ', neutralTail: 'a seat', jaNeutralStem: '席を選び', jaNeutralDict: '席を選ぶ' },
  { base: 'speak', third: 'speaks', past: 'spoke', pp: 'spoken', ing: 'speaking', tail: 'English in class', jaStem: '授業で英語を話し', jaDict: '授業で英語を話す', neutralTail: 'English with classmates', jaNeutralStem: 'クラスメートと英語を話し', jaNeutralDict: 'クラスメートと英語を話す' },
  { base: 'drive', third: 'drives', past: 'drove', pp: 'driven', ing: 'driving', tail: 'to work every morning', jaStem: '毎朝車で仕事へ行き', jaDict: '毎朝車で仕事へ行く', neutralTail: 'to work', jaNeutralStem: '車で仕事へ行き', jaNeutralDict: '車で仕事へ行く' },
]

const ACTION_JA_PAST = Object.freeze({
  play: 'テニスをした',
  visit: '博物館を訪れた',
  study: '英語を勉強した',
  carry: 'かばんを上の階へ運んだ',
  watch: 'ニュースを見た',
  cook: '夕食を作った',
  clean: '教室を掃除した',
  open: '店を開けた',
  use: 'コンピューターを使った',
  help: '近所の人を手伝った',
  call: '祖母へ電話した',
  walk: '犬を散歩させた',
  practice: 'ピアノを練習した',
  write: '報告書を書いた',
  take: '写真を撮った',
  buy: '食料品を買った',
  teach: '数学を教えた',
  choose: '席を選んだ',
  speak: 'クラスメートと英語を話した',
  drive: '車で仕事へ行った',
})

const ACTION_JA_TE = Object.freeze({
  play: 'テニスをして',
  visit: '博物館を訪れて',
  study: '英語を勉強して',
  carry: 'かばんを上の階へ運んで',
  watch: 'ニュースを見て',
  cook: '夕食を作って',
  clean: '教室を掃除して',
  open: '店を開けて',
  use: 'コンピューターを使って',
  help: '近所の人を手伝って',
  call: '祖母へ電話して',
  walk: '犬を散歩させて',
  practice: 'ピアノを練習して',
  write: '報告書を書いて',
  take: '写真を撮って',
  buy: '食料品を買って',
  teach: '数学を教えて',
  choose: '席を選んで',
  speak: 'クラスメートと英語を話して',
  drive: '車で仕事へ行って',
})

const actionJaPast = (action) => ACTION_JA_PAST[action.base]
const actionJaTe = (action) => ACTION_JA_TE[action.base]
const ONGOING_ACTIONS = ACTIONS.filter((action) => action.base !== 'open')

const BE_COMPLEMENTS = [
  ['ready for class', '授業の準備ができています'],
  ['busy this morning', '今朝は忙しいです'],
  ['good at science', '理科が得意です'],
  ['in the music room', '音楽室にいます'],
  ['from Hokkaido', '北海道出身です'],
  ['very kind to everyone', '皆にとても親切です'],
  ['a member of the club', 'その部の一員です'],
  ['interested in animals', '動物に興味があります'],
  ['at the station now', '今、駅にいます'],
  ['happy with the result', 'その結果に満足しています'],
  ['afraid of large dogs', '大きな犬を怖がっています'],
  ['famous in this town', 'この町で有名です'],
]

const PLURAL_NOUNS = [
  ['box', 'boxes', '箱', 'cardboard', '段ボールの'],
  ['city', 'cities', '都市', 'coastal', '沿岸の'],
  ['knife', 'knives', 'ナイフ', 'sharp', '鋭い'],
  ['child', 'children', '子ども', 'young', '幼い'],
  ['woman', 'women', '女性', 'smiling', '笑顔の'],
  ['man', 'men', '男性', 'tall', '背の高い'],
  ['leaf', 'leaves', '葉', 'green', '緑の'],
  ['watch', 'watches', '腕時計', 'expensive', '高価な'],
  ['bus', 'buses', 'バス', 'school', '通学用の'],
  ['baby', 'babies', '赤ん坊', 'sleeping', '眠っている'],
  ['foot', 'feet', '足', 'bare', '裸足の'],
  ['tooth', 'teeth', '歯', 'healthy', '健康な'],
]

function jaCounter(singular, count) {
  if (['child', 'woman', 'man', 'baby'].includes(singular)) return `${count}人`
  if (['knife', 'foot', 'tooth'].includes(singular)) return `${count}本`
  if (singular === 'leaf') return `${count}枚`
  if (singular === 'bus') return `${count}台`
  return `${count}つ`
}

const isPersonNoun = (singular) => ['child', 'woman', 'man', 'baby'].includes(singular)

const LOCATIONS = [
  ['on the shelf', '棚の上に'],
  ['in the room', '部屋に'],
  ['near the entrance', '入口の近くに'],
  ['under the table', 'テーブルの下に'],
]

const TIME_PREPOSITIONS = [
  ['Our English lesson begins ___ seven o’clock.', 'at', ['at', 'on', 'in', 'for'], '英語の授業は7時に始まります。'],
  ['The train leaves ___ noon.', 'at', ['at', 'on', 'in', 'from'], 'その列車は正午に出発します。'],
  ['The film starts ___ 8:30.', 'at', ['at', 'on', 'in', 'by'], 'その映画は8時30分に始まります。'],
  ['The office closes ___ five.', 'at', ['at', 'in', 'on', 'during'], 'その事務所は5時に閉まります。'],
  ['Our club meets ___ Monday.', 'on', ['on', 'at', 'in', 'by'], '私たちの部は月曜日に集まります。'],
  ['The game is scheduled ___ Tuesday.', 'on', ['on', 'in', 'at', 'for'], 'その試合は火曜日に予定されています。'],
  ['The library is closed ___ Sunday.', 'on', ['on', 'at', 'in', 'from'], 'その図書館は日曜日に休館です。'],
  ['The report is due ___ Friday.', 'on', ['on', 'in', 'at', 'during'], 'その報告書は金曜日が締め切りです。'],
  ['The festival is held ___ July 10.', 'on', ['on', 'in', 'at', 'for'], 'その祭りは7月10日に開かれます。'],
  ['The concert takes place ___ August 3.', 'on', ['on', 'at', 'in', 'by'], 'その演奏会は8月3日に開かれます。'],
  ['The exam is scheduled ___ May 15.', 'on', ['on', 'in', 'at', 'during'], 'その試験は5月15日に予定されています。'],
  ['The museum reopens ___ October 1.', 'on', ['on', 'at', 'in', 'from'], 'その博物館は10月1日に再開します。'],
  ['The school year begins ___ April.', 'in', ['in', 'on', 'at', 'to'], '新学期は4月に始まります。'],
  ['These flowers bloom ___ May.', 'in', ['in', 'at', 'on', 'by'], 'これらの花は5月に咲きます。'],
  ['My family will move ___ July.', 'in', ['in', 'on', 'at', 'for'], '私の家族は7月に引っ越します。'],
  ['The local fair is usually held ___ November.', 'in', ['in', 'at', 'on', 'from'], '地元の市は通常11月に開かれます。'],
  ['The lake sometimes freezes ___ winter.', 'in', ['in', 'at', 'on', 'by'], 'その湖は冬に凍ることがあります。'],
  ['We often travel to Hokkaido ___ summer.', 'in', ['in', 'on', 'at', 'for'], '私たちは夏によく北海道へ旅行します。'],
  ['The leaves change color ___ autumn.', 'in', ['in', 'at', 'on', 'during of'], '木の葉は秋に色づきます。'],
  ['Many birds return ___ spring.', 'in', ['in', 'on', 'at', 'from'], '多くの鳥が春に戻ってきます。'],
  ['I usually study ___ the morning.', 'in', ['in', 'on', 'at', 'from'], '私はたいてい朝に勉強します。'],
  ['We exercise ___ the afternoon.', 'in', ['in', 'at', 'on', 'by'], '私たちは午後に運動します。'],
  ['My father reads ___ the evening.', 'in', ['in', 'on', 'at', 'during of'], '父は夕方に読書をします。'],
  ['The streets become busy ___ the early morning.', 'in', ['in', 'at', 'on', 'for'], '通りは早朝に混み始めます。'],
  ['The stars are clearly visible ___ night.', 'at', ['at', 'in', 'on', 'during of'], '星は夜にはっきり見えます。'],
  ['Owls are active ___ night.', 'at', ['at', 'on', 'in the', 'from'], 'フクロウは夜に活動します。'],
  ['The streets are quiet ___ night.', 'at', ['at', 'in', 'on', 'by the'], '通りは夜には静かです。'],
  ['The temperature drops ___ night.', 'at', ['at', 'on', 'in the', 'for'], '気温は夜に下がります。'],
  ['The seminar begins ___ ten.', 'at', ['at', 'on', 'in', 'during'], 'その講習会は10時に始まります。'],
  ['Our meeting starts ___ three.', 'at', ['at', 'in', 'on', 'from'], '私たちの会議は3時に始まります。'],
  ['The campaign starts ___ Wednesday.', 'on', ['on', 'at', 'in', 'for'], 'その活動は水曜日に始まります。'],
  ['The new shop opens ___ Saturday.', 'on', ['on', 'in', 'at', 'by'], 'その新しい店は土曜日に開店します。'],
]

const ROLES = [
  ['artist', '芸術家', 'an'],
  ['engineer', '技術者', 'an'],
  ['actor', '俳優', 'an'],
  ['office worker', '会社員', 'an'],
  ['teacher', '教師', 'a'],
  ['doctor', '医師', 'a'],
  ['musician', '音楽家', 'a'],
  ['pilot', 'パイロット', 'a'],
  ['university student', '大学生', 'a'],
  ['nurse', '看護師', 'a'],
]

const OBJECT_PRONOUN_CASES = [
  ['The teacher helped ___ after class.', 'us', ['us', 'we', 'our', 'ours'], '先生は放課後、私たちを手伝ってくれました。'],
  ['I met Ken and spoke to ___.', 'him', ['him', 'he', 'his', 'himself'], '私はケンに会って、彼と話しました。'],
  ['Please give the key to ___.', 'her', ['her', 'she', 'hers', 'herself'], 'その鍵を彼女に渡してください。'],
  ['My grandparents often call ___.', 'me', ['me', 'I', 'my', 'mine'], '祖父母はよく私に電話をくれます。'],
  ['We invited Emi and Yuki to join ___.', 'us', ['us', 'we', 'our', 'ours'], '私たちはエミとユキを仲間に招きました。'],
  ['These umbrellas belong to ___.', 'them', ['them', 'they', 'their', 'theirs are'], 'これらの傘は彼らのものです。'],
  ['That blue bicycle is ___.', 'mine', ['mine', 'my', 'me', 'I'], 'あの青い自転車は私のものです。'],
  ['Our seats are here, and ___ are over there.', 'theirs', ['theirs', 'their', 'them', 'they'], '私たちの席はここで、彼らの席は向こうです。'],
]

const PRONOUN_CONTEXTS = [
  [['today', '今日'], ['yesterday', '昨日'], ['last Friday', '先週の金曜日'], ['before the holiday', '休暇前に']],
  [['yesterday', '昨日'], ['at the station', '駅で'], ['after the concert', '演奏会後に'], ['last weekend', '先週末に']],
  [['before class', '授業前に'], ['this afternoon', '今日の午後'], ['when you see her', '彼女に会ったら'], ['at the front desk', '受付で']],
  [['on Sundays', '日曜日に'], ['after dinner', '夕食後に'], ['during the holidays', '休暇中に'], ['from Osaka', '大阪から']],
  [['last week', '先週'], ['for the project', '計画のために'], ['after the meeting', '会議後に'], ['at lunch', '昼食時に']],
  [['at school', '学校にある'], ['near the entrance', '入口近くにある'], ['by the door', 'ドアのそばにある'], ['in the classroom', '教室にある']],
  [['According to the name tag, ', '名札によると、'], ['Everyone knows that ', '皆が知っているとおり、'], ['The record shows that ', '記録によると、'], ['As you can see, ', '見て分かるとおり、']],
  [['According to the seating chart, ', '座席表によると、'], ['Everyone knows that ', '皆が知っているとおり、'], ['The record shows that ', '記録によると、'], ['As you can see, ', '見て分かるとおり、']],
]

const WH_CASES = [
  ['___ do you practice soccer?', 'Where', ['Where', 'When', 'Who', 'Why'], 'どこでサッカーを練習しますか。'],
  ['___ does the class start?', 'When', ['When', 'Where', 'What', 'Whose'], 'その授業はいつ始まりますか。'],
  ['___ is your favorite singer?', 'Who', ['Who', 'What', 'Which', 'How'], 'あなたの好きな歌手は誰ですか。'],
  ['___ are you smiling?', 'Why', ['Why', 'Where', 'When', 'Which'], 'なぜ笑っているのですか。'],
  ['___ subject do you like best?', 'Which', ['Which', 'Who', 'Where', 'How'], 'どの教科がいちばん好きですか。'],
  ['___ bag is on the chair?', 'Whose', ['Whose', 'Who', 'Which is', 'What does'], 'いすの上にあるのは誰のかばんですか。'],
  ['___ many students are in your class?', 'How', ['How', 'What', 'Who', 'When'], 'あなたのクラスには何人の生徒がいますか。'],
  ['___ color is your bicycle?', 'What', ['What', 'How', 'Whose', 'Where'], 'あなたの自転車は何色ですか。'],
]

const WH_CONTEXTS = Object.freeze({
  Where: [['after school', '放課後'], ['on weekends', '週末は'], ['with your team', 'チームと一緒のとき'], ['during vacation', '休暇中は']],
  When: [['this week', '今週'], ['on school days', '登校日には'], ['during summer', '夏の間は'], ['after the holidays', '休暇後は']],
  Who: [['right now', '今'], ['in your family', '家族の中で'], ['among these artists', 'この芸術家たちの中で'], ['this year', '今年']],
  Why: [['right now', '今'], ['in this photograph', 'この写真で'], ['during the lesson', '授業中に'], ['today', '今日']],
  Which: [['this year', '今年'], ['at school', '学校で'], ['for next term', '来学期に向けて'], ['among these three', 'この3教科の中で']],
  Whose: [['near the door', 'ドアの近くにある'], ['under the desk', '机の下にある'], ['in the hallway', '廊下にある'], ['on the bus', 'バスにある']],
  How: [['this year', '今年'], ['right now', '現在'], ['altogether', '全部で'], ['in the morning class', '午前のクラスには']],
  What: [['in this photograph', 'この写真では'], ['under the cover', 'カバーの下では'], ['that you bought', 'あなたが買ったものは'], ['outside', '外にあるものは']],
})

const FIVE_FAMILIES = [
  family({
    key: '5_be_singular', level: '5', topic: 'be動詞',
    explain: '3人称単数の主語には be動詞 is を使う。',
    cases: cross(THIRD_SUBJECTS, BE_COMPLEMENTS),
    build: ([[sEn, sJa], [cEn, cJa]]) => ({
      q: `${sEn} ___ ${cEn}.`, choices: ['is', 'are', 'am', 'be'], answer: 'is',
      ja: `${sJa}は${cJa}。`,
    }),
  }),
  family({
    key: '5_be_plural', level: '5', topic: 'be動詞',
    explain: '複数の主語には be動詞 are を使う。',
    cases: cross(PLURAL_SUBJECTS, BE_COMPLEMENTS),
    build: ([[sEn, sJa], [cEn, cJa]]) => ({
      q: `${sEn} ___ ${cEn === 'a member of the club' ? 'members of the club' : cEn}.`, choices: ['are', 'is', 'am', 'be'], answer: 'are',
      ja: `${sJa}は${cJa}。`,
    }),
  }),
  family({
    key: '5_third_present', level: '5', topic: '一般動詞・3単現',
    explain: '現在の文で主語が3人称単数なら、一般動詞を3単現の形にする。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} ___ ${action.tail}.`,
      choices: [action.third, action.base, action.past, action.ing],
      answer: action.third,
      ja: `${sJa}は${action.jaStem}ます。`,
    }),
  }),
  family({
    key: '5_do_question', level: '5', topic: '否定文・疑問文',
    explain: '複数主語の一般動詞の疑問文は Do＋主語＋動詞原形で作る。',
    cases: cross(PLURAL_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `___ ${midSentence(sEn)} ${action.base} ${action.tail}?`,
      choices: ['Do', 'Does', 'Are', 'Is'], answer: 'Do',
      ja: `${sJa}は${action.jaStem}ますか。`,
    }),
  }),
  family({
    key: '5_does_question', level: '5', topic: '否定文・疑問文',
    explain: '3人称単数主語の一般動詞の疑問文は Does で始め、動詞は原形に戻す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `___ ${midSentence(sEn)} ${action.base} ${action.tail}?`,
      choices: ['Does', 'Do', 'Is', 'Has'], answer: 'Does',
      ja: `${sJa}は${action.jaStem}ますか。`,
    }),
  }),
  family({
    key: '5_can', level: '5', topic: '助動詞 can',
    explain: 'can の後ろには主語にかかわらず動詞の原形を置く。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} can ___ ${action.tail}.`,
      choices: [action.base, action.third, action.past, action.ing],
      answer: action.base,
      ja: `${sJa}は${action.jaDict}ことができます。`,
    }),
  }),
  family({
    key: '5_progressive', level: '5', topic: '現在進行形',
    explain: '現在進行形は be動詞＋動詞ing で「今〜している」を表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => {
      const context = action.base === 'study'
        ? ['for tomorrow’s test', '明日の試験に向けて']
        : ['right now', '今']
      return {
        q: `${sEn} is ___ ${action.neutralTail} ${context[0]}.`,
        choices: [action.ing, action.base, action.third, action.past],
        answer: action.ing,
        ja: `${sJa}は${context[1]}${actionJaTe(action)}います。`,
      }
    },
  }),
  family({
    key: '5_article', level: '5', topic: '冠詞',
    explain: '単数の職業名には a/an を付け、母音の音で始まる語には an を使う。',
    cases: cross(THIRD_SUBJECTS, ROLES),
    build: ([[sEn, sJa], [roleEn, roleJa, article]]) => ({
      q: `${sEn} wants to be ___ ${roleEn}.`,
      choices: article === 'an' ? ['an', 'a', 'the', 'some'] : ['a', 'an', 'the', 'some'],
      answer: article,
      ja: `${sJa}は${roleJa}になりたがっています。`,
    }),
  }),
  family({
    key: '5_time_preposition', level: '5', topic: '前置詞',
    explain: '時刻には at、曜日・日付には on、月・季節・朝には in を使う。',
    cases: TIME_PREPOSITIONS,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: '5_plural', level: '5', topic: '名詞の複数形',
    explain: '2つ以上を表す数の後ろでは、数えられる名詞を複数形にする。',
    cases: cross(PLURAL_NOUNS, LOCATIONS),
    build: ([[singular, plural, jaNoun, descriptor, jaDescriptor], [locationEn, locationJa]], index) => ({
      q: `There are ${index % 4 + 2} ${descriptor} ___ ${locationEn}.`,
      choices: [plural, singular, `${singular}s`, `${plural}es`],
      answer: plural,
      ja: `${locationJa}${jaDescriptor}${jaNoun}が${jaCounter(singular, index % 4 + 2)}${isPersonNoun(singular) ? 'います' : 'あります'}。`,
    }),
  }),
  family({
    key: '5_pronoun', level: '5', topic: '代名詞',
    explain: '動詞・前置詞の目的語には目的格を、名詞なしで所有を表すときは所有代名詞を使う。',
    cases: cross(OBJECT_PRONOUN_CASES, ['today', 'after lunch', 'at school', 'this morning']),
    build: ([[q, answer, choices, ja]], index) => {
      const row = Math.floor(index / 4)
      const [contextEn, contextJa] = PRONOUN_CONTEXTS[row][index % 4]
      const ownership = row >= 6
      const ownershipBody = contextEn.endsWith('that ') && q.startsWith('That ')
        ? q.replace(/^That /, 'the ')
        : midSentence(q)
      return {
        q: ownership
          ? `${contextEn}${ownershipBody}`
          : q.replace(/[.?!]$/, ` ${contextEn}$&`),
        choices,
        answer,
        ja: ownership ? `${contextJa}${ja}` : `${contextJa}、${ja}`,
      }
    },
  }),
  family({
    key: '5_wh', level: '5', topic: '疑問詞',
    explain: 'たずねたい内容に応じて where、when、who、why、which、whose、how、what を使い分ける。',
    cases: cross(WH_CASES, ['today', 'this week', 'at school', 'right now']),
    build: ([[q, answer, choices, ja]], index) => {
      const [contextEn, contextJa] = WH_CONTEXTS[answer][index % 4]
      return {
        q: q.replace('?', ` ${contextEn}?`),
        choices,
        answer,
        ja: `${contextJa}、${ja}`,
      }
    },
  }),
]

const ADJECTIVES = [
  ['tall', 'taller', 'tallest', '背が高い', 'when they stand together'],
  ['small', 'smaller', 'smallest', '小さい', 'in this photograph'],
  ['fast', 'faster', 'fastest', '速い', 'on the running track'],
  ['young', 'younger', 'youngest', '若い', 'according to their ages'],
  ['old', 'older', 'oldest', '年上の', 'by three years'],
  ['long', 'longer', 'longest', '長い', 'on the route map'],
  ['short', 'shorter', 'shortest', '短い', 'when measured carefully'],
  ['large', 'larger', 'largest', '大きい', 'in total area'],
  ['bright', 'brighter', 'brightest', '明るい', 'under the same light'],
  ['warm', 'warmer', 'warmest', '暖かい', 'this afternoon'],
]

const LONG_ADJECTIVES = [
  ['interesting', 'more interesting', 'most interesting', 'おもしろい', 'for the book club'],
  ['beautiful', 'more beautiful', 'most beautiful', '美しい', 'in the exhibition'],
  ['important', 'more important', 'most important', '重要な', 'for our future'],
  ['difficult', 'more difficult', 'most difficult', '難しい', 'in the final test'],
  ['popular', 'more popular', 'most popular', '人気がある', 'among local students'],
  ['expensive', 'more expensive', 'most expensive', '高価な', 'in the entire store'],
  ['useful', 'more useful', 'most useful', '役に立つ', 'for this project'],
  ['careful', 'more careful', 'most careful', '注意深い', 'during the experiment'],
]

const COMPARISON_CASES = [
  ['Ken is ___ than his younger brother.', 'taller', ['taller', 'tall', 'tallest', 'more tall'], 'ケンは弟より背が高いです。'],
  ['Ms. Brown is ___ than Ms. Green.', 'taller', ['taller', 'tall', 'tallest', 'more tall'], 'ブラウン先生はグリーン先生より背が高いです。'],
  ['This box is ___ than that one.', 'smaller', ['smaller', 'small', 'smallest', 'more small'], 'この箱はあの箱より小さいです。'],
  ['The blue bag is ___ than the black one.', 'smaller', ['smaller', 'small', 'smallest', 'most small'], '青いかばんは黒いかばんより小さいです。'],
  ['The express train is ___ than the local train.', 'faster', ['faster', 'fast', 'fastest', 'more fast'], '急行列車は普通列車より速いです。'],
  ['A cheetah is ___ than a horse.', 'faster', ['faster', 'fast', 'fastest', 'most fast'], 'チーターは馬より速いです。'],
  ['Emi is ___ than her sister.', 'younger', ['younger', 'young', 'youngest', 'more young'], 'エミは姉より若いです。'],
  ['My uncle is ___ than my father.', 'younger', ['younger', 'young', 'youngest', 'most young'], '叔父は父より若いです。'],
  ['This temple is ___ than the library.', 'older', ['older', 'old', 'oldest', 'more old'], 'この寺はその図書館より古いです。'],
  ['The stone bridge is ___ than the wooden one.', 'older', ['older', 'old', 'oldest', 'most old'], '石橋は木の橋より古いです。'],
  ['The Shinano River is ___ than this canal.', 'longer', ['longer', 'long', 'longest', 'more long'], '信濃川はこの運河より長いです。'],
  ['The first movie is ___ than the second one.', 'longer', ['longer', 'long', 'longest', 'most long'], '最初の映画は2本目より長いです。'],
  ['This route is ___ than the old route.', 'shorter', ['shorter', 'short', 'shortest', 'more short'], 'この経路は以前の経路より短いです。'],
  ['The red pencil is ___ than the blue one.', 'shorter', ['shorter', 'short', 'shortest', 'most short'], '赤い鉛筆は青い鉛筆より短いです。'],
  ['Central Park is ___ than our local park.', 'larger', ['larger', 'large', 'largest', 'more large'], 'セントラルパークは地元の公園より大きいです。'],
  ['The new classroom is ___ than the old one.', 'larger', ['larger', 'large', 'largest', 'most large'], '新しい教室は古い教室より広いです。'],
  ['This room is ___ than the hallway.', 'brighter', ['brighter', 'bright', 'brightest', 'more bright'], 'この部屋は廊下より明るいです。'],
  ['The desk lamp is ___ than the ceiling light.', 'brighter', ['brighter', 'bright', 'brightest', 'most bright'], '机の照明は天井の照明より明るいです。'],
  ['Tokyo is ___ than Sapporo today.', 'warmer', ['warmer', 'warm', 'warmest', 'more warm'], '今日は東京のほうが札幌より暖かいです。'],
  ['This afternoon is ___ than this morning.', 'warmer', ['warmer', 'warm', 'warmest', 'most warm'], '今日の午後は朝より暖かいです。'],
  ['This suitcase is ___ than mine.', 'heavier', ['heavier', 'heavy', 'heaviest', 'more heavy'], 'このスーツケースは私のものより重いです。'],
  ['The second puzzle is ___ than the first one.', 'easier', ['easier', 'easy', 'easiest', 'more easy'], '2番目のパズルは1番目より簡単です。'],
  ['Our new computer is ___ than the old one.', 'quieter', ['quieter', 'quiet', 'quietest', 'more quiet'], '新しいコンピューターは古いものより静かです。'],
  ['The city library is ___ than the school library.', 'busier', ['busier', 'busy', 'busiest', 'more busy'], '市立図書館は学校図書館より混んでいます。'],
]

const CONNECTOR_CASES = [
  ['We stayed inside ___ it was raining heavily.', 'because', ['because', 'although', 'if', 'until'], '雨が激しく降っていたので、私たちは屋内にいました。'],
  ['Mika took a taxi ___ she was late.', 'because', ['because', 'although', 'unless', 'while'], 'ミカは遅れていたので、タクシーに乗りました。'],
  ['I opened the window ___ the room was hot.', 'because', ['because', 'if', 'until', 'before'], '部屋が暑かったので、私は窓を開けました。'],
  ['___ we were tired, we finished the work.', 'Although', ['Although', 'Because', 'Until', 'If'], '私たちは疲れていましたが、仕事を終えました。'],
  ['___ the book was long, I enjoyed it.', 'Although', ['Although', 'Because', 'Before', 'Unless'], 'その本は長かったですが、私は楽しみました。'],
  ['___ he is young, he is very responsible.', 'Although', ['Although', 'When', 'Until', 'Because of'], '彼は若いですが、とても責任感があります。'],
  ['The phone rang ___ I was cooking dinner.', 'while', ['while', 'during', 'because of', 'after to'], '私が夕食を作っている間に電話が鳴りました。'],
  ['Please be quiet ___ the baby is sleeping.', 'while', ['while', 'during', 'until to', 'because of'], '赤ん坊が眠っている間は静かにしてください。'],
  ['I met Ken ___ I was walking home.', 'while', ['while', 'during', 'before of', 'unless'], '帰宅途中に歩いていると、ケンに会いました。'],
  ['Check the door ___ you leave home.', 'before', ['before', 'during', 'because', 'unless of'], '家を出る前にドアを確認してください。'],
  ['Wash your hands carefully ___ you eat.', 'before', ['before', 'while of', 'because of', 'until to'], '食事の前に丁寧に手を洗ってください。'],
  ['Read the instructions ___ you use the machine.', 'before', ['before', 'during', 'although of', 'after to'], '機械を使う前に説明書を読んでください。'],
  ['Call me ___ you need help.', 'if', ['if', 'because of', 'during', 'so to'], '助けが必要なら私に電話してください。'],
  ['Bring an umbrella with you ___ it rains.', 'if', ['if', 'during', 'because of', 'until'], '雨が降るなら傘を持っていってください。'],
  ['You can join us ___ you have time.', 'if', ['if', 'although of', 'during', 'before of'], '時間があれば私たちに加われます。'],
  ['Please wait here ___ the rain stops.', 'until', ['until', 'during', 'because', 'before of'], '雨がやむまでここで待ってください。'],
  ['The shop is open ___ nine o’clock.', 'until', ['until', 'during', 'because of', 'after to'], 'その店は9時まで開いています。'],
  ['We talked ___ the bus arrived.', 'until', ['until', 'during', 'although of', 'before of'], 'バスが来るまで私たちは話しました。'],
  ['We went home ___ the class ended.', 'after', ['after', 'while of', 'because', 'unless'], '授業が終わったあと、私たちは帰宅しました。'],
  ['Ken called me ___ he arrived at the station.', 'after', ['after', 'during', 'because of', 'unless of'], 'ケンは駅に着いたあと、私に電話しました。'],
  ['The children played outside ___ they finished lunch.', 'after', ['after', 'while of', 'until to', 'because of'], '子どもたちは昼食を終えたあと、外で遊びました。'],
  ['I smiled ___ I saw my old friend.', 'when', ['when', 'during', 'because of', 'until to'], '昔の友人を見たとき、私は笑顔になりました。'],
  ['Turn off the light ___ you leave the room.', 'when', ['when', 'during', 'because of', 'before of'], '部屋を出るときは明かりを消してください。'],
  ['The students stood up ___ the teacher entered.', 'when', ['when', 'during', 'although of', 'until to'], '先生が入ってきたとき、生徒たちは立ち上がりました。'],
]

const HOW_ACTIONS = [
  ['use', 'using', 'used', 'uses', 'this machine safely', 'この機械を安全に使う'],
  ['cross', 'crossing', 'crossed', 'crosses', 'the road safely', '道路を安全に渡る'],
  ['fill out', 'filling out', 'filled out', 'fills out', 'the form correctly', '用紙に正しく記入する'],
  ['operate', 'operating', 'operated', 'operates', 'the camera properly', 'カメラを正しく操作する'],
  ['solve', 'solving', 'solved', 'solves', 'this problem efficiently', 'この問題を効率よく解く'],
  ['pronounce', 'pronouncing', 'pronounced', 'pronounces', 'the word correctly', 'その単語を正しく発音する'],
  ['prepare', 'preparing', 'prepared', 'prepares', 'the dish safely', 'その料理を安全に作る'],
  ['open', 'opening', 'opened', 'opens', 'an account online', 'オンラインで口座を開く'],
  ['save', 'saving', 'saved', 'saves', 'the file correctly', 'ファイルを正しく保存する'],
  ['care for', 'caring for', 'cared for', 'cares for', 'this plant properly', 'この植物を正しく世話する'],
  ['connect', 'connecting', 'connected', 'connects', 'the printer correctly', 'プリンターを正しく接続する'],
  ['reset', 'resetting', 'reset', 'resets', 'the password safely', 'パスワードを安全に再設定する'],
  ['measure', 'measuring', 'measured', 'measures', 'the length accurately', '長さを正確に測る'],
  ['read', 'reading', 'read', 'reads', 'this map correctly', 'この地図を正しく読む'],
  ['give', 'giving', 'gave', 'gives', 'a clear presentation', '分かりやすく発表する'],
  ['write', 'writing', 'wrote', 'writes', 'a formal email', '正式なメールを書く'],
  ['recycle', 'recycling', 'recycled', 'recycles', 'this bottle properly', 'このボトルを正しくリサイクルする'],
  ['check', 'checking', 'checked', 'checks', 'the tire pressure safely', 'タイヤの空気圧を安全に確認する'],
  ['apply for', 'applying for', 'applied for', 'applies for', 'the scholarship online', 'オンラインで奨学金に応募する'],
  ['book', 'booking', 'booked', 'books', 'a train ticket online', 'オンラインで列車の切符を予約する'],
]

const PURPOSE_CASES = [
  ['Ken joined the tennis club', 'practice', 'every week', 'ケンは毎週練習するためにテニス部へ入りました'],
  ['Emi went to the library', 'study', 'for the exam', 'エミは試験勉強をするために図書館へ行きました'],
  ['I turned on the television', 'watch', 'the news', '私はニュースを見るためにテレビをつけました'],
  ['My father went to the kitchen', 'cook', 'dinner', '父は夕食を作るために台所へ行きました'],
  ['The students stayed after class', 'clean', 'the room', '生徒たちは教室を掃除するために放課後も残りました'],
  ['Ms. Brown arrived early', 'open', 'the shop', 'ブラウンさんは店を開けるために早く到着しました'],
  ['We sat at the desk', 'use', 'the computer', '私たちはコンピューターを使うために机に座りました'],
  ['Ken went next door', 'help', 'his neighbor', 'ケンは近所の人を手伝うために隣の家へ行きました'],
  ['I picked up my phone', 'call', 'Grandma', '私は祖母へ電話するために携帯電話を手に取りました'],
  ['Emi went outside', 'walk', 'the dog', 'エミは犬を散歩させるために外へ出ました'],
  ['My sister sat at the piano', 'practice', 'a new song', '姉は新しい曲を練習するためにピアノの前に座りました'],
  ['The reporter stayed at the office', 'write', 'an article', '記者は記事を書くために事務所に残りました'],
  ['We went to the park', 'take', 'pictures', '私たちは写真を撮るために公園へ行きました'],
  ['My mother stopped at the store', 'buy', 'groceries', '母は食料品を買うために店へ寄りました'],
  ['Mr. Sato went to school', 'teach', 'an evening class', '佐藤先生は夜の授業を教えるために学校へ行きました'],
  ['I checked the seating chart', 'choose', 'a good seat', '私はよい席を選ぶために座席表を確認しました'],
  ['The students joined the discussion', 'speak', 'English', '生徒たちは英語を話すために討論へ参加しました'],
  ['My father left home early', 'drive', 'to work', '父は車で仕事へ行くために早く家を出ました'],
  ['We visited the museum', 'learn', 'about local history', '私たちは郷土史を学ぶために博物館を訪れました'],
  ['The team met online', 'plan', 'the next event', 'チームは次の行事を計画するためにオンラインで集まりました'],
  ['Yuki read the manual', 'understand', 'the new system', 'ユキは新しい制度を理解するために説明書を読みました'],
  ['I saved some money', 'travel', 'abroad', '私は海外旅行をするためにお金をためました'],
  ['The class held a sale', 'raise', 'money for charity', 'クラスは慈善活動の資金を集めるために販売会を開きました'],
  ['We used a map', 'find', 'the shortest route', '私たちは最短経路を見つけるために地図を使いました'],
]

const EXTRA_VERB_FORMS = Object.freeze({
  give: { third: 'gives', past: 'gave', ing: 'giving' },
  show: { third: 'shows', past: 'showed', ing: 'showing' },
  send: { third: 'sends', past: 'sent', ing: 'sending' },
  lend: { third: 'lends', past: 'lent', ing: 'lending' },
  make: { third: 'makes', past: 'made', ing: 'making' },
  live: { third: 'lives', past: 'lived', ing: 'living' },
  know: { third: 'knows', past: 'knew', ing: 'knowing' },
  work: { third: 'works', past: 'worked', ing: 'working' },
  belong: { third: 'belongs', past: 'belonged', ing: 'belonging' },
  stay: { third: 'stays', past: 'stayed', ing: 'staying' },
  learn: { third: 'learns', past: 'learned', ing: 'learning' },
  plan: { third: 'plans', past: 'planned', ing: 'planning' },
  understand: { third: 'understands', past: 'understood', ing: 'understanding' },
  travel: { third: 'travels', past: 'traveled', ing: 'traveling' },
  raise: { third: 'raises', past: 'raised', ing: 'raising' },
  find: { third: 'finds', past: 'found', ing: 'finding' },
})

function formsFor(base) {
  const action = ACTIONS.find((item) => item.base === base)
  if (action) return action
  const forms = EXTRA_VERB_FORMS[base]
  if (!forms) throw new Error(`動詞活用が未登録です: ${base}`)
  return { base, ...forms }
}

const MODAL_CASES = [
  ['must', ['must', 'must to', 'has', 'can to'], '義務を表す must の後ろには動詞原形を置く。', '〜しなければなりません', 'According to the rule,'],
  ['should', ['should', 'should to', 'had', 'does'], '助言を表す should の後ろには動詞原形を置く。', '〜したほうがよいです', 'For better results,'],
  ['may', ['may', 'may to', 'is', 'does'], '許可・可能性を表す may の後ろには動詞原形を置く。', '〜してもよいです', 'With permission,'],
  ['can', ['can', 'can to', 'is', 'does'], '可能を表す can の後ろには動詞原形を置く。', '〜することができます', 'With this support,'],
]

const FOUR_FAMILIES = [
  family({
    key: '4_past', level: '4', topic: '過去形',
    explain: '過去の出来事は動詞の過去形で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} ___ ${action.neutralTail} yesterday.`,
      choices: [action.past, action.base, action.third, action.ing],
      answer: action.past,
      ja: `${sJa}は昨日、${action.jaNeutralStem}ました。`,
    }),
  }),
  family({
    key: '4_past_question', level: '4', topic: '過去形',
    explain: '過去の一般動詞の疑問文は Did＋主語＋動詞原形で作る。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `Did ${midSentence(sEn)} ___ ${action.neutralTail} yesterday?`,
      choices: [action.base, action.past, action.third, action.ing],
      answer: action.base,
      ja: `${sJa}は昨日、${action.jaNeutralStem}ましたか。`,
    }),
  }),
  family({
    key: '4_past_progressive', level: '4', topic: '過去進行形',
    explain: '過去進行形は was/were＋動詞ing で、過去のある時点で進行中だった動作を表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} was ___ ${action.neutralTail} at that time.`,
      choices: [action.ing, action.base, action.past, action.third],
      answer: action.ing,
      ja: `${sJa}はその時、${actionJaTe(action)}いました。`,
    }),
  }),
  family({
    key: '4_will', level: '4', topic: '未来表現',
    explain: '未来の予測・意志は will＋動詞原形で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} will ___ ${action.neutralTail} tomorrow.`,
      choices: [action.base, action.third, action.past, action.ing],
      answer: action.base,
      ja: `${sJa}は明日、${action.jaNeutralStem}ます。`,
    }),
  }),
  family({
    key: '4_going_to', level: '4', topic: '未来表現',
    explain: '予定は be going to＋動詞原形で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} is going to ___ ${action.neutralTail} tomorrow.`,
      choices: [action.base, action.third, action.past, action.ing],
      answer: action.base,
      ja: `${sJa}は明日、${action.jaNeutralDict}予定です。`,
    }),
  }),
  family({
    key: '4_comparative', level: '4', topic: '比較',
    explain: '2者を比べるときは比較級＋than を使う。',
    cases: COMPARISON_CASES,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: '4_superlative', level: '4', topic: '比較',
    explain: '3者以上の中で最も〜と表すときは the＋最上級を使う。',
    cases: cross(LONG_ADJECTIVES, THIRD_SUBJECTS),
    build: ([[base, comparative, superlative, jaAdj, context], [sEn, sJa]]) => ({
      q: `${sEn} chose the ___ option of the three ${context}.`,
      choices: [superlative, comparative, base, `${base}er`],
      answer: superlative,
      ja: `${sJa}は3つのうち最も${jaAdj}選択肢を選びました。`,
    }),
  }),
  family({
    key: '4_modal', level: '4', topic: '助動詞',
    explain: '助動詞の後ろには動詞の原形を置く。',
    cases: cross(ACTIONS, MODAL_CASES),
    build: ([action, [modal, choices, modalExplain, , lead]]) => ({
      q: `${lead} you ___ ${action.base} ${action.neutralTail}.`,
      choices, answer: modal, explain: modalExplain,
      ja: `あなたは${modal === 'must' ? `${action.jaNeutralDict}必要があります` : modal === 'should' ? `${action.jaNeutralDict}ほうがよいです` : modal === 'may' ? `${action.jaNeutralDict}ことが許されています` : `${action.jaNeutralDict}ことができます`}。`,
    }),
  }),
  family({
    key: '4_infinitive_plan', level: '4', topic: '不定詞',
    explain: 'want/hope/plan の後ろでは to＋動詞原形を目的語にする。',
    cases: cross(ACTIONS, ['want', 'hope', 'plan', 'would like']),
    build: ([action, verb]) => ({
      q: `We ${verb} ___ ${action.neutralTail} next week.`,
      choices: [`to ${action.base}`, action.ing, action.base, action.past],
      answer: `to ${action.base}`,
      ja: `私たちは来週、${verb === 'plan' ? `${action.jaNeutralDict}ことを計画しています` : verb === 'hope' ? `${action.jaNeutralDict}ことを望んでいます` : `${action.jaNeutralStem}たいと思っています`}。`,
    }),
  }),
  family({
    key: '4_infinitive_purpose', level: '4', topic: '不定詞',
    explain: '目的を表す不定詞は to＋動詞原形で「〜するために」を表す。',
    cases: PURPOSE_CASES,
    build: ([lead, base, tail, ja]) => {
      const forms = formsFor(base)
      return {
        q: `${lead} ___ ${tail}.`,
        choices: [`to ${base}`, forms.ing, forms.past, forms.third],
        answer: `to ${base}`,
        ja: `${ja}。`,
      }
    },
  }),
  family({
    key: '4_gerund_object', level: '4', topic: '動名詞',
    explain: 'enjoy/finish の目的語には動名詞を使う。',
    cases: cross(ACTIONS, ['enjoys', 'finished', 'likes', 'started']),
    build: ([action, verb]) => ({
      q: `Emi ${verb} ___ ${action.neutralTail}.`,
      choices: [action.ing, action.base, action.past, `to ${action.past}`],
      answer: action.ing,
      ja: `エミは${verb === 'finished' ? `${action.jaNeutralDict}のを終えました` : verb === 'started' ? `${action.jaNeutralStem}始めました` : verb === 'likes' ? `${action.jaNeutralDict}のが好きです` : `${action.jaNeutralDict}ことを楽しんでいます`}。`,
    }),
  }),
  family({
    key: '4_gerund_preposition', level: '4', topic: '動名詞',
    explain: '前置詞の後ろに動詞を置くときは動名詞にする。',
    cases: cross(ACTIONS, ['before', 'after']),
    build: ([action, prep]) => ({
      q: `${prep === 'before' ? 'Please prepare carefully' : 'Take a short break'} ${prep} ___ ${action.neutralTail}.`,
      choices: [action.ing, action.base, `to ${action.base}`, action.past],
      answer: action.ing,
      ja: `${prep === 'before' ? action.jaNeutralDict : actionJaPast(action)}${prep === 'before' ? '前に、よく準備してください' : '後で、少し休憩してください'}。`,
    }),
  }),
  family({
    key: '4_conjunction', level: '4', topic: '接続詞',
    explain: '節どうしの意味関係に合う接続詞を選ぶ。',
    cases: CONNECTOR_CASES,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: '4_there', level: '4', topic: 'There is/are',
    explain: '過去に複数のものがあったことは There were＋複数名詞で表す。',
    cases: cross(PLURAL_NOUNS, LOCATIONS),
    build: ([[singular, plural, jaNoun], [locationEn, locationJa]], index) => ({
      q: `There ___ ${index % 5 + 2} ${plural} ${locationEn} yesterday.`,
      choices: ['were', 'was', 'are', 'is'], answer: 'were',
      ja: `昨日、${locationJa}${jaNoun}が${jaCounter(singular, index % 5 + 2)}${isPersonNoun(singular) ? 'いました' : 'ありました'}。`,
    }),
  }),
  family({
    key: '4_question_infinitive', level: '4', topic: '疑問詞+不定詞',
    explain: 'how＋to＋動詞原形で「どのように〜すべきか・〜する方法」を表す。',
    cases: HOW_ACTIONS,
    build: ([base, ing, past, third, tail, ja]) => ({
      q: `Please tell me how ___ ${tail}.`,
      choices: [`to ${base}`, ing, past, third],
      answer: `to ${base}`,
      ja: `${ja}方法を教えてください。`,
    }),
  }),
  family({
    key: '4_tag', level: '4', topic: '付加疑問',
    explain: '肯定文の後ろには否定形の付加疑問を置く。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => {
      const pronoun = subjectPronoun(sEn)
      const answer = `doesn’t ${pronoun}`
      return {
        q: `${sEn} ${action.third} ${action.tail}, ___?`,
        choices: [answer, `does ${pronoun}`, `isn’t ${pronoun}`, `didn’t ${pronoun}`],
        answer,
        ja: `${sJa}は${action.jaStem}ますよね。`,
      }
    },
  }),
  family({
    key: '4_exclamation', level: '4', topic: '感嘆文',
    explain: '形容詞＋名詞を強調する感嘆文は What a/an ...! の形にする。',
    cases: cross([
      ['exciting', 'adventure', 'わくわくする冒険', 'an'],
      ['beautiful', 'picture', '美しい絵', 'a'],
      ['important', 'lesson', '重要な教訓', 'an'],
      ['difficult', 'problem', '難しい問題', 'a'],
      ['popular', 'singer', '人気の歌手', 'a'],
      ['expensive', 'watch', '高価な腕時計', 'an'],
      ['useful', 'tool', '役立つ道具', 'a'],
      ['careful', 'driver', '注意深い運転手', 'a'],
    ], ['this is', 'that was', 'it is']),
    build: ([[base, noun, jaNoun, article], ending]) => ({
      q: `___ ${article} ${base} ${noun} ${ending}!`,
      choices: ['What', 'How', 'So', 'Which'], answer: 'What',
      ja: `なんて${jaNoun}なのでしょう。`,
    }),
  }),
  family({
    key: '4_used_to', level: '4', topic: 'used to',
    explain: 'used to＋動詞原形で、現在とは異なる過去の習慣を表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} ___ ${action.base} ${action.neutralTail} years ago.`,
      choices: ['used to', 'was used to', 'use to', 'using to'], answer: 'used to',
      ja: `${sJa}は何年も前、よく${actionJaPast(action)}ものです。`,
    }),
  }),
]

function subjectPronoun(subject) {
  return ['Emi', 'My sister', 'My mother', 'Ms. Brown'].includes(subject) ? 'she' : 'he'
}

const DURATION_STATES = [
  ['live', 'lived', 'in this town', 'この町に住んで', 'five years'],
  ['know', 'known', 'Mr. Lee', 'リー先生と知り合って', 'ten years'],
  ['work', 'worked', 'at this company', 'この会社で働いて', 'three years'],
  ['study', 'studied', 'French', 'フランス語を勉強して', 'six months'],
  ['use', 'used', 'this computer', 'このコンピューターを使って', 'two years'],
  ['belong', 'belonged', 'to the club', 'その部に所属して', 'four years'],
  ['stay', 'stayed', 'with this family', 'この家族と暮らして', 'a month'],
  ['teach', 'taught', 'at our school', '私たちの学校で教えて', 'eight years'],
]

const PASSIVE_EVENTS = [
  ['The classroom', 'その教室', 'is', 'cleaned', 'the students', '生徒たち', 'every Friday', '毎週金曜日に', '掃除されます'],
  ['This bridge', 'この橋', 'is', 'used', 'many commuters', '多くの通勤者', 'every day', '毎日', '利用されます'],
  ['The school festival', 'その学園祭', 'is', 'held', 'the student council', '生徒会', 'each autumn', '毎年秋に', '開催されます'],
  ['These vegetables', 'これらの野菜', 'are', 'grown', 'local farmers', '地元の農家', 'without chemicals', '農薬を使わずに', '栽培されます'],
  ['The library', 'その図書館', 'is', 'visited', 'many children', '多くの子どもたち', 'on weekends', '週末に', '訪れられます'],
  ['This song', 'この歌', 'is', 'loved', 'people around the world', '世界中の人々', 'even today', '今でも', '愛されています'],
  ['The final decision', '最終決定', 'is', 'made', 'the committee', '委員会', 'after the meeting', '会議後に', '下されます'],
  ['The package', 'その小包', 'is', 'delivered', 'a local driver', '地元の配達員', 'before noon', '正午前に', '配達されます'],
  ['The old temple', 'その古い寺', 'is', 'protected', 'the community', '地域社会', 'with great care', '細心の注意を払って', '守られています'],
  ['The results', 'その結果', 'are', 'announced', 'the principal', '校長', 'on Monday', '月曜日に', '発表されます'],
  ['The new rule', 'その新しい規則', 'is', 'explained', 'our teacher', '私たちの先生', 'in class', '授業で', '説明されます'],
  ['The windows', 'その窓', 'are', 'opened', 'the staff', '職員', 'every morning', '毎朝', '開けられます'],
  ['English', '英語', 'is', 'taught', 'Ms. Brown', 'ブラウン先生', 'in this class', 'この授業で', '教えられます'],
  ['School meals', '学校給食', 'are', 'served', 'the kitchen staff', '調理員', 'at noon', '正午に', '提供されます'],
  ['The letters', 'その手紙', 'are', 'sorted', 'postal workers', '郵便局員', 'every morning', '毎朝', '仕分けされます'],
  ['Each patient room', '各病室', 'is', 'checked', 'a nurse', '看護師', 'twice a day', '1日に2回', '点検されます'],
  ['Concert tickets', '演奏会の切符', 'are', 'sold', 'the school office', '学校事務室', 'online', 'オンラインで', '販売されます'],
  ['The data', 'そのデータ', 'is', 'stored', 'the research center', '研究センター', 'on a secure server', '安全なサーバーに', '保存されます'],
  ['The roads', 'その道路', 'are', 'repaired', 'the city', '市', 'during summer', '夏の間に', '補修されます'],
  ['These uniforms', 'これらの制服', 'are', 'worn', 'all team members', 'チーム全員', 'during matches', '試合中に', '着用されます'],
]

const RELATIVE_PEOPLE = [
  ['a student', '生徒', 'who', 'students'],
  ['a teacher', '先生', 'who', 'teachers'],
  ['a musician', '音楽家', 'who', 'musicians'],
  ['a neighbor', '近所の人', 'who', 'neighbors'],
  ['a doctor', '医師', 'who', 'doctors'],
  ['an artist', '芸術家', 'who', 'artists'],
  ['a volunteer', 'ボランティア', 'who', 'volunteers'],
  ['a coach', 'コーチ', 'who', 'coaches'],
]

const OBJECT_RELATIVE_EVENTS = [
  ['the cake', 'そのケーキ', 'Emi made', 'エミが作った'],
  ['the picture', 'その写真', 'Ken took', 'ケンが撮った'],
  ['the book', 'その本', 'Ms. Brown recommended', 'ブラウン先生が勧めた'],
  ['the song', 'その歌', 'the children sang', '子どもたちが歌った'],
  ['the letter', 'その手紙', 'my uncle wrote', '叔父が書いた'],
  ['the bag', 'そのかばん', 'my sister chose', '姉が選んだ'],
  ['the bicycle', 'その自転車', 'Mr. Sato repaired', '佐藤さんが修理した'],
  ['the movie', 'その映画', 'we watched', '私たちが見た'],
  ['the plan', 'その計画', 'the team discussed', 'チームが話し合った'],
  ['the computer', 'そのコンピューター', 'our school bought', '学校が購入した'],
]

const SVOO_EVENTS = [
  ['gave', 'give', 'me', 'a useful map', '私に役立つ地図をくれました'],
  ['showed', 'show', 'us', 'the new classroom', '私たちに新しい教室を見せました'],
  ['sent', 'send', 'her', 'a birthday card', '彼女に誕生日カードを送りました'],
  ['taught', 'teach', 'them', 'an English song', '彼らに英語の歌を教えました'],
  ['lent', 'lend', 'Ken', 'a bicycle', 'ケンに自転車を貸しました'],
  ['bought', 'buy', 'his son', 'a warm coat', '息子に暖かい上着を買いました'],
  ['made', 'make', 'the children', 'some sandwiches', '子どもたちにサンドイッチを作りました'],
  ['wrote', 'write', 'me', 'a long email', '私に長いメールを書きました'],
]

const SVOC_EVENTS = [
  ['made', 'the room', 'bright', 'その部屋を明るくしました'],
  ['kept', 'the door', 'open', 'ドアを開けたままにしました'],
  ['found', 'the task', 'difficult', 'その課題が難しいと分かりました'],
  ['called', 'the puppy', 'Momo', 'その子犬をモモと呼びました'],
  ['painted', 'the wall', 'white', '壁を白く塗りました'],
  ['left', 'the window', 'unlocked', '窓の鍵を開けたままにしました'],
  ['named', 'the boat', 'Hope', 'その船をホープと名付けました'],
  ['considered', 'the idea', 'useful', 'その考えを役立つと考えました'],
]

const RESULT_ADJECTIVES = [
  ['tired', 'he could hardly walk', 'ほとんど歩けないほど疲れていました'],
  ['busy', 'she could not answer the phone', '電話に出られないほど忙しくしていました'],
  ['cold', 'the lake began to freeze', '湖が凍り始めるほど寒くなりました'],
  ['excited', 'he could not sleep', '眠れないほど興奮していました'],
  ['hungry', 'she ate two large meals', 'たっぷり2食分を食べるほど空腹でした'],
  ['quiet', 'we could hear the clock', '時計の音が聞こえるほど静かでした'],
  ['dark', 'we could not see the road', '道が見えないほど暗くなりました'],
  ['kind', 'everyone trusted her', '皆が彼女を信頼するほど親切でした'],
]

const AS_COMPARISON_CASES = [
  ['The new tower is twice as ___ as the old building.', 'tall', ['tall', 'taller', 'tallest', 'more tall'], '新しい塔は古い建物の2倍の高さです。'],
  ['This storage room is three times as ___ as our office.', 'large', ['large', 'larger', 'largest', 'more large'], 'この倉庫は私たちの事務所の3倍の広さです。'],
  ['The red rope is twice as ___ as the blue one.', 'long', ['long', 'longer', 'longest', 'more long'], '赤いロープは青いロープの2倍の長さです。'],
  ['This lamp is twice as ___ as the desk light.', 'bright', ['bright', 'brighter', 'brightest', 'more bright'], 'この照明は机の照明の2倍の明るさです。'],
  ['The express train is twice as ___ as the local bus.', 'fast', ['fast', 'faster', 'fastest', 'more fast'], '急行列車は路線バスの2倍の速さです。'],
  ['This suitcase is three times as ___ as my backpack.', 'heavy', ['heavy', 'heavier', 'heaviest', 'more heavy'], 'このスーツケースは私のリュックの3倍の重さです。'],
  ['The main hall is twice as ___ as this classroom.', 'wide', ['wide', 'wider', 'widest', 'more wide'], '大広間はこの教室の2倍の幅があります。'],
  ['The new pool is twice as ___ as the old one.', 'deep', ['deep', 'deeper', 'deepest', 'more deep'], '新しいプールは古いプールの2倍の深さです。'],
  ['Mount A is three times as ___ as that hill.', 'high', ['high', 'higher', 'highest', 'more high'], 'エー山はあの丘の3倍の高さです。'],
  ['This textbook is twice as ___ as the workbook.', 'thick', ['thick', 'thicker', 'thickest', 'more thick'], 'この教科書は問題集の2倍の厚さです。'],
  ['The new bridge is twice as ___ as the old bridge.', 'strong', ['strong', 'stronger', 'strongest', 'more strong'], '新しい橋は古い橋の2倍の強度があります。'],
  ['The conference room is three times as ___ as this room.', 'large', ['large', 'larger', 'largest', 'more large'], '会議室はこの部屋の3倍の広さです。'],
  ['The northern route is twice as ___ as the coastal route.', 'long', ['long', 'longer', 'longest', 'more long'], '北回りの経路は海岸沿いの経路の2倍の長さです。'],
  ['The new battery lasts twice as ___ as the old one.', 'long', ['long', 'longer', 'longest', 'more longer'], '新しい電池は古い電池の2倍長持ちします。'],
  ['This screen is twice as ___ as my phone screen.', 'wide', ['wide', 'wider', 'widest', 'more wide'], 'この画面は携帯電話の画面の2倍の幅があります。'],
  ['The winter coat is twice as ___ as this jacket.', 'heavy', ['heavy', 'heavier', 'heaviest', 'more heavy'], 'その冬用コートはこの上着の2倍の重さです。'],
  ['The city park is three times as ___ as our schoolyard.', 'large', ['large', 'larger', 'largest', 'more large'], '市立公園は校庭の3倍の広さです。'],
  ['This candle burns twice as ___ as the small one.', 'bright', ['bright', 'brighter', 'brightest', 'more bright'], 'このろうそくは小さいものの2倍明るく燃えます。'],
  ['The new elevator moves twice as ___ as the old one.', 'fast', ['fast', 'faster', 'fastest', 'more fast'], '新しいエレベーターは古いものの2倍の速さで動きます。'],
  ['The science building is four times as ___ as the old lab.', 'large', ['large', 'larger', 'largest', 'more large'], '理科棟は古い実験室の4倍の広さです。'],
]

const THREE_FAMILIES = [
  family({
    key: '3_perfect_experience', level: '3', topic: '現在完了',
    explain: '経験を表す現在完了は have/has＋過去分詞を使う。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action], index) => {
      const frequencyEn = ['once', 'twice', 'three times', 'four times'][index % 4]
      const frequencyJa = ['1回', '2回', '3回', '4回'][index % 4]
      return {
        q: `${sEn} has ___ ${action.neutralTail} ${frequencyEn}.`,
        choices: [action.pp, action.past, action.base, action.ing],
        answer: action.pp,
        ja: `${sJa}は${actionJaPast(action)}ことが${frequencyJa}あります。`,
      }
    },
  }),
  family({
    key: '3_perfect_completion', level: '3', topic: '現在完了',
    explain: '完了・結果を表す現在完了は has just/already＋過去分詞を使う。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action], index) => ({
      q: `${sEn} has ${index % 2 ? 'already' : 'just'} ___ ${action.neutralTail}.`,
      choices: [action.pp, action.past, action.base, action.ing],
      answer: action.pp,
      ja: `${sJa}は${index % 2 ? 'すでに' : 'ちょうど'}${actionJaPast(action)}ところです。`,
    }),
  }),
  family({
    key: '3_perfect_duration', level: '3', topic: '現在完了',
    explain: '過去から現在までの継続は have/has＋過去分詞＋for 期間で表す。',
    cases: cross(THIRD_SUBJECTS, DURATION_STATES),
    build: ([[sEn, sJa], [base, pp, tail, jaState, duration]]) => {
      const forms = formsFor(base)
      return {
        q: `${sEn} has ___ ${tail} for ${duration}.`,
        choices: [pp, base, forms.ing, forms.third],
        answer: pp,
        ja: `${sJa}は${duration === 'five years' ? '5年間' : duration === 'ten years' ? '10年間' : duration === 'three years' ? '3年間' : duration === 'six months' ? '6か月間' : duration === 'two years' ? '2年間' : duration === 'four years' ? '4年間' : duration === 'a month' ? '1か月間' : '8年間'}、${jaState}います。`,
      }
    },
  }),
  family({
    key: '3_passive_present', level: '3', topic: '受動態',
    explain: '現在の受動態は am/is/are＋過去分詞で作る。',
    cases: PASSIVE_EVENTS,
    build: ([objectEn, objectJa, be, pp, agentEn, agentJa, timeEn, timeJa, jaPassive]) => ({
      q: `${objectEn} ___ ${pp} by ${agentEn} ${timeEn}.`,
      choices: [be, be === 'is' ? 'are' : 'is', 'was', 'be'],
      answer: be,
      ja: `${objectJa}は${timeJa}${agentJa}によって${jaPassive}。`,
    }),
  }),
  family({
    key: '3_passive_modal', level: '3', topic: '受動態',
    explain: '助動詞を含む受動態は 助動詞＋be＋過去分詞の形にする。',
    cases: PASSIVE_EVENTS,
    build: ([objectEn, objectJa, , pp, , , timeEn, timeJa, jaPassive], index) => {
      const modal = ['must', 'can', 'will', 'can', 'can', 'may', 'should', 'will', 'must', 'will', 'should', 'must', 'should', 'will', 'must', 'must', 'can', 'must', 'will', 'must'][index]
      const jaCore = jaPassive.replace(/ます$/, '')
      return {
        q: `${objectEn} ${modal} ___ ${pp} ${timeEn}.`,
        choices: ['be', 'been', 'being', 'is'],
        answer: 'be',
        ja: `${objectJa}は${timeJa}${modal === 'must' ? `${jaCore}なければなりません` : modal === 'should' ? `${jaCore}るべきです` : modal === 'can' ? `${jaCore}ることができます` : modal === 'may' ? `${jaCore}るかもしれません` : jaPassive}。`,
      }
    },
  }),
  family({
    key: '3_relative_subject', level: '3', topic: '関係代名詞',
    explain: '人を先行詞とし、関係詞節の主語になるときは who を使う。',
    cases: cross(ACTIONS, RELATIVE_PEOPLE),
    build: ([action, [personEn, personJa]]) => ({
      q: `I know ${personEn} ___ ${action.third} ${action.neutralTail}.`,
      choices: ['who', 'which', 'whose', 'where'], answer: 'who',
      ja: `私は${action.jaNeutralDict}${personJa}を知っています。`,
    }),
  }),
  family({
    key: '3_relative_object', level: '3', topic: '関係代名詞',
    explain: '物を先行詞とし、関係詞節の目的語になるときは that/which を使う。',
    cases: cross(OBJECT_RELATIVE_EVENTS, ['yesterday', 'last week', 'for the event', 'at school']),
    build: ([[objectEn, objectJa, clauseEn, clauseJa], suffix]) => ({
      q: `This is ${objectEn} ___ ${clauseEn} ${suffix}.`,
      choices: ['that', 'who', 'whose', 'where'], answer: 'that',
      ja: `これは${suffix === 'yesterday' ? '昨日' : suffix === 'last week' ? '先週' : suffix === 'for the event' ? '行事のために' : '学校で'}${clauseJa}${objectJa}です。`,
    }),
  }),
  family({
    key: '3_indirect_question', level: '3', topic: '間接疑問',
    explain: '間接疑問では〈疑問詞＋主語＋動詞〉の平叙文語順を使う。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `Do you know why ${midSentence(sEn)} ___ ${action.neutralTail}?`,
      choices: [action.third, `does ${action.base}`, action.base, action.ing],
      answer: action.third,
      ja: `${sJa}がなぜ${action.jaNeutralDict}のか知っていますか。`,
    }),
  }),
  family({
    key: '3_tell_to', level: '3', topic: '不定詞応用',
    explain: 'tell/want/ask＋人＋to＋動詞原形で「人に〜するよう言う・望む・頼む」を表す。',
    cases: cross(['told', 'asked', 'wanted'], THIRD_SUBJECTS, ACTIONS),
    build: ([verb, [sEn, sJa], action]) => ({
      q: `Our teacher ${verb} ${sEn} ___ ${action.neutralTail}.`,
      choices: [`to ${action.base}`, action.base, action.ing, action.past],
      answer: `to ${action.base}`,
      ja: `先生は${sJa}に${action.jaNeutralDict}よう${verb === 'told' ? '言いました' : verb === 'asked' ? '頼みました' : '望みました'}。`,
    }),
  }),
  family({
    key: '3_comparison', level: '3', topic: '比較応用',
    explain: '倍数表現は 倍数＋as＋原級＋as の語順にする。',
    cases: AS_COMPARISON_CASES,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: '3_svoo', level: '3', topic: '文型(SVOO/SVOC)',
    explain: 'give/show/send などは〈動詞＋人＋物〉のSVOOを作れる。',
    cases: cross(THIRD_SUBJECTS, SVOO_EVENTS),
    build: ([[sEn, sJa], [past, base, person, thing, jaEvent]]) => {
      const forms = formsFor(base)
      return {
        q: `${sEn} ___ ${person} ${thing}.`,
        choices: [past, base, forms.third, forms.ing],
        answer: past,
        ja: `${sJa}は${jaEvent}。`,
      }
    },
  }),
  family({
    key: '3_svoc', level: '3', topic: '文型(SVOO/SVOC)',
    explain: 'SVOCでは目的語の後ろの補語が、目的語の状態・名称を説明する。',
    cases: cross(THIRD_SUBJECTS, SVOC_EVENTS),
    build: ([[sEn, sJa], [past, object, complement, jaEvent]]) => ({
      q: `${sEn} ${past} ${object} ___.`,
      choices: [complement, `${complement}ly`, `to ${complement}`, `${complement}ing`],
      answer: complement,
      ja: `${sJa}は${jaEvent}。`,
    }),
  }),
  family({
    key: '3_so_that', level: '3', topic: 'so...that',
    explain: 'so＋形容詞＋that節で「とても〜なので…」という結果を表す。',
    cases: cross(THIRD_SUBJECTS, RESULT_ADJECTIVES, ['yesterday', 'after the trip']),
    build: ([[sEn, sJa], [adj, resultEn, jaResult], time]) => ({
      q: `${sEn} was ___ ${adj} that ${resultEn} ${time}.`,
      choices: ['so', 'such', 'too', 'enough'], answer: 'so',
      ja: `${sJa}は${time === 'yesterday' ? '昨日' : '旅行後'}、${jaResult}。`,
    }),
  }),
  family({
    key: '3_participle', level: '3', topic: '分詞',
    explain: '名詞が動作をしているなら現在分詞、動作を受けるなら過去分詞で修飾する。',
    cases: cross(ACTIONS, ['student', 'teacher', 'woman', 'man']),
    build: ([action, noun]) => ({
      q: `The ${noun} ___ ${action.neutralTail} is my neighbor.`,
      choices: [action.ing, action.pp, action.base, action.third],
      answer: action.ing,
      ja: `${action.jaNeutralDict}${noun === 'student' ? '生徒' : noun === 'teacher' ? '先生' : noun === 'woman' ? '女性' : '男性'}は私の近所の人です。`,
    }),
  }),
  family({
    key: '3_future_time_clause', level: '3', topic: '接続詞',
    explain: '未来を表す時・条件の副詞節では、willを使わず現在形を使う。',
    cases: cross(['when', 'after', 'before', 'as soon as'], THIRD_SUBJECTS, ACTIONS),
    build: ([connector, [sEn, sJa], action]) => ({
      q: `I will call you ${connector} ${midSentence(sEn)} ___ ${action.neutralTail}.`,
      choices: [action.third, `will ${action.base}`, action.past, action.ing],
      answer: action.third,
      ja: `${sJa}が${action.jaNeutralDict}${connector === 'when' ? 'とき' : connector === 'after' ? 'あとで' : connector === 'before' ? '前に' : 'とすぐに'}、電話します。`,
    }),
  }),
  family({
    key: '3_bare_infinitive', level: '3', topic: '原形不定詞',
    explain: 'make＋人＋動詞原形で「人に〜させる」を表す。',
    cases: ACTIONS,
    build: (action) => ({
      q: `The situation made Ken ___ ${action.neutralTail}.`,
      choices: [action.base, `to ${action.base}`, action.ing, action.past],
      answer: action.base,
      ja: `その状況により、ケンは${action.jaNeutralDict}ことになりました。`,
    }),
  }),
  family({
    key: '3_perfect_progressive', level: '3', topic: '現在完了進行形',
    explain: '現在完了進行形は has been＋動詞ing で、過去から継続中の動作を表す。',
    cases: cross(THIRD_SUBJECTS, ONGOING_ACTIONS),
    build: ([[sEn, sJa], action], index) => {
      const hours = index % 5 + 1
      return {
        q: `${sEn} has been ___ ${action.neutralTail} for ${hours} hour${hours === 1 ? '' : 's'}.`,
        choices: [action.ing, action.pp, action.base, action.third],
        answer: action.ing,
        ja: `${sJa}は${hours}時間ずっと${actionJaTe(action)}います。`,
      }
    },
  }),
  family({
    key: '3_subjunctive', level: '3', topic: '仮定法(基礎)',
    explain: '現在の事実に反する仮定は If＋過去形, would/could＋動詞原形で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `If ${midSentence(sEn)} had more time, ${subjectPronoun(sEn)} ___ ${action.base} ${action.neutralTail}.`,
      choices: ['could', 'can', 'will', 'has'], answer: 'could',
      ja: `${sJa}にもっと時間があれば、${action.jaNeutralDict}ことができるでしょう。`,
    }),
  }),
]

const PLACE_CASES = [
  ['the park', 'その公園', 'children play safely', '子どもたちが安全に遊ぶ'],
  ['the town', 'その町', 'my grandfather was born', '祖父が生まれた'],
  ['the café', 'そのカフェ', 'we first met', '私たちが初めて会った'],
  ['the room', 'その部屋', 'the meeting is held', '会議が開かれる'],
  ['the village', 'その村', 'the festival began', '祭りが始まった'],
  ['the library', 'その図書館', 'students study quietly', '生徒たちが静かに勉強する'],
  ['the station', 'その駅', 'the two lines connect', '2つの路線が接続する'],
  ['the beach', 'その浜辺', 'sea turtles lay eggs', 'ウミガメが卵を産む'],
]

const ABSTRACT_NOUNS = [
  ['the reason', 'その理由', 'why', 'the plan failed', '計画が失敗した'],
  ['the day', 'その日', 'when', 'the project started', '計画が始まった'],
  ['the way', 'その方法', 'how', 'she solved the puzzle', '彼女がパズルを解いた'],
  ['the time', 'その時', 'when', 'everyone felt hopeful', '皆が希望を感じた'],
  ['the reason', 'その理由', 'why', 'he changed his mind', '彼が考えを変えた'],
  ['the day', 'その日', 'when', 'the new school opened', '新しい学校が開校した'],
]

const EVALUATION_CASES = [
  ['important', 'for', 'every member', 'to vote', '全員が投票することが重要です'],
  ['difficult', 'for', 'young children', 'to understand the rule', '幼い子どもがその規則を理解するのは難しいです'],
  ['necessary', 'for', 'the team', 'to share information', 'チームが情報を共有する必要があります'],
  ['possible', 'for', 'us', 'to finish today', '私たちが今日終えることは可能です'],
  ['kind', 'of', 'you', 'to offer your seat', '席を譲ってくれるとはあなたは親切です'],
  ['careless', 'of', 'him', 'to lose the key', '鍵をなくすとは彼は不注意です'],
  ['wise', 'of', 'her', 'to check the data twice', 'データを2度確認するとは彼女は賢明です'],
  ['generous', 'of', 'them', 'to support the project', '計画を支援するとは彼らは寛大です'],
]

const HAVE_OBJECT_CASES = [
  ['the car', '車', 'repaired', 'yesterday', '昨日', '修理して'],
  ['my hair', '髪', 'cut', 'last week', '先週', '切って'],
  ['the house', '家', 'painted', 'last month', '先月', '塗装して'],
  ['our family photo', '家族写真', 'taken', 'at the studio', '写真館で', '撮って'],
  ['the package', '小包', 'delivered', 'before noon', '正午前に', '配達して'],
  ['the document', '書類', 'translated', 'yesterday', '昨日', '翻訳して'],
  ['the meeting room', '会議室', 'cleaned', 'this morning', '今朝', '掃除して'],
  ['the computer', 'コンピューター', 'checked', 'last week', '先週', '点検して'],
  ['the suit', 'スーツ', 'altered', 'before the ceremony', '式典前に', '仕立て直して'],
  ['the key', '鍵', 'copied', 'at the shop', '店で', '複製して'],
  ['the windows', '窓', 'replaced', 'last month', '先月', '交換して'],
  ['the report', '報告書', 'printed', 'before the meeting', '会議前に', '印刷して'],
  ['my watch', '腕時計', 'fixed', 'yesterday', '昨日', '修理して'],
  ['my eyes', '目', 'examined', 'at the clinic', '診療所で', '診てもらって'],
  ['the luggage', '荷物', 'carried', 'upstairs', '上の階へ', '運んで'],
  ['the bicycle', '自転車', 'repaired', 'over the weekend', '週末に', '修理して'],
  ['the invitation', '招待状', 'designed', 'for the event', '行事用に', 'デザインして'],
  ['my essay', '作文', 'proofread', 'before submission', '提出前に', '校正して'],
  ['the air conditioner', 'エアコン', 'serviced', 'this spring', 'この春に', '整備して'],
  ['the portrait', '肖像画', 'framed', 'at the art shop', '画材店で', '額装して'],
]

const ENOUGH_CASES = [
  ['Ken is strong enough ___ the heavy box.', 'to carry', ['to carry', 'carrying', 'carry', 'for carrying'], 'ケンはその重い箱を運べるほど力があります。'],
  ['Emi is old enough ___ by herself.', 'to travel', ['to travel', 'traveling', 'travel', 'for travel'], 'エミは一人で旅行できる年齢です。'],
  ['This room is large enough ___ twenty people.', 'to hold', ['to hold', 'holding', 'hold', 'for hold'], 'この部屋は20人が入れるほど広いです。'],
  ['The water is warm enough ___ in.', 'to swim', ['to swim', 'swimming', 'swim', 'for swimming'], 'その水は泳げるほど暖かいです。'],
  ['The instructions are clear enough ___ easily.', 'to follow', ['to follow', 'following', 'follow', 'for follow'], 'その説明は簡単に理解できるほど明確です。'],
  ['This bag is strong enough ___ all the books.', 'to hold', ['to hold', 'holding', 'hold', 'for holding'], 'このかばんはすべての本を入れられるほど丈夫です。'],
  ['The desk is wide enough ___ two monitors.', 'to support', ['to support', 'supporting', 'support', 'for support'], 'その机はモニターを2台置けるほど幅があります。'],
  ['The battery is powerful enough ___ the device all day.', 'to run', ['to run', 'running', 'run', 'for running'], 'その電池は装置を一日中動かせるほど強力です。'],
  ['The bridge is safe enough ___ now.', 'to cross', ['to cross', 'crossing', 'cross', 'for crossing'], 'その橋は今なら渡れるほど安全です。'],
  ['The text is easy enough ___ without a dictionary.', 'to understand', ['to understand', 'understanding', 'understand', 'for understand'], 'その文章は辞書なしで理解できるほど簡単です。'],
  ['The ceiling is high enough ___ the new equipment.', 'to install', ['to install', 'installing', 'install', 'for install'], 'その天井は新しい装置を設置できるほど高いです。'],
  ['The rope is long enough ___ the other side.', 'to reach', ['to reach', 'reaching', 'reach', 'for reaching'], 'そのロープは反対側まで届くほど長いです。'],
  ['Our team is experienced enough ___ the project.', 'to manage', ['to manage', 'managing', 'manage', 'for manage'], '私たちのチームはその計画を管理できるほど経験豊富です。'],
  ['The student is confident enough ___ the speech.', 'to give', ['to give', 'giving', 'give', 'for giving'], 'その生徒は演説ができるほど自信を持っています。'],
  ['The print is large enough ___ from the back row.', 'to read', ['to read', 'reading', 'read', 'for reading'], 'その文字は後列から読めるほど大きいです。'],
  ['The hall is quiet enough ___ the recording.', 'to make', ['to make', 'making', 'make', 'for making'], 'その会場は録音できるほど静かです。'],
  ['The car is fast enough ___ the train.', 'to catch', ['to catch', 'catching', 'catch', 'for catching'], 'その車は列車に間に合えるほど速いです。'],
  ['The coat is thick enough ___ us warm.', 'to keep', ['to keep', 'keeping', 'keep', 'for keeping'], 'そのコートは私たちを暖かく保てるほど厚手です。'],
  ['The budget is large enough ___ the repairs.', 'to cover', ['to cover', 'covering', 'cover', 'for covering'], 'その予算は修理費を賄えるほど十分です。'],
  ['The deadline is flexible enough ___ one revision.', 'to allow', ['to allow', 'allowing', 'allow', 'for allowing'], 'その締め切りにはもう一度修正できるほど余裕があります。'],
]

const PARTICIPLE_CLAUSE_CASES = [
  ['Walking', 'walk', 'walked', 'home', 'Emi found a coin.', '家へ歩いている途中で、エミは硬貨を見つけました。'],
  ['Studying', 'study', 'studied', 'in the library', 'Ken took careful notes.', '図書館で勉強しながら、ケンは丁寧にノートを取りました。'],
  ['Using', 'use', 'used', 'the computer', 'Emi prepared a report.', 'コンピューターを使って、エミは報告書を作りました。'],
  ['Carrying', 'carry', 'carried', 'the bags', 'Ken climbed the stairs slowly.', 'かばんを運びながら、ケンはゆっくり階段を上りました。'],
  ['Watching', 'watch', 'watched', 'the news', 'the family discussed the election.', 'ニュースを見ながら、家族は選挙について話し合いました。'],
  ['Cooking', 'cook', 'cooked', 'dinner', 'my mother listened to the radio.', '夕食を作りながら、母はラジオを聞きました。'],
  ['Cleaning', 'clean', 'cleaned', 'the classroom', 'the students found a key.', '教室を掃除していると、生徒たちは鍵を見つけました。'],
  ['Opening', 'open', 'opened', 'the shop', 'the owner greeted the first customer.', '店を開けながら、店主は最初の客にあいさつしました。'],
  ['Helping', 'help', 'helped', 'his neighbor', 'Ken learned about gardening.', '近所の人を手伝いながら、ケンは園芸について学びました。'],
  ['Calling', 'call', 'called', 'Grandma', 'Emi checked the train schedule.', '祖母へ電話をしながら、エミは列車の時刻を確認しました。'],
  ['Walking', 'walk', 'walked', 'the dog', 'Ken met his teacher.', '犬を散歩させていると、ケンは先生に会いました。'],
  ['Practicing', 'practice', 'practiced', 'the piano', 'my sister recorded the melody.', 'ピアノを練習しながら、姉は旋律を録音しました。'],
  ['Writing', 'write', 'wrote', 'the report', 'the staff checked the data.', '報告書を書きながら、職員はデータを確認しました。'],
  ['Taking', 'take', 'took', 'pictures', 'the tourist spotted a rare bird.', '写真を撮っていると、旅行者は珍しい鳥を見つけました。'],
  ['Buying', 'buy', 'bought', 'groceries', 'my mother compared the prices.', '食料品を買いながら、母は値段を比べました。'],
  ['Teaching', 'teach', 'taught', 'math', 'Mr. Sato used a clear diagram.', '数学を教えながら、佐藤先生は分かりやすい図を使いました。'],
  ['Choosing', 'choose', 'chose', 'a seat', 'Emi checked the view from the window.', '席を選びながら、エミは窓からの眺めを確かめました。'],
  ['Speaking', 'speak', 'spoke', 'English', 'the students gained confidence.', '英語を話すことで、生徒たちは自信をつけました。'],
  ['Driving', 'drive', 'drove', 'to work', 'my father heard the weather report.', '車で仕事へ向かいながら、父は天気予報を聞きました。'],
  ['Visiting', 'visit', 'visited', 'the museum', 'the class learned about local history.', '博物館を訪れながら、クラスは郷土史を学びました。'],
]

const THE_COMPARATIVE_CASES = [
  ['The more carefully you read, the ___ you understand the argument.', 'better', ['better', 'best', 'good', 'more good'], '注意深く読めば読むほど、論点をよく理解できます。'],
  ['The longer we waited, the ___ impatient we became.', 'more', ['more', 'most', 'much', 'very'], '待てば待つほど、私たちはいら立ちました。'],
  ['The more you practice, the ___ your pronunciation becomes.', 'clearer', ['clearer', 'clearest', 'clear', 'more clearly'], '練習すればするほど、発音が明瞭になります。'],
  ['The earlier you leave, the ___ traffic you will meet.', 'less', ['less', 'least', 'few', 'little'], '早く出発すればするほど、渋滞は少なくなります。'],
  ['The more evidence we collect, the ___ our conclusion becomes.', 'stronger', ['stronger', 'strongest', 'strong', 'more strongly'], '証拠を集めれば集めるほど、結論は強固になります。'],
  ['The faster the wind blows, the ___ the waves become.', 'higher', ['higher', 'highest', 'high', 'more highly'], '風が強く吹けば吹くほど、波は高くなります。'],
  ['The more often you review, the ___ you remember.', 'more', ['more', 'most', 'many', 'muchest'], '復習する回数が増えるほど、よく覚えられます。'],
  ['The closer we got, the ___ the music sounded.', 'louder', ['louder', 'loudest', 'loud', 'more loudly'], '近づけば近づくほど、音楽は大きく聞こえました。'],
  ['The more complex the task is, the ___ time it requires.', 'more', ['more', 'most', 'many', 'few'], '課題が複雑であればあるほど、必要な時間が増えます。'],
  ['The harder she worked, the ___ confident she became.', 'more', ['more', 'most', 'much', 'very'], '努力すればするほど、彼女は自信を持つようになりました。'],
  ['The colder it gets, the ___ energy we use.', 'more', ['more', 'most', 'many', 'few'], '寒くなればなるほど、使うエネルギーが増えます。'],
  ['The more clearly you explain, the ___ questions people ask.', 'fewer', ['fewer', 'fewest', 'less', 'little'], '明確に説明すればするほど、質問は少なくなります。'],
  ['The longer the meeting lasts, the ___ difficult it is to focus.', 'more', ['more', 'most', 'much', 'very'], '会議が長引けば長引くほど、集中が難しくなります。'],
  ['The more widely the service is used, the ___ useful the feedback becomes.', 'more', ['more', 'most', 'much', 'very'], 'サービスが広く使われるほど、意見が役立つものになります。'],
  ['The sooner we begin, the ___ we can finish.', 'earlier', ['earlier', 'earliest', 'early', 'more early'], '早く始めれば始めるほど、早く終えられます。'],
  ['The more books you read, the ___ your vocabulary becomes.', 'richer', ['richer', 'richest', 'rich', 'more richly'], '本を読めば読むほど、語彙が豊かになります。'],
  ['The higher the temperature rises, the ___ the ice melts.', 'faster', ['faster', 'fastest', 'fast', 'more fast'], '気温が上がれば上がるほど、氷は速く溶けます。'],
  ['The more carefully we plan, the ___ mistakes we make.', 'fewer', ['fewer', 'fewest', 'less', 'little'], '慎重に計画すればするほど、間違いは少なくなります。'],
  ['The farther you travel, the ___ the landscape changes.', 'more', ['more', 'most', 'many', 'very'], '遠くへ行けば行くほど、景色は変化します。'],
  ['The more difficult the question is, the ___ satisfying the answer feels.', 'more', ['more', 'most', 'much', 'very'], '問題が難しければ難しいほど、答えを得た満足感は大きくなります。'],
]

const PRE2_FAMILIES = [
  family({
    key: 'pre2_participle', level: 'pre2', topic: '分詞',
    explain: '名詞と能動関係なら現在分詞、受動関係なら過去分詞で後ろから修飾する。',
    cases: cross(ACTIONS, ['student', 'teacher', 'volunteer', 'worker']),
    build: ([action, noun]) => ({
      q: `The ${noun} ___ ${action.neutralTail} waved to us.`,
      choices: [action.ing, action.pp, action.base, action.third],
      answer: action.ing,
      ja: `${action.jaNeutralDict}${noun === 'student' ? '生徒' : noun === 'teacher' ? '先生' : noun === 'volunteer' ? 'ボランティア' : '作業員'}が私たちに手を振りました。`,
    }),
  }),
  family({
    key: 'pre2_relative_adverb', level: 'pre2', topic: '関係副詞',
    explain: '場所を表す先行詞には where、時には when、理由には why を使う。',
    cases: cross([...PLACE_CASES.map((row) => [...row, 'where']), ...ABSTRACT_NOUNS.map(([nEn, nJa, rel, clause, ja]) => [nEn, nJa, clause, ja, rel])], ['clearly', 'well', 'vividly']),
    build: ([[nounEn, nounJa, clauseEn, clauseJa, answer], adverb]) => ({
      q: `I ${adverb} remember ${nounEn} ___ ${clauseEn}.`,
      choices: [answer, answer === 'where' ? 'when' : 'where', 'which', 'what'],
      answer,
      ja: `私は${clauseJa}${nounJa}を${adverb === 'clearly' ? 'はっきり' : adverb === 'well' ? 'よく' : '鮮明に'}覚えています。`,
    }),
  }),
  family({
    key: 'pre2_subjunctive', level: 'pre2', topic: '仮定法(基礎)',
    explain: '現在の事実に反する仮定は If＋過去形, would/could＋動詞原形で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `If ${midSentence(sEn)} were free today, ${subjectPronoun(sEn)} ___ ${action.base} ${action.neutralTail}.`,
      choices: ['would', 'will', 'has', 'is'], answer: 'would',
      ja: `${sJa}が今日暇なら、${action.jaNeutralDict}でしょう。`,
    }),
  }),
  family({
    key: 'pre2_causative_make', level: 'pre2', topic: '使役・知覚',
    explain: 'make＋人＋動詞原形で「人に〜させる」を表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `The manager made ${sEn} ___ ${action.neutralTail}.`,
      choices: [action.base, `to ${action.base}`, action.ing, action.past],
      answer: action.base,
      ja: `責任者の指示で、${sJa}は${action.jaNeutralDict}ことになりました。`,
    }),
  }),
  family({
    key: 'pre2_causative_have', level: 'pre2', topic: '使役・知覚',
    explain: 'have＋物＋過去分詞で「物を〜してもらう」を表す。',
    cases: HAVE_OBJECT_CASES,
    build: ([objectEn, objectJa, pp, timeEn, timeJa, jaAction]) => ({
      q: `We had ${objectEn} ___ ${timeEn}.`,
      choices: [pp, `being ${pp}`, `to be ${pp}`, 'have'],
      answer: pp,
      ja: `私たちは${timeJa}${objectJa}を${jaAction}もらいました。`,
    }),
  }),
  family({
    key: 'pre2_it_for_of', level: 'pre2', topic: 'it...to/for',
    explain: '不定詞の動作主は通常 for 人、性質への評価なら of 人で示す。',
    cases: cross(EVALUATION_CASES, ['today', 'in this situation', 'at school']),
    build: ([[adj, answer, person, action, ja], suffix]) => {
      const context = action.endsWith('today') && suffix === 'today' ? 'as planned' : suffix
      return {
        q: `It is ${adj} ___ ${person} ${action} ${context}.`,
        choices: [answer, answer === 'for' ? 'of' : 'for', 'to', 'with'],
        answer,
        ja: `${context === 'today' ? '今日、' : context === 'as planned' ? '予定どおり、' : context === 'in this situation' ? 'この状況では、' : '学校では、'}${ja}。`,
      }
    },
  }),
  family({
    key: 'pre2_perfect_progressive', level: 'pre2', topic: '現在完了進行形',
    explain: 'has been＋動詞ing で、過去から現在まで続く動作を強調する。',
    cases: cross(THIRD_SUBJECTS, ONGOING_ACTIONS),
    build: ([[sEn, sJa], action], index) => ({
      q: `${sEn} has been ___ ${action.neutralTail} since ${index % 12 + 1} o’clock.`,
      choices: [action.ing, action.pp, action.base, action.past],
      answer: action.ing,
      ja: `${sJa}は${index % 12 + 1}時からずっと${actionJaTe(action)}います。`,
    }),
  }),
  family({
    key: 'pre2_nonrestrictive', level: 'pre2', topic: '関係代名詞(継続)',
    explain: 'コンマの後の継続用法では that を使わず、人には who、物には which を使う。',
    cases: cross(OBJECT_RELATIVE_EVENTS, ['recently', 'last year', 'for the event']),
    build: ([[objectEn, objectJa, clauseEn, clauseJa], suffix]) => ({
      q: `${capitalize(objectEn)}, ___ ${clauseEn} ${suffix}, attracted attention.`,
      choices: ['which', 'that', 'what', 'where'], answer: 'which',
      ja: `${suffix === 'recently' ? '最近' : suffix === 'last year' ? '昨年' : '行事のために'}${clauseJa}${objectJa}が注目を集めました。`,
    }),
  }),
  family({
    key: 'pre2_too_enough', level: 'pre2', topic: 'too/enough',
    explain: '形容詞＋enough＋to do で「〜するのに十分…」を表す。',
    cases: ENOUGH_CASES,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: 'pre2_indirect_whether', level: 'pre2', topic: '間接疑問',
    explain: '「〜かどうか」は whether/if＋主語＋動詞の平叙文語順で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `I wonder ___ ${midSentence(sEn)} will ${action.base} ${action.tail}.`,
      choices: ['whether', 'what', 'which', 'how many'], answer: 'whether',
      ja: `${sJa}が${action.jaDict}かどうか気になります。`,
    }),
  }),
  family({
    key: 'pre2_participle_clause', level: 'pre2', topic: '分詞構文',
    explain: '主節と同じ主語の副詞節は、接続詞と主語を省き動詞ingで始められる。',
    cases: PARTICIPLE_CLAUSE_CASES,
    build: ([ing, base, past, phrase, main, ja]) => ({
      q: `___ ${phrase}, ${main}`,
      choices: [ing, capitalize(past), `To ${base}`, capitalize(base)],
      answer: ing,
      ja,
    }),
  }),
  family({
    key: 'pre2_relative_what', level: 'pre2', topic: '関係代名詞 what',
    explain: 'what は先行詞を含み「〜すること・もの」という名詞節を作る。',
    cases: cross(ACTIONS, ['today', 'right now', 'for the project']),
    build: ([action, suffix]) => ({
      q: `Please tell me ___ you need to ${action.base} ${action.neutralTail} ${suffix}.`,
      choices: ['what', 'that', 'which one is', 'where to'], answer: 'what',
      ja: `${suffix === 'today' ? '今日' : suffix === 'right now' ? '今すぐ' : '計画のために'}${action.jaNeutralDict}のに必要なものを教えてください。`,
    }),
  }),
  family({
    key: 'pre2_past_perfect', level: 'pre2', topic: '過去完了',
    explain: '過去の基準時より前の完了は had＋過去分詞で表す。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} had ___ ${action.neutralTail} before the meeting began.`,
      choices: [action.pp, action.past, action.base, action.ing],
      answer: action.pp,
      ja: `${sJa}は会議が始まる前にはすでに${actionJaPast(action)}のでした。`,
    }),
  }),
  family({
    key: 'pre2_so_such', level: 'pre2', topic: 'so/such...that',
    explain: 'such＋a/an＋形容詞＋名詞＋that節で程度と結果を表す。',
    cases: cross(LONG_ADJECTIVES, ROLES),
    build: ([[adj, , , jaAdj], [roleEn, roleJa]]) => ({
      q: `It was ___ ${/^[aeiou]/i.test(adj) ? 'an' : 'a'} ${adj} ${roleEn} that everyone listened carefully.`,
      choices: ['such', 'so', 'too', 'enough'], answer: 'such',
      ja: `とても${jaAdj}${roleJa}だったので、皆が注意深く耳を傾けました。`,
    }),
  }),
  family({
    key: 'pre2_correlative', level: 'pre2', topic: '相関接続詞',
    explain: 'not only A but also B で「AだけでなくBも」を表す。',
    cases: cross(ACTIONS.slice(0, 10), ACTIONS.slice(10)),
    build: ([a, b]) => ({
      q: `Ken can not only ${a.base} ${a.tail} ___ also ${b.base} ${b.tail}.`,
      choices: ['but', 'and', 'or', 'so'], answer: 'but',
      ja: `ケンは${a.jaDict}だけでなく、${b.jaDict}こともできます。`,
    }),
  }),
  family({
    key: 'pre2_the_comparative', level: 'pre2', topic: '比較応用',
    explain: 'the＋比較級 ..., the＋比較級 ... で「〜すればするほど…」を表す。',
    cases: THE_COMPARATIVE_CASES,
    build: ([q, answer, choices, ja]) => ({ q, choices, answer, ja }),
  }),
  family({
    key: 'pre2_preposition_relative', level: 'pre2', topic: '前置詞+関係代名詞',
    explain: '前置詞の直後で物を受ける関係代名詞には which を使う。',
    cases: cross(PLACE_CASES, ['This is', 'That is', 'We visited']),
    build: ([[placeEn, placeJa, clauseEn, clauseJa], lead]) => ({
      q: `${lead} ${placeEn} in ___ ${clauseEn}.`,
      choices: ['which', 'that', 'what', 'where'], answer: 'which',
      ja: `${lead === 'We visited' ? '私たちが訪れたのは' : lead === 'That is' ? 'あちらが' : 'こちらが'}${clauseJa}${placeJa}です。`,
    }),
  }),
  family({
    key: 'pre2_past_habit', level: 'pre2', topic: '過去の習慣',
    explain: 'would＋動詞原形で、過去に繰り返した習慣的動作を表せる。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} would often ___ ${action.neutralTail} years ago.`,
      choices: [action.base, action.past, action.third, action.ing],
      answer: action.base,
      ja: `${sJa}は何年も前、よく${actionJaPast(action)}ものです。`,
    }),
  }),
  family({
    key: 'pre2_had_better', level: 'pre2', topic: 'had better',
    explain: 'had better＋動詞原形で強めの助言を表す。',
    cases: cross(ACTIONS, ['today', 'before noon', 'as soon as possible']),
    build: ([action, time]) => ({
      q: `You had better ___ ${action.neutralTail} ${time}.`,
      choices: [action.base, `to ${action.base}`, action.ing, action.past],
      answer: action.base,
      ja: `${time === 'today' ? '今日' : time === 'before noon' ? '正午前に' : 'できるだけ早く'}${action.jaNeutralDict}ほうがよいです。`,
    }),
  }),
  family({
    key: 'pre2_purpose', level: 'pre2', topic: '目的の表現',
    explain: 'in order to＋動詞原形で目的を明示する。',
    cases: PURPOSE_CASES,
    build: ([lead, base, tail, ja]) => {
      const forms = formsFor(base)
      return {
        q: `${lead} in order to ___ ${tail}.`,
        choices: [base, forms.third, forms.past, forms.ing],
        answer: base,
        ja: `${ja}。`,
      }
    },
  }),
  family({
    key: 'pre2_gerund_idiom', level: 'pre2', topic: '動名詞の慣用',
    explain: 'look forward to の to は前置詞なので、後ろには動名詞を置く。',
    cases: cross(THIRD_SUBJECTS, ACTIONS),
    build: ([[sEn, sJa], action]) => ({
      q: `${sEn} looks forward to ___ ${action.tail}.`,
      choices: [action.ing, action.base, `to ${action.base}`, action.pp],
      answer: action.ing,
      ja: `${sJa}は${action.jaDict}ことを楽しみにしています。`,
    }),
  }),
  family({
    key: 'pre2_quantity', level: 'pre2', topic: '数量表現',
    explain: '可算名詞には few/a few、不可算名詞には little/a little を使う。',
    cases: cross(['time', 'money', 'information', 'water'], ['today', 'for the task', 'at home', 'right now']),
    build: ([noun, suffix]) => ({
      q: `We have only ___ ${noun} ${suffix}, so let’s be careful.`,
      choices: ['a little', 'a few', 'many', 'few of'], answer: 'a little',
      ja: `${suffix === 'today' ? '今日' : suffix === 'for the task' ? '課題のために' : suffix === 'at home' ? '家に' : '今'}${noun === 'time' ? '時間' : noun === 'money' ? 'お金' : noun === 'information' ? '情報' : '水'}が少ししかないので、注意しましょう。`,
    }),
  }),
  family({
    key: 'pre2_reflexive', level: 'pre2', topic: '再帰代名詞',
    explain: '主語と目的語が同一なら、主語に合う再帰代名詞を使う。',
    cases: cross(THIRD_SUBJECTS, ['at the meeting', 'to the class', 'during the event']),
    build: ([[sEn, sJa], suffix]) => {
      const female = ['Emi', 'My sister', 'My mother', 'Ms. Brown'].includes(sEn)
      return {
        q: `${sEn} introduced ___ ${suffix}.`,
        choices: [female ? 'herself' : 'himself', female ? 'her' : 'him', female ? 'hers' : 'his', female ? 'she' : 'he'],
        answer: female ? 'herself' : 'himself',
        ja: `${sJa}は${suffix === 'at the meeting' ? '会議で' : suffix === 'to the class' ? 'クラスに' : '行事中に'}自己紹介しました。`,
      }
    },
  }),
]

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function midSentence(text) {
  return /^(My|Our|The|Those|This|That|These)\b/.test(text)
    ? text.charAt(0).toLowerCase() + text.slice(1)
    : text
}

const jaPast = (academic) => academic.base === 'review'
  ? academic.jaAction.replace(/見直す$/, '見直した')
  : academic.jaAction.replace(/する$/, 'した')
const jaTe = (academic) => academic.base === 'review'
  ? academic.jaAction.replace(/見直す$/, '見直して')
  : academic.jaAction.replace(/する$/, 'して')
const jaPolitePast = (academic) => academic.base === 'review'
  ? academic.jaAction.replace(/見直す$/, '見直しました')
  : academic.jaAction.replace(/する$/, 'しました')
const jaContinuative = (academic) => academic.base === 'review'
  ? academic.jaAction.replace(/見直す$/, '見直し')
  : academic.jaAction.replace(/する$/, 'し')
const jaPotential = (academic) => academic.base === 'review'
  ? academic.jaAction.replace(/見直す$/, '見直せる')
  : academic.jaAction.replace(/する$/, 'できる')
const jaObject = (academic) => academic.jaAction.replace(/を[^を]+$/, '')
const detachedObject = (academic) => academic.object === 'its emissions'
  ? 'the company’s emissions'
  : academic.object

const ACADEMIC_ACTIONS = [
  { subject: 'the committee', jaSubject: '委員会', base: 'revise', third: 'revises', past: 'revised', pp: 'revised', ing: 'revising', object: 'the proposal', jaAction: '提案を修正する' },
  { subject: 'the research team', jaSubject: '研究チーム', base: 'verify', third: 'verifies', past: 'verified', pp: 'verified', ing: 'verifying', object: 'the results', jaAction: '結果を検証する' },
  { subject: 'the board', jaSubject: '理事会', base: 'approve', third: 'approves', past: 'approved', pp: 'approved', ing: 'approving', object: 'the budget', jaAction: '予算を承認する' },
  { subject: 'the agency', jaSubject: 'その機関', base: 'publish', third: 'publishes', past: 'published', pp: 'published', ing: 'publishing', object: 'the report', jaAction: '報告書を公表する' },
  { subject: 'the university', jaSubject: 'その大学', base: 'introduce', third: 'introduces', past: 'introduced', pp: 'introduced', ing: 'introducing', object: 'the new policy', jaAction: '新しい方針を導入する' },
  { subject: 'the company', jaSubject: 'その会社', base: 'reduce', third: 'reduces', past: 'reduced', pp: 'reduced', ing: 'reducing', object: 'its emissions', jaAction: '排出量を削減する' },
  { subject: 'the council', jaSubject: '評議会', base: 'consider', third: 'considers', past: 'considered', pp: 'considered', ing: 'considering', object: 'the alternatives', jaAction: '代案を検討する' },
  { subject: 'the hospital', jaSubject: 'その病院', base: 'adopt', third: 'adopts', past: 'adopted', pp: 'adopted', ing: 'adopting', object: 'the new system', jaAction: '新しい制度を採用する' },
  { subject: 'the government', jaSubject: '政府', base: 'review', third: 'reviews', past: 'reviewed', pp: 'reviewed', ing: 'reviewing', object: 'the regulation', jaAction: '規制を見直す' },
  { subject: 'the panel', jaSubject: '審査団', base: 'evaluate', third: 'evaluates', past: 'evaluated', pp: 'evaluated', ing: 'evaluating', object: 'the evidence', jaAction: '証拠を評価する' },
  { subject: 'the editor', jaSubject: '編集者', base: 'clarify', third: 'clarifies', past: 'clarified', pp: 'clarified', ing: 'clarifying', object: 'the argument', jaAction: '論点を明確にする' },
  { subject: 'the foundation', jaSubject: 'その財団', base: 'support', third: 'supports', past: 'supported', pp: 'supported', ing: 'supporting', object: 'the project', jaAction: '計画を支援する' },
]

const ONGOING_ACADEMIC_ACTIONS = ACADEMIC_ACTIONS.filter((academic) =>
  ['revise', 'verify', 'reduce', 'consider', 'review', 'evaluate', 'clarify', 'support'].includes(academic.base))

const LOGICAL_CONNECTORS = [
  ['therefore', ['therefore', 'nevertheless', 'otherwise', 'meanwhile'], 'そのため', 'The evidence was conclusive', '証拠は決定的でした'],
  ['nevertheless', ['nevertheless', 'therefore', 'moreover', 'accordingly'], 'それにもかかわらず', 'Serious objections remained', '重大な反対意見が残っていました'],
  ['moreover', ['moreover', 'otherwise', 'instead', 'nevertheless'], 'そのうえ', 'The first change had succeeded', '最初の変更は成功していました'],
  ['consequently', ['consequently', 'nevertheless', 'meanwhile', 'likewise'], 'その結果', 'Immediate action was required', '早急な対応が必要でした'],
]

const TWO_FAMILIES = [
  family({
    key: '2_past_subjunctive', level: '2', topic: '仮定法過去完了',
    explain: '過去の事実に反する仮定は If＋had＋過去分詞, would have＋過去分詞で表す。',
    cases: cross(ACADEMIC_ACTIONS, ['earlier', 'before the deadline']),
    build: ([academic, timing]) => ({
      q: `If ${academic.subject} had ___ ${academic.object} ${timing}, the outcome would have been different.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `もし${academic.jaSubject}が${timing === 'earlier' ? 'もっと早く' : '締め切り前に'}${jaTe(academic)}いたら、結果は違っていたでしょう。`,
    }),
  }),
  family({
    key: '2_participle_clause', level: '2', topic: '分詞構文',
    explain: '主節より前に完了した動作は Having＋過去分詞の分詞構文で表す。',
    cases: cross(ACADEMIC_ACTIONS, ['carefully', 'independently', 'in advance', 'twice']),
    build: ([academic, adverb]) => ({
      q: `Having ___ ${academic.object} ${adverb}, ${academic.subject} announced its decision.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は${adverb === 'carefully' ? '注意深く' : adverb === 'independently' ? '独自に' : adverb === 'in advance' ? '事前に' : '2度'}${jaTe(academic)}から、決定を発表しました。`,
    }),
  }),
  family({
    key: '2_relative_what', level: '2', topic: '関係代名詞 what',
    explain: 'what は先行詞を含み「〜すること・もの」という名詞節を作る。',
    cases: cross(ACADEMIC_ACTIONS, ['now', 'most', 'in the long run']),
    build: ([academic, focus]) => ({
      q: `___ ${academic.subject} needs ${focus} is time to ${academic.base} ${academic.object}.`,
      choices: ['What', 'That', 'Which', 'How'], answer: 'What',
      ja: `${academic.jaSubject}が${focus === 'now' ? '今' : focus === 'most' ? '最も' : '長期的に'}必要としているのは、${academic.jaAction}ための時間です。`,
    }),
  }),
  family({
    key: '2_future_perfect', level: '2', topic: '完了形応用',
    explain: '未来の基準時までの完了は will have＋過去分詞で表す。',
    cases: cross(ACADEMIC_ACTIONS, ['by Friday', 'by next month', 'before the deadline']),
    build: ([academic, time]) => ({
      q: `${capitalize(academic.subject)} will have ___ ${academic.object} ${time}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は${time === 'by Friday' ? '金曜日までに' : time === 'by next month' ? '来月までに' : '締め切り前に'}${jaContinuative(academic)}終えているでしょう。`,
    }),
  }),
  family({
    key: '2_whose', level: '2', topic: '関係代名詞 whose',
    explain: '先行詞と後ろの名詞の所有関係は whose で表す。',
    cases: cross(RELATIVE_PEOPLE, ACADEMIC_ACTIONS),
    build: ([[personEn, personJa], academic]) => ({
      q: `We interviewed ${personEn} ___ team had ${academic.pp} ${academic.object}.`,
      choices: ['whose', 'who', 'whom', 'which'], answer: 'whose',
      ja: `私たちは、所属チームが${jaPast(academic)}${personJa}に取材しました。`,
    }),
  }),
  family({
    key: '2_wish', level: '2', topic: '仮定法',
    explain: '現在の実現していない願いは wish＋過去形で表す。',
    cases: cross(THIRD_SUBJECTS, ACADEMIC_ACTIONS),
    build: ([[sEn, sJa], academic]) => ({
      q: `${sEn} wishes ${academic.subject} ___ more time to ${academic.base} ${academic.object}.`,
      choices: ['had', 'has', 'will have', 'having'], answer: 'had',
      ja: `${sJa}は${academic.jaSubject}に${academic.jaAction}ための時間がもっとあればよいと思っています。`,
    }),
  }),
  family({
    key: '2_cleft', level: '2', topic: '強調構文',
    explain: 'It is/was ... that の強調構文で、時・場所・人・理由を焦点化する。',
    cases: cross(ACADEMIC_ACTIONS, ['yesterday', 'at the final meeting', 'because of public concern']),
    build: ([academic, focus]) => ({
      q: `It was ${focus} ___ ${academic.subject} ${academic.past} ${academic.object}.`,
      choices: ['that', 'what', 'where', 'which'], answer: 'that',
      ja: `${academic.jaSubject}が${jaPast(academic)}のは${focus === 'yesterday' ? '昨日でした' : focus === 'at the final meeting' ? '最終会議でした' : '世論の懸念が理由でした'}。`,
    }),
  }),
  family({
    key: '2_inanimate_subject', level: '2', topic: '無生物主語',
    explain: '無生物主語＋enable/prevent＋人＋to/from doing で原因・手段を簡潔に表す。',
    cases: cross(ACADEMIC_ACTIONS, ['more efficiently', 'without delay']),
    build: ([academic, adverb]) => ({
      q: `The new system will enable ${academic.subject} ___ ${academic.object} ${adverb}.`,
      choices: [`to ${academic.base}`, academic.base, academic.ing, academic.past],
      answer: `to ${academic.base}`,
      ja: `新しい制度により、${academic.jaSubject}は${adverb === 'more efficiently' ? 'より効率的に' : '遅滞なく'}${academic.jaAction}ことができるようになります。`,
    }),
  }),
  family({
    key: '2_conjunctive_adverb', level: '2', topic: '接続副詞',
    explain: '前後の論理関係に合う接続副詞を、セミコロンの後ろに置く。',
    cases: cross(ACADEMIC_ACTIONS, LOGICAL_CONNECTORS),
    build: ([academic, [answer, choices, ja, lead, jaLead]]) => ({
      q: `${lead}; ___, ${academic.subject} ${academic.past} ${academic.object}.`,
      choices, answer,
      ja: `${jaLead}。${ja}、${academic.jaSubject}は${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: '2_advanced_relative', level: '2', topic: '関係代名詞応用',
    explain: 'コンマ後の数量＋of whom/which で、先行詞の一部を補足する。',
    cases: cross(['two', 'three', 'four'], RELATIVE_PEOPLE, ACADEMIC_ACTIONS),
    build: ([number, [, personJa, , pluralEn], academic]) => ({
      q: `We met several ${pluralEn}, ${number} of ___ had ${academic.pp} ${academic.object}.`,
      choices: ['whom', 'them', 'who', 'that'], answer: 'whom',
      ja: `私たちは数人の${personJa}に会い、そのうち${number === 'two' ? '2人' : number === 'three' ? '3人' : '4人'}が${jaPast(academic)}ことを知りました。`,
    }),
  }),
  family({
    key: '2_inversion', level: '2', topic: '倒置',
    explain: '前文への同意を表す So＋助動詞＋主語 では倒置語順を使う。',
    cases: cross(ACADEMIC_ACTIONS, THIRD_SUBJECTS),
    build: ([academic, [sEn, sJa]]) => ({
      q: `${capitalize(academic.subject)} supports the change, and so ___ ${midSentence(sEn)}.`,
      choices: ['does', 'is', 'has been', 'supports'], answer: 'does',
      ja: `${academic.jaSubject}は変更を支持しており、${sJa}もそうです。`,
    }),
  }),
  family({
    key: '2_noun_clause', level: '2', topic: '名詞節',
    explain: '文の主語になる「〜かどうか」の節には whether を使う。',
    cases: cross(ACADEMIC_ACTIONS, ['remains unclear', 'will be decided tomorrow', 'depends on the evidence']),
    build: ([academic, tail]) => ({
      q: `___ ${academic.subject} will ${academic.base} ${academic.object} ${tail}.`,
      choices: ['Whether', 'If or not', 'That whether', 'Which'], answer: 'Whether',
      ja: `${academic.jaSubject}が${academic.jaAction}かどうかは、${tail === 'remains unclear' ? '不明なままです' : tail === 'will be decided tomorrow' ? '明日決まります' : '証拠次第です'}。`,
    }),
  }),
  family({
    key: '2_partial_negation', level: '2', topic: '部分否定',
    explain: 'not every/all/always は「すべて・いつも〜とは限らない」という部分否定。',
    cases: cross(ACADEMIC_ACTIONS, [['always', 'in practice'], ['necessarily', 'under pressure'], ['fully', 'at this stage']]),
    build: ([academic, [adverb, context]]) => ({
      q: `${capitalize(academic.subject)} does not ___ ${academic.base} ${academic.object} ${context}.`,
      choices: [adverb, 'never', 'nothing', 'neither'], answer: adverb,
      ja: `${adverb === 'always' ? `${academic.jaSubject}がいつも${academic.jaAction}とは限りません` : adverb === 'necessarily' ? `${academic.jaSubject}が必ずしも${academic.jaAction}とは限りません` : `${academic.jaSubject}はこの段階では全面的に${academic.jaAction}わけではありません`}。`,
    }),
  }),
  family({
    key: '2_causative_get', level: '2', topic: '使役',
    explain: 'get＋人＋to do で「人に〜してもらう・させる」を表す。',
    cases: cross(THIRD_SUBJECTS, ACADEMIC_ACTIONS),
    build: ([[sEn, sJa], academic]) => ({
      q: `We got ${sEn} ___ ${academic.object}.`,
      choices: [`to ${academic.base}`, academic.base, academic.ing, academic.pp],
      answer: `to ${academic.base}`,
      ja: `私たちは${sJa}に${jaTe(academic)}もらいました。`,
    }),
  }),
  family({
    key: '2_modal_perfect', level: '2', topic: '助動詞+have done',
    explain: 'must have＋過去分詞で過去についての強い推量を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['must', 'may', 'cannot', 'should']),
    build: ([academic, modal]) => ({
      q: `${capitalize(academic.subject)} ${modal} have ___ ${academic.object} already.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}はすでに${modal === 'must' ? `${jaPast(academic)}に違いありません` : modal === 'may' ? `${jaPast(academic)}かもしれません` : modal === 'cannot' ? `${jaPast(academic)}はずがありません` : `${academic.jaAction}べきでした`}。`,
    }),
  }),
  family({
    key: '2_reported_speech', level: '2', topic: '話法',
    explain: '過去の発言より前の出来事は、間接話法で過去完了にする。',
    cases: cross(ACADEMIC_ACTIONS, THIRD_SUBJECTS),
    build: ([academic, [sEn, sJa]]) => ({
      q: `${sEn} said that ${academic.subject} had ___ ${academic.object}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${sJa}は${academic.jaSubject}が${jaPast(academic)}と言いました。`,
    }),
  }),
  family({
    key: '2_perfect_infinitive', level: '2', topic: '完了不定詞',
    explain: '述語より前に起きたことは to have＋過去分詞の完了不定詞で表す。',
    cases: cross(ACADEMIC_ACTIONS, ['seems', 'appears', 'is believed']),
    build: ([academic, predicate]) => ({
      q: `${capitalize(academic.subject)} ${predicate} to have ___ ${academic.object}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は${jaPast(academic)}${predicate === 'seems' ? 'ようです' : predicate === 'appears' ? 'ように見えます' : 'と考えられています'}。`,
    }),
  }),
  family({
    key: '2_be_to', level: '2', topic: 'be to構文',
    explain: 'be to＋動詞原形で公的な予定・義務を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['tomorrow', 'next week', 'before noon']),
    build: ([academic, time]) => ({
      q: `${capitalize(academic.subject)} is to ___ ${academic.object} ${time}.`,
      choices: [academic.base, academic.third, academic.past, academic.ing],
      answer: academic.base,
      ja: `${academic.jaSubject}は${time === 'tomorrow' ? '明日' : time === 'next week' ? '来週' : '正午前に'}${academic.jaAction}予定です。`,
    }),
  }),
  family({
    key: '2_formal_object', level: '2', topic: '形式目的語',
    explain: 'find/make＋it＋形容詞＋to do で、itを形式目的語として使う。',
    cases: cross(['easy', 'difficult', 'necessary', 'possible'], ACADEMIC_ACTIONS),
    build: ([adj, academic]) => ({
      q: `The new data made ___ ${adj} to ${academic.base} ${academic.object}.`,
      choices: ['it', 'that', 'this', 'what'], answer: 'it',
      ja: `新しいデータによって、${academic.jaAction}ことが${adj === 'easy' ? '容易に' : adj === 'difficult' ? '難しく' : adj === 'necessary' ? '必要に' : '可能に'}なりました。`,
    }),
  }),
  family({
    key: '2_gerund_idiom', level: '2', topic: '動名詞の慣用',
    explain: 'There is no＋動名詞で「〜することはできない・否定できない」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['at this stage', 'under these conditions', 'given the evidence']),
    build: ([academic, suffix]) => ({
      q: `There is no ___ that ${academic.subject} must ${academic.base} ${academic.object} ${suffix}.`,
      choices: ['denying', 'deny', 'to deny', 'denied'], answer: 'denying',
      ja: `${suffix === 'at this stage' ? 'この段階で' : suffix === 'under these conditions' ? 'この条件下で' : 'その証拠を踏まえると'}${academic.jaSubject}が${academic.jaAction}必要があることは否定できません。`,
    }),
  }),
]

function CapitalizeSubject(subject) {
  return capitalize(subject)
}

const PRE1_FAMILIES = [
  family({
    key: 'pre1_negative_inversion', level: 'pre1', topic: '倒置',
    explain: '否定・準否定語句が文頭に出ると、助動詞＋主語の倒置語順になる。',
    cases: cross(['Never', 'Rarely', 'Seldom', 'At no time'], ACADEMIC_ACTIONS),
    build: ([negative, academic]) => ({
      q: `${negative} ___ ${academic.subject} ${academic.pp} ${academic.object} so quickly.`,
      choices: ['has', 'the', 'is', 'does'], answer: 'has',
      ja: `${academic.jaSubject}がこれほど早く${jaPast(academic)}ことは${negative === 'Never' ? '一度もありません' : 'めったにありません'}。`,
    }),
  }),
  family({
    key: 'pre1_only_inversion', level: 'pre1', topic: '倒置',
    explain: 'Only＋副詞句が文頭に出ると、主節は助動詞＋主語の倒置になる。',
    cases: cross(['after the final review', 'by checking every detail', 'when new evidence emerged'], ACADEMIC_ACTIONS),
    build: ([condition, academic]) => ({
      q: `Only ${condition} ___ ${academic.subject} ${academic.base} ${academic.object}.`,
      choices: ['did', 'was', 'had been', 'the'], answer: 'did',
      ja: `${condition === 'after the final review' ? '最終確認後に' : condition === 'by checking every detail' ? '細部をすべて確認して' : '新証拠が現れて'}初めて、${academic.jaSubject}は${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: 'pre1_conditional_inversion', level: 'pre1', topic: '仮定法応用',
    explain: 'If＋主語＋had＋過去分詞の if を省略すると Had＋主語の倒置になる。',
    cases: cross(ACADEMIC_ACTIONS, ['earlier', 'more carefully', 'before the deadline']),
    build: ([academic, adverb]) => ({
      q: `Had ${academic.subject} ___ ${academic.object} ${adverb}, the outcome would have differed.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}が${adverb === 'earlier' ? 'もっと早く' : adverb === 'more carefully' ? 'より慎重に' : '締め切り前に'}${jaTe(academic)}いたら、結果は違っていたでしょう。`,
    }),
  }),
  family({
    key: 'pre1_wish_past', level: 'pre1', topic: '仮定法応用',
    explain: '過去の事実への後悔は wish＋had＋過去分詞で表す。',
    cases: cross(THIRD_SUBJECTS, ACADEMIC_ACTIONS),
    build: ([[sEn, sJa], academic]) => ({
      q: `${sEn} wishes ${academic.subject} had ___ ${academic.object} sooner.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${sJa}は${academic.jaSubject}がもっと早く${jaTe(academic)}いればよかったと思っています。`,
    }),
  }),
  family({
    key: 'pre1_concession', level: 'pre1', topic: '譲歩',
    explain: 'however＋形容詞/副詞＋主語＋動詞で「どれほど〜しても」を表す。',
    cases: cross(['carefully', 'quickly', 'thoroughly', 'strongly'], ACADEMIC_ACTIONS),
    build: ([adverb, academic]) => ({
      q: `___ ${adverb} ${academic.subject} ${academic.third} ${academic.object}, some uncertainty remains.`,
      choices: ['However', 'Whatever', 'Although of', 'Despite'], answer: 'However',
      ja: `${academic.jaSubject}がどれほど${adverb === 'carefully' ? '慎重に' : adverb === 'quickly' ? '迅速に' : adverb === 'thoroughly' ? '徹底的に' : '強く'}${jaTe(academic)}も、不確実性は残ります。`,
    }),
  }),
  family({
    key: 'pre1_absolute_participle', level: 'pre1', topic: '独立分詞構文',
    explain: '分詞構文に独自の主語を置くと独立分詞構文になる。',
    cases: cross(['There being no objections', 'The review being complete', 'All factors considered'], ACADEMIC_ACTIONS),
    build: ([opening, academic]) => ({
      q: `${opening}, ${academic.subject} ___ ${academic.object}.`,
      choices: [academic.past, academic.base, academic.ing, academic.third],
      answer: academic.past,
      ja: `${opening === 'There being no objections' ? '反対がなかったので' : opening === 'The review being complete' ? '審査が完了したので' : 'すべての要因を考慮して'}、${academic.jaSubject}は${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: 'pre1_appositive_that', level: 'pre1', topic: '同格',
    explain: '抽象名詞の具体的内容を同格の that 節で説明する。',
    cases: cross(['fact', 'possibility', 'assumption', 'belief'], ACADEMIC_ACTIONS),
    build: ([noun, academic]) => ({
      q: `The ${noun} ___ ${academic.subject} may ${academic.base} ${academic.object} deserves attention.`,
      choices: ['that', 'what', 'which', 'whether or'], answer: 'that',
      ja: `${academic.jaSubject}が${academic.jaAction}かもしれないという${noun === 'fact' ? '事実' : noun === 'possibility' ? '可能性' : noun === 'assumption' ? '仮定' : '考え'}は注目に値します。`,
    }),
  }),
  family({
    key: 'pre1_compound_relative', level: 'pre1', topic: '複合関係詞',
    explain: 'whatever/whichever＋名詞で「どの〜であっても」という譲歩を表す。',
    cases: cross([['Whatever', 'method'], ['Whichever', 'option'], ['Whatever', 'schedule'], ['Whichever', 'proposal']], ACADEMIC_ACTIONS),
    build: ([[answer, noun], academic]) => ({
      q: `___ ${noun} ${academic.subject} chooses, it must ${academic.base} ${academic.object}.`,
      choices: [answer, answer === 'Whatever' ? 'However' : 'Whenever', 'Whoever', 'Wherever'],
      answer,
      ja: `${academic.jaSubject}がどの${noun === 'option' ? '選択肢' : noun === 'method' ? '方法' : noun === 'schedule' ? '日程' : '提案'}を選んでも、${academic.jaAction}必要があります。`,
    }),
  }),
  family({
    key: 'pre1_participle_idiom', level: 'pre1', topic: '分詞構文応用',
    explain: 'generally/strictly speaking などは文全体にかかる慣用的な分詞構文。',
    cases: cross(['Generally', 'Strictly', 'Roughly', 'Broadly'], ACADEMIC_ACTIONS),
    build: ([adverb, academic]) => ({
      q: `${adverb} ___, ${academic.subject} should ${academic.base} ${academic.object}.`,
      choices: ['speaking', 'spoken', 'to speak', 'speak'], answer: 'speaking',
      ja: `${adverb === 'Generally' ? '一般的に' : adverb === 'Strictly' ? '厳密に' : adverb === 'Roughly' ? '大まかに' : '広く'}言えば、${academic.jaSubject}は${academic.jaAction}べきです。`,
    }),
  }),
  family({
    key: 'pre1_reporting_verb', level: 'pre1', topic: '話法',
    explain: 'deny は動名詞、admit は動名詞、warn は人＋not to do を取る。',
    cases: cross(['denied', 'admitted'], ACADEMIC_ACTIONS, ['publicly', 'during the hearing']),
    build: ([verb, academic, suffix]) => ({
      q: `${capitalize(academic.subject)} ${verb} having ___ ${academic.object} ${suffix}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は${suffix === 'publicly' ? '公に' : '審理中に'}${jaPast(academic)}ことを${verb === 'denied' ? '否定しました' : '認めました'}。`,
    }),
  }),
  family({
    key: 'pre1_be_to', level: 'pre1', topic: 'be to構文',
    explain: 'If S is to do は「Sが〜するためには」という必要条件を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['successfully', 'by the deadline', 'without further delay']),
    build: ([academic, suffix]) => ({
      q: `If ${academic.subject} is to ___ ${academic.object} ${suffix}, it needs more resources.`,
      choices: [academic.base, academic.third, academic.past, academic.ing],
      answer: academic.base,
      ja: `${academic.jaSubject}が${suffix === 'successfully' ? 'うまく' : suffix === 'by the deadline' ? '期限までに' : 'これ以上遅れずに'}${academic.jaAction}ためには、さらに資源が必要です。`,
    }),
  }),
  family({
    key: 'pre1_whale', level: 'pre1', topic: 'クジラ構文',
    explain: 'no more A than B で「BがAでないのと同様に〜もAでない」を表す。',
    cases: cross(['a rumor', 'an assumption', 'a slogan', 'a promise'], ['evidence', 'a fact', 'a solution'], ['in formal reasoning', 'without verification']),
    build: ([subject, complement, context]) => ({
      q: `${context === 'in formal reasoning' ? 'In formal reasoning' : 'Without verification'}, ${subject} is no ___ ${complement} than a guess is.`,
      choices: ['more', 'less', 'better', 'rather'], answer: 'more',
      ja: `${context === 'in formal reasoning' ? '厳密な推論では' : '検証がなければ'}、推測が${complement === 'evidence' ? '証拠' : complement === 'a fact' ? '事実' : '解決策'}でないのと同様に、${subject === 'a rumor' ? '噂' : subject === 'an assumption' ? '仮定' : subject === 'a slogan' ? '標語' : '約束'}もそうではありません。`,
    }),
  }),
  family({
    key: 'pre1_chain_relative', level: 'pre1', topic: '連鎖関係詞',
    explain: '挿入節を除いた関係詞節内で主語なら who、目的語なら whom を使う。',
    cases: cross(RELATIVE_PEOPLE, ACADEMIC_ACTIONS),
    build: ([[personEn, personJa], academic]) => ({
      q: `This is ${personEn} ___ we believe can ${academic.base} ${academic.object}.`,
      choices: ['who', 'whom', 'whose', 'which'], answer: 'who',
      ja: `こちらが${jaPotential(academic)}と私たちが考える${personJa}です。`,
    }),
  }),
  family({
    key: 'pre1_with', level: 'pre1', topic: '付帯状況',
    explain: 'with＋目的語＋現在分詞で、目的語が動作中の付帯状況を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['the discussion continuing', 'several members waiting', 'the deadline approaching']),
    build: ([academic, situation]) => ({
      q: `With ${situation}, ${academic.subject} ___ ${academic.object}.`,
      choices: [academic.past, academic.base, academic.ing, academic.third],
      answer: academic.past,
      ja: `${situation === 'the discussion continuing' ? '議論が続く中' : situation === 'several members waiting' ? '数人の委員が待つ中' : '締め切りが迫る中'}、${academic.jaSubject}は${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: 'pre1_ellipsis', level: 'pre1', topic: '省略',
    explain: 'if necessary/if possible は if it is necessary/possible の主語とbe動詞を省略した形。',
    cases: cross([['necessary', 'after consultation'], ['possible', 'before the deadline'], ['appropriate', 'under the rules'], ['required', 'by law']], ACADEMIC_ACTIONS),
    build: ([[answer, context], academic]) => ({
      q: `If ___, ${academic.subject} will ${academic.base} ${academic.object} again ${context}.`,
      choices: [answer, `it ${answer}`, `is ${answer}`, `to be ${answer}`],
      answer,
      ja: `${answer === 'necessary' ? '必要なら' : answer === 'possible' ? '可能なら' : answer === 'appropriate' ? '適切なら' : '求められれば'}、${academic.jaSubject}は再び${academic.jaAction}でしょう。`,
    }),
  }),
  family({
    key: 'pre1_emphasis', level: 'pre1', topic: '強調',
    explain: '肯定文の一般動詞の前に do/does/did を置くと動詞を強調できる。',
    cases: cross(ACADEMIC_ACTIONS, ['indeed', 'actually', 'in fact']),
    build: ([academic, adverb]) => ({
      q: `${capitalize(academic.subject)} ${adverb} ___ ${academic.base} ${academic.object}.`,
      choices: ['did', 'was', 'had been', 'very'], answer: 'did',
      ja: `${academic.jaSubject}は${adverb === 'indeed' ? '確かに' : adverb === 'actually' ? '実際に' : '事実として'}${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: 'pre1_agreement', level: 'pre1', topic: '一致',
    explain: 'a series of＋複数名詞では、主語の中心 series に合わせ単数動詞を使う。',
    cases: cross(['A series of reviews', 'A set of guidelines', 'The number of objections'], ACADEMIC_ACTIONS),
    build: ([subject, academic]) => ({
      q: `${subject} ___ expected to help ${academic.subject} ${academic.base} ${academic.object}.`,
      choices: ['is', 'are', 'have', 'be'], answer: 'is',
      ja: `${subject === 'A series of reviews' ? '一連の審査' : subject === 'A set of guidelines' ? '一組の指針' : '異議の数'}は、${academic.jaSubject}が${academic.jaAction}際に役立つと期待されています。`,
    }),
  }),
  family({
    key: 'pre1_modal', level: 'pre1', topic: '助動詞',
    explain: 'ought to have＋過去分詞で「〜すべきだったのに」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['earlier', 'more carefully', 'before acting']),
    build: ([academic, suffix]) => ({
      q: `${capitalize(academic.subject)} ought to have ___ ${academic.object} ${suffix}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は${suffix === 'earlier' ? 'もっと早く' : suffix === 'more carefully' ? 'より慎重に' : '行動前に'}${academic.jaAction}べきでした。`,
    }),
  }),
  family({
    key: 'pre1_comparison', level: 'pre1', topic: '比較構文',
    explain: 'not so much A as B で「AというよりむしろB」を表す。',
    cases: cross(['expensive', 'complex', 'risky', 'slow'], ['impractical', 'unclear', 'unnecessary', 'outdated'], ['in practice', 'under current conditions']),
    build: ([a, b, context]) => ({
      q: `The proposal is not so much ${a} ___ ${b} ${context}.`,
      choices: ['as', 'than', 'but', 'like'], answer: 'as',
      ja: `その提案は${a === 'expensive' ? '高価' : a === 'complex' ? '複雑' : a === 'risky' ? '危険' : '遅い'}というより、むしろ${b === 'impractical' ? '非実用的' : b === 'unclear' ? '不明確' : b === 'unnecessary' ? '不要' : '時代遅れ'}です。`,
    }),
  }),
]

const ONE_FAMILIES = [
  family({
    key: '1_no_sooner', level: '1', topic: '倒置・強調',
    explain: 'No sooner had S＋過去分詞 than ... で「〜するとすぐ…」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['the public began to respond', 'new questions emerged']),
    build: ([academic, reaction]) => ({
      q: `No sooner had ${academic.subject} ___ ${academic.object} than ${reaction}.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}が${jaContinuative(academic)}終えるとすぐ、${reaction === 'the public began to respond' ? '世間が反応し始めました' : '新たな疑問が生じました'}。`,
    }),
  }),
  family({
    key: '1_so_inversion', level: '1', topic: '倒置・強調',
    explain: 'So＋形容詞が文頭に出ると、be動詞＋主語の倒置になる。',
    cases: cross(ACADEMIC_ACTIONS, ['compelling', 'complex', 'controversial', 'urgent'], ['that the vote was delayed', 'that further review was required']),
    build: ([academic, adj, result]) => ({
      q: `So ${adj} ___ ${academic.subject}'s proposal ${result}.`,
      choices: ['was', 'did', 'had', 'it was'], answer: 'was',
      ja: `${academic.jaSubject}の提案は非常に${adj === 'compelling' ? '説得力があった' : adj === 'complex' ? '複雑だった' : adj === 'controversial' ? '議論を呼んだ' : '緊急性が高かった'}ため、${result === 'that the vote was delayed' ? '採決が延期されました' : 'さらなる審査が必要になりました'}。`,
    }),
  }),
  family({
    key: '1_mandative', level: '1', topic: '仮定法・語法',
    explain: '提案・要求を表す動詞の that 節では、動詞原形（仮定法現在）を使う。',
    cases: cross(['recommended', 'demanded', 'proposed', 'insisted'], ACADEMIC_ACTIONS),
    build: ([reporting, academic]) => ({
      q: `The experts ${reporting} that ${academic.subject} ___ ${academic.object}.`,
      choices: [academic.base, academic.third, academic.past, academic.ing],
      answer: academic.base,
      ja: `専門家は${academic.jaSubject}が${academic.jaAction}よう${reporting === 'recommended' ? '勧告しました' : reporting === 'demanded' ? '要求しました' : reporting === 'proposed' ? '提案しました' : '強く主張しました'}。`,
    }),
  }),
  family({
    key: '1_high_time', level: '1', topic: '仮定法・語法',
    explain: 'It is high time＋主語＋過去形で「もう〜すべき時だ」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['finally', 'properly', 'once again']),
    build: ([academic, adverb]) => ({
      q: `It is high time ${academic.subject} ${adverb} ___ ${academic.object}.`,
      choices: [academic.past, academic.base, academic.third, `will ${academic.base}`],
      answer: academic.past,
      ja: `${academic.jaSubject}が${adverb === 'finally' ? 'いよいよ' : adverb === 'properly' ? '適切に' : 'もう一度'}${academic.jaAction}べき時です。`,
    }),
  }),
  family({
    key: '1_modal_deduction', level: '1', topic: '助動詞・推量',
    explain: 'cannot/must/may have＋過去分詞で、過去についての推量を表す。',
    cases: cross(['cannot', 'must', 'may', 'should'], ACADEMIC_ACTIONS),
    build: ([modal, academic]) => ({
      q: `${capitalize(academic.subject)} ${modal} have ___ ${academic.object} without consulting anyone.`,
      choices: [academic.pp, academic.past === academic.pp ? academic.ing : academic.past, academic.base, academic.third],
      answer: academic.pp,
      ja: `${academic.jaSubject}は誰にも相談せず${modal === 'cannot' ? `${jaPast(academic)}はずがありません` : modal === 'must' ? `${jaPast(academic)}に違いありません` : modal === 'may' ? `${jaPast(academic)}かもしれません` : `${academic.jaAction}べきでした`}。`,
    }),
  }),
  family({
    key: '1_future_perfect_progressive', level: '1', topic: '時制・相',
    explain: '未来完了進行形 will have been＋動詞ing で、未来の時点まで続く動作を表す。',
    cases: cross(ONGOING_ACADEMIC_ACTIONS, ['for two months', 'for a year', 'for six months']),
    build: ([academic, duration]) => ({
      q: `By next June, ${academic.subject} will have been ___ ${academic.object} ${duration}.`,
      choices: [academic.ing, academic.pp, academic.base, academic.past],
      answer: academic.ing,
      ja: `来年6月には、${academic.jaSubject}は${duration === 'for two months' ? '2か月間' : duration === 'for a year' ? '1年間' : '6か月間'}${jaContinuative(academic)}続けていることになります。`,
    }),
  }),
  family({
    key: '1_agreement_neither', level: '1', topic: '主語と動詞の一致',
    explain: 'neither A nor B では、試験文法上、動詞を近い主語Bに一致させる。',
    cases: cross(['the chair', 'the director', 'the lead researcher'], ['the members', 'the assistants', 'the reviewers'], ACADEMIC_ACTIONS),
    build: ([a, b, academic]) => ({
      q: `Neither ${a} nor ${b} ___ willing to ${academic.base} ${detachedObject(academic)}.`,
      choices: ['were', 'was', 'has', 'be'], answer: 'were',
      ja: `${a === 'the chair' ? '議長' : a === 'the director' ? '責任者' : '主任研究者'}も${b === 'the members' ? '委員たち' : b === 'the assistants' ? '助手たち' : '審査員たち'}も${academic.jaAction}意思がありませんでした。`,
    }),
  }),
  family({
    key: '1_agreement_number', level: '1', topic: '主語と動詞の一致',
    explain: 'a number of＋複数名詞は複数、the number of＋複数名詞は単数扱い。',
    cases: cross(['A number of experts', 'A number of reviewers'], ACADEMIC_ACTIONS, ['already', 'independently']),
    build: ([subject, academic, adverb]) => ({
      q: `${subject} ___ ${academic.pp} ${academic.object} ${adverb}.`,
      choices: ['have', 'has', 'is', 'was'], answer: 'have',
      ja: `多くの専門家が${adverb === 'already' ? 'すでに' : '独自に'}${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: '1_ellipsis', level: '1', topic: '省略・代用',
    explain: '副詞節の主語が主節と同じでbe動詞を伴うとき、主語とbe動詞を省略できる。',
    cases: cross(['If accepted', 'When completed', 'Unless revised', 'Once approved'], ACADEMIC_ACTIONS),
    build: ([opening, academic]) => ({
      q: `${opening}, ${academic.subject}'s ${opening === 'If accepted' ? 'proposal' : opening === 'When completed' ? 'project' : opening === 'Unless revised' ? 'policy' : 'budget'} will ___ the entire process.`,
      choices: ['affect', 'affects', 'affected', 'affecting'], answer: 'affect',
      ja: `${opening === 'If accepted' ? '受け入れられれば' : opening === 'When completed' ? '完成すれば' : opening === 'Unless revised' ? '修正されない限り' : '承認されれば'}、${academic.jaSubject}の${opening === 'If accepted' ? '提案' : opening === 'When completed' ? '計画' : opening === 'Unless revised' ? '方針' : '予算'}は全過程に影響します。`,
    }),
  }),
  family({
    key: '1_all_the_more', level: '1', topic: '高度比較',
    explain: 'all the more＋形容詞＋because ... で「…なのでなおさら〜」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['important', 'urgent', 'remarkable', 'concerning']),
    build: ([academic, adj]) => ({
      q: `${capitalize(academic.subject)}'s decision is all the ___ ${adj} because action was delayed.`,
      choices: ['more', 'most', 'very', 'much as'], answer: 'more',
      ja: `対応が遅れたため、${academic.jaSubject}の決定はなおさら${adj === 'important' ? '重要' : adj === 'urgent' ? '緊急' : adj === 'remarkable' ? '注目に値するもの' : '懸念すべきもの'}です。`,
    }),
  }),
  family({
    key: '1_superior_to', level: '1', topic: '高度比較',
    explain: 'superior/inferior/senior/junior は比較対象の前に than ではなく to を使う。',
    cases: cross(['superior', 'inferior', 'preferable'], ACADEMIC_ACTIONS, ['in accuracy', 'in cost', 'in reliability']),
    build: ([adj, academic, respect]) => ({
      q: `In handling ${academic.object}, this approach is ${adj} ___ the previous one ${respect}.`,
      choices: ['to', 'than', 'over than', 'with'], answer: 'to',
      ja: `${jaObject(academic)}を扱う際、この方法は${respect === 'in accuracy' ? '正確さ' : respect === 'in cost' ? '費用' : '信頼性'}の点で以前の方法より${adj === 'superior' ? '優れています' : adj === 'inferior' ? '劣っています' : '望ましいです'}。`,
    }),
  }),
  family({
    key: '1_quantifier', level: '1', topic: '限定詞・数量',
    explain: 'many a＋単数名詞は意味上複数でも単数動詞を取る。',
    cases: cross(['promising proposal', 'careful analysis', 'well-designed policy', 'serious attempt'], ACADEMIC_ACTIONS),
    build: ([noun, academic]) => ({
      q: `Many a ${noun} ___ failed because ${academic.subject} lacked resources.`,
      choices: ['has', 'have', 'are', 'were'], answer: 'has',
      ja: `${academic.jaSubject}に資源が不足していたため、多くの${noun === 'promising proposal' ? '有望な提案' : noun === 'careful analysis' ? '慎重な分析' : noun === 'well-designed policy' ? 'よく練られた政策' : '真剣な試み'}が失敗してきました。`,
    }),
  }),
  family({
    key: '1_extent_to_which', level: '1', topic: '関係詞応用',
    explain: 'the extent to which ... で「…する程度・範囲」を表す。',
    cases: cross(ONGOING_ACADEMIC_ACTIONS, ['remains unclear', 'is still disputed', 'requires investigation']),
    build: ([academic, tail]) => ({
      q: `The extent to ___ ${academic.subject} ${academic.past} ${academic.object} ${tail}.`,
      choices: ['which', 'that', 'what', 'where'], answer: 'which',
      ja: `${academic.jaSubject}が${jaPast(academic)}程度は、${tail === 'remains unclear' ? '不明なままです' : tail === 'is still disputed' ? '今も議論されています' : '調査が必要です'}。`,
    }),
  }),
  family({
    key: '1_notwithstanding', level: '1', topic: '高度語法',
    explain: 'notwithstanding は前置詞として名詞句を取り「〜にもかかわらず」を表す。',
    cases: cross(['the objections', 'the uncertainty', 'the limited budget', 'the delay'], ACADEMIC_ACTIONS),
    build: ([noun, academic]) => ({
      q: `___ ${noun}, ${academic.subject} ${academic.past} ${academic.object}.`,
      choices: ['Notwithstanding', 'Although', 'Because', 'Unless'], answer: 'Notwithstanding',
      ja: `${noun === 'the objections' ? '反対意見' : noun === 'the uncertainty' ? '不確実性' : noun === 'the limited budget' ? '限られた予算' : '遅れ'}にもかかわらず、${academic.jaSubject}は${jaPolitePast(academic)}。`,
    }),
  }),
  family({
    key: '1_insofar_as', level: '1', topic: '高度語法',
    explain: 'insofar as は「〜する限りにおいて」という範囲・程度を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['follows the evidence', 'acts transparently', 'serves the public interest']),
    build: ([academic, condition]) => ({
      q: `___ as ${academic.subject} ${condition}, its decision deserves support.`,
      choices: ['Insofar', 'Despite', 'Unless', 'Whereas of'], answer: 'Insofar',
      ja: `${academic.jaSubject}が${condition === 'follows the evidence' ? '証拠に従う' : condition === 'acts transparently' ? '透明性を保って行動する' : '公共の利益にかなう行動をする'}限りにおいて、その決定は支持に値します。`,
    }),
  }),
  family({
    key: '1_pseudo_cleft', level: '1', topic: '強調・倒置',
    explain: 'What S V is ... の疑似分裂文で、焦点となる情報を後ろに置く。',
    cases: cross(ACADEMIC_ACTIONS, ['more evidence', 'a clear timetable', 'independent review']),
    build: ([academic, focus]) => ({
      q: `___ ${academic.subject} needs is ${focus} to ${academic.base} ${academic.object}.`,
      choices: ['What', 'That', 'Which', 'It'], answer: 'What',
      ja: `${academic.jaSubject}が${academic.jaAction}ために必要なのは${focus === 'more evidence' ? 'さらなる証拠' : focus === 'a clear timetable' ? '明確な日程' : '独立した審査'}です。`,
    }),
  }),
  family({
    key: '1_optative', level: '1', topic: '祈願文',
    explain: 'May＋主語＋動詞原形で願望・祈願を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['succeed', 'make progress', 'find lasting success']),
    build: ([academic, predicate]) => ({
      q: `___ ${academic.subject} ${predicate} in its efforts to ${academic.base} ${academic.object}.`,
      choices: ['May', 'Can', 'Should have', 'Would'], answer: 'May',
      ja: `${academic.jaSubject}が${academic.jaAction}ための取り組みで${predicate === 'succeed' ? '成功しますように' : predicate === 'make progress' ? '前進できますように' : '永続的な成果を得られますように'}。`,
    }),
  }),
  family({
    key: '1_suffice', level: '1', topic: '高度語法',
    explain: 'Suffice it to say that ... は「…と言えば十分だ」という仮定法現在の慣用表現。',
    cases: cross(ACADEMIC_ACTIONS, ['controversial', 'costly', 'long overdue']),
    build: ([academic, adjective]) => ({
      q: `___ it to say that ${academic.subject}'s decision was ${adjective}.`,
      choices: ['Suffice', 'Enough', 'Sufficient', 'Sufficing'], answer: 'Suffice',
      ja: `${academic.jaSubject}の決定が${adjective === 'controversial' ? '議論を呼んだ' : adjective === 'costly' ? '多額の費用を要した' : '長く待ち望まれていた'}と言えば十分でしょう。`,
    }),
  }),
  family({
    key: '1_lest', level: '1', topic: '高度語法',
    explain: 'lest＋主語＋(should)＋動詞原形で「〜しないように」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['misunderstand', 'overlook a detail', 'draw the wrong conclusion']),
    build: ([academic, risk]) => ({
      q: `${capitalize(academic.subject)} explained its decision carefully lest anyone ___ ${risk}.`,
      choices: ['should', 'will', 'has', 'would have'], answer: 'should',
      ja: `誰かが${risk === 'misunderstand' ? '誤解する' : risk === 'overlook a detail' ? '細部を見落とす' : '誤った結論を出す'}ことのないよう、${academic.jaSubject}はその決定を注意深く説明しました。`,
    }),
  }),
  family({
    key: '1_provided_that', level: '1', topic: '高度語法',
    explain: 'provided/providing that は「〜という条件で」を表す。',
    cases: cross(ACADEMIC_ACTIONS, ['the evidence is disclosed', 'costs remain stable', 'all parties agree']),
    build: ([academic, condition]) => ({
      q: `${capitalize(academic.subject)} may ${academic.base} ${academic.object} ___ that ${condition}.`,
      choices: ['provided', 'unless', 'lest', 'despite'], answer: 'provided',
      ja: `${condition === 'the evidence is disclosed' ? '証拠が公開される' : condition === 'costs remain stable' ? '費用が安定している' : 'すべての当事者が同意する'}という条件で、${academic.jaSubject}は${academic.jaAction}ことができます。`,
    }),
  }),
  family({
    key: '1_were_to', level: '1', topic: '仮定法・語法',
    explain: 'Were＋主語＋to do は If＋主語＋were to do のif省略倒置。',
    cases: cross(ACADEMIC_ACTIONS, ['unexpectedly', 'without warning', 'at this stage']),
    build: ([academic, adverb]) => ({
      q: `___ ${academic.subject} to ${academic.base} ${academic.object} ${adverb}, the consequences would be serious.`,
      choices: ['Were', 'Had', 'Should have', 'If'], answer: 'Were',
      ja: `万一${academic.jaSubject}が${adverb === 'unexpectedly' ? '予想外に' : adverb === 'without warning' ? '予告なく' : 'この段階で'}${academic.jaAction}とすれば、結果は重大でしょう。`,
    }),
  }),
]

// 500問の手作り問題と合わせ、級別428〜429問・合計3,000問にする。
export const GENERATED_GRAMMAR_COUNTS = Object.freeze({
  5: 366,
  4: 361,
  3: 358,
  pre2: 347,
  2: 349,
  pre1: 355,
  1: 364,
})

export const GENERATED_GRAMMAR = [
  ...selectRoundRobin('5', GENERATED_GRAMMAR_COUNTS[5], FIVE_FAMILIES),
  ...selectRoundRobin('4', GENERATED_GRAMMAR_COUNTS[4], FOUR_FAMILIES),
  ...selectRoundRobin('3', GENERATED_GRAMMAR_COUNTS[3], THREE_FAMILIES),
  ...selectRoundRobin('pre2', GENERATED_GRAMMAR_COUNTS.pre2, PRE2_FAMILIES),
  ...selectRoundRobin('2', GENERATED_GRAMMAR_COUNTS[2], TWO_FAMILIES),
  ...selectRoundRobin('pre1', GENERATED_GRAMMAR_COUNTS.pre1, PRE1_FAMILIES),
  ...selectRoundRobin('1', GENERATED_GRAMMAR_COUNTS[1], ONE_FAMILIES),
]
