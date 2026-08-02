// 学習XPを、下がらない「冒険者LV 1〜99」へ変換する純ロジック。
// 英検級に応じて上下する適応難易度（adaptive.js）とは別軸にすることで、
// 苦手な問題で敵ランクが下がっても、これまでの努力は失われない。
import { battleThemeById } from './battleThemes.js'
import { battleTeacherAffinity } from './battleCast.js'

export const MAX_HERO_LEVEL = 99

// 冒険者LVごとの「挑戦できる英検ランク」の解放表。
// 適応難易度はこの上限の内側だけで上下する。これにより、保存済みの engPos や
// 高い診断結果があっても、低LVの冒険者がいきなり1級と戦うことはない。
export const ENEMY_RANK_UNLOCKS = [
  { rankIndex: 0, level: 1, label: '5級' },
  { rankIndex: 1, level: 10, label: '4級' },
  { rankIndex: 2, level: 20, label: '3級' },
  { rankIndex: 3, level: 35, label: '準2級' },
  { rankIndex: 4, level: 50, label: '2級' },
  { rankIndex: 5, level: 70, label: '準1級' },
  { rankIndex: 6, level: 85, label: '1級' },
]

export function maxEnemyRankIndexForHeroLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  return [...ENEMY_RANK_UNLOCKS]
    .reverse()
    .find((unlock) => safeLevel >= unlock.level)?.rankIndex ?? 0
}

export function capEnemyPositionForHeroLevel(position, level) {
  const safePosition = Math.max(0, Number.isFinite(position) ? position : 0)
  return Math.min(safePosition, maxEnemyRankIndexForHeroLevel(level))
}

export function nextEnemyRankUnlockForHeroLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  return ENEMY_RANK_UNLOCKS.find((unlock) => unlock.level > safeLevel) ?? null
}

// 序盤は6問正解ほどでLVが上がり、後半は少しずつ腰を据えて育てる曲線。
// LV99到達は24,120XP。既存のXP（正解10 / 誤答3など）をそのまま使える。
export function xpNeededForNextLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL - 1, Math.floor(level) || 1))
  return 60 + Math.floor((safeLevel - 1) / 5) * 20
}

const LEVEL_START_XP = [0, 0]
for (let level = 2; level <= MAX_HERO_LEVEL; level += 1) {
  LEVEL_START_XP[level] =
    LEVEL_START_XP[level - 1] + xpNeededForNextLevel(level - 1)
}

export const MAX_LEVEL_XP = LEVEL_START_XP[MAX_HERO_LEVEL]

export function xpAtLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  return LEVEL_START_XP[safeLevel]
}

const TITLES = [
  { level: 1, name: '放課後ルーキー', emoji: '🌱' },
  { level: 10, name: 'ことばノート係', emoji: '📒' },
  { level: 20, name: '図書室の探索者', emoji: '🔎' },
  { level: 30, name: '校内クイズ名人', emoji: '💡' },
  { level: 40, name: '文法クラブ部長', emoji: '📐' },
  { level: 50, name: '語彙テスト王', emoji: '✏️' },
  { level: 60, name: '読解委員長', emoji: '📚' },
  { level: 70, name: '放課後の挑戦者', emoji: '🔥' },
  { level: 80, name: '生徒会の知恵袋', emoji: '🎖️' },
  { level: 90, name: '学園のことば守り', emoji: '🛡️' },
  { level: 99, name: 'ことばマスター', emoji: '🎓' },
]

export const RELICS = [
  {
    level: 1,
    name: '保健室のばんそうこう',
    emoji: '🩹',
    text: 'ちょっとしたピンチをやさしく手当てする',
    slot: 'charm',
    stats: { maxHp: 4 },
  },
  {
    level: 5,
    name: '勝負チョーク',
    emoji: '✏️',
    text: '黒板に書いた答えが攻撃の合図になる',
    slot: 'weapon',
    stats: { attack: 2 },
  },
  {
    level: 10,
    name: 'ひみつの単語ノート',
    emoji: '📗',
    text: '覚えた単語にだけ花まるが浮かぶ',
    slot: 'offhand',
    stats: { maxHp: 8 },
  },
  {
    level: 15,
    name: '無音の黒板消し',
    emoji: '🧽',
    text: '粉を立てずに相手の一撃を消してしまう',
    slot: 'charm',
    stats: { defense: 2 },
  },
  {
    level: 20,
    name: '先生の花まるシール',
    emoji: '💮',
    text: 'がんばったページに貼られる元気のしるし',
    slot: 'aura',
    stats: { maxHp: 8 },
  },
  {
    level: 25,
    name: '三角定規ブーメラン',
    emoji: '📐',
    text: '正しい角度で投げると手元へ戻ってくる',
    slot: 'charm',
    stats: { attack: 3 },
  },
  {
    level: 30,
    name: '鉄壁の下敷き',
    emoji: '🟦',
    text: 'ノートも反撃も折れ目ひとつ付けずに守る',
    slot: 'offhand',
    stats: { defense: 3 },
  },
  {
    level: 35,
    name: '放送室ヘッドホン',
    emoji: '🎧',
    text: '校内放送の小さな音まで聞き分ける',
    slot: 'head',
    stats: { defense: 3 },
  },
  {
    level: 40,
    name: '理科室のプリズム',
    emoji: '🔺',
    text: '長い文を意味の色へ分けて見せる',
    slot: 'offhand',
    stats: { attack: 4 },
  },
  {
    level: 45,
    name: '旧校舎のロッカー鍵',
    emoji: '🔑',
    text: '難問の奥にしまわれたヒントを開ける',
    slot: 'charm',
    stats: { attack: 4 },
  },
  {
    level: 50,
    name: '添削の赤ペン',
    emoji: '🖊️',
    text: '迷いのある選択肢へ鋭い一本線を引く',
    slot: 'weapon',
    stats: { attack: 6 },
  },
  {
    level: 55,
    name: '給食当番のエプロン',
    emoji: '🥼',
    text: '毎日の元気と小さなこぼれを受け止める',
    slot: 'aura',
    stats: { maxHp: 12 },
  },
  {
    level: 60,
    name: '使い込んだ英語辞典',
    emoji: '📖',
    text: '引いた回数だけ答えへの道が太くなる',
    slot: 'weapon',
    stats: { attack: 6 },
  },
  {
    level: 65,
    name: '音楽室の音叉',
    emoji: '🎵',
    text: '正しい響きで相手の攻撃を打ち消す',
    slot: 'charm',
    stats: { defense: 4 },
  },
  {
    level: 70,
    name: '放送委員のマイク',
    emoji: '🎙️',
    text: '間違えても次の一問をはっきり宣言できる',
    slot: 'aura',
    stats: { maxHp: 16 },
  },
  {
    level: 75,
    name: '校内見取り図',
    emoji: '🗺️',
    text: '次に向かう教室と弱点の場所が分かる',
    slot: 'offhand',
    stats: { attack: 6 },
  },
  {
    level: 80,
    name: '卒業記念リボン',
    emoji: '🎀',
    text: '積み重ねた努力をそっと結び直す',
    slot: 'head',
    stats: { maxHp: 20 },
  },
  {
    level: 85,
    name: '体育倉庫のストップウォッチ',
    emoji: '⏱️',
    text: '落ち着いて見直す一瞬を作り出す',
    slot: 'charm',
    stats: { defense: 6 },
  },
  {
    level: 90,
    name: '生徒会の通学かばん',
    emoji: '🎒',
    text: '大切なノートも強い反撃も受け止める',
    slot: 'offhand',
    stats: { defense: 8 },
  },
  {
    level: 95,
    name: '校長室の大辞典',
    emoji: '📕',
    text: '学校じゅうで集めた言葉の記録',
    slot: 'weapon',
    stats: { attack: 10 },
  },
  {
    level: 99,
    name: 'ことばの卒業帽',
    emoji: '🎓',
    text: 'LV99へ到達した生徒だけに贈られる',
    slot: 'head',
    stats: { maxHp: 30, attack: 12, defense: 10 },
  },
]

