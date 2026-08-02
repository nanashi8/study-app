import { publicAssetUrl } from './publicAssetUrl.js'

export const BATTLE_EMOTION_STATES = [
  { id: 'idle', label: '待機', emoji: '🌙', group: 'calm' },
  { id: 'gentle', label: 'やさしい', emoji: '🌷', group: 'healing' },
  { id: 'delighted', label: '大喜び', emoji: '✨', group: 'joy' },
  { id: 'playful', label: '楽しそう', emoji: '🎈', group: 'joy' },
  { id: 'healing', label: '癒し', emoji: '🍀', group: 'healing' },
  { id: 'relieved', label: 'ほっとする', emoji: '☕', group: 'healing' },
  { id: 'confident', label: '自信', emoji: '🌟', group: 'brave' },
  { id: 'focused', label: '集中', emoji: '🎯', group: 'brave' },
  { id: 'curious', label: '興味津々', emoji: '🔎', group: 'calm' },
  { id: 'thinking', label: '考える', emoji: '💭', group: 'calm' },
  { id: 'surprised', label: 'びっくり', emoji: '❕', group: 'emotion' },
  { id: 'embarrassed', label: '照れる', emoji: '🌸', group: 'emotion' },
  { id: 'worried', label: '心配', emoji: '☁️', group: 'emotion' },
  { id: 'sad', label: '悲しい', emoji: '🌧️', group: 'emotion' },
  { id: 'crying', label: '涙', emoji: '💧', group: 'emotion' },
  { id: 'angry', label: '怒り', emoji: '🔥', group: 'brave' },
  { id: 'determined', label: '決意', emoji: '⚡', group: 'brave' },
  { id: 'scared', label: 'こわい', emoji: '🫧', group: 'emotion' },
  { id: 'hurt', label: 'ダメージ', emoji: '💥', group: 'battle' },
  { id: 'exhausted', label: '疲労', emoji: '🪫', group: 'battle' },
  { id: 'attack', label: '攻撃', emoji: '⚔️', group: 'battle' },
  { id: 'guard', label: '防御', emoji: '🛡️', group: 'battle' },
  { id: 'victory', label: '勝利', emoji: '🏆', group: 'joy' },
  { id: 'cheering', label: '応援', emoji: '📣', group: 'joy' },
]

const EMOTION_BY_ID = new Map(
  BATTLE_EMOTION_STATES.map((emotion) => [emotion.id, emotion]),
)

export const DEFAULT_BATTLE_STUDENT_ID = 'mio'

export const BATTLE_STUDENTS = [
  {
    id: 'mio',
    name: '音羽ミオ',
    reading: 'おとわ みお',
    club: '合唱部',
    emoji: '🎼',
    trait: '気持ちを音に変える、やさしい旋律使い。',
    accent: '#ec4899',
  },
  {
    id: 'ren',
    name: '青井レン',
    reading: 'あおい れん',
    club: '美術部',
    emoji: '✏️',
    trait: 'ひらめきを一筆で描く、放課後の作戦家。',
    accent: '#0ea5e9',
  },
  {
    id: 'haru',
    name: '久遠ハル',
    reading: 'くおん はる',
    club: '図書委員',
    emoji: '📘',
    trait: '静かな観察眼で、答えへの道筋を読む。',
    accent: '#6366f1',
  },
  {
    id: 'akari',
    name: '星野アカリ',
    reading: 'ほしの あかり',
    club: '科学部',
    emoji: '🧪',
    trait: '失敗も実験データに変える、前向きな発明家。',
    accent: '#f97316',
  },
  {
    id: 'kaito',
    name: '風間カイト',
    reading: 'かざま かいと',
    club: '陸上部',
    emoji: '👟',
    trait: '考えるより一歩先へ。仲間を引っぱる俊足。',
    accent: '#10b981',
  },
  {
    id: 'rei',
    name: '黒川レイ',
    reading: 'くろかわ れい',
    club: '生徒会',
    emoji: '📋',
    trait: '冷静な判断と小さな笑顔で作戦を整える。',
    accent: '#8b5cf6',
  },
  {
    id: 'nao',
    name: '朝倉ナオ',
    reading: 'あさくら なお',
    club: '国際交流部',
    emoji: '🌍',
    trait: 'ことばの壁を楽しさに変えるムードメーカー。',
    accent: '#14b8a6',
  },
  {
    id: 'tsubaki',
    name: '桐生ツバキ',
    reading: 'きりゅう つばき',
    club: '剣道部',
    emoji: '⚔️',
    trait: '迷いを断ち切り、仲間の前に立つ守り手。',
    accent: '#dc2626',
    hairProfile: {
      color: 'dark-purple-black',
      texture: 'straight',
      allowedStyles: ['down', 'high-ponytail', 'high-twin-tails'],
      forbiddenTextures: ['wavy', 'curly', 'ringlet'],
    },
  },
  {
    id: 'noa',
    name: '水瀬ノア',
    reading: 'みなせ のあ',
    club: '電脳研究会',
    emoji: '💻',
    trait: '好奇心とコードで、校内の謎を解析する。',
    accent: '#06b6d4',
  },
  {
    id: 'yuu',
    name: '白峰ユウ',
    reading: 'しらみね ゆう',
    club: '文芸部',
    emoji: '🖋️',
    trait: '物語の結末を信じ、最後の一問まで諦めない。',
    accent: '#64748b',
  },
].map((student) => ({
  ...student,
  assetBase: publicAssetUrl(`/assets/battle/cast/students/${student.id}`),
  motionBase: publicAssetUrl(`/assets/battle/motion/students/${student.id}`),
  lifestyleBase: publicAssetUrl(`/assets/battle/cast/lifestyle/${student.id}`),
}))

