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
    id: 'sora',
    name: '風間ソラ',
    reading: 'かざま そら',
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
  assetBase: `/assets/battle/cast/students/${student.id}`,
}))

// バトルの外にも同じ10人が暮らしていることを見せる日常ストーリー。
// 学習評価や能力値には接続せず、表情差分と世界観だけを共有する。
export const BATTLE_DAILY_SCENES = [
  {
    id: 'morning',
    name: '朝の支度',
    shortName: '朝',
    emoji: '🌅',
    time: '06:45',
    image: '/assets/battle/scenes/morning.webp',
    description: '制服に袖を通し、今日のノートを鞄へ。静かな朝が冒険の始まり。',
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
    image: '/assets/battle/scenes/commute.webp',
    description: '紫陽花の道を駅へ。昨日の雨も、今朝はきらめく作戦会議の舞台。',
    cast: [
      { studentId: 'ren', emotionId: 'curious' },
      { studentId: 'sora', emotionId: 'playful' },
    ],
  },
  {
    id: 'classroom',
    name: '授業中のひらめき',
    shortName: '授業',
    emoji: '✋',
    time: '10:20',
    image: '/assets/battle/scenes/classroom.webp',
    description: '考えて、書いて、手を挙げる。正解へ近づく小さな瞬間を三人で。',
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
    image: '/assets/battle/scenes/everyday.webp',
    description: '中庭の木陰でお弁当。何でもない会話が、午後の元気を回復する。',
    cast: [
      { studentId: 'nao', emotionId: 'playful' },
      { studentId: 'noa', emotionId: 'curious' },
      { studentId: 'tsubaki', emotionId: 'gentle' },
    ],
  },
  {
    id: 'club',
    name: '部活の合同準備',
    shortName: '部活',
    emoji: '🎨',
    time: '16:18',
    image: '/assets/battle/scenes/club.webp',
    description: '歌と絵と体力を持ち寄って、文化祭の景色を少しずつ完成させる。',
    cast: [
      { studentId: 'mio', emotionId: 'delighted' },
      { studentId: 'ren', emotionId: 'focused' },
      { studentId: 'sora', emotionId: 'cheering' },
    ],
  },
  {
    id: 'snack',
    name: '帰り道の買い食い',
    shortName: '買い食い',
    emoji: '🥟',
    time: '17:06',
    image: '/assets/battle/scenes/snack.webp',
    description: '商店街の揚げたてを分け合う。今日の頑張りに、おいしい回復時間。',
    cast: [
      { studentId: 'sora', emotionId: 'playful' },
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
    image: '/assets/battle/scenes/shopping.webp',
    description: '文具と小物を見比べて、三人それぞれの「好き」を見つける放課後。',
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
    image: '/assets/battle/scenes/library.webp',
    description: 'ページをめくり、手がかりをつなぐ。夕日の書架で心まで整う。',
    cast: [
      { studentId: 'haru', emotionId: 'focused' },
      { studentId: 'yuu', emotionId: 'gentle' },
      { studentId: 'mio', emotionId: 'healing' },
    ],
  },
  {
    id: 'homeward',
    name: '夕暮れの帰宅路',
    shortName: '帰宅',
    emoji: '🌇',
    time: '18:03',
    image: '/assets/battle/scenes/homeward.webp',
    description: '川沿いを歩きながら一日を振り返る。明日の一問へ続く穏やかな帰り道。',
    cast: [
      { studentId: 'haru', emotionId: 'relieved' },
      { studentId: 'yuu', emotionId: 'gentle' },
    ],
  },
]

const STUDENT_BY_ID = new Map(
  BATTLE_STUDENTS.map((student) => [student.id, student]),
)

const DAILY_SCENE_BY_ID = new Map(
  BATTLE_DAILY_SCENES.map((scene) => [scene.id, scene]),
)

export function isBattleStudentId(id) {
  return STUDENT_BY_ID.has(id)
}

export function normalizeBattleStudentId(id) {
  return isBattleStudentId(id) ? id : DEFAULT_BATTLE_STUDENT_ID
}

export function battleStudentById(id) {
  return STUDENT_BY_ID.get(normalizeBattleStudentId(id))
}

export function battleDailySceneById(id) {
  return DAILY_SCENE_BY_ID.get(id) ?? BATTLE_DAILY_SCENES[0]
}

export function battleEmotionById(id) {
  return EMOTION_BY_ID.get(id) ?? EMOTION_BY_ID.get('idle')
}

export function battleStudentPortrait(studentId, emotionId = 'idle') {
  const student = battleStudentById(studentId)
  const emotion = battleEmotionById(emotionId)
  return `${student.assetBase}/${emotion.id}.webp`
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
    portrait: `/assets/battle/cast/rivals/${id}.webp`,
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

// 回答イベントを24種類の表情・動作へ結びつける。評価値やダメージ計算には触れない。
export function battleStudentState({ battleState, eventActive = false } = {}) {
  if (!battleState) return 'idle'
  if (battleState.enemyDefeated) return 'victory'
  if (battleState.heroDefeated) return 'exhausted'

  const event = battleState.lastEvent
  if (eventActive && event?.themeAbility === 'encore') return 'healing'
  if (eventActive) {
    if (['block', 'shield', 'item-guard'].includes(event?.kind)) return 'guard'
    if (event?.kind === 'unknown') return 'worried'
    if (event?.kind === 'damage') return 'hurt'
    if (event?.kind === 'counter' && event?.healing) return 'relieved'
    if (['burst', 'item-power'].includes(event?.kind)) return 'determined'
    if (event?.kind === 'hit') return battleState.streak >= 3 ? 'delighted' : 'attack'
  }

  if (battleState.answered === 0) return 'idle'
  if (battleState.streak >= 3) return 'confident'
  if (battleState.streak === 2) return 'focused'
  if (battleState.streak === 1) return 'curious'
  return 'determined'
}