export const CHAPTERS = [
  {
    id: 'meadow',
    number: 1,
    minLevel: 1,
    maxLevel: 9,
    name: 'はじまりの教室',
    emoji: '🏫',
    gradient: 'linear-gradient(135deg,#7c3aed,#6366f1 52%,#0ea5e9)',
    story: '放課後のチャイムが鳴ったら、ことばバトルの授業が始まる。',
    enemies: [
      { id: 'moss-slime', name: 'モススライム', emoji: '🟢' },
      { id: 'riddle-rabbit', name: 'なぞかけウサギ', emoji: '🐇' },
      { id: 'ink-bat', name: 'インクコウモリ', emoji: '🦇' },
      { id: 'sleepy-mushroom', name: 'ねむりキノコ', emoji: '🍄' },
    ],
    boss: { id: 'grass-wolf', name: '草原のグリムウルフ', emoji: '🐺' },
  },
  {
    id: 'mistwood',
    number: 2,
    minLevel: 10,
    maxLevel: 19,
    name: 'ひみつの図書室',
    emoji: '📚',
    gradient: 'linear-gradient(135deg,#065f46,#0f766e 52%,#0891b2)',
    story: '本棚の間でささやく似た意味から、本物の答えを見つけ出す。',
    enemies: [
      { id: 'echo-owl', name: 'こだまフクロウ', emoji: '🦉' },
      { id: 'thorn-goblin', name: 'いばらゴブリン', emoji: '👺' },
      { id: 'mist-fox', name: '霧まといのキツネ', emoji: '🦊' },
      { id: 'root-imp', name: '語根のインプ', emoji: '😈' },
    ],
    boss: { id: 'forest-keeper', name: '忘却樹の番人', emoji: '🌳' },
  },
  {
    id: 'clocktower',
    number: 3,
    minLevel: 20,
    maxLevel: 29,
    name: '放課後の時計廊下',
    emoji: '🕰️',
    gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb 52%,#06b6d4)',
    story: '止まった校内時計を、正しい時制の順番で動かしていく。',
    enemies: [
      { id: 'minute-mimic', name: 'ミニットミミック', emoji: '⏱️' },
      { id: 'gear-spider', name: '歯車グモ', emoji: '🕷️' },
      { id: 'tense-ghost', name: '時制ゴースト', emoji: '👻' },
      { id: 'bell-gargoyle', name: '鐘楼ガーゴイル', emoji: '🗿' },
    ],
    boss: { id: 'chronos', name: '時計塔主クロノス', emoji: '⏳' },
  },
  {
    id: 'azure-sea',
    number: 4,
    minLevel: 30,
    maxLevel: 39,
    name: 'きらめく屋内プール',
    emoji: '🏊',
    gradient: 'linear-gradient(135deg,#0369a1,#0891b2 52%,#6366f1)',
    story: '長文の波を読み切り、向こう岸の正解タイルへ泳ぎ着く。',
    enemies: [
      { id: 'comma-jelly', name: 'コンマクラゲ', emoji: '🪼' },
      { id: 'phrase-pirate', name: 'フレーズ海賊', emoji: '🏴‍☠️' },
      { id: 'blue-kraken', name: '蒼のクラーケン', emoji: '🐙' },
      { id: 'current-siren', name: '潮流のセイレーン', emoji: '🧜' },
    ],
    boss: { id: 'leviathan', name: '深読王リヴァイア', emoji: '🐋' },
  },
  {
    id: 'crystal-library',
    number: 5,
    minLevel: 40,
    maxLevel: 49,
    name: 'ふしぎな理科室',
    emoji: '🧪',
    gradient: 'linear-gradient(135deg,#581c87,#7c3aed 52%,#4f46e5)',
    story: '文法の実験式を完成させ、千の例文をビーカーから解き放つ。',
    enemies: [
      { id: 'syntax-armor', name: '構文アーマー', emoji: '🦾' },
      { id: 'page-golem', name: 'ページゴーレム', emoji: '📄' },
      { id: 'clause-witch', name: '節まどう魔女', emoji: '🧙' },
      { id: 'crystal-eye', name: '水晶の監視眼', emoji: '👁️' },
    ],
    boss: { id: 'librarian', name: '禁書司書アーカ', emoji: '📚' },
  },
  {
    id: 'star-route',
    number: 6,
    minLevel: 50,
    maxLevel: 59,
    name: '星降る音楽室',
    emoji: '🎼',
    gradient: 'linear-gradient(135deg,#312e81,#4f46e5 52%,#9333ea)',
    story: '音だけで光る楽譜を頼りに、静かなフレーズを聞き分ける。',
    enemies: [
      { id: 'noise-comet', name: 'ノイズ彗星', emoji: '☄️' },
      { id: 'moon-moth', name: '月影モス', emoji: '🦋' },
      { id: 'signal-wisp', name: 'シグナルウィスプ', emoji: '💫' },
      { id: 'orbit-drake', name: '軌道のドレイク', emoji: '🐲' },
    ],
    boss: { id: 'silent-dragon', name: '無音竜サイレンス', emoji: '🐉' },
  },
  {
    id: 'thunder-range',
    number: 7,
    minLevel: 60,
    maxLevel: 69,
    name: '夕焼けの体育館',
    emoji: '🏀',
    gradient: 'linear-gradient(135deg,#9a3412,#ea580c 52%,#db2777)',
    story: '一瞬のひらめきをつなぎ、終了の笛より先にゴールを決める。',
    enemies: [
      { id: 'spark-hare', name: 'スパークヘア', emoji: '🐰' },
      { id: 'thunder-griffin', name: '雷羽グリフォン', emoji: '🦅' },
      { id: 'storm-troll', name: '嵐のトロル', emoji: '👹' },
      { id: 'cloud-serpent', name: '雲海サーペント', emoji: '🐍' },
    ],
    boss: { id: 'tempest', name: '天雷将テンペスト', emoji: '⚡' },
  },
  {
    id: 'hollow-citadel',
    number: 8,
    minLevel: 70,
    maxLevel: 79,
    name: 'しずかな旧校舎',
    emoji: '🏚️',
    gradient: 'linear-gradient(135deg,#27272a,#52525b 52%,#7c3aed)',
    story: '選ばなかった答えがささやく廊下で、自分の根拠を貫く。',
    enemies: [
      { id: 'doubt-knight', name: '疑念の騎士', emoji: '🥷' },
      { id: 'mirror-mage', name: '鏡像メイジ', emoji: '🪞' },
      { id: 'false-chest', name: 'まやかしチェスト', emoji: '🧰' },
      { id: 'hollow-raven', name: '虚空のレイヴン', emoji: '🐦‍⬛' },
    ],
    boss: { id: 'nameless-king', name: '無名王ノーネーム', emoji: '♟️' },
  },
  {
    id: 'sky-archive',
    number: 9,
    minLevel: 80,
    maxLevel: 89,
    name: '雲の上の職員室',
    emoji: '☁️',
    gradient: 'linear-gradient(135deg,#075985,#0284c7 52%,#8b5cf6)',
    story: 'これまで覚えた言葉が出席簿の星座になって空へ続く。',
    enemies: [
      { id: 'archive-bee', name: '索引ハチ', emoji: '🐝' },
      { id: 'cloud-sphinx', name: '雲上スフィンクス', emoji: '🦁' },
      { id: 'memory-whale', name: '記憶クジラ', emoji: '🐳' },
      { id: 'bookmark-fairy', name: 'しおりの妖精', emoji: '🧚' },
    ],
    boss: { id: 'archive-angel', name: '書庫天使セラフィム', emoji: '👼' },
  },
  {
    id: 'word-castle',
    number: 10,
    minLevel: 90,
    maxLevel: 98,
    name: '最上階の校長室',
    emoji: '🚪',
    gradient: 'linear-gradient(135deg,#701a75,#be185d 52%,#ea580c)',
    story: 'すべての教室で得た知識を携え、最後のドアをノックする。',
    enemies: [
      { id: 'royal-guard', name: '王城の近衛兵', emoji: '💂' },
      { id: 'lexicon-lion', name: '辞書獅子レクス', emoji: '🦁' },
      { id: 'crown-mage', name: '王冠の賢術師', emoji: '🧙‍♂️' },
      { id: 'ancient-drake', name: '古語竜エルダー', emoji: '🐲' },
    ],
    boss: { id: 'word-emperor', name: '言霊帝ヴォキャブラ', emoji: '🦹' },
  },
  {
    id: 'throne',
    number: 11,
    minLevel: 99,
    maxLevel: 99,
    name: '卒業式の講堂',
    emoji: '🎓',
    gradient: 'linear-gradient(135deg,#92400e,#f59e0b 52%,#db2777)',
    story: 'LV99は終わりではない。卒業後も、ことばを磨く新学期が始まる。',
    enemies: [],
    boss: { id: 'endless-book', name: '無限書典インフィニタス', emoji: '📖' },
  },
]

const MOB_ELEMENTS = {
  草: ['🌿', '#4ade80'],
  光: ['✨', '#facc15'],
  影: ['🌑', '#818cf8'],
  眠り: ['💤', '#c084fc'],
  獣: ['🐾', '#fb923c'],
  音: ['🔊', '#22d3ee'],
  棘: ['🌹', '#fb7185'],
  霧: ['🌫️', '#a5b4fc'],
  樹: ['🌳', '#22c55e'],
  時: ['⏳', '#f59e0b'],
  機械: ['⚙️', '#94a3b8'],
  霊: ['👻', '#67e8f9'],
  石: ['🪨', '#a8a29e'],
  水: ['💧', '#38bdf8'],
  言霊: ['🗯️', '#a78bfa'],
  深淵: ['🌀', '#6366f1'],
  潮: ['🌊', '#2dd4bf'],
  文法: ['📐', '#8b5cf6'],
  紙: ['📄', '#fbbf24'],
  魔力: ['🔮', '#d946ef'],
  水晶: ['💎', '#60a5fa'],
  星: ['🌠', '#a78bfa'],
  月: ['🌙', '#c4b5fd'],
  電波: ['📡', '#22d3ee'],
  軌道: ['🪐', '#818cf8'],
  無音: ['🔇', '#64748b'],
  雷: ['⚡', '#facc15'],
  嵐: ['🌩️', '#60a5fa'],
  雲: ['☁️', '#bae6fd'],
  疑念: ['❓', '#a3a3a3'],
  鏡: ['🪞', '#c4b5fd'],
  幻: ['🎭', '#f0abfc'],
  虚空: ['◈', '#8b5cf6'],
  記憶: ['🧠', '#38bdf8'],
  知恵: ['🧩', '#f59e0b'],
  聖: ['🪽', '#fde68a'],
  王権: ['♛', '#fb7185'],
  古語: ['📜', '#d97706'],
  王冠: ['👑', '#fbbf24'],
  無限: ['∞', '#f97316'],
}

const mob = (
  sprite,
  hue,
  species,
  role,
  element,
  move,
  intent,
  lore,
  flip = false,
) => {
  const [elementEmoji, accent] = MOB_ELEMENTS[element] ?? ['✦', '#a78bfa']
  return {
    sprite,
    hue,
    species,
    role,
    element,
    elementEmoji,
    accent,
    move,
    intent,
    lore,
    flip,
  }
}

