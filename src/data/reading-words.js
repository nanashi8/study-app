// 長文教材で中心概念になるが、既存の単語帳に未収録だった語。
// ALL_WORDS に合流させることで、通常学習・SRS・マイ単語と同じ ID を共有する。

import { PASSAGES } from './passages.js'

const passageExample = (surface) => {
  const key = surface.toLowerCase()
  for (const passage of PASSAGES) {
    for (const sentence of passage.sentences) {
      const tokens = sentence.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []
      if (tokens.some((token) => token.toLowerCase() === key)) {
        return { en: sentence.en, ja: sentence.ja }
      }
    }
  }
  throw new Error(`長文辞書語 "${surface}" の例文が見つかりません`)
}

const makePassageWord = ({
  id,
  word = id,
  surface = word,
  pos,
  level,
  meaning,
  field,
  phonetic,
  example,
}) => ({
  id,
  word,
  pos,
  level,
  meaning,
  meanings: meaning.split('・'),
  ...(phonetic ? { phonetic } : {}),
  example: example ?? passageExample(surface),
  etymology: {
    parts: [{ t: word, kind: 'stem', gloss: meaning.split('・')[0] }],
    note: `この項目では ${word} 全体を語幹として扱う。長文中では「${meaning}」の意味で用いられる。`,
  },
  field,
})