export const BATTLE_LIFESTYLE_OUTFITS = [
  { id: 'home', label: '自宅の私服', emoji: '🏠' },
  { id: 'weekend', label: '休日の私服', emoji: '🗓️' },
  { id: 'club', label: '部活動中の姿', emoji: '🎽' },
]

const BATTLE_LIFESTYLE_OUTFIT_IDS = new Set(
  BATTLE_LIFESTYLE_OUTFITS.map((outfit) => outfit.id),
)

export const BATTLE_CHARACTER_VISUAL_COUNT = BATTLE_STUDENTS.length
  * (BATTLE_EMOTION_STATES.length + BATTLE_LIFESTYLE_OUTFITS.length)

export const BATTLE_MOTION_STATES = [
  'attack',
  'guard',
  'healing',
  'hurt',
  'victory',
]

const MOTION_BY_EMOTION = new Map([
  ['attack', 'attack'],
  ['delighted', 'attack'],
  ['determined', 'attack'],
  ['guard', 'guard'],
  ['healing', 'healing'],
  ['relieved', 'healing'],
  ['hurt', 'hurt'],
  ['worried', 'hurt'],
  ['scared', 'hurt'],
  ['exhausted', 'hurt'],
  ['victory', 'victory'],
])

export const BATTLE_SUPPORT_STYLES = [
  { id: 'empathy', label: '気持ちに寄り添う', emoji: '🤝' },
  { id: 'idea', label: '小さな工夫を提案', emoji: '💡' },
  { id: 'together', label: '一緒にやってみる', emoji: '🌱' },
]

