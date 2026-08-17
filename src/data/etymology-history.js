// 「由来の型」を、互いに異なる3軸へ分ける。
//
// 1) formation: 英語にどう入った／英語内でどう作られたか
// 2) source:    由来説明に記された出発言語・歴史層
// 3) domain:    現在の意味分野
//
// 言語名（ラテン語など）と形成法（短縮・擬音など）を同じ分類表へ
// 混在させない。source は「直接の借用元」と断定せず、収録済みの由来説明に
// 現れる最初の言語層として扱う。

export const ETYMOLOGY_FORMATION_META = {
  inherited: {
    label: '昔の英語から受け継いだ語',
    short: '受け継いだ語',
    emoji: '🌱',
    description: '昔の英語から、つづりや発音、意味を少しずつ変えながら残った語です。',
  },
  borrowing: {
    label: 'ほかの言語から入った語',
    short: '外から入った語',
    emoji: '🧭',
    description: 'ほかの言語のことばが英語に入り、英語らしい形や意味に変わった語です。',
  },
  construction: {
    label: '部品を組み合わせた語',
    short: '組み合わせた語',
    emoji: '🧱',
    description: '2つ以上のことばや、前後につく部品を組み合わせてできた語です。',
  },
  shortening: {
    label: '短くしてできた語',
    short: '短くした語',
    emoji: '✂️',
    description: '長いことばを短くしたり、頭文字をつないだりしてできた語です。',
  },
  blend: {
    label: '混ぜ合わせた語',
    short: '混ぜた語',
    emoji: '🧪',
    description: '2つのことばの一部分ずつを取り出し、1語に混ぜてできた語です。',
  },
  reshaped: {
    label: 'もとの形を変えた語',
    short: '形を変えた語',
    emoji: '🪄',
    description: 'すでにあったことばの形や使い方を変えてできた語です。',
  },
  name: {
    label: '名前から一般語へ',
    short: '名前からできた語',
    emoji: '📍',
    description: '人や場所などの名前が、広く使われる一般的なことばになったものです。',
  },
  sound: {
    label: '音を写した語',
    short: '音からできた語',
    emoji: '🔊',
    description: '実際の音や声の響きをまねてできた語です。',
  },
  coinage: {
    label: '新しく作られた語',
    short: '新しく作った語',
    emoji: '✨',
    description: '新しいものや考え方に名前をつけるため、新しく作られた語です。',
  },
  semanticShift: {
    label: '意味が移ってできた語',
    short: '意味が変わった語',
    emoji: '💡',
    description: 'もとの使い方がたとえなどに広がり、今の意味になった語です。',
  },
  uncertain: {
    label: '由来がはっきりしない語',
    short: '由来が未詳の語',
    emoji: '🪨',
    description: '由来が不確かなので、分かっている範囲だけを手がかりにする語です。',
  },
}

export const ETYMOLOGY_SOURCE_META = {
  oldEnglish: {
    label: '古英語',
    short: '古英語',
    emoji: '🏡',
    description: '今の英語より前に使われていた古英語が、もとの手がかりです。',
  },
  englishHistory: {
    label: '英語内の変化',
    short: '英語の中で変化',
    emoji: '🕰️',
    description: '英語の中で、つづりや意味が変わった道すじをたどります。',
  },
  norse: {
    label: '古ノルド・北欧語系',
    short: '北欧語系',
    emoji: '⛵',
    description: '古ノルド語など、北欧で使われたことばがもとの手がかりです。',
  },
  french: {
    label: 'フランス語系',
    short: 'フランス語系',
    emoji: '🏰',
    description: '古フランス語を含むフランス語が、もとの手がかりです。',
  },
  latin: {
    label: 'ラテン語系',
    short: 'ラテン語系',
    emoji: '🏛️',
    description: 'ラテン語の形や意味が、もとの手がかりです。',
  },
  greek: {
    label: 'ギリシャ語系',
    short: 'ギリシャ語系',
    emoji: '🏺',
    description: 'ギリシャ語の形や意味が、もとの手がかりです。',
  },
  germanic: {
    label: 'ゲルマン諸語',
    short: 'ゲルマン',
    emoji: '🌲',
    description: 'ドイツ語やオランダ語などのことばが、もとの手がかりです。',
  },
  world: {
    label: 'その他の言語',
    short: '世界の言語',
    emoji: '🌍',
    description: '世界各地で使われることばが、もとの手がかりです。',
  },
  unknown: {
    label: 'もとの言語は未詳',
    short: 'もとの言語は未詳',
    emoji: '🗺️',
    description: 'もとの言語が分からないため、分かっている由来だけを確認します。',
  },
}