// 敵IDは保存済みの学習履歴と互換のまま、図鑑設定と24体のMOBアトラスを結び付ける。
// 同じ素体を使う上位種も、属性色・反転・章の背景・固有技で別個体として見分けられる。
export const MOB_PROFILES = {
  'moss-slime': mob(0, 0, '苔粘体', '吸収型', '草', '苔むす体当たり', '迷いを吸い取り、足元を絡め取る', '朝露の単語を食べて育つ、おだやかな草原の掃除屋。'),
  'riddle-rabbit': mob(1, 0, '謎跳獣', 'かく乱型', '光', 'なぞなぞステップ', '似た意味の選択肢を飛び回って入れ替える', '答えを思いつくと長い耳が金色に光る、好奇心旺盛な案内役。'),
  'ink-bat': mob(2, 0, '墨翼獣', '暗幕型', '影', 'インク・スプラッシュ', '黒いしぶきで手掛かりを一瞬だけ隠す', '書き損じから生まれ、夜ごと白紙を探して飛ぶ小さな翼獣。'),
  'sleepy-mushroom': mob(3, 0, '夢茸族', '遅延型', '眠り', 'まどろみ胞子', '考える速度をゆるめ、うっかりを誘う', '正しい発音を子守歌にして眠る。起こすと少しだけ不機嫌。'),
  'grass-wolf': mob(6, 72, '草原魔狼', '追撃型', '獣', 'グリーン・ハウリング', '連続する遠吠えで集中を切らそうとする', 'ことばの種を守る草原の主。強い旅人だけを次の森へ通す。'),

  'echo-owl': mob(4, 0, '響梟族', '反響型', '音', 'エコー・クイズ', '聞こえた語を似た響きで何度も返す', '森の会話を一字も忘れない。敵か先生かは答え方しだい。'),
  'thorn-goblin': mob(5, 0, '茨小鬼', '妨害型', '棘', 'ソーン・スクランブル', '語順に茨を差し込み、文をほどけにくくする', '難しい語根を鎧に編み込み、森の近道で待ち伏せしている。'),
  'mist-fox': mob(6, 0, '霧狐族', '幻惑型', '霧', 'ミスト・パラフレーズ', '同じ意味の別表現に姿を変えて惑わせる', '霧の中では青く、月明かりでは銀色に見える知恵者。'),
  'root-imp': mob(7, 0, '語根木霊', '分解型', '樹', 'ルート・スプリット', '単語を接頭辞と語根へばらばらにする', '古い樹皮に眠る語源を掘り起こし、宝物のように集めている。'),
  'forest-keeper': mob(7, 104, '忘却古樹', '封印型', '樹', 'メモリー・オーバーグロウ', '覚えた言葉を枝葉で覆い、思い出す力を試す', '忘れられた単語を年輪に刻む森の番人。倒すより思い出すことを望む。'),

  'minute-mimic': mob(8, 0, '時箱魔', '奇襲型', '時', 'ミニット・バイト', '制限時間をかじり、焦りを生み出す', '時計塔の落とし物に化ける。秒針の音だけは隠しきれない。'),
  'gear-spider': mob(9, 0, '歯車蜘蛛', '拘束型', '機械', 'ギア・ウェブ', '時制の歯車を糸でつなぎ、順番を絡ませる', '正しい時制で話すと歯車が整い、満足そうに糸をほどく。'),
  'tense-ghost': mob(10, 0, '時制霊', '変化型', '霊', 'パスト・シフト', '現在の文を過去へずらして形を変える', '言い残した一文を完成させるまで、同じ時刻をさまよい続ける。'),
  'bell-gargoyle': mob(11, 0, '鐘楼石魔', '警報型', '石', 'ベル・リバーブ', '鐘の余韻で語尾の音を聞き取りにくくする', '正時になると目覚め、発音の乱れを塔じゅうへ知らせる見張り。'),
  chronos: mob(15, 28, '時鎧巨人', '連続型', '時', 'クロノ・コンジュゲート', '過去・現在・未来を一息で切り替える', '止まった大時計を鎧にした塔主。正しい時制だけが針を進める。'),

  'comma-jelly': mob(12, 0, '句読水母', '間合い型', '水', 'コンマ・ドリフト', '文の切れ目を漂わせ、読みの間合いを揺らす', '長文の潮に浮かび、読みやすい場所へそっとコンマを運ぶ。'),
  'phrase-pirate': mob(13, 0, '熟語海賊', '略奪型', '言霊', 'イディオム・レイド', '知っている単語を奪い、熟語へ組み替える', '一語では開かない宝箱を求め、ことば海を航海する船長。'),
  'blue-kraken': mob(14, 0, '群青海魔', '多段型', '深淵', 'オクト・チョイス', '八本の腕で選択肢を同時に突きつける', '海底の長文を丸ごと記憶する。要点を見抜く旅人にだけ道を譲る。'),
  'current-siren': mob(17, 184, '潮歌魔女', '誘導型', '潮', 'カレント・コーラス', '心地よい誤答へ声と潮流で誘い込む', '接続詞の歌で潮を操る。逆接の響きだけが彼女の歌を破る。'),
  leviathan: mob(14, 342, '深読巨鯨', '要塞型', '深淵', 'アビス・スキミング', '長文の波を重ね、要点を深く沈める', '海に失われた一文を背負う王。全体像を読める者を待っている。'),

  'syntax-armor': mob(15, 0, '構文魔鎧', '防御型', '文法', 'シンタックス・ガード', '主語と述語の結界で弱点を守る', '中身のない鎧だが、文の骨組みが崩れない限り倒れない。'),
  'page-golem': mob(16, 0, '紙頁巨人', '積層型', '紙', 'ページ・スタック', '例文を積み重ね、視界を壁で区切る', '捨てられた下書きが集まって生まれた。直された文を大切にする。'),
  'clause-witch': mob(17, 0, '従節魔女', '詠唱型', '魔力', 'クローズ・チェイン', '節と節を魔法の鎖でつなぎ替える', '関係詞の杖で文を伸ばす研究者。長すぎる説明が玉にきず。'),
  'crystal-eye': mob(18, 0, '晶視魔眼', '看破型', '水晶', 'クリスタル・スキャン', '曖昧な文法を見つけ、光線で弱点を突く', '千の例文を映してきた監視眼。根拠のある答えにはまばたきする。'),
  librarian: mob(23, 0, '禁書魔導書', '召喚型', '魔力', 'アーカ・カタログ', '未習の規則を索引から呼び出して試す', '封印本を守る司書の意志が宿る書典。余白には優しいヒントがある。'),

  'noise-comet': mob(19, 0, '雑音星霊', '高速型', '星', 'ノイズ・テイル', '尾を引く雑音で最初の音をかき消す', '聞き取れなかった音を集めて夜空を走る、にぎやかな彗星。'),
  'moon-moth': mob(20, 0, '月鱗蛾', '静穏型', '月', 'ルナ・ウィスパー', 'ささやき声まで小さくして耳を澄まさせる', '月光を鱗粉に変える。静かに聞く旅人の肩へ止まることもある。'),
  'signal-wisp': mob(19, 42, '信号火霊', '点滅型', '電波', 'シグナル・ブリンク', '大事な音だけを点滅させ、順番を試す', '星と星の間を飛び、短い合図で迷った船へ航路を伝える。'),
  'orbit-drake': mob(2, 326, '軌道小竜', '旋回型', '軌道', 'オービット・ダイブ', '文の周囲を旋回し、要点へ急降下する', '音の惑星を巡る小竜。繰り返し聞くほど軌道が安定する。'),
  'silent-dragon': mob(2, 350, '無響天竜', '沈黙型', '無音', 'サイレンス・ブレス', '一切の音を奪い、記憶だけで答えさせる', '鳴き声を持たない星空の竜。その羽ばたきは心の中でだけ聞こえる。'),

  'spark-hare': mob(1, 54, '電駆兎', '先制型', '雷', 'スパーク・ホップ', 'ひらめきと同時に飛び込み、即断を迫る', '雷雲より速い山兎。正解すると耳の先から小さな花火が散る。'),
  'thunder-griffin': mob(4, 55, '雷羽獣', '急襲型', '雷', 'サンダー・ディクテート', '雷鳴に語を混ぜ、聞き取りを試す', '頂へ続く風を守る雷鳥。澄んだ発音には翼を休めて耳を傾ける。'),
  'storm-troll': mob(21, 34, '嵐巨人', '重撃型', '嵐', 'テンペスト・スマッシュ', '長い問題を雷槌の一撃で押しつける', '難問ほど嬉しそうに笑う山の力持ち。粘り強い旅人を認める。'),
  'cloud-serpent': mob(14, 96, '雲海蛇竜', '包囲型', '雲', 'クラウド・コイル', '白い雲で選択肢を包み、輪郭をぼかす', '連峰を一周するほど長い体を持ち、接続語を道標に空を泳ぐ。'),
  tempest: mob(21, 62, '天雷武神', '奥義型', '雷', 'ヘブンズ・ボルト', '蓄えた雷を一問へ集中し、真っ向勝負を挑む', '山頂の雷を束ねる将。連続正解の火花を何より高く評価する。'),

  'doubt-knight': mob(15, 338, '疑念魔鎧', '反問型', '疑念', 'ダウト・パリィ', '選んだ直後に「本当に？」と問い返す', 'かつて迷い続けた騎士。理由を持つ答えには静かに剣を下ろす。'),
  'mirror-mage': mob(22, 0, '鏡面術師', '複写型', '鏡', 'ミラー・コピー', '正解そっくりの像を作って並べる', '鏡の向こうの可能性を映す魔術師。姿ではなく意味を見る者を待つ。'),
  'false-chest': mob(8, 260, '幻宝箱', '罠型', '幻', 'フェイク・リワード', '魅力的な誤答を宝物のように光らせる', '開ける前に根拠を確かめれば、こっそり本物の報酬をくれる。'),
  'hollow-raven': mob(2, 34, '虚空黒翼', '消去型', '虚空', 'ヴォイド・クロウ', '文から重要語を一つさらって空欄にする', '選ばれなかった答えを城へ運ぶ黒い鳥。空欄の場所をよく知る。'),
  'nameless-king': mob(15, 24, '無名王霊', '支配型', '虚空', 'ネームレス・チェック', '名称を伏せ、定義だけで知識を問う', '名を失っても意味は失わないと証明するため、玉座を守り続ける王。'),

  'archive-bee': mob(20, 58, '索引蜜蜂', '探索型', '記憶', 'インデックス・ダンス', '記憶の棚番号を踊りで入れ替える', '覚えた語を花粉のように運び、空の書庫へ新しい索引を作る。'),
  'cloud-sphinx': mob(4, 22, '雲上謎獣', '問答型', '知恵', 'スフィンクス・リドル', '定義と用例を組み合わせた謎を出す', '答えだけでなく理由も聞く、書庫の門番。良い質問を好む。'),
  'memory-whale': mob(14, 176, '記憶天鯨', '回想型', '記憶', 'リコール・ソング', '昔まちがえた語を歌にして呼び戻す', '旅人の復習記録を星座として背に浮かべ、雲海をゆっくり泳ぐ。'),
  'bookmark-fairy': mob(20, 86, '栞妖精', '支援型', '知恵', 'ブックマーク・シャッフル', '大事なページへ印を付け、優先順位を変える', '苦手なページを見つけるのが得意。戦いの後は復習場所を教えてくれる。'),
  'archive-angel': mob(20, 44, '書庫天使', '審判型', '聖', 'セラフィム・リコール', '旅の全記録から忘れかけた一問を選ぶ', '積み重ねた学習を翼の文字として記す、天空書庫の最後の司書。'),

  'royal-guard': mob(15, 350, '王城近衛', '鉄壁型', '王権', 'ロイヤル・ブロック', '基本語の盾で王城への道を塞ぐ', '基礎を軽んじない者だけを通す近衛兵。礼儀正しく、とても頑固。'),
  'lexicon-lion': mob(6, 320, '辞書獅子', '威圧型', '言霊', 'レクス・ロアー', '膨大な同義語を咆哮に混ぜて放つ', 'たてがみの一房ごとに一語を宿す。新しい語を知ると誇らしげに揺らす。'),
  'crown-mage': mob(17, 298, '王冠賢術師', '複合型', '王冠', 'クラウン・コンボ', '語彙・文法・読解の術を連続で切り替える', '一つの得意だけでは王になれないと説く、王城随一の教育係。'),
  'ancient-drake': mob(2, 14, '古語老竜', '詠唱型', '古語', 'エルダー・エティモン', '古い語源から現代語の意味を呼び起こす', '最初の辞書が書かれる前から言葉を集めてきた、物知りな老竜。'),
  'word-emperor': mob(22, 26, '言霊皇帝', '総力型', '王権', 'ヴォキャブラ・レガリア', '全章の技を王笏へ集め、総合力を試す', '言葉は支配するものではなく育てるものだと、勝者へ王冠を託す。'),

  'endless-book': mob(23, 42, '無限書典', '周回型', '無限', 'インフィニット・ページ', '学ぶたびに新しいページを開き、終わりなき挑戦を作る', 'LV99の記録から生まれた最後で最初の書。ページの先は毎日増え続ける。'),
}