// バトルの外にも同じ10人が暮らしていることを見せる日常ストーリー。
// 声掛けには正解・不正解を設けず、学習評価や能力値へ接続しない。
// 選んだ言葉に応じて、生徒の表情と返事だけが変わる。
export const BATTLE_DAILY_SCENES = [
  {
    id: 'morning',
    name: '朝の支度',
    shortName: '朝',
    emoji: '🌅',
    time: '06:45',
    contextId: 'school',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/morning.webp'),
    description: '制服に袖を通し、今日のノートを鞄へ。静かな朝が冒険の始まり。',
    episode: {
      title: '朝からつまずいた日',
      speakerId: 'yuu',
      openingEmotionId: 'worried',
      situation: 'ユウは昨夜決めた早起きができず、予定していた英単語の復習も手つかずです。',
      opening: '「また続かなかった。朝からもう、今日はだめな気がする」',
      choices: [
        {
          id: 'morning-empathy',
          styleId: 'empathy',
          label: '「朝から調子が出ない日、あるよ」',
          reply: '「そっか、私だけじゃないんだ。今からできることを見てみる」',
          emotionId: 'relieved',
        },
        {
          id: 'morning-idea',
          styleId: 'idea',
          label: '「今日は一つだけ終わらせよう」',
          reply: '「全部取り戻さなくていいんだね。単語を5個だけ見てみる」',
          emotionId: 'focused',
        },
        {
          id: 'morning-together',
          styleId: 'together',
          label: '「登校までの5分、一緒に見よう」',
          reply: '「一緒なら始められそう。最初のページを開いてみるね」',
          emotionId: 'gentle',
        },
      ],
    },
    cast: [
      { studentId: 'mio', emotionId: 'gentle' },
      { studentId: 'yuu', emotionId: 'focused' },
    ],
  },
  {
    id: 'commute',
    name: '雨上がりの通学路',
    shortName: '通学',
    emoji: '🚲',
    time: '07:38',
    contextId: 'school',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/commute-v2.webp'),
    description: '紫陽花の道を駅へ。昨日の雨も、今朝はきらめく作戦会議の舞台。',
    episode: {
      title: '間に合わないかもしれない',
      speakerId: 'ren',
      openingEmotionId: 'worried',
      situation: '雨で電車が遅れ、レンは一時間目の発表準備に間に合わないのではと焦っています。',
      opening: '「遅れたら班のみんなに迷惑をかける。もっと早く出ればよかった」',
      choices: [
        {
          id: 'commute-empathy',
          styleId: 'empathy',
          label: '「焦るよね。でもレンのせいじゃないよ」',
          reply: '「そう言ってもらえると、少し息ができる。まず落ち着くよ」',
          emotionId: 'relieved',
        },
        {
          id: 'commute-idea',
          styleId: 'idea',
          label: '「班へ先に状況を伝えておこう」',
          reply: '「連絡なら今できるね。着く時間と資料の場所を送ってみる」',
          emotionId: 'focused',
        },
        {
          id: 'commute-together',
          styleId: 'together',
          label: '「着いたら準備を一緒に手伝うよ」',
          reply: '「ありがとう。一人で全部背負わなくていいんだね」',
          emotionId: 'gentle',
        },
      ],
    },
    cast: [
      { studentId: 'ren', emotionId: 'curious' },
      { studentId: 'kaito', emotionId: 'playful' },
    ],
  },
  {
    id: 'classroom',
    name: '授業中のひらめき',
    shortName: '授業',
    emoji: '✋',
    time: '10:20',
    contextId: 'school',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/classroom-v3.webp'),
    description: '考えて、書いて、手を挙げる。正解へ近づく小さな瞬間を三人で。',
    episode: {
      title: '手を挙げたいのに',
      speakerId: 'haru',
      openingEmotionId: 'scared',
      situation: 'ハルは答えの考え方が浮かんでいますが、間違えて笑われる場面を想像して手を挙げられません。',
      opening: '「たぶん分かる。でも、違っていたらと思うと声が出ない」',
      choices: [
        {
          id: 'classroom-empathy',
          styleId: 'empathy',
          label: '「みんなの前で話すの、こわいよね」',
          reply: '「うん。分かってもらえただけで、肩の力が少し抜けたよ」',
          emotionId: 'relieved',
        },
        {
          id: 'classroom-idea',
          styleId: 'idea',
          label: '「答えより、考え方から話してみる？」',
          reply: '「それなら言えそう。途中まででも、自分の考えを伝えてみる」',
          emotionId: 'determined',
        },
        {
          id: 'classroom-together',
          styleId: 'together',
          label: '「次の問いは私も一緒に手を挙げる」',
          reply: '「隣に仲間がいると思えば挑戦できそう。次はやってみるよ」',
          emotionId: 'confident',
        },
      ],
    },
    cast: [
      { studentId: 'haru', emotionId: 'confident' },
      { studentId: 'rei', emotionId: 'focused' },
      { studentId: 'akari', emotionId: 'delighted' },
    ],
  },
  {
    id: 'everyday',
    name: 'いつもの昼休み',
    shortName: '日常',
    emoji: '🍱',
    time: '12:35',
    contextId: 'school',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/everyday.webp'),
    description: '中庭の木陰でお弁当。何でもない会話が、午後の元気を回復する。',
    episode: {
      title: '会話に入れない昼休み',
      speakerId: 'noa',
      openingEmotionId: 'embarrassed',
      situation: 'ノアは友達の盛り上がっている話題を知らず、会話へ入るきっかけを逃してしまいました。',
      opening: '「今さら何の話って聞いたら、空気を止めちゃいそうで……」',
      choices: [
        {
          id: 'everyday-empathy',
          styleId: 'empathy',
          label: '「入るタイミング、難しいときあるよね」',
          reply: '「あるって言ってもらえて安心した。黙っていた自分を責めなくてよさそう」',
          emotionId: 'relieved',
        },
        {
          id: 'everyday-idea',
          styleId: 'idea',
          label: '「“それ何？”って一言だけ聞いてみよう」',
          reply: '「詳しく知らなくても質問ならできるね。ちょっと聞いてみたい」',
          emotionId: 'curious',
        },
        {
          id: 'everyday-together',
          styleId: 'together',
          label: '「まず私と一緒に輪へ戻ろう」',
          reply: '「隣にいてくれるなら行けそう。今度は私からも話してみる」',
          emotionId: 'gentle',
        },
      ],
    },
    cast: [
      { studentId: 'nao', emotionId: 'playful' },
      { studentId: 'noa', emotionId: 'curious' },
      { studentId: 'tsubaki', emotionId: 'gentle' },
    ],
  },
  {
    id: 'park',
    name: 'カードピクニック',
    shortName: '公園',
    emoji: '🃏',
    time: '14:20',
    contextId: 'weekend',
    outfitId: 'weekend',
    image: publicAssetUrl('/assets/battle/scenes/park.webp'),
    description: '休日の私服で一枚のシートを囲み、三人とも同じシンボルカードの一手に注目。',
    episode: {
      title: '次の一手を一緒に',
      speakerId: 'haru',
      openingEmotionId: 'thinking',
      situation: '公園のピクニックで、ツバキ・ナオ・ハルは一つのカードゲームを囲んでいます。ハルは手札と中央の並びを見比べ、あなたにも相談しました。',
      opening: '「この星を先に出すか、みんなの印がそろうまで待つか。君ならどうする？」',
      choices: [
        {
          id: 'park-empathy',
          styleId: 'empathy',
          label: '「迷うよね。急がず一緒に見よう」',
          reply: '「ありがとう。勝ち負けだけじゃなく、考える時間もみんなで楽しめそうだ」',
          emotionId: 'relieved',
        },
        {
          id: 'park-idea',
          styleId: 'idea',
          label: '「中央と同じ印からつなげよう」',
          reply: '「なるほど、全員が同じ並びを追えるね。ナオとツバキにも見せてみる」',
          emotionId: 'curious',
        },
        {
          id: 'park-together',
          styleId: 'together',
          label: '「私も輪に入って、次を考えるよ」',
          reply: '「うれしいな。では四人で同じカードを見ながら、もう一局やろう」',
          emotionId: 'delighted',
        },
      ],
    },
    cast: [
      { studentId: 'tsubaki', emotionId: 'focused' },
      { studentId: 'nao', emotionId: 'playful' },
      { studentId: 'haru', emotionId: 'curious' },
    ],
  },
  {
    id: 'club',
    name: '部活の合同準備',
    shortName: '部活',
    emoji: '🎨',
    time: '16:18',
    contextId: 'school',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/club.webp'),
    description: '歌と絵と体力を持ち寄って、文化祭の景色を少しずつ完成させる。',
    episode: {
      title: '自分だけ遅れて見える',
      speakerId: 'mio',
      openingEmotionId: 'sad',
      situation: '文化祭の練習で周りが上達するなか、ミオは同じところで何度もつまずいています。',
      opening: '「みんなの足を引っ張ってる気がする。私がいない方が進むのかな」',
      choices: [
        {
          id: 'club-empathy',
          styleId: 'empathy',
          label: '「比べ続けると苦しくなるよね」',
          reply: '「うん、本当は悔しかったんだ。言葉にしたら少し軽くなったよ」',
          emotionId: 'relieved',
        },
        {
          id: 'club-idea',
          styleId: 'idea',
          label: '「今日は一小節だけ確かめよう」',
          reply: '「全部うまくやろうとしてた。一小節なら変化を見つけられそう」',
          emotionId: 'focused',
        },
        {
          id: 'club-together',
          styleId: 'together',
          label: '「苦手な部分を一緒に合わせよう」',
          reply: '「ありがとう。できないところを隠さず、もう一度やってみるね」',
          emotionId: 'determined',
        },
      ],
    },
    cast: [
      { studentId: 'mio', emotionId: 'delighted' },
      { studentId: 'ren', emotionId: 'focused' },
      { studentId: 'kaito', emotionId: 'cheering' },
    ],
  },
  {
    id: 'cafe',
    name: '週末プラン会議',
    shortName: 'カフェ',
    emoji: '☕',
    time: '16:52',
    contextId: 'afterschool',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/cafe.webp'),
    description: '放課後のカフェで一枚の地図とスマホを囲み、三人で週末の行き先を相談。',
    episode: {
      title: '三人で決める寄り道',
      speakerId: 'akari',
      openingEmotionId: 'curious',
      situation: 'ミオ・アカリ・レイは同じ地図を広げ、週末に三人で回る店の順番を考えています。あなたにもスマホの候補を見せてきました。',
      opening: '「この店から始めれば全部回れそう！　でも休憩も入れた方がいいかな？」',
      choices: [
        {
          id: 'cafe-empathy',
          styleId: 'empathy',
          label: '「楽しみだと全部行きたくなるよね」',
          reply: '「そう、それ！　分かってもらえたら、焦らず楽しい順番を考えられそう」',
          emotionId: 'delighted',
        },
        {
          id: 'cafe-idea',
          styleId: 'idea',
          label: '「地図に休憩場所も印をつけよう」',
          reply: '「いいね。三人とも無理せず回れるルートにして、レイとミオにも見せるよ」',
          emotionId: 'focused',
        },
        {
          id: 'cafe-together',
          styleId: 'together',
          label: '「私も候補を一つ持ってくる」',
          reply: '「四人の行きたい場所を一本につなごう。次の会議もこの席でね！」',
          emotionId: 'playful',
        },
      ],
    },
    cast: [
      { studentId: 'mio', emotionId: 'gentle' },
      { studentId: 'akari', emotionId: 'delighted' },
      { studentId: 'rei', emotionId: 'focused' },
    ],
  },
  {
    id: 'snack',
    name: '帰り道の買い食い',
    shortName: '買い食い',
    emoji: '🥟',
    time: '17:06',
    contextId: 'afterschool',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/snack-v2.webp'),
    description: '商店街の揚げたてを分け合う。今日の頑張りに、おいしい回復時間。',
    episode: {
      title: '小テストのあとで',
      speakerId: 'yuu',
      openingEmotionId: 'sad',
      situation: '小テストで思うような点が取れず、ユウは友達との楽しい帰り道にも後ろめたさを感じています。',
      opening: '「できなかったのに、こんなふうに休んでいていいのかな」',
      choices: [
        {
          id: 'snack-empathy',
          styleId: 'empathy',
          label: '「うまくいかない日にも休んでいいよ」',
          reply: '「休むのも次へ進むためなんだね。今はちゃんと味わってみる」',
          emotionId: 'relieved',
        },
        {
          id: 'snack-idea',
          styleId: 'idea',
          label: '「あとで間違えた一問だけ見よう」',
          reply: '「全部やり直すと思って重かったんだ。一問なら向き合えそう」',
          emotionId: 'focused',
        },
        {
          id: 'snack-together',
          styleId: 'together',
          label: '「食べ終わったら一緒に答えを見よう」',
          reply: '「一人で開くのが嫌だったんだ。隣にいてくれたら見られるよ」',
          emotionId: 'gentle',
        },
      ],
    },
    cast: [
      { studentId: 'kaito', emotionId: 'playful' },
      { studentId: 'yuu', emotionId: 'delighted' },
      { studentId: 'mio', emotionId: 'gentle' },
    ],
  },
  {
    id: 'shopping',
    name: '週末ショッピング',
    shortName: '買い物',
    emoji: '🛍️',
    time: '17:24',
    contextId: 'weekend',
    outfitId: 'weekend',
    image: publicAssetUrl('/assets/battle/scenes/shopping-casual.webp'),
    description: '休日の私服で文具と小物を見比べる。三人で一つの買い物候補を相談中。',
    episode: {
      title: 'なかなか決められない',
      speakerId: 'akari',
      openingEmotionId: 'thinking',
      situation: '限られたお小遣いで文具を一つ選びたいアカリは、友達を待たせている気がして焦っています。',
      opening: '「二つとも好き。でも迷ってばかりだと、みんなを困らせるよね」',
      choices: [
        {
          id: 'shopping-empathy',
          styleId: 'empathy',
          label: '「大切に選んでいるから迷うんだよ」',
          reply: '「遅いんじゃなくて、大事に考えてたんだ。もう少し見てみたい」',
          emotionId: 'relieved',
        },
        {
          id: 'shopping-idea',
          styleId: 'idea',
          label: '「使う場面を一つずつ想像してみよう」',
          reply: '「毎日使う方を考えたら、気持ちが少しはっきりしてきたよ」',
          emotionId: 'curious',
        },
        {
          id: 'shopping-together',
          styleId: 'together',
          label: '「二つの良いところを一緒に比べよう」',
          reply: '「急かさず付き合ってくれてありがとう。納得して決められそう」',
          emotionId: 'delighted',
        },
      ],
    },
    cast: [
      { studentId: 'akari', emotionId: 'delighted' },
      { studentId: 'rei', emotionId: 'curious' },
      { studentId: 'noa', emotionId: 'playful' },
    ],
  },
  {
    id: 'library',
    name: '図書館の静かな時間',
    shortName: '図書館',
    emoji: '📚',
    time: '17:41',
    contextId: 'afterschool',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/library.webp'),
    description: 'ページをめくり、手がかりをつなぐ。夕日の書架で心まで整う。',
    episode: {
      title: '読んでも頭に入らない',
      speakerId: 'haru',
      openingEmotionId: 'exhausted',
      situation: 'ハルは同じ英文を何度も読み直していますが、意味がつながらず集中力も切れてきました。',
      opening: '「さっきから同じ行ばかり。読むのが向いていないのかな」',
      choices: [
        {
          id: 'library-empathy',
          styleId: 'empathy',
          label: '「頭に入らない日、誰にでもあるよ」',
          reply: '「能力のせいと決めなくていいんだね。少し休んで戻ってみる」',
          emotionId: 'relieved',
        },
        {
          id: 'library-idea',
          styleId: 'idea',
          label: '「一段落を一言でメモしてみよう」',
          reply: '「全部覚えようとしてた。一言なら文章の道筋を追えそうだ」',
          emotionId: 'focused',
        },
        {
          id: 'library-together',
          styleId: 'together',
          label: '「一文ずつ交代で読んでみよう」',
          reply: '「声に出すと区切りが見えるかも。一緒に最初からお願い」',
          emotionId: 'curious',
        },
      ],
    },
    cast: [
      { studentId: 'haru', emotionId: 'focused' },
      { studentId: 'yuu', emotionId: 'gentle' },
      { studentId: 'mio', emotionId: 'healing' },
    ],
  },
  {
    id: 'arcade',
    name: '一曲を三人で攻略',
    shortName: 'ゲーム',
    emoji: '🎮',
    time: '17:55',
    contextId: 'afterschool',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/arcade.webp'),
    description: 'ノアのリズムゲームをカイトが応援し、レンは三人で取った景品を抱える放課後。',
    episode: {
      title: '最後のリズムだけ',
      speakerId: 'noa',
      openingEmotionId: 'focused',
      situation: 'ノアが同じリズムゲームへ挑戦し、カイトは画面を見て声援、レンは直前に三人で取った景品を持って見守っています。残る難所は最後の一拍です。',
      opening: '「最後だけ少し早い。みんな、次の一回も同じ画面を見て合図してくれる？」',
      choices: [
        {
          id: 'arcade-empathy',
          styleId: 'empathy',
          label: '「あと一歩だと力が入るよね」',
          reply: '「うん。だからこそ三人の声が聞こえると、いつものリズムへ戻れそう」',
          emotionId: 'relieved',
        },
        {
          id: 'arcade-idea',
          styleId: 'idea',
          label: '「最後の四拍だけ一緒に数えよう」',
          reply: '「それなら画面と合図を一本にできる。カイトとレンにも同じ数え方を頼むね」',
          emotionId: 'curious',
        },
        {
          id: 'arcade-together',
          styleId: 'together',
          label: '「次は隣の台で一緒に挑戦する」',
          reply: '「協力プレイへ切り替えよう。四人で同じ曲をそろえたら、きっと最高だよ」',
          emotionId: 'delighted',
        },
      ],
    },
    cast: [
      { studentId: 'noa', emotionId: 'focused' },
      { studentId: 'kaito', emotionId: 'cheering' },
      { studentId: 'ren', emotionId: 'delighted' },
    ],
  },
  {
    id: 'homeward',
    name: '夕暮れの帰宅路',
    shortName: '帰宅',
    emoji: '🌇',
    time: '18:03',
    contextId: 'afterschool',
    outfitId: 'uniform',
    image: publicAssetUrl('/assets/battle/scenes/homeward-v2.webp'),
    description: '川沿いを歩きながら一日を振り返る。明日の一問へ続く穏やかな帰り道。',
    episode: {
      title: '頑張った実感がない',
      speakerId: 'haru',
      openingEmotionId: 'sad',
      situation: '毎日勉強しているのに結果がすぐ数字へ表れず、ハルは友達と自分を比べています。',
      opening: '「続けてるのに追いつけない。僕のやり方は無駄なのかな」',
      choices: [
        {
          id: 'homeward-empathy',
          styleId: 'empathy',
          label: '「結果が見えない時期、つらいよね」',
          reply: '「うん。すぐ前向きになれなくてもいいと思えたら、少し楽になった」',
          emotionId: 'relieved',
        },
        {
          id: 'homeward-idea',
          styleId: 'idea',
          label: '「昨日よりできた一つを探してみよう」',
          reply: '「今日は前より速く読めた文があった。小さくても進んでいたんだね」',
          emotionId: 'confident',
        },
        {
          id: 'homeward-together',
          styleId: 'together',
          label: '「明日の最初の一問も一緒にやろう」',
          reply: '「明日につながる約束があると安心する。もう一日だけ続けてみるよ」',
          emotionId: 'gentle',
        },
      ],
    },
    cast: [
      { studentId: 'haru', emotionId: 'relieved' },
      { studentId: 'yuu', emotionId: 'gentle' },
    ],
  },
]