export const ETYMOLOGY_DOMAIN_META = {
  core: { label: '基礎・日常', emoji: '🧺' },
  action: { label: '動作・状態', emoji: '🏃' },
  function: { label: '機能・数量', emoji: '🔢' },
  people: { label: '人・心', emoji: '🫶' },
  daily: { label: '暮らし', emoji: '🏠' },
  nature: { label: '自然・健康', emoji: '🌿' },
  science: { label: '科学・技術', emoji: '🔬' },
  language: { label: 'ことば・文化', emoji: '📚' },
  society: { label: '社会・制度', emoji: '🏙️' },
  arts: { label: '芸術・音楽', emoji: '🎨' },
  other: { label: 'その他', emoji: '🧭' },
}

export const ETYMOLOGY_FIELD_TO_DOMAIN = {
  一般: 'core',
  '動作・行為': 'action',
  '性質・状態': 'action',
  '様子・程度': 'function',
  機能語: 'function',
  '時間・数量': 'function',
  副詞: 'function',
  心理: 'people',
  '家族・人': 'people',
  '食・生活': 'daily',
  料理: 'daily',
  交通: 'daily',
  建築: 'daily',
  スポーツ: 'daily',
  農業: 'daily',
  自然: 'nature',
  気象: 'nature',
  環境: 'nature',
  医学: 'nature',
  科学: 'science',
  技術: 'science',
  測定: 'science',
  学問: 'science',
  教育: 'language',
  言語: 'language',
  文学: 'language',
  メディア: 'language',
  歴史: 'society',
  地理: 'society',
  社会: 'society',
  経済: 'society',
  ビジネス: 'society',
  政治: 'society',
  法律: 'society',
  軍事: 'society',
  宗教: 'society',
  芸術: 'arts',
  音楽: 'arts',
}

const SOURCE_MATCHERS = [
  ['oldEnglish', /古英語/g],
  ['norse', /古ノルド|ノルド|北欧|スカンジナビア/g],
  ['french', /古フランス|フランス(?:語)?|アングロ[＝・-]?フランス/g],
  ['latin', /ラテン(?:語)?/g],
  ['greek', /ギリシャ(?:語)?/g],
  [
    'germanic',
    /ゲルマン|古フランク|古高ドイツ|中低ドイツ|低地ドイツ|ドイツ(?:語)?|オランダ(?:語)?|フリジア|スコットランド/g,
  ],
  [
    'world',
    /アラビア|サンスクリット|ヒンディ|ウルドゥ|ペルシャ|トルコ|中国語|広東語|日本語|マレー|ポリネシア|イタリア|スペイン|ポルトガル|ロシア|ケルト|ウェールズ|アフリカ|マオリ|ナワトル|タミル|ベンガル|スワヒリ|ヘブライ|イディッシュ|チェコ|ハンガリー|フィンランド/g,
  ],
  ['englishHistory', /中英語|近代英語|古い英語|英語由来/g],
]

const textFor = (word) =>
  `${word?.etymology?.origin ?? ''} ${word?.etymology?.note ?? ''}`.trim()

/** 由来記述に最初に現れる言語層を返す。直接の借用元とは断定しない。 */
export function etymologySourceKey(word) {
  const text = textFor(word)
  let key = 'unknown'
  let firstIndex = Number.POSITIVE_INFINITY
  for (const [candidate, matcher] of SOURCE_MATCHERS) {
    matcher.lastIndex = 0
    const match = matcher.exec(text)
    if (match && match.index < firstIndex) {
      key = candidate
      firstIndex = match.index
    }
  }
  return key
}