const teacherRival = ({
  id,
  name,
  subject,
  subjectEmoji,
  accent,
  attackEmoji,
  move,
  attackLine,
  intent,
  lore,
  intro,
}) => ({
  id,
  portraitId: id,
  isTeacher: true,
  kindLabel: 'TEACHER',
  name,
  teacherSubject: subject,
  species: `${subject}担当`,
  role: '先生ライバル',
  element: subject,
  elementEmoji: subjectEmoji,
  accent,
  attackEmoji,
  move,
  attackLine,
  intent,
  lore,
  intro,
})

// 章ボスのIDは変えず、校内では架空の先生ライバルとして登場させる。
// 保存済みセッションとの互換性を守りながら、先生ごとの備品攻撃を表示できる。
export const TEACHER_RIVALS = {
  'grass-wolf': teacherRival({
    id: 'grass-wolf',
    name: '英語の白石先生',
    subject: '英語',
    subjectEmoji: '🔤',
    accent: '#818cf8',
    attackEmoji: '✏️',
    move: 'チョーク・スナイプ',
    attackLine: '白石先生がチョークを投げた！',
    intent: '正解そっくりの単語を黒板いっぱいに書く',
    lore: 'テンポのよい授業で人気の先生。正解すると「Excellent!」の花まるをくれる。',
    intro: '白石先生がチョークを構えた。「最初の小テスト、いくよ！」',
  }),
  'forest-keeper': teacherRival({
    id: 'forest-keeper',
    name: '国語の文月先生',
    subject: '国語',
    subjectEmoji: '📝',
    accent: '#34d399',
    attackEmoji: '🧽',
    move: '黒板消しクラップ',
    attackLine: '文月先生が黒板消しをパンッと叩いた！',
    intent: 'チョークの粉で決め手になる一語を隠す',
    lore: 'ことばの理由を大切にする先生。根拠まで言える生徒にはとびきり大きな丸を付ける。',
    intro: '図書室の奥で、文月先生が黒板消しを両手に持って待っている。',
  }),
  chronos: teacherRival({
    id: 'chronos',
    name: '数学の角田先生',
    subject: '数学',
    subjectEmoji: '➗',
    accent: '#38bdf8',
    attackEmoji: '📐',
    move: '巨大コンパス・ターン',
    attackLine: '角田先生が巨大コンパスをくるりと回した！',
    intent: '選択肢の順番を正確な角度で入れ替える',
    lore: '図形と英文の構造を同じように見抜く先生。途中式ならぬ「途中の根拠」をほめてくれる。',
    intro: '廊下の時計が止まり、角田先生の巨大コンパスだけが動き始めた。',
  }),
  leviathan: teacherRival({
    id: 'leviathan',
    name: '地理の地図野先生',
    subject: '地理',
    subjectEmoji: '🌏',
    accent: '#22d3ee',
    attackEmoji: '🌍',
    move: '地球儀スピン',
    attackLine: '地図野先生が地球儀を高速で回した！',
    intent: '長文の舞台を世界の反対側まで飛ばす',
    lore: '例文の国や文化まで教えてくれる先生。地球儀が止まった場所からクイズが始まる。',
    intro: '水面に地球儀が浮かび、地図野先生が次の国を指さした。',
  }),
  librarian: teacherRival({
    id: 'librarian',
    name: '化学の火野先生',
    subject: '化学',
    subjectEmoji: '🔬',
    accent: '#c084fc',
    attackEmoji: '🧪',
    move: 'ビーカー・バブル',
    attackLine: '火野先生が重曹入りビーカーを泡立てた！',
    intent: 'カラフルな泡で文法の手掛かりを包み込む',
    lore: '失敗も立派な観察結果だと教える先生。安全ゴーグルと復習だけは忘れない。',
    intro: '理科室のビーカーがふくらみ、火野先生が実験開始を宣言した。',
  }),
  'silent-dragon': teacherRival({
    id: 'silent-dragon',
    name: '英コミュの響先生',
    subject: '英コミュ',
    subjectEmoji: '🗣️',
    accent: '#a78bfa',
    attackEmoji: '🎧',
    move: 'リズム・シャドーイング',
    attackLine: '響先生が英語のフレーズをリズムよく読み上げた！',
    intent: '似た発音のフレーズを同じ速さで重ねて聞き分けさせる',
    lore: '発音と聞き取りをリズムで教える先生。伝わる一言には静かに拍手する。',
    intro: '音楽室が静まり、響先生の英語の呼びかけが澄んだリズムで広がった。',
  }),
  tempest: teacherRival({
    id: 'tempest',
    name: '物理の速水先生',
    subject: '物理',
    subjectEmoji: '🧲',
    accent: '#fb923c',
    attackEmoji: '⏱️',
    move: '加速度スプリント',
    attackLine: '速水先生が台車のストップウォッチを押した！',
    intent: '速度と向きを一気に変え、運動の法則を問いかける',
    lore: '運動部の記録も授業データにする物理教師。式だけでなく実際の動きを確かめる。',
    intro: '夕焼けの体育館に実験用の台車が並ぶ。「速度の変化を最後まで追うぞ！」',
  }),
  'nameless-king': teacherRival({
    id: 'nameless-king',
    name: '地学の工藤先生',
    subject: '地学',
    subjectEmoji: '🌋',
    accent: '#94a3b8',
    attackEmoji: '⛏️',
    move: '地層ハンマー・スタンプ',
    attackLine: '工藤先生が岩石ハンマーで標本をコンと叩いた！',
    intent: '地層の順番をずらし、過去の環境を読み直させる',
    lore: '石と地層を校舎の記憶として読む先生。採集道具の片付けまでが観察だ。',
    intro: '旧校舎の標本台で、工藤先生が岩石と化石を年代順に並べた。',
  }),
  'archive-angel': teacherRival({
    id: 'archive-angel',
    name: '生物の彩先生',
    subject: '生物',
    subjectEmoji: '🧬',
    accent: '#f472b6',
    attackEmoji: '🔬',
    move: '細胞スケッチ・スキャン',
    attackLine: '彩先生が顕微鏡の像をスクリーンへ映した！',
    intent: 'よく似た細胞を並べ、形と働きの違いを観察させる',
    lore: '観察スケッチを大切にする生物教師。小さな違いから生命の仕組みを見つける。',
    intro: '生物準備室の標本が光り、彩先生が顕微鏡の焦点を合わせた。',
  }),
  'word-emperor': teacherRival({
    id: 'word-emperor',
    name: '日本史の鐘ヶ江先生',
    subject: '日本史',
    subjectEmoji: '🏯',
    accent: '#fb7185',
    attackEmoji: '📜',
    move: '年表・出席簿プレス',
    attackLine: '鐘ヶ江教頭が巨大な日本史年表を開いた！',
    intent: '出来事の順番と因果関係を出席簿のように照合する',
    lore: '教頭を務めながら日本史も教える先生。校内の歩みを時代の流れへ結びつける。',
    intro: '校長室の前で鐘ヶ江教頭が年表を開く。「出来事を流れで説明してください」',
  }),
  'endless-book': teacherRival({
    id: 'endless-book',
    name: '世界史の学園坂先生',
    subject: '世界史',
    subjectEmoji: '🌐',
    accent: '#fbbf24',
    attackEmoji: '🗺️',
    move: '文明ロングスピーチ',
    attackLine: '学園坂校長が世界史の長い講話を始めた！',
    intent: '大事な年代を文明の長い物語の中へそっと隠す',
    lore: '校長を務めながら世界史も教える先生。異なる地域の歩みを一つの物語として語る。',
    intro: '卒業式の講堂で世界地図が開く。「短く一言……文明のつながりから始めましょう」',
  }),
}