// 本文タップで未解決だった基本語・題材語。透明な派生語は passage-gloss.js で
// 既存語族へ接続し、ここには独立した語義を学ぶ必要がある語だけを置く。
const PASSAGE_DICTIONARY_WORDS = [
  { id: 'junior', pos: '形', level: '5', meaning: '年下の・下級の・中学の', field: '教育' },
  { id: 'english', word: 'English', pos: '名', level: '5', meaning: '英語・英語の', field: '言語' },
  { id: 'many', pos: '形', level: '5', meaning: '多くの・たくさんの', field: '時間・数量' },
  { id: 'after', pos: '前', level: '5', meaning: '〜の後に・〜の後で', field: '機能語' },
  { id: 'under', pos: '前', level: '5', meaning: '〜の下に・〜の下で', field: '機能語' },
  { id: 'thank', pos: '動', level: '5', meaning: '感謝する・礼を言う', field: 'コミュニケーション' },
  {
    id: 'ms',
    word: 'Ms.',
    surface: 'Ms',
    pos: '名',
    level: '4',
    meaning: '〜さん・〜先生（女性への敬称）',
    field: 'コミュニケーション',
    phonetic: '/mɪz/',
  },
  { id: 'fifty', pos: '形', level: '4', meaning: '50の・50個の', field: '時間・数量' },
  { id: 'glue', pos: '名', level: '4', meaning: 'のり・接着剤', field: '食・生活' },
  { id: 'noon', pos: '名', level: '4', meaning: '正午', field: '時間・数量' },
  { id: 'before', pos: '前', level: '4', meaning: '〜の前に・〜より前に', field: '機能語' },
  { id: 'put', pos: '動', level: '4', meaning: '置く・載せる', field: '動作・行為' },
  { id: 'plant', pos: '動', level: '3', meaning: '植える・植物', field: '自然' },
  { id: 'spray', pos: '名', level: '3', meaning: '噴霧器・スプレー', field: '農業' },
  { id: 'around', pos: '前', level: '4', meaning: '〜の周りに・およそ', field: '機能語' },
  { id: 'cucumber', surface: 'cucumbers', pos: '名', level: '3', meaning: 'きゅうり', field: '食・生活' },
  { id: 'center', pos: '名', level: '3', meaning: '中心・センター', field: '一般' },
  { id: 'farm', surface: 'farming', pos: '名', level: '3', meaning: '農場・農業を営む', field: '農業' },
  { id: 'tip', surface: 'tips', pos: '名', level: '3', meaning: '助言・こつ', field: 'コミュニケーション' },
  { id: 'teenager', surface: 'teenagers', pos: '名', level: 'pre2', meaning: '10代の若者', field: '家族・人' },
  { id: 'than', pos: '接', level: '4', meaning: '〜よりも・〜に比べて', field: '機能語' },
  { id: 'program', pos: '名', level: 'pre2', meaning: '計画・活動・番組', field: '社会' },
  { id: 'staff', pos: '名', level: 'pre2', meaning: '職員・スタッフ', field: 'ビジネス' },
  { id: 'worksheet', surface: 'worksheets', pos: '名', level: 'pre2', meaning: '学習用ワークシート', field: '教育' },
  { id: 'afternoon', pos: '名', level: '4', meaning: '午後', field: '時間・数量' },
  { id: 'visitor', surface: 'visitors', pos: '名', level: 'pre2', meaning: '訪問者・来館者', field: '家族・人' },
  { id: 'sense', pos: '名', level: 'pre2', meaning: '感覚・意識', field: '心理' },
  { id: 'other', pos: '形', level: '4', meaning: 'ほかの・もう一方の', field: '機能語' },
  { id: 'past', pos: '名', level: 'pre2', meaning: '過去・過ぎた', field: '時間・数量' },
  { id: 'someone', pos: '代', level: '4', meaning: '誰か・ある人', field: '家族・人' },
  { id: 'thing', surface: 'things', pos: '名', level: '5', meaning: '物・事', field: '一般' },
  { id: 'counter', pos: '名', level: 'pre2', meaning: '受付台・カウンター', field: '食・生活' },
  { id: 'digital', pos: '形', level: '2', meaning: 'デジタルの・電子式の', field: '技術' },
  { id: 'seem', surface: 'seems', pos: '動', level: '3', meaning: '〜のように見える・思われる', field: '性質・状態' },
  { id: 'themselves', pos: '代', level: 'pre2', meaning: '彼ら自身・彼女ら自身・それら自体', field: '機能語' },
  { id: 'app', surface: 'apps', pos: '名', level: '3', meaning: 'アプリ・応用ソフト', field: '技術' },
  { id: 'yet', pos: '接', level: 'pre2', meaning: 'しかし・それにもかかわらず', field: '機能語' },
  { id: 'everywhere', pos: '副', level: '3', meaning: 'どこでも・至る所に', field: '副詞' },
  { id: 'single', pos: '形', level: 'pre2', meaning: '一つの・単一の', field: '時間・数量' },
  { id: 'downstream', pos: '副', level: 'pre1', meaning: '下流へ・下流で', field: '地理' },
  { id: 'conditioner', surface: 'conditioners', pos: '名', level: '2', meaning: '調整装置・空調機', field: '技術' },
  { id: 'rainwater', pos: '名', level: 'pre1', meaning: '雨水', field: '気象' },
  { id: 'sidewalk', surface: 'sidewalks', pos: '名', level: 'pre2', meaning: '歩道', field: '交通' },
  { id: 'root', surface: 'roots', pos: '名', level: 'pre1', meaning: '根・根本', field: '自然' },
  { id: 'rent', surface: 'rents', pos: '名', level: 'pre1', meaning: '家賃・賃借料', field: '経済' },
  { id: 'intersection', surface: 'intersections', pos: '名', level: '2', meaning: '交差点・交差', field: '交通' },
  { id: 'such', pos: '形', level: '3', meaning: 'そのような・そのように', field: '機能語' },
  {
    id: 'politics',
    word: 'politics',
    surface: 'political',
    pos: '名',
    level: 'pre1',
    meaning: '政治・政治学',
    field: '政治',
    example: { en: 'Politics can influence public memory.', ja: '政治は公共の記憶に影響を与えうる。' },
  },
  {
    id: 'necessary',
    surface: 'unnecessary',
    pos: '形',
    level: '3',
    meaning: '必要な',
    field: '性質・状態',
    example: { en: 'Careful preparation is necessary.', ja: '入念な準備が必要です。' },
  },
  { id: 'rainfall', pos: '名', level: 'pre1', meaning: '降雨・降水量', field: '気象' },
  { id: 'date', surface: 'dates', pos: '名', level: '4', meaning: '日付・期日', field: '時間・数量' },
  { id: 'media', pos: '名', level: '2', meaning: 'メディア・情報媒体', field: 'メディア' },
  { id: 'video', surface: 'videos', pos: '名', level: '3', meaning: '動画・映像', field: 'メディア' },
  { id: 'pathway', surface: 'pathways', pos: '名', level: 'pre1', meaning: '経路・道筋', field: '一般' },
  { id: 'university', surface: 'universities', pos: '名', level: 'pre2', meaning: '大学', field: '教育' },
  { id: 'able', pos: '形', level: '3', meaning: '〜できる・能力がある', field: '性質・状態' },
  { id: 'nor', pos: '接', level: 'pre1', meaning: '〜もまた…ない・そして…もない', field: '機能語' },
  { id: 'role', pos: '名', level: 'pre2', meaning: '役割', field: '一般' },
  { id: 'few', pos: '形', level: '4', meaning: '少数の・ほとんどない', field: '時間・数量' },
  { id: 'self', pos: '名', level: 'pre1', meaning: '自己・自分自身', field: '心理' },
  { id: 'alone', pos: '副', level: '3', meaning: '一人で・それだけで', field: '副詞' },
  { id: 'headline', surface: 'headlines', pos: '名', level: '2', meaning: '見出し・主要ニュース', field: 'メディア' },
].map(makePassageWord)

