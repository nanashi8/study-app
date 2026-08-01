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
    label: '受け継いだ語',
    short: '継承',
    emoji: '🌱',
    description: '古英語・中英語から形や意味を変えながら受け継がれた語です。',
  },
  borrowing: {
    label: '借用して入った語',
    short: '借用',
    emoji: '🧭',
    description: 'ほかの言語の語が英語へ入り、発音や意味を変えた語です。',
  },
  construction: {
    label: '部品を組み立てた語',
    short: '組立',
    emoji: '🧱',
    description: '複合・接辞・結合形など、記載された部品の足し算でできた語です。',
  },
  shortening: {
    label: '短くしてできた語',
    short: '短縮',
    emoji: '✂️',
    description: '長い語や語句を切り縮めたり、頭文字にしたりしてできた語です。',
  },
  blend: {
    label: '混ぜ合わせた語',
    short: '混成',
    emoji: '🧪',
    description: '2語の一部分ずつを重ね合わせて作った混成語です。',
  },
  reshaped: {
    label: '形を作り替えた語',
    short: '変形',
    emoji: '🪄',
    description: '変形・逆成・品詞転換など、既存の形を作り替えた語です。',
  },
  name: {
    label: '名前から一般語へ',
    short: '名前',
    emoji: '📍',
    description: '人名・地名・神話名などの固有名が一般的な語になったものです。',
  },
  sound: {
    label: '音を写した語',
    short: '音',
    emoji: '🔊',
    description: '実際の音や声の響きをまねて作られた語です。',
  },
  coinage: {
    label: '意図して作られた語',
    short: '造語',
    emoji: '✨',
    description: '作者や学者などが、名付けるために意図して作った語です。',
  },
  semanticShift: {
    label: '意味が移ってできた語',
    short: '意味変化',
    emoji: '💡',
    description: '既存の像や用法が比喩・拡張によって現在の意味へ移った語です。',
  },
  uncertain: {
    label: '由来を断定しない語',
    short: '未詳',
    emoji: '🪨',
    description: '由来が不確か、または収録説明だけでは形成法を断定できない語です。',
  },
}

export const ETYMOLOGY_SOURCE_META = {
  oldEnglish: {
    label: '古英語',
    short: '古英語',
    emoji: '🏡',
    description: '英語の最も古い記録層を出発点に含みます。',
  },
  englishHistory: {
    label: '英語内の変化',
    short: '英語史',
    emoji: '🕰️',
    description: '中英語以後の英語内の形・意味の変化をたどります。',
  },
  norse: {
    label: '古ノルド・北欧語系',
    short: '北欧語系',
    emoji: '⛵',
    description: '古ノルド語や北欧の言語層を出発点に含みます。',
  },
  french: {
    label: 'フランス語系',
    short: '仏語系',
    emoji: '🏰',
    description: '古フランス語を含むフランス語の層を出発点に含みます。',
  },
  latin: {
    label: 'ラテン語系',
    short: '羅語系',
    emoji: '🏛️',
    description: 'ラテン語の語形・意味を出発点に含みます。',
  },
  greek: {
    label: 'ギリシャ語系',
    short: '希語系',
    emoji: '🏺',
    description: 'ギリシャ語の語形・意味を出発点に含みます。',
  },
  germanic: {
    label: 'ゲルマン諸語',
    short: 'ゲルマン',
    emoji: '🌲',
    description: 'ドイツ語・オランダ語などのゲルマン諸語の層を含みます。',
  },
  world: {
    label: 'その他の言語',
    short: '世界の言語',
    emoji: '🌍',
    description: '欧州古典語以外を含む、世界各地の言語を出発点にします。',
  },
  unknown: {
    label: '言語経路なし・未詳',
    short: '経路未詳',
    emoji: '🗺️',
    description: '収録説明に出発言語が無いか、言語経路が確定していません。',
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