// 11章のボスIDは保存互換のため増減させず、不足する古文担当だけを
// 学校生活へ登場する一般教員として追加する。
export const FACULTY_TEACHERS = {
  'classical-ogura': teacherRival({
    id: 'classical-ogura',
    name: '古文の小倉先生',
    subject: '古文',
    subjectEmoji: '📜',
    accent: '#a16207',
    attackEmoji: '🪭',
    move: '助動詞・扇',
    attackLine: '小倉先生が助動詞を書いた扇を開いた！',
    intent: '昔のことばを現代の場面へつなぎ、心情を読み取らせる',
    lore: '声に出した響きと場面を結びつける古文教師。暗記だけでなく、登場人物の気持ちを尋ねる。',
    intro: '古典教室で扇が開き、小倉先生が一節をゆっくり読み始めた。',
  }),
}

export const SCHOOL_TEACHERS = {
  ...TEACHER_RIVALS,
  ...FACULTY_TEACHERS,
}

const UNKNOWN_MOB_PROFILE = mob(
  23,
  0,
  '未確認種',
  '観察型',
  '無限',
  'アンノウン・サイン',
  'まだ分からない力を静かに観察する',
  '図鑑に記録のない来訪者。出会いそのものが新しい学びになる。',
)

export function mobProfile(enemyId) {
  return MOB_PROFILES[enemyId] ?? UNKNOWN_MOB_PROFILE
}

const ENCOUNTER_LINES = [
  '放課後のチャイムと同時に、教室の備品がそっと動き出した。',
  '廊下の先から、今日のことばライバルがやって来た。',
  '校内放送が鳴る。今日の一戦が始まろうとしている。',
  'ノートをめくる風の中から、新たな挑戦者が現れた。',
]

const positiveMod = (value, divisor) => ((value % divisor) + divisor) % divisor

export function chapterForLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  return CHAPTERS.find(
    (chapter) => safeLevel >= chapter.minLevel && safeLevel <= chapter.maxLevel,
  ) ?? CHAPTERS[0]
}

export function titleForLevel(level) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  return [...TITLES].reverse().find((title) => safeLevel >= title.level) ?? TITLES[0]
}

export function relicsForLevel(level) {
  return RELICS.filter((relic) => level >= relic.level)
}

export function nextRelicForLevel(level) {
  return RELICS.find((relic) => relic.level > level) ?? null
}

const HERO_EQUIPMENT_SLOTS = ['aura', 'head', 'weapon', 'offhand', 'charm']

export function relicStatLabel(relic) {
  const stats = relic?.stats ?? {}
  return [
    stats.maxHp ? `HP +${stats.maxHp}` : null,
    stats.attack ? `ATK +${stats.attack}` : null,
    stats.defense ? `DEF +${stats.defense}` : null,
  ].filter(Boolean).join(' · ')
}

// 取得済み戦利品から、バトルへ1個だけ持ち込む。
// 保存値が無い／未解放の値なら、これまでどおり最新の戦利品を自動選択する。
export function battleRelicForLevel(level, selectedLevel = null) {
  const relics = relicsForLevel(level)
  const safeSelectedLevel = Number.isSafeInteger(selectedLevel)
    ? selectedLevel
    : Number(selectedLevel)
  return relics.find((relic) => relic.level === safeSelectedLevel)
    ?? relics[relics.length - 1]
    ?? null
}

// 既存の能力補正から、1バトル1回のアクティブ効果を導く。
// ATK系＝次の正解を強化、DEF系＝次の反撃を防止、HP系＝即時回復。
export function relicBattleAbility(relic) {
  if (!relic) return null
  const stats = relic.stats ?? {}
  if ((stats.attack ?? 0) > 0) {
    const multiplier = Number(
      Math.min(2, 1.3 + stats.attack * 0.05).toFixed(2),
    )
    return {
      kind: 'power',
      label: '威力UP',
      short: `威力×${multiplier}`,
      multiplier,
      description: `次の正解攻撃を${multiplier}倍にする。ミスしても正解するまで効果は残る。`,
    }
  }
  if ((stats.defense ?? 0) > 0) {
    return {
      kind: 'guard',
      label: '反撃防止',
      short: '反撃を1回防ぐ',
      description: '次に受ける反撃を1回だけ完全に防ぐ。',
    }
  }
  const healPercent = Math.min(40, 10 + (stats.maxHp ?? 0))
  return {
    kind: 'heal',
    label: 'HP回復',
    short: `HP${healPercent}%回復`,
    healPercent,
    description: `最大HPの${healPercent}%をその場で回復する。`,
  }
}

export const BATTLE_ITEM_FILTERS = [
  { id: 'all', label: 'すべて' },
  { id: 'power', label: '攻撃' },
  { id: 'guard', label: '防御' },
  { id: 'heal', label: '回復' },
]

export const BATTLE_ITEM_SORTS = [
  { id: 'acquired', label: '入手順' },
  { id: 'newest', label: '新しい順' },
  { id: 'kind', label: '種類順' },
]

const BATTLE_ITEM_KIND_ORDER = {
  power: 0,
  guard: 1,
  heal: 2,
}

// アイテムボックスの整理は表示順だけを変え、取得順や永続化IDは変更しない。
// 不正な絞り込み・並び順は既定値へ戻し、古い画面状態からでも全所持品を失わない。
export function organizeBattleItems(
  relics,
  { filterId = 'all', sortId = 'acquired' } = {},
) {
  const safeRelics = Array.isArray(relics) ? relics.filter(Boolean) : []
  const safeFilterId = BATTLE_ITEM_FILTERS.some(({ id }) => id === filterId)
    ? filterId
    : 'all'
  const safeSortId = BATTLE_ITEM_SORTS.some(({ id }) => id === sortId)
    ? sortId
    : 'acquired'
  const filtered = safeFilterId === 'all'
    ? [...safeRelics]
    : safeRelics.filter(
      (relic) => relicBattleAbility(relic)?.kind === safeFilterId,
    )

  return filtered.sort((left, right) => {
    if (safeSortId === 'newest') return right.level - left.level
    if (safeSortId === 'kind') {
      const kindDifference =
        (BATTLE_ITEM_KIND_ORDER[relicBattleAbility(left)?.kind] ?? 99)
        - (BATTLE_ITEM_KIND_ORDER[relicBattleAbility(right)?.kind] ?? 99)
      if (kindDifference !== 0) return kindDifference
    }
    return left.level - right.level
  })
}

// 戦利品は所持するだけでなく、各部位の最新アイテムが主人公の外見へ反映される。
export function heroEquipmentForLevel(level) {
  const equipment = Object.fromEntries(
    HERO_EQUIPMENT_SLOTS.map((slot) => [slot, null]),
  )
  for (const relic of relicsForLevel(level)) {
    if (relic.slot in equipment) equipment[relic.slot] = relic
  }
  return equipment
}

// HP・攻撃・防御はLVごとに必ず上がり、獲得済み戦利品の補正を加算する。
// 適応敵ランクとは別軸なので、苦手な問題が続いても成長値は下がらない。
export function heroBattleStats(level = 1) {
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  const base = {
    maxHp: 96 + (safeLevel - 1) * 4,
    attack: 14 + Math.floor((safeLevel - 1) * 1.3),
    defense: 8 + (safeLevel - 1),
  }
  const bonus = relicsForLevel(safeLevel).reduce(
    (sum, relic) => ({
      maxHp: sum.maxHp + (relic.stats?.maxHp ?? 0),
      attack: sum.attack + (relic.stats?.attack ?? 0),
      defense: sum.defense + (relic.stats?.defense ?? 0),
    }),
    { maxHp: 0, attack: 0, defense: 0 },
  )

  return {
    level: safeLevel,
    maxHp: base.maxHp + bonus.maxHp,
    attack: base.attack + bonus.attack,
    defense: base.defense + bonus.defense,
    base,
    bonus,
  }
}