const STUDENT_BY_ID = new Map(
  BATTLE_STUDENTS.map((student) => [student.id, student]),
)

// 旧プロフィールを保存済みの端末・進捗コード・クラウドデータだけを、
// 現在の正式IDへ移行する。新規保存や画面内参照には旧IDを残さない。
const LEGACY_BATTLE_STUDENT_IDS = new Map([
  ['sora', 'kaito'],
])

const DAILY_SCENE_BY_ID = new Map(
  BATTLE_DAILY_SCENES.map((scene) => [scene.id, scene]),
)

const SUPPORT_STYLE_BY_ID = new Map(
  BATTLE_SUPPORT_STYLES.map((style) => [style.id, style]),
)

export function isBattleStudentId(id) {
  return STUDENT_BY_ID.has(id)
}

export function isRestorableBattleStudentId(id) {
  return isBattleStudentId(id) || LEGACY_BATTLE_STUDENT_IDS.has(id)
}

export function normalizeBattleStudentId(id) {
  const currentId = LEGACY_BATTLE_STUDENT_IDS.get(id) ?? id
  return isBattleStudentId(currentId) ? currentId : DEFAULT_BATTLE_STUDENT_ID
}

export function battleStudentById(id) {
  return STUDENT_BY_ID.get(normalizeBattleStudentId(id))
}

