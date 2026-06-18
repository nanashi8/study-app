// 長文データ（シード）。英検の級ごと。
// 各文： en（英文）/ ja（自然な和訳）/ chunks（区切り直訳：スラッシュリーディング）/
//        gloss（単語ごとの意味。キーは小文字の表層形。id を付けると単語詳細へリンク）
// vocab： まとめで学習する重要語（src/data/words.js にある単語の id）
//
// gloss のキーは英文に出てくる形そのまま（小文字）。例: "loves" を引けるようにする。

export const PASSAGES = [
  {
    id: 'p_school_day',
    level: '5',
    emoji: '🏫',
    title: 'My School Day',
    titleJa: 'わたしの学校の一日',
    blurb: 'やさしい現在形の短い文章。',
    vocab: ['school', 'study', 'friend', 'book', 'happy'],
    sentences: [
      {
        en: 'I go to school every day.',
        ja: '私は毎日学校へ行きます。',
        chunks: [
          { en: 'I go to school', ja: '私は学校へ行く' },
          { en: 'every day', ja: '毎日' },
        ],
        gloss: {
          go: { ja: '行く' },
          school: { ja: '学校', id: 'school' },
          every: { ja: 'すべての・毎〜' },
          day: { ja: '日' },
        },
      },
      {
        en: 'I study English and math.',
        ja: '私は英語と数学を勉強します。',
        chunks: [
          { en: 'I study', ja: '私は勉強する' },
          { en: 'English and math', ja: '英語と数学を' },
        ],
        gloss: {
          study: { ja: '勉強する', id: 'study' },
          english: { ja: '英語' },
          math: { ja: '数学' },
        },
      },
      {
        en: 'My friend and I eat lunch together.',
        ja: '友達と私は一緒に昼食を食べます。',
        chunks: [
          { en: 'My friend and I', ja: '友達と私は' },
          { en: 'eat lunch', ja: '昼食を食べる' },
          { en: 'together', ja: '一緒に' },
        ],
        gloss: {
          friend: { ja: '友達', id: 'friend' },
          eat: { ja: '食べる' },
          lunch: { ja: '昼食' },
          together: { ja: '一緒に' },
        },
      },
      {
        en: 'I read many books in the library.',
        ja: '私は図書館でたくさんの本を読みます。',
        chunks: [
          { en: 'I read many books', ja: '私はたくさんの本を読む' },
          { en: 'in the library', ja: '図書館で' },
        ],
        gloss: {
          read: { ja: '読む' },
          many: { ja: 'たくさんの' },
          books: { ja: '本', id: 'book' },
          library: { ja: '図書館' },
        },
      },
      {
        en: 'School is fun, and I am very happy.',
        ja: '学校は楽しくて、私はとても幸せです。',
        chunks: [
          { en: 'School is fun', ja: '学校は楽しい' },
          { en: 'and I am very happy', ja: 'そして私はとても幸せ' },
        ],
        gloss: {
          school: { ja: '学校', id: 'school' },
          fun: { ja: '楽しい' },
          very: { ja: 'とても' },
          happy: { ja: '幸せな', id: 'happy' },
        },
      },
    ],
  },

  {
    id: 'p_mountain_trip',
    level: '3',
    emoji: '⛰️',
    title: 'A Trip to the Mountain',
    titleJa: '山への旅行',
    blurb: '過去形で書かれた、家族旅行の思い出。',
    vocab: ['travel', 'nature', 'photograph', 'adventure', 'event'],
    sentences: [
      {
        en: 'My family loves to travel.',
        ja: '私の家族は旅行が大好きです。',
        chunks: [
          { en: 'My family', ja: '私の家族は' },
          { en: 'loves to travel', ja: '旅行が大好き' },
        ],
        gloss: {
          family: { ja: '家族' },
          loves: { ja: '大好きである' },
          travel: { ja: '旅行する', id: 'travel' },
        },
      },
      {
        en: 'Last week, we visited a beautiful mountain.',
        ja: '先週、私たちは美しい山を訪れました。',
        chunks: [
          { en: 'Last week', ja: '先週' },
          { en: 'we visited', ja: '私たちは訪れた' },
          { en: 'a beautiful mountain', ja: '美しい山を' },
        ],
        gloss: {
          last: { ja: 'この前の' },
          week: { ja: '週' },
          visited: { ja: '訪れた' },
          beautiful: { ja: '美しい' },
          mountain: { ja: '山' },
        },
      },
      {
        en: 'We enjoyed the beauty of nature.',
        ja: '私たちは自然の美しさを楽しみました。',
        chunks: [
          { en: 'We enjoyed', ja: '私たちは楽しんだ' },
          { en: 'the beauty of nature', ja: '自然の美しさを' },
        ],
        gloss: {
          enjoyed: { ja: '楽しんだ' },
          beauty: { ja: '美しさ' },
          nature: { ja: '自然', id: 'nature' },
        },
      },
      {
        en: 'I took many photographs of the trees.',
        ja: '私は木々の写真をたくさん撮りました。',
        chunks: [
          { en: 'I took many photographs', ja: '私はたくさんの写真を撮った' },
          { en: 'of the trees', ja: '木々の' },
        ],
        gloss: {
          took: { ja: '撮った・取った' },
          photographs: { ja: '写真', id: 'photograph' },
          trees: { ja: '木' },
        },
      },
      {
        en: 'Climbing the mountain was a great adventure.',
        ja: '山に登ることは、すばらしい冒険でした。',
        chunks: [
          { en: 'Climbing the mountain', ja: '山に登ることは' },
          { en: 'was a great adventure', ja: 'すばらしい冒険だった' },
        ],
        gloss: {
          climbing: { ja: '登ること' },
          great: { ja: 'すばらしい' },
          adventure: { ja: '冒険', id: 'adventure' },
        },
      },
      {
        en: 'For me, it was a special event.',
        ja: '私にとって、それは特別な出来事でした。',
        chunks: [
          { en: 'For me', ja: '私にとって' },
          { en: 'it was a special event', ja: 'それは特別な出来事だった' },
        ],
        gloss: {
          special: { ja: '特別な' },
          event: { ja: '出来事', id: 'event' },
        },
      },
    ],
  },

  {
    id: 'p_vocabulary_power',
    level: 'pre2',
    emoji: '📱',
    title: 'The Power of Vocabulary',
    titleJa: '語彙の力',
    blurb: 'スマホと英語学習についての説明文。',
    vocab: ['convenient', 'introduce', 'study', 'vocabulary', 'produce', 'future'],
    sentences: [
      {
        en: 'Today, smartphones are very convenient.',
        ja: '今日、スマートフォンはとても便利です。',
        chunks: [
          { en: 'Today', ja: '今日では' },
          { en: 'smartphones are very convenient', ja: 'スマホはとても便利だ' },
        ],
        gloss: {
          today: { ja: '今日' },
          smartphones: { ja: 'スマートフォン' },
          convenient: { ja: '便利な', id: 'convenient' },
        },
      },
      {
        en: 'They can introduce us to a world of information.',
        ja: 'それらは私たちを情報の世界へと案内してくれます。',
        chunks: [
          { en: 'They can introduce us', ja: 'それらは私たちを案内できる' },
          { en: 'to a world of information', ja: '情報の世界へ' },
        ],
        gloss: {
          introduce: { ja: '紹介する・案内する', id: 'introduce' },
          world: { ja: '世界' },
          information: { ja: '情報' },
        },
      },
      {
        en: 'Apps help us study English every day.',
        ja: 'アプリは私たちが毎日英語を勉強する手助けをします。',
        chunks: [
          { en: 'Apps help us', ja: 'アプリは私たちを助ける' },
          { en: 'study English', ja: '英語を勉強するのを' },
          { en: 'every day', ja: '毎日' },
        ],
        gloss: {
          apps: { ja: 'アプリ' },
          help: { ja: '助ける' },
          study: { ja: '勉強する', id: 'study' },
        },
      },
      {
        en: 'A large vocabulary is a powerful tool.',
        ja: '豊富な語彙は強力な道具です。',
        chunks: [
          { en: 'A large vocabulary', ja: '豊富な語彙は' },
          { en: 'is a powerful tool', ja: '強力な道具だ' },
        ],
        gloss: {
          large: { ja: '大きい・豊富な' },
          vocabulary: { ja: '語彙', id: 'vocabulary' },
          powerful: { ja: '強力な' },
          tool: { ja: '道具' },
        },
      },
      {
        en: 'Reading books can produce new ideas.',
        ja: '読書は新しい考えを生み出すことができます。',
        chunks: [
          { en: 'Reading books', ja: '読書は' },
          { en: 'can produce new ideas', ja: '新しい考えを生み出せる' },
        ],
        gloss: {
          reading: { ja: '読むこと' },
          produce: { ja: '生み出す', id: 'produce' },
          ideas: { ja: '考え・アイデア' },
        },
      },
      {
        en: 'These skills will help your future.',
        ja: 'これらの力は、あなたの将来に役立つでしょう。',
        chunks: [
          { en: 'These skills', ja: 'これらの力は' },
          { en: 'will help your future', ja: 'あなたの将来に役立つ' },
        ],
        gloss: {
          skills: { ja: '技能・力' },
          future: { ja: '未来・将来', id: 'future' },
        },
      },
    ],
  },

  {
    id: 'p_predict_weather',
    level: '2',
    emoji: '🌦️',
    title: 'Predicting the Weather',
    titleJa: '天気を予測する',
    blurb: '科学者の仕事についての説明文。',
    vocab: ['predict', 'inspect', 'conduct', 'expect', 'event'],
    sentences: [
      {
        en: 'Scientists try to predict the weather.',
        ja: '科学者は天気を予測しようとします。',
        chunks: [
          { en: 'Scientists try', ja: '科学者は試みる' },
          { en: 'to predict the weather', ja: '天気を予測することを' },
        ],
        gloss: {
          scientists: { ja: '科学者' },
          try: { ja: '試みる' },
          predict: { ja: '予測する', id: 'predict' },
          weather: { ja: '天気' },
        },
      },
      {
        en: 'They inspect data from many places.',
        ja: '彼らは多くの場所のデータを調べます。',
        chunks: [
          { en: 'They inspect data', ja: '彼らはデータを調べる' },
          { en: 'from many places', ja: '多くの場所からの' },
        ],
        gloss: {
          inspect: { ja: '調べる・検査する', id: 'inspect' },
          data: { ja: 'データ' },
          places: { ja: '場所' },
        },
      },
      {
        en: 'They conduct experiments every day.',
        ja: '彼らは毎日実験を行います。',
        chunks: [
          { en: 'They conduct experiments', ja: '彼らは実験を行う' },
          { en: 'every day', ja: '毎日' },
        ],
        gloss: {
          conduct: { ja: '行う・実施する', id: 'conduct' },
          experiments: { ja: '実験' },
        },
      },
      {
        en: 'We expect their forecasts to be correct.',
        ja: '私たちは彼らの予報が正しいことを期待します。',
        chunks: [
          { en: 'We expect', ja: '私たちは期待する' },
          { en: 'their forecasts', ja: '彼らの予報が' },
          { en: 'to be correct', ja: '正しいことを' },
        ],
        gloss: {
          expect: { ja: '期待する・予期する', id: 'expect' },
          forecasts: { ja: '予報' },
          correct: { ja: '正しい' },
        },
      },
      {
        en: 'Good weather news is always a welcome event.',
        ja: '良い天気の知らせは、いつも歓迎される出来事です。',
        chunks: [
          { en: 'Good weather news', ja: '良い天気の知らせは' },
          { en: 'is always a welcome event', ja: 'いつも歓迎される出来事だ' },
        ],
        gloss: {
          news: { ja: '知らせ・ニュース' },
          always: { ja: 'いつも' },
          welcome: { ja: '歓迎される' },
          event: { ja: '出来事', id: 'event' },
        },
      },
    ],
  },

  {
    id: 'p_future_dream',
    level: '4',
    emoji: '🌟',
    title: 'My Future Dream',
    titleJa: '私の将来の夢',
    blurb: '夢と努力についてのやさしい文章。',
    vocab: ['dream', 'future', 'doctor', 'study', 'friend'],
    sentences: [
      {
        en: 'I have a big dream.',
        ja: '私には大きな夢があります。',
        chunks: [
          { en: 'I have', ja: '私は持っている' },
          { en: 'a big dream', ja: '大きな夢を' },
        ],
        gloss: { have: { ja: '持っている' }, big: { ja: '大きい', id: 'big' }, dream: { ja: '夢', id: 'dream' } },
      },
      {
        en: 'I want to be a doctor in the future.',
        ja: '私は将来、医者になりたいです。',
        chunks: [
          { en: 'I want to be', ja: '私はなりたい' },
          { en: 'a doctor', ja: '医者に' },
          { en: 'in the future', ja: '将来' },
        ],
        gloss: { want: { ja: '〜したい' }, doctor: { ja: '医者', id: 'doctor' }, future: { ja: '未来・将来', id: 'future' } },
      },
      {
        en: 'Every day, I study very hard.',
        ja: '毎日、私はとても一生懸命勉強します。',
        chunks: [
          { en: 'Every day', ja: '毎日' },
          { en: 'I study', ja: '私は勉強する' },
          { en: 'very hard', ja: 'とても熱心に' },
        ],
        gloss: { every: { ja: '毎〜' }, study: { ja: '勉強する', id: 'study' }, hard: { ja: '熱心に・難しい' } },
      },
      {
        en: 'My friends help me a lot.',
        ja: '友達が私をたくさん助けてくれます。',
        chunks: [
          { en: 'My friends', ja: '私の友達が' },
          { en: 'help me', ja: '私を助ける' },
          { en: 'a lot', ja: 'たくさん' },
        ],
        gloss: { friends: { ja: '友達', id: 'friend' }, help: { ja: '助ける' }, lot: { ja: 'たくさん' } },
      },
      {
        en: 'I will never give up my dream.',
        ja: '私は決して夢をあきらめません。',
        chunks: [
          { en: 'I will never', ja: '私は決して〜しない' },
          { en: 'give up', ja: 'あきらめる' },
          { en: 'my dream', ja: '私の夢を' },
        ],
        gloss: { never: { ja: '決して〜ない' }, give: { ja: '与える' }, dream: { ja: '夢', id: 'dream' } },
      },
    ],
  },

  {
    id: 'p_power_of_habit',
    level: 'pre1',
    emoji: '🧗',
    title: 'The Power of Habit',
    titleJa: '習慣の力',
    blurb: '努力と習慣についての説明文（語根語が多め）。',
    vocab: ['succeed', 'acquire', 'process', 'maintain', 'sustain', 'obtain'],
    sentences: [
      {
        en: 'Good habits help us succeed.',
        ja: '良い習慣は私たちが成功する手助けをします。',
        chunks: [
          { en: 'Good habits', ja: '良い習慣は' },
          { en: 'help us succeed', ja: '私たちが成功するのを助ける' },
        ],
        gloss: { good: { ja: '良い', id: 'good' }, habits: { ja: '習慣' }, succeed: { ja: '成功する', id: 'succeed' } },
      },
      {
        en: 'We acquire skills through daily practice.',
        ja: '私たちは日々の練習を通して技能を習得します。',
        chunks: [
          { en: 'We acquire skills', ja: '私たちは技能を習得する' },
          { en: 'through daily practice', ja: '日々の練習を通して' },
        ],
        gloss: { acquire: { ja: '習得する', id: 'acquire' }, skills: { ja: '技能' }, daily: { ja: '毎日の' }, practice: { ja: '練習' } },
      },
      {
        en: 'Learning is a slow but steady process.',
        ja: '学習はゆっくりですが着実な過程です。',
        chunks: [
          { en: 'Learning is', ja: '学習は〜だ' },
          { en: 'a slow but steady process', ja: 'ゆっくりだが着実な過程' },
        ],
        gloss: { learning: { ja: '学ぶこと' }, slow: { ja: '遅い' }, steady: { ja: '着実な' }, process: { ja: '過程', id: 'process' } },
      },
      {
        en: 'To maintain motivation is not easy.',
        ja: 'やる気を維持することは簡単ではありません。',
        chunks: [
          { en: 'To maintain motivation', ja: 'やる気を維持することは' },
          { en: 'is not easy', ja: '簡単ではない' },
        ],
        gloss: { maintain: { ja: '維持する', id: 'maintain' }, motivation: { ja: 'やる気' }, easy: { ja: '簡単な' } },
      },
      {
        en: 'Those who sustain their effort obtain great results.',
        ja: '努力を持続する人は、素晴らしい結果を得ます。',
        chunks: [
          { en: 'Those who sustain their effort', ja: '努力を持続する人は' },
          { en: 'obtain great results', ja: '素晴らしい結果を得る' },
        ],
        gloss: { sustain: { ja: '持続させる', id: 'sustain' }, effort: { ja: '努力' }, obtain: { ja: '得る', id: 'obtain' }, results: { ja: '結果', id: 'result' }, great: { ja: '素晴らしい' } },
      },
    ],
  },
]

export const PASSAGES_BY_ID = Object.fromEntries(PASSAGES.map((p) => [p.id, p]))
export const getPassage = (id) => PASSAGES_BY_ID[id]
export const passagesByLevel = (levelId) => PASSAGES.filter((p) => p.level === levelId)