export function heroProgress(totalXp = 0) {
  const xp = Math.max(0, Math.floor(Number(totalXp) || 0))
  let level = 1
  while (level < MAX_HERO_LEVEL && xp >= LEVEL_START_XP[level + 1]) level += 1

  const isMax = level === MAX_HERO_LEVEL
  const levelStartXp = LEVEL_START_XP[level]
  const nextLevelXp = isMax ? levelStartXp : LEVEL_START_XP[level + 1]
  const intoLevel = isMax ? 0 : xp - levelStartXp
  const needed = isMax ? 0 : nextLevelXp - levelStartXp

  return {
    level,
    totalXp: xp,
    levelStartXp,
    nextLevelXp,
    intoLevel,
    needed,
    xpToNext: isMax ? 0 : Math.max(0, nextLevelXp - xp),
    progress: isMax ? 1 : intoLevel / needed,
    isMax,
    title: titleForLevel(level),
    chapter: chapterForLevel(level),
    relics: relicsForLevel(level),
    equipment: heroEquipmentForLevel(level),
    battleStats: heroBattleStats(level),
    nextRelic: nextRelicForLevel(level),
    enemyRankCap: maxEnemyRankIndexForHeroLevel(level),
    nextEnemyRankUnlock: nextEnemyRankUnlockForHeroLevel(level),
  }
}

export const BATTLE_QUESTS = [
  {
    id: 'scout',
    label: '小テスト',
    emoji: '✏️',
    size: 5,
    minutes: '約2分',
    description: 'さくっと5問',
  },
  {
    id: 'duel',
    label: '放課後戦',
    emoji: '🎒',
    size: 10,
    minutes: '約4分',
    description: 'ちょうどいい10問',
  },
  {
    id: 'expedition',
    label: '学年末戦',
    emoji: '🏫',
    size: 15,
    minutes: '約7分',
    description: 'じっくり15問',
  },
]

export function battleQuest(questId) {
  return BATTLE_QUESTS.find((quest) => quest.id === questId) ?? BATTLE_QUESTS[1]
}

export function featuredQuestId(day = 0) {
  return BATTLE_QUESTS[positiveMod(Math.floor(day) || 0, BATTLE_QUESTS.length)].id
}

// バトル中の正答率・XP・SRSは変えず、解答順に応じた遊び方だけを変える作戦。
// 生徒が得意な戦い方を選べる一方、学習評価そのものは常に同じ基準に保つ。
export const BATTLE_TACTICS = [
  {
    id: 'combo',
    label: '集中',
    name: '集中モード',
    emoji: '🔥',
    short: '3連続で花まる',
    description: '3問連続で正解するたび、花まるコンボが発動。最大コンボに挑戦。',
  },
  {
    id: 'guard',
    label: '見直し',
    name: '見直しモード',
    emoji: '📒',
    short: '2正解でガード',
    description: '2問正解するたびに見直しガードを1枚獲得。次のミスによる反撃を防ぐ。',
  },
  {
    id: 'counter',
    label: 'やり直し',
    name: 'やり直しモード',
    emoji: '💡',
    short: 'ミス後の正解で回復',
    description: 'ミスの直後に正解するとリトライが成功し、失ったHPを回復。',
  },
]

export function battleTactic(tacticId) {
  return BATTLE_TACTICS.find((tactic) => tactic.id === tacticId) ?? BATTLE_TACTICS[0]
}

export function featuredBattleTacticId(day = 0) {
  return BATTLE_TACTICS[
    positiveMod(Math.floor(day) || 0, BATTLE_TACTICS.length)
  ].id
}

export const BATTLE_SCENE_CUES = {
  ready: {
    emoji: '✏️',
    label: 'READY',
    title: '答えをえらぼう',
    actor: 'hero',
    target: null,
  },
  hit: {
    emoji: '💮',
    label: 'NICE!',
    title: '正解アタック',
    actor: 'hero',
    target: 'enemy',
  },
  burst: {
    emoji: '🔥',
    label: 'COMBO!',
    title: '花まるコンボ',
    actor: 'hero',
    target: 'enemy',
  },
  shield: {
    emoji: '📒',
    label: 'GUARD +1',
    title: '見直しガード',
    actor: 'hero',
    target: 'hero',
  },
  block: {
    emoji: '🛡️',
    label: 'BLOCK!',
    title: '反撃を防いだ',
    actor: 'enemy',
    target: 'hero',
  },
  counter: {
    emoji: '💡',
    label: 'RETRY!',
    title: 'やり直し成功',
    actor: 'hero',
    target: 'enemy',
  },
  'item-power': {
    emoji: '✨',
    label: 'ITEM BOOST!',
    title: 'アイテム強化',
    actor: 'hero',
    target: 'enemy',
  },
  'item-guard': {
    emoji: '🛡️',
    label: 'ITEM GUARD!',
    title: 'アイテム防御',
    actor: 'enemy',
    target: 'hero',
  },
  'item-heal': {
    emoji: '🩹',
    label: 'ITEM HEAL!',
    title: 'アイテムで回復',
    actor: 'hero',
    target: 'hero',
  },
  damage: {
    emoji: '💥',
    label: 'ENEMY HIT',
    title: '敵の反撃',
    actor: 'enemy',
    target: 'hero',
  },
  unknown: {
    emoji: '🧭',
    label: 'REASSESS',
    title: '立て直し',
    actor: 'enemy',
    target: 'hero',
  },
}

export function battleSceneCue(eventKind) {
  return BATTLE_SCENE_CUES[eventKind] ?? BATTLE_SCENE_CUES.ready
}

const isMiss = (answer) => answer === 'wrong' || answer === 'unknown'

function normalizeBondSkill(skill) {
  if (
    !skill
    || typeof skill !== 'object'
    || !['heal', 'power', 'guard'].includes(skill.kind)
    || typeof skill.id !== 'string'
    || typeof skill.name !== 'string'
  ) return null

  const normalized = {
    id: skill.id,
    name: skill.name,
    emoji: typeof skill.emoji === 'string' ? skill.emoji : '🤝',
    description: typeof skill.description === 'string' ? skill.description : '',
    kind: skill.kind,
  }
  if (skill.kind === 'guard') {
    normalized.reductionPercent = Math.max(
      1,
      Math.min(90, Math.floor(Number(skill.reductionPercent) || 0)),
    )
    return normalized
  }
  normalized.every = Math.max(1, Math.min(100, Math.floor(Number(skill.every) || 1)))
  if (skill.kind === 'heal') {
    normalized.healPercent = Math.max(
      1,
      Math.min(100, Math.floor(Number(skill.healPercent) || 0)),
    )
  } else {
    normalized.bonusPercent = Math.max(
      1,
      Math.min(100, Math.floor(Number(skill.bonusPercent) || 0)),
    )
  }
  return normalized
}

export function enemyBattleStats({
  heroLevel = 1,
  enemyRankIndex = 0,
  isBoss = false,
  total = 10,
} = {}) {
  const heroStats = heroBattleStats(heroLevel)
  const rank = Math.max(0, Math.min(6, Math.floor(Number(enemyRankIndex) || 0)))
  const safeTotal = Math.max(1, Math.floor(Number(total) || 1))
  const defense =
    2
    + Math.floor((heroStats.level - 1) * 0.38)
    + rank * 3
    + (isBoss ? 4 : 0)
  const normalHit = Math.max(1, heroStats.attack - defense)
  const comboHit = Math.max(normalHit, Math.round(normalHit * 1.5))
  // 問題が残っているのにHPが0にならないよう、選択した問題数ぶんの通常攻撃と、
  // 最終問より前に発動し得る最大コンボぶんを敵HPへ織り込む。
  const comboReserve = (comboHit - normalHit) * Math.floor((safeTotal - 1) / 3)
  const normalDamage = Math.max(1, Math.ceil(heroStats.maxHp / safeTotal))
  // ATK表示と実ダメージを一致させつつ、5/10/15問で一発の重さを調整する。
  const attack = normalDamage + Math.floor(heroStats.defense * 0.22)

  return {
    rank,
    isBoss,
    attack,
    defense,
    maxHp: normalHit * safeTotal + comboReserve,
    normalHit,
    normalDamage,
  }
}