export function battleDailySceneById(id) {
  return DAILY_SCENE_BY_ID.get(id) ?? BATTLE_DAILY_SCENES[0]
}

export function battleSupportStyleById(id) {
  return SUPPORT_STYLE_BY_ID.get(id) ?? BATTLE_SUPPORT_STYLES[0]
}

export function battleEmotionById(id) {
  return EMOTION_BY_ID.get(id) ?? EMOTION_BY_ID.get('idle')
}

export function battleStudentPortrait(studentId, emotionId = 'idle') {
  const student = battleStudentById(studentId)
  const emotion = battleEmotionById(emotionId)
  return `${student.assetBase}/${emotion.id}.webp`
}

export function battleStudentLifestylePortrait(studentId, outfitId = 'uniform') {
  const student = battleStudentById(studentId)
  if (BATTLE_LIFESTYLE_OUTFIT_IDS.has(outfitId)) {
    return `${student.lifestyleBase}/${outfitId}.webp`
  }
  return battleStudentPortrait(student.id, 'idle')
}

export function battleStudentMotion(studentId, emotionId = 'idle') {
  const student = battleStudentById(studentId)
  const motionId = MOTION_BY_EMOTION.get(battleEmotionById(emotionId).id)
  return motionId ? `${student.motionBase}/${motionId}.webm` : null
}