export const PASSAGE_DICTIONARY_WORD_IDS = Object.freeze(
  PASSAGE_DICTIONARY_WORDS.map((word) => word.id),
)

export const READING_WORDS = [
  ...PASSAGE_DICTIONARY_WORDS,
  {
    id: 'volunteer',
    word: 'volunteer',
    pos: '名',
    level: 'pre2',
    meaning: 'ボランティア・志願者',
    meanings: ['ボランティア', '志願者', '自ら進んで行う（動）'],
    phonetic: '/ˌvɑlənˈtɪr/',
    example: {
      en: 'Student volunteers welcome visitors at the museum.',
      ja: '学生ボランティアが博物館で来館者を迎える。',
    },
    etymology: {
      parts: [{ t: 'volunt', kind: 'root', gloss: '意志・望み' }],
      note: 'ラテン語 voluntas「意志」から。「自分の意志で申し出る人」が中心の意味。',
      origin: 'ラテン語 voluntas',
    },
    field: '社会',
  },
  {
    id: 'sensor',
    word: 'sensor',
    pos: '名',
    level: '2',
    meaning: 'センサー・感知器',
    meanings: ['センサー', '感知器'],
    phonetic: '/ˈsɛnsər/',
    example: {
      en: 'The sensor measures how crowded the platform is.',
      ja: 'そのセンサーはホームの混雑度を測る。',
    },
    etymology: {
      parts: [
        { t: 'sens', kind: 'root', gloss: '感じる' },
        { t: 'or', kind: 'suffix', gloss: '〜するもの' },
      ],
      note: 'sense「感じる」＋ -or「もの」から、変化を感じ取る装置。',
      origin: 'ラテン語 sentire',
    },
    field: '技術',
  },
  {
    id: 'privacy',
    word: 'privacy',
    pos: '名',
    level: '2',
    meaning: 'プライバシー・私生活',
    meanings: ['プライバシー', '私生活', '他人に干渉されない権利'],
    phonetic: '/ˈpraɪvəsi/',
    example: {
      en: 'Cities must protect the privacy of their residents.',
      ja: '都市は住民のプライバシーを守らなければならない。',
    },
    etymology: {
      parts: [
        { t: 'priv', kind: 'root', gloss: '個人の' },
        { t: 'acy', kind: 'suffix', gloss: '状態' },
      ],
      note: 'private「個人の」から派生し、個人の領域が守られている状態を表す。',
      origin: 'ラテン語 privatus',
    },
    field: '社会',
  },
  {
    id: 'infrastructure',
    word: 'infrastructure',
    pos: '名',
    level: 'pre1',
    meaning: '社会基盤・インフラ',
    meanings: ['社会基盤', 'インフラ', '基礎設備'],
    phonetic: '/ˈɪnfrəˌstrʌktʃər/',
    example: {
      en: 'The city invested in infrastructure for extreme weather.',
      ja: 'その都市は異常気象に備える社会基盤へ投資した。',
    },
    etymology: {
      parts: [
        { t: 'infra', kind: 'prefix', gloss: '下に' },
        { t: 'structure', kind: 'stem', gloss: '構造' },
      ],
      note: 'infra「下に」＋ structure「構造」。社会や組織を下から支える基盤。',
      origin: 'ラテン語 infra + structura',
    },
    field: '社会',
  },
  {
    id: 'archive',
    word: 'archive',
    pos: '名',
    level: 'pre1',
    meaning: '記録保管所・公文書',
    meanings: ['記録保管所', '保存記録', '記録を保存する（動）'],
    phonetic: '/ˈɑrkaɪv/',
    example: {
      en: 'The archive preserves documents from earlier generations.',
      ja: 'その記録保管所は以前の世代の文書を保存している。',
    },
    etymology: {
      parts: [{ t: 'archiv', kind: 'stem', gloss: '公的記録' }],
      note: 'ギリシャ語 arkheion「公文書を置く役所」から、保存記録やその保管所を指す。',
      origin: 'ギリシャ語 arkheion',
    },
    field: '歴史',
  },
  {
    id: 'algorithmic',
    word: 'algorithmic',
    pos: '形',
    level: '1',
    meaning: 'アルゴリズムによる',
    meanings: ['アルゴリズムによる', '計算手順に基づく'],
    phonetic: '/ˌælɡəˈrɪðmɪk/',
    example: {
      en: 'Algorithmic recommendations shape what people notice online.',
      ja: 'アルゴリズムによる推薦は、人々がオンラインで何に気づくかを形づくる。',
    },
    etymology: {
      parts: [
        { t: 'algorithm', kind: 'stem', gloss: '計算手順' },
        { t: 'ic', kind: 'suffix', gloss: '〜の' },
      ],
      note: 'algorithm「一定の計算手順」＋ -ic「〜の」。手順によって自動的に決まることを表す。',
      origin: 'algorithm + -ic',
    },
    field: '技術',
  },
  {
    id: 'accountability',
    word: 'accountability',
    pos: '名',
    level: '1',
    meaning: '説明責任',
    meanings: ['説明責任', '責任を負うこと'],
    phonetic: '/əˌkaʊntəˈbɪləti/',
    example: {
      en: 'Public institutions need independence and accountability.',
      ja: '公的機関には独立性と説明責任が必要だ。',
    },
    etymology: {
      parts: [
        { t: 'account', kind: 'stem', gloss: '説明する・報告する' },
        { t: 'able', kind: 'suffix', gloss: '〜できる' },
        { t: 'ity', kind: 'suffix', gloss: '状態' },
      ],
      note: 'account「説明する」＋ able「できる」＋ -ity「状態」。判断を説明し責任を負えること。',
      origin: 'account + -able + -ity',
    },
    field: '社会',
  },
  {
    id: 'feedback',
    word: 'feedback',
    pos: '名',
    level: 'pre2',
    meaning: '意見・反応・フィードバック',
    meanings: ['意見', '反応', '改善のための評価'],
    phonetic: '/ˈfiːdbæk/',
    example: {
      en: 'The museum uses visitor feedback to plan future exhibitions.',
      ja: '博物館は来館者の意見を将来の展示計画に活用する。',
    },
    etymology: {
      parts: [
        { t: 'feed', kind: 'stem', gloss: '送り込む' },
        { t: 'back', kind: 'stem', gloss: '戻して' },
      ],
      note: '情報を相手へ戻すことから、改善に役立つ反応や意見を表す。',
      origin: 'feed + back',
    },
    field: 'コミュニケーション',
  },
  {
    id: 'maladaptation',
    word: 'maladaptation',
    pos: '名',
    level: 'pre1',
    meaning: '不適応・逆効果となる適応',
    meanings: ['不適応', '新たな危険を生む適応策'],
    phonetic: '/ˌmæləˌdæpˈteɪʃən/',
    example: {
      en: 'A climate measure can become maladaptation if it deepens inequality.',
      ja: '気候対策も、不平等を深めれば不適応になり得る。',
    },
    etymology: {
      parts: [
        { t: 'mal', kind: 'prefix', gloss: '悪く' },
        { t: 'adapt', kind: 'root', gloss: '適応する' },
        { t: 'ation', kind: 'suffix', gloss: 'こと' },
      ],
      note: 'mal-「悪く」＋ adaptation「適応」。問題を減らすはずの対策が別の害を生むこと。',
      origin: 'mal- + adaptation',
    },
    field: '環境',
  },
  {
    id: 'intervention',
    word: 'intervention',
    pos: '名',
    level: 'pre1',
    meaning: '介入・対策',
    meanings: ['介入', '対策', '状況を変えるための働きかけ'],
    phonetic: '/ˌɪntərˈvɛnʃən/',
    example: {
      en: 'Planners must examine how an intervention affects different residents.',
      ja: '計画者は対策が異なる住民へどう影響するかを調べなければならない。',
    },
    etymology: {
      parts: [
        { t: 'inter', kind: 'prefix', gloss: '間に' },
        { t: 'ven', kind: 'root', gloss: '来る' },
        { t: 'tion', kind: 'suffix', gloss: 'こと' },
      ],
      note: '物事の間に入って状況へ働きかけること。政策・医療・研究でよく使う。',
      origin: 'ラテン語 intervenire',
    },
    field: '社会',
  },
  {
    id: 'retention',
    word: 'retention',
    pos: '名',
    level: '1',
    meaning: '保持・維持',
    meanings: ['保持', '維持', '記憶にとどめること'],
    phonetic: '/rɪˈtɛnʃən/',
    example: {
      en: 'Preservation involves more than the retention of data.',
      ja: '保存には、データを保持する以上のことが含まれる。',
    },
    etymology: {
      parts: [
        { t: 're', kind: 'prefix', gloss: '後ろに' },
        { t: 'tent', kind: 'root', gloss: '保つ' },
        { t: 'ion', kind: 'suffix', gloss: 'こと' },
      ],
      note: '手元に引き留めて保つこと。retain の名詞形。',
      origin: 'ラテン語 retinere',
    },
    field: '一般',
  },
  {
    id: 'intelligible',
    word: 'intelligible',
    pos: '形',
    level: '1',
    meaning: '理解できる・明瞭な',
    meanings: ['理解できる', '明瞭な'],
    phonetic: '/ɪnˈtɛlɪdʒəbəl/',
    example: {
      en: 'An archive must keep its records intelligible to later users.',
      ja: '記録保管所は後の利用者にも記録を理解できる状態に保つ必要がある。',
    },
    etymology: {
      parts: [
        { t: 'intellig', kind: 'stem', gloss: '理解する' },
        { t: 'ible', kind: 'suffix', gloss: '〜できる' },
      ],
      note: 'intelligence と同系で、知性によって意味を理解できる状態を表す。',
      origin: 'ラテン語 intelligere',
    },
    field: '言語',
  },
  {
    id: 'discoverable',
    word: 'discoverable',
    pos: '形',
    level: '1',
    meaning: '発見可能な・検索で見つけられる',
    meanings: ['発見可能な', '検索で見つけられる'],
    phonetic: '/dɪˈskʌvərəbəl/',
    example: {
      en: 'Good indexing keeps digital records discoverable.',
      ja: '適切な索引はデジタル記録を検索で見つけられる状態に保つ。',
    },
    etymology: {
      parts: [
        { t: 'discover', kind: 'stem', gloss: '発見する' },
        { t: 'able', kind: 'suffix', gloss: '〜できる' },
      ],
      note: 'discover「発見する」＋ -able「できる」。情報検索の文脈でも使う。',
      origin: 'discover + -able',
    },
    field: '情報',
  },
  {
    id: 'neutrality',
    word: 'neutrality',
    pos: '名',
    level: '1',
    meaning: '中立性',
    meanings: ['中立性', 'どちらにも偏らない状態'],
    phonetic: '/nuːˈtræləti/',
    example: {
      en: 'Complete neutrality is difficult when an archive must select materials.',
      ja: '記録保管所が資料を選ばなければならない以上、完全な中立性は難しい。',
    },
    etymology: {
      parts: [
        { t: 'neutral', kind: 'stem', gloss: '中立の' },
        { t: 'ity', kind: 'suffix', gloss: '状態' },
      ],
      note: 'neutral「中立の」＋ -ity「状態」。対立するどちら側にも偏らないこと。',
      origin: 'neutral + -ity',
    },
    field: '社会',
  },
]