// 正誤の並びから作戦の発動状況とHUD表示を再現する純ロジック。
// 一時中断から戻った場合も battleLog だけで同じ戦況を復元できる。
export function resolveBattleState({
  answers = [],
  total = 10,
  tacticId = 'combo',
  heroLevel = 1,
  enemyRankIndex = 0,
  isBoss = false,
  studentId = null,
  teacherSubject = null,
  relicLevel = null,
  itemUsedAt = null,
  themeId = 'music-pastel',
  bondSkill = null,
} = {}) {
  const tactic = battleTactic(tacticId)
  const battleTheme = battleThemeById(themeId)
  const themeAbility = battleTheme.ability
  const teacherAffinity = battleTeacherAffinity(studentId, teacherSubject)
  const log = (Array.isArray(answers) ? answers : []).filter(
    (answer) => answer === 'correct' || isMiss(answer),
  ).slice(0, Math.max(1, Math.floor(Number(total) || 1)))
  const safeTotal = Math.max(1, Math.floor(Number(total) || 1))
  const heroStats = heroBattleStats(heroLevel)
  const itemRelic = battleRelicForLevel(heroStats.level, relicLevel)
  const itemAbility = relicBattleAbility(itemRelic)
  const activeBondSkill = normalizeBondSkill(bondSkill)
  const safeItemUsedAt =
    itemRelic
    && Number.isSafeInteger(itemUsedAt)
    && itemUsedAt >= 0
    && itemUsedAt < safeTotal
      ? itemUsedAt
      : null
  const enemyStats = enemyBattleStats({
    heroLevel: heroStats.level,
    enemyRankIndex,
    isBoss,
    total: safeTotal,
  })

  let correct = 0
  let heroDamage = 0
  let streak = 0
  let maxStreak = 0
  let comboBursts = 0
  let guardCharge = 0
  let shields = 0
  let protectedHits = 0
  let counters = 0
  let previousWasMiss = false
  let lastEvent = null
  let heroCurrentHp = heroStats.maxHp
  let enemyCurrentHp = enemyStats.maxHp
  let damageDealt = 0
  let damageTaken = 0
  let healingDone = 0
  let lastDamageTaken = 0
  let itemArmed = false
  let itemTriggered = false
  let itemBonusDamage = 0
  let itemBlocked = 0
  let itemHealing = 0
  let themeActivations = 0
  let themeHealing = 0
  let themeBonusDamage = 0
  let themeBlockedDamage = 0
  let affinityActivations = 0
  let affinityBonusDamage = 0
  let bondActivations = 0
  let bondHealing = 0
  let bondBonusDamage = 0
  let bondBlockedDamage = 0

  const activateItem = () => {
    itemArmed = true
    if (itemAbility?.kind !== 'heal') return
    const healing = Math.min(
      Math.ceil((heroStats.maxHp * itemAbility.healPercent) / 100),
      heroStats.maxHp - heroCurrentHp,
    )
    heroCurrentHp += healing
    healingDone += healing
    itemHealing += healing
    itemTriggered = true
    itemArmed = false
  }

  for (const [turnIndex, answer] of log.entries()) {
    if (turnIndex === safeItemUsedAt) activateItem()
    const finalTurn = turnIndex + 1 >= safeTotal
    if (answer === 'correct') {
      correct += 1
      streak += 1
      maxStreak = Math.max(maxStreak, streak)

      if (tactic.id === 'combo' && streak % 3 === 0) {
        comboBursts += 1
        lastEvent = {
          kind: 'burst',
          emoji: '🔥',
          title: `${streak}連続！ 花まるコンボ`,
        }
      } else if (tactic.id === 'guard') {
        guardCharge += 1
        if (guardCharge === 2) {
          guardCharge = 0
          shields += 1
          lastEvent = {
            kind: 'shield',
            emoji: '📒',
            title: '見直しガードを1枚獲得！',
          }
        } else {
          lastEvent = { kind: 'hit', emoji: '💮', title: '正解アタック！' }
        }
      } else if (tactic.id === 'counter' && previousWasMiss) {
        counters += 1
        heroDamage = Math.max(0, heroDamage - 1)
        const healing = Math.min(
          lastDamageTaken,
          heroStats.maxHp - heroCurrentHp,
        )
        heroCurrentHp += healing
        healingDone += healing
        lastEvent = {
          kind: 'counter',
          emoji: '💡',
          title: 'やり直し成功！ HPも回復',
          healing,
        }
      } else {
        lastEvent = { kind: 'hit', emoji: '💮', title: '正解アタック！' }
      }

      const themeHealActive =
        themeAbility.kind === 'heal'
        && correct % themeAbility.every === 0
      if (themeHealActive) {
        const healing = Math.min(
          Math.ceil((heroStats.maxHp * themeAbility.healPercent) / 100),
          heroStats.maxHp - heroCurrentHp,
        )
        heroCurrentHp += healing
        healingDone += healing
        themeHealing += healing
        themeActivations += 1
        lastEvent = {
          ...lastEvent,
          emoji: themeAbility.emoji,
          title: `${lastEvent.title}・${themeAbility.name}！`,
          healing: (lastEvent.healing ?? 0) + healing,
          themeAbility: themeAbility.id,
        }
      }

      const bondHealActive =
        activeBondSkill?.kind === 'heal'
        && correct % activeBondSkill.every === 0
      if (bondHealActive) {
        const healing = Math.min(
          Math.ceil((heroStats.maxHp * activeBondSkill.healPercent) / 100),
          heroStats.maxHp - heroCurrentHp,
        )
        heroCurrentHp += healing
        healingDone += healing
        bondHealing += healing
        bondActivations += 1
        lastEvent = {
          ...lastEvent,
          emoji: activeBondSkill.emoji,
          title: `${lastEvent.title}・${activeBondSkill.name}！`,
          healing: (lastEvent.healing ?? 0) + healing,
          bondSkill: activeBondSkill.id,
        }
      }

      const tacticMultiplier =
        lastEvent.kind === 'burst'
          ? 1.5
          : lastEvent.kind === 'counter'
            ? 1.25
            : 1
      const itemPowerActive = itemArmed && itemAbility?.kind === 'power'
      const normalDamage = Math.max(
        1,
        Math.round(
          Math.max(1, heroStats.attack - enemyStats.defense) * tacticMultiplier,
        ),
      )
      let damage = itemPowerActive
        ? Math.max(1, Math.round(normalDamage * itemAbility.multiplier))
        : normalDamage
      if (itemPowerActive) {
        itemArmed = false
        itemTriggered = true
        lastEvent = {
          ...lastEvent,
          kind: 'item-power',
          emoji: itemRelic.emoji,
          title: `${itemRelic.name}で威力アップ！`,
        }
      }
      const damageAfterItem = damage
      const bondPowerActive =
        activeBondSkill?.kind === 'power'
        && correct % activeBondSkill.every === 0
      const damageBeforeBond = damage
      let bondPowerBonus = 0
      if (bondPowerActive) {
        bondPowerBonus = Math.max(
          1,
          Math.round((normalDamage * activeBondSkill.bonusPercent) / 100),
        )
        damage += bondPowerBonus
        bondActivations += 1
        lastEvent = {
          ...lastEvent,
          emoji: activeBondSkill.emoji,
          title: `${lastEvent.title}・${activeBondSkill.name}！`,
          bondSkill: activeBondSkill.id,
        }
      }
      const themePowerActive =
        themeAbility.kind === 'power'
        && correct % themeAbility.every === 0
      const damageBeforeTheme = damage
      let themePowerBonus = 0
      if (themePowerActive) {
        themePowerBonus = Math.max(
          1,
          Math.round((normalDamage * themeAbility.bonusPercent) / 100),
        )
        damage += themePowerBonus
        themeActivations += 1
        lastEvent = {
          ...lastEvent,
          emoji: themeAbility.emoji,
          title: `${lastEvent.title}・${themeAbility.name}！`,
          themeAbility: themeAbility.id,
        }
      }
      const affinityActive = teacherAffinity.damageBonusPercent > 0
      const damageBeforeAffinity = damage
      if (affinityActive) {
        damage += Math.max(
          1,
          Math.round((normalDamage * teacherAffinity.damageBonusPercent) / 100),
        )
        affinityActivations += 1
        lastEvent = {
          ...lastEvent,
          title: `${lastEvent.title}・教科相性サポート！`,
          teacherAffinity: teacherAffinity.id,
        }
      }
      // コンボを選ばない作戦でも、全問正解の最終問は残りHPを削り切る。
      const forceFinisher = finalTurn && correct === safeTotal
      if (forceFinisher) damage = enemyCurrentHp
      // 相性・エリア・アイテムで実ダメージが増えても、全問正解以外では倒し切らない。
      const minimumHp = forceFinisher ? 0 : 1
      const availableDamage = Math.max(0, enemyCurrentHp - minimumHp)
      const appliedDamage = Math.min(damage, availableDamage)
      if (affinityActive && !forceFinisher) {
        affinityBonusDamage += Math.max(
          0,
          appliedDamage - Math.min(damageBeforeAffinity, availableDamage),
        )
      }
      if (themePowerActive && !forceFinisher) {
        themeBonusDamage += Math.max(
          0,
          Math.min(damageBeforeTheme + themePowerBonus, availableDamage)
            - Math.min(damageBeforeTheme, availableDamage),
        )
      }
      if (bondPowerActive && !forceFinisher) {
        bondBonusDamage += Math.max(
          0,
          Math.min(damageBeforeBond + bondPowerBonus, availableDamage)
            - Math.min(damageBeforeBond, availableDamage),
        )
      }
      if (itemPowerActive && !forceFinisher) {
        const appliedBeforeTheme = Math.min(damageAfterItem, availableDamage)
        itemBonusDamage += Math.max(
          0,
          appliedBeforeTheme - Math.min(normalDamage, availableDamage),
        )
      }
      enemyCurrentHp -= appliedDamage
      damageDealt += appliedDamage
      lastEvent.damage = appliedDamage
      previousWasMiss = false
      continue
    }

    streak = 0
    previousWasMiss = true
    if (itemArmed && itemAbility?.kind === 'guard') {
      itemArmed = false
      itemTriggered = true
      itemBlocked += 1
      lastEvent = {
        kind: 'item-guard',
        emoji: itemRelic.emoji,
        title: `${itemRelic.name}で反撃を防いだ！`,
        damage: 0,
      }
    } else if (tactic.id === 'guard' && shields > 0) {
      shields -= 1
      protectedHits += 1
      lastEvent = {
        kind: 'block',
        emoji: '📒',
        title: '見直しガードで反撃を防いだ！',
        damage: 0,
      }
    } else {
      heroDamage += 1
      const themeGuardActive =
        themeAbility.kind === 'guard'
        && themeActivations === 0
      const bondGuardActive =
        activeBondSkill?.kind === 'guard'
        && bondActivations === 0
      const damageAfterTheme = themeGuardActive
        ? Math.max(1, Math.ceil(
            enemyStats.normalDamage * (1 - themeAbility.reductionPercent / 100),
          ))
        : enemyStats.normalDamage
      const damage = bondGuardActive
        ? Math.max(1, Math.ceil(
            damageAfterTheme * (1 - activeBondSkill.reductionPercent / 100),
          ))
        : damageAfterTheme
      const minimumHp = finalTurn ? 0 : 1
      // 防御特技があっても全問不正解なら敗北する、従来の決着条件を保つ。
      const forceDefeat = finalTurn && correct === 0
      const appliedDamage = forceDefeat
        ? heroCurrentHp
        : Math.min(damage, Math.max(0, heroCurrentHp - minimumHp))
      heroCurrentHp -= appliedDamage
      damageTaken += appliedDamage
      lastDamageTaken = appliedDamage
      if (themeGuardActive) {
        themeActivations += 1
        themeBlockedDamage += Math.max(0, enemyStats.normalDamage - damageAfterTheme)
      }
      if (bondGuardActive) {
        bondActivations += 1
        bondBlockedDamage += Math.max(0, damageAfterTheme - damage)
      }
      lastEvent = answer === 'unknown'
        ? {
            kind: 'unknown',
            emoji: '🧭',
            title: '「わからない」を記録。次で立て直そう',
            damage: appliedDamage,
          }
        : {
            kind: 'damage',
            emoji: '💥',
            title: '相手の反撃！ 次の一問で取り返そう',
            damage: appliedDamage,
          }
      if (themeGuardActive) {
        lastEvent = {
          ...lastEvent,
          emoji: themeAbility.emoji,
          title: `${themeAbility.name}で反撃を軽減！`,
          themeAbility: themeAbility.id,
        }
      }
      if (bondGuardActive) {
        lastEvent = {
          ...lastEvent,
          emoji: activeBondSkill.emoji,
          title: `${activeBondSkill.name}で反撃を軽減！`,
          bondSkill: activeBondSkill.id,
        }
      }
    }
  }

  // 回答後に次ターン用として使った場合や、HP回復を回答前に使った場合も
  // battleLogだけの再計算で同じ待機・回復状態を復元する。
  if (safeItemUsedAt === log.length && log.length < safeTotal) activateItem()

  // HPの割合も選択した問題数を分母にする。全問正解／全問ミス以外では、
  // 最終問より前に0%へ到達しない。
  const enemyHp = Math.max(0, 100 - Math.floor((correct / safeTotal) * 100))
  const heroHp = Math.max(0, 100 - Math.floor((heroDamage / safeTotal) * 100))
  const misses = log.length - correct

  let status
  let summary
  let activations
  if (tactic.id === 'guard') {
    status = shields > 0
      ? `ガード ${shields}枚`
      : `見直し ${guardCharge}/2`
    summary = `見直しガード ${protectedHits}回・残り ${shields}枚`
    activations = protectedHits
  } else if (tactic.id === 'counter') {
    status = previousWasMiss
      ? 'RETRY READY'
      : `やり直し ${counters}回`
    summary = `やり直し成功 ${counters}回・HP回復 ${counters}回`
    activations = counters
  } else {
    const comboStep = streak % 3
    status = comboStep
      ? `${streak}連続 · あと${3 - comboStep}問`
      : comboBursts
        ? `花まる ${comboBursts}回`
        : '3連続で花まる'
    summary = `花まるコンボ ${comboBursts}回・最大 ${maxStreak}連続`
    activations = comboBursts
  }

  const itemUsed = safeItemUsedAt !== null
  const itemStatus = !itemUsed
    ? '未使用'
    : itemArmed
      ? itemAbility.kind === 'power'
        ? itemAbility.short
        : '反撃防止 待機'
      : itemAbility.kind === 'heal'
        ? itemHealing > 0
          ? `HP +${itemHealing}`
          : 'HP満タン'
        : itemAbility.kind === 'power'
          ? itemBonusDamage > 0
            ? `追加 +${itemBonusDamage}`
            : '威力UP 発動'
          : itemBlocked > 0
            ? '反撃を防止'
            : '使用済み'
  const itemSummary = !itemUsed
    ? '持ち込み・未使用'
    : itemAbility.kind === 'heal'
      ? `HPを${itemHealing}回復`
      : itemAbility.kind === 'power'
        ? `追加ダメージ ${itemBonusDamage}`
          : `反撃防止 ${itemBlocked}回`
  const themeSummary = themeAbility.kind === 'heal'
    ? `${themeAbility.name} ${themeActivations}回・HP回復 ${themeHealing}`
    : themeAbility.kind === 'guard'
      ? `${themeAbility.name} ${themeActivations}回・軽減 ${themeBlockedDamage}`
      : `${themeAbility.name} ${themeActivations}回・追加 ${themeBonusDamage}`
  const affinitySummary = teacherAffinity.active
    ? `${teacherAffinity.summary} 発動 ${affinityActivations}回・追加 ${affinityBonusDamage}`
    : teacherAffinity.summary
  const bondSummary = !activeBondSkill
    ? '同行特技 未解放'
    : activeBondSkill.kind === 'heal'
      ? `${activeBondSkill.name} ${bondActivations}回・HP回復 ${bondHealing}`
      : activeBondSkill.kind === 'guard'
        ? `${activeBondSkill.name} ${bondActivations}回・軽減 ${bondBlockedDamage}`
        : `${activeBondSkill.name} ${bondActivations}回・追加 ${bondBonusDamage}`

  return {
    tacticId: tactic.id,
    themeId: battleTheme.id,
    battleTheme,
    themeAbility,
    themeActivations,
    themeHealing,
    themeBonusDamage,
    themeBlockedDamage,
    themeSummary,
    teacherAffinity,
    affinityActivations,
    affinityBonusDamage,
    affinitySummary,
    bondSkill: activeBondSkill,
    bondActivations,
    bondHealing,
    bondBonusDamage,
    bondBlockedDamage,
    bondSummary,
    answered: log.length,
    correct,
    misses,
    enemyHp,
    heroHp,
    heroCurrentHp,
    heroMaxHp: heroStats.maxHp,
    heroHealthPercent: Math.round((heroCurrentHp / heroStats.maxHp) * 100),
    enemyCurrentHp,
    enemyMaxHp: enemyStats.maxHp,
    enemyHealthPercent: Math.round((enemyCurrentHp / enemyStats.maxHp) * 100),
    heroStats,
    enemyStats,
    damageDealt,
    damageTaken,
    healingDone,
    complete: log.length >= safeTotal,
    enemyDefeated: enemyCurrentHp === 0,
    heroDefeated: heroCurrentHp === 0,
    streak,
    maxStreak,
    comboBursts,
    guardCharge,
    shields,
    protectedHits,
    counters,
    activations,
    status,
    summary,
    lastEvent,
    itemRelic,
    itemAbility,
    itemUsed,
    itemUsedAt: safeItemUsedAt,
    itemArmed,
    itemTriggered,
    itemStatus,
    itemSummary,
    itemBonusDamage,
    itemBlocked,
    itemHealing,
  }
}