/** 形成法と出発言語を混ぜず、形成法だけを判定する。 */
export function etymologyFormationKey(word, sourceKey = etymologySourceKey(word)) {
  const text = textFor(word)
  if (
    /由来(?:は)?(?:不明|未詳|不確か|はっきりしない)|語源(?:は)?(?:不明|未詳|不確か)|由来不確か/.test(text)
  ) {
    return 'uncertain'
  }
  if (/短縮(?:形|語)?|略語|略称|頭文字|アクロニム|の略(?:。|$)|を縮め/.test(text)) {
    return 'shortening'
  }
  if (/混成|ブレンド|を混ぜ/.test(text)) return 'blend'
  if (/人名|地名|姓|固有名|商標|発明者|神名|人物名|神話|女神|にちな/.test(text)) {
    return 'name'
  }
  if (/擬音|擬態|鳴き声|音をまね|音の響き|音から生まれ/.test(text)) return 'sound'
  if (
    /(?:\+|＋)|複合語|を組み合わせ|を合わせた|名詞形|形容詞形|副詞形|動詞形|接頭辞|接尾辞|派生|過去分詞|現在分詞/.test(text)
  ) {
    return 'construction'
  }
  if (/変形|変化形|異形|訛|綴り|方言|民間語源|品詞転換|転用|動詞として|名詞として/.test(text)) {
    return 'reshaped'
  }
  if (/造語|新語|創作/.test(text)) return 'coinage'
  if (sourceKey === 'oldEnglish' || sourceKey === 'englishHistory') return 'inherited'
  if (sourceKey !== 'unknown') return 'borrowing'
  if (/→|から|起源|由来/.test(text)) return 'semanticShift'
  return 'uncertain'
}

export function etymologyDomainKey(word) {
  return ETYMOLOGY_FIELD_TO_DOMAIN[word?.field] ?? 'other'
}

/** UIで「出発点 → 意味の橋 → 現在義」を見せるための、改変しない表示用情報。 */
export function etymologyHistoryFor(word) {
  const note = word?.etymology?.note?.trim() ?? ''
  const sourceKey = etymologySourceKey(word)
  const formationKey = etymologyFormationKey(word, sourceKey)
  const domainKey = etymologyDomainKey(word)
  const arrowSteps = note
    .split(/\s*(?:→|⇒)\s*/)
    .map((step) => step.trim().replace(/。$/, ''))
    .filter(Boolean)

  return {
    formationKey,
    sourceKey,
    domainKey,
    sourceText: word?.etymology?.origin?.trim() || ETYMOLOGY_SOURCE_META[sourceKey].label,
    note,
    arrowSteps: arrowSteps.length > 1 ? arrowSteps : [],
    currentMeaning: word?.meanings?.slice(0, 2).join('・') || word?.meaning || '',
  }
}

/**
 * 収録済みの史実メモを変えず、中高生が読む順にそろえた説明。
 * 全語で「作られ方 → もとの情報 → 変化 → 今の意味」を同じ形で返す。
 */
export function etymologyLearningGuideFor(word) {
  const history = etymologyHistoryFor(word)
  const formation = ETYMOLOGY_FORMATION_META[history.formationKey]
  const source = ETYMOLOGY_SOURCE_META[history.sourceKey]
  const storySteps = history.arrowSteps.length > 1
    ? history.arrowSteps
    : [history.note || history.sourceText].filter(Boolean)

  return {
    formationLabel: formation.label,
    formationEmoji: formation.emoji,
    formationText: formation.description,
    sourceLabel: source.label,
    sourceEmoji: source.emoji,
    sourceText: history.sourceText,
    storyLabel: storySteps.length > 1 ? '意味の変化' : '由来の記録',
    storySteps,
    currentMeaning: history.currentMeaning,
  }
}