export const BATTLE_RIVAL_GROUPS = [
  { id: 'humanities', name: 'ことば・社会棟', emoji: '📚', accent: '#8b5cf6' },
  { id: 'stem', name: '理数・科学棟', emoji: '🧪', accent: '#0ea5e9' },
  { id: 'arts', name: '芸術・表現棟', emoji: '🎨', accent: '#ec4899' },
  { id: 'campus', name: '体育・校務棟', emoji: '🏫', accent: '#10b981' },
  { id: 'mystery', name: '七不思議・最深部', emoji: '🌙', accent: '#a855f7' },
]

const RIVAL_DEFINITIONS = [
  ['english-kanda', '神田エイジ', '英語教師・アクセントブレイカー', 'humanities'],
  ['literature-murasaki', '紫崎文香', '国語教師・比喩の魔術師', 'humanities'],
  ['librarian-kisaragi', '如月 栞', '司書教諭・静寂の番人', 'humanities'],
  ['debate-kuroda', '黒田 論', '弁論部顧問・反証の盾', 'humanities'],
  ['history-sakaki', '榊 時生', '歴史教師・年代の将', 'humanities'],
  ['geography-nanase', '七瀬 環', '地理教師・地図の航海士', 'humanities'],
  ['social-takamine', '高峰律子', '公民教師・規則の天秤', 'humanities'],
  ['calligraphy-mikage', '御影墨華', '書道教師・一筆の刃', 'humanities'],
  ['drama-orihara', '折原 舞', '演劇部顧問・幕間の女王', 'humanities'],
  ['international-elena', 'エレナ・ミラー', '国際交流教師・ことばの架け橋', 'humanities'],

  ['math-takagi', '高木算太', '数学教師・方程式の塔', 'stem'],
  ['physics-aoi', '蒼井理央', '物理教師・重力の観測者', 'stem'],
  ['chemistry-shirabe', '白金ケイ', '化学教師・反応式の錬金家', 'stem'],
  ['biology-mori', '森 葉子', '生物教師・生命図鑑の守人', 'stem'],
  ['robotics-dan', '丹羽鉄平', 'ロボット部顧問・鋼の設計者', 'stem'],
  ['astronomy-tsukishiro', '月城 昴', '天文部顧問・星図の案内人', 'stem'],
  ['computing-makino', '牧野ルイ', '情報教師・コードウィーバー', 'stem'],
  ['engineering-genda', '源田 匠', '技術教師・機巧の親方', 'stem'],
  ['statistics-yukari', '結城 統', '統計教師・確率の読解者', 'stem'],
  ['lab-sae', '冴木 晶', '実験助手・安全眼鏡の参謀', 'stem'],

  ['piano-ayane', '綾音美琴', '音楽教師・夕映えの指揮者', 'arts'],
  ['choir-kiryu', '桐谷 響', '合唱部顧問・共鳴のソプラノ', 'arts'],
  ['brass-shindo', '進藤 奏', '吹奏楽部顧問・真鍮の号令', 'arts'],
  ['art-kurose', '黒瀬 彩', '美術教師・彩色のストラテジスト', 'arts'],
  ['sculpture-haku', '白堂 彫', '彫刻教師・石膏の巨匠', 'arts'],
  ['photo-reika', '玲花シオン', '写真部顧問・瞬間の収集家', 'arts'],
  ['film-ryuji', '龍司シネマ', '映像部顧問・放課後監督', 'arts'],
  ['design-maya', '真矢デザイン', 'デザイン教師・色彩の編集者', 'arts'],
  ['crafts-gen', '玄木 巧', '工芸教師・木目の魔術師', 'arts'],
  ['dance-ran', '蘭ステラ', 'ダンス部顧問・拍動の演出家', 'arts'],

  ['pe-go', '豪堂 烈', '体育教師・熱血ホイッスル', 'campus'],
  ['swim-kai', '海堂 凪', '水泳部顧問・蒼波のコーチ', 'campus'],
  ['kendo-jin', '陣内 剣', '剣道部顧問・正眼の師範', 'campus'],
  ['track-hayate', '風早 颯', '陸上部顧問・追い風の伴走者', 'campus'],
  ['soccer-shun', '駿河シュン', 'サッカー部顧問・戦術盤の司令塔', 'campus'],
  ['nurse-hinata', '日向ほのか', '養護教諭・保健室の陽だまり', 'campus'],
  ['counselor-madoka', '円城まどか', '相談員・心のコンパス', 'campus'],
  ['vice-soma', '相馬 厳', '教頭・校則のゲートキーパー', 'campus'],
  ['principal-albert', 'アルバート校長', '校長・学びの紳士', 'campus'],
  ['caretaker-tetsu', '用務員テツ', '校務員・鍵束の守護者', 'campus'],

  ['ghost-prefect', '幽霊風紀委員', '七不思議・消えない出席簿', 'mystery'],
  ['clock-keeper', '時計塔の番人', '七不思議・止まった放課後', 'mystery'],
  ['ink-phantom', 'インクの幻影', '七不思議・黒い答案', 'mystery'],
  ['archive-mask', '書庫の仮面', '七不思議・記憶を読む者', 'mystery'],
  ['violet-alchemist', '紫苑の錬金教師', '最深部・感情結晶の研究者', 'mystery'],
  ['mirror-twin', '鏡廊の双子', '七不思議・答えを反転する影', 'mystery'],
  ['roof-oracle', '屋上の託宣者', '七不思議・星風の予言者', 'mystery'],
  ['basement-mechanic', '地下機関の整備士', '七不思議・校舎心臓の番人', 'mystery'],
  ['festival-magician', '文化祭の魔術師', '七不思議・終わらない前夜祭', 'mystery'],
  ['shadow-headmaster', '影の学園長', '最終試験・黄昏校舎の主', 'mystery'],
]