export function encounterFor({
  level = 1,
  day = 0,
  enemyRankIndex = 0,
} = {}) {
  const chapter = chapterForLevel(level)
  const safeLevel = Math.max(1, Math.min(MAX_HERO_LEVEL, Math.floor(level) || 1))
  const isBoss = safeLevel === chapter.maxLevel
  const pool = chapter.enemies.length ? chapter.enemies : [chapter.boss]
  const index = positiveMod(
    Math.floor(day) + safeLevel * 7 + Math.floor(enemyRankIndex) * 11,
    pool.length,
  )
  const enemy = isBoss ? chapter.boss : pool[index]
  const teacher = isBoss ? TEACHER_RIVALS[enemy.id] : null
  const lineIndex = positiveMod(Math.floor(day) + safeLevel + index, ENCOUNTER_LINES.length)

  return {
    ...enemy,
    ...mobProfile(enemy.id),
    ...teacher,
    isBoss,
    chapterId: chapter.id,
    chapterNumber: chapter.number,
    chapterName: chapter.name,
    chapterEmoji: chapter.emoji,
    chapterGradient: chapter.gradient,
    intro: teacher?.intro ?? ENCOUNTER_LINES[lineIndex],
  }
}

export function battleVerdict(accuracy = 0) {
  const safe = Math.max(0, Math.min(1, Number(accuracy) || 0))
  if (safe >= 0.9) {
    return {
      id: 'legendary',
      emoji: '🏆',
      title: safe === 1 ? '完全勝利！' : '圧勝！',
      text: safe === 1
        ? '最後の一問まで正解。先生から特大の花まるをもらった！'
        : 'ほとんどの問題を正解し、教室じゅうから拍手が起こった。',
    }
  }
  if (safe >= 0.7) {
    return {
      id: 'victory',
      emoji: '💮',
      title: '勝利！',
      text: '積み重ねた正解で今日のチャレンジをクリア。覚えた言葉が確かな力になった。',
    }
  }
  if (safe >= 0.4) {
    return {
      id: 'draw',
      emoji: '📒',
      title: '互角の戦い',
      text: 'あと少しで合格ライン。ノートを見直して再挑戦すれば、次は押し切れそうだ。',
    }
  }
  return {
    id: 'retreat',
    emoji: '💡',
    title: '作戦を立て直そう',
    text: '今日は弱点を見つけられた。それだけでも大収穫。復習して、もう一度挑戦しよう。',
  }
}