export const BATTLE_RIVALS = RIVAL_DEFINITIONS.map(
  ([id, name, title, groupId]) => ({
    id,
    name,
    title,
    groupId,
    portrait: publicAssetUrl(`/assets/battle/cast/rivals/${id}.webp`),
  }),
)

const RIVAL_BY_ID = new Map(BATTLE_RIVALS.map((rival) => [rival.id, rival]))
const RIVALS_BY_GROUP = new Map(
  BATTLE_RIVAL_GROUPS.map((group) => [
    group.id,
    BATTLE_RIVALS.filter((rival) => rival.groupId === group.id),
  ]),
)

export function battleRivalById(id) {
  return RIVAL_BY_ID.get(id) ?? BATTLE_RIVALS[0]
}

function stableBattleHash(value) {
  let hash = 2166136261
  for (const character of String(value)) {
    hash ^= character.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function rivalGroupForEncounter(encounter) {
  if (encounter?.isBoss) return 'mystery'
  const clue = `${encounter?.teacherSubject ?? ''} ${encounter?.name ?? ''} ${encounter?.move ?? ''}`
  if (/音楽|美術|芸術|演劇|写真|映画|ダンス|合唱|書道/.test(clue)) return 'arts'
  if (/数学|理科|物理|化学|生物|情報|技術|科学|天文/.test(clue)) return 'stem'
  if (/体育|保健|陸上|水泳|剣道|サッカー|校長|教頭|用務/.test(clue)) return 'campus'
  if (/英語|国語|社会|歴史|地理|公民|図書|ことば/.test(clue)) return 'humanities'
  const regularGroups = ['humanities', 'stem', 'arts', 'campus']
  return regularGroups[stableBattleHash(clue) % regularGroups.length]
}

export function battleRivalForEncounter(encounter, seed = 0) {
  const groupId = rivalGroupForEncounter(encounter)
  const pool = RIVALS_BY_GROUP.get(groupId) ?? BATTLE_RIVALS
  const key = `${encounter?.id ?? encounter?.name ?? 'school'}:${seed}`
  return pool[stableBattleHash(key) % pool.length]
}

const BATTLE_SITUATION_MARGIN = 10

function battleHealthSituation(battleState) {
  const heroHealth = Number(battleState?.heroHealthPercent)
  const enemyHealth = Number(battleState?.enemyHealthPercent)
  if (!Number.isFinite(heroHealth) || !Number.isFinite(enemyHealth)) return 'even'

  const lead = heroHealth - enemyHealth
  if (lead >= BATTLE_SITUATION_MARGIN) return 'advantage'
  if (lead <= -BATTLE_SITUATION_MARGIN) return 'disadvantage'
  return 'even'
}

// 回答イベントとHP差を24種類の表情・動作へ結びつける。
// 表示だけを変え、評価値やダメージ計算には触れない。
export function battleStudentState({
  battleState,
  eventActive = false,
  eventKind = null,
} = {}) {
  if (!battleState) return 'idle'
  if (battleState.enemyDefeated) return 'victory'
  if (battleState.heroDefeated) return 'exhausted'

  const event = battleState.lastEvent
  const resolvedEventKind = eventKind ?? event?.kind
  const situation = battleHealthSituation(battleState)
  if (eventActive && event?.themeAbility === 'encore') return 'healing'
  if (eventActive) {
    if (resolvedEventKind === 'item-heal') return 'healing'
    if (['block', 'shield', 'item-guard'].includes(resolvedEventKind)) return 'guard'
    if (resolvedEventKind === 'unknown') {
      return situation === 'advantage' ? 'focused' : 'worried'
    }
    if (resolvedEventKind === 'damage') return 'hurt'
    if (resolvedEventKind === 'counter' && event?.healing) return 'relieved'
    if (['burst', 'item-power'].includes(resolvedEventKind)) return 'determined'
    if (resolvedEventKind === 'hit') return battleState.streak >= 3 ? 'delighted' : 'attack'
  }

  if (battleState.answered === 0) return 'idle'
  if (situation === 'advantage') return 'confident'
  if (situation === 'disadvantage') return 'worried'
  if (battleState.streak >= 3) return 'confident'
  if (battleState.streak === 2) return 'focused'
  if (battleState.streak === 1) return 'curious'
  return 'determined'
}

// 戦闘中と結果画面で同じ決着表情を使い、選択中の生徒の連続性を保つ。
export function battleStudentResultState({ battleState, accuracy = 0 } = {}) {
  if (battleState?.heroDefeated) return 'exhausted'
  if (battleState?.enemyDefeated) return 'victory'
  if (accuracy >= 0.7) return 'delighted'
  if (accuracy >= 0.4) return 'relieved'
  return 'sad'
}
