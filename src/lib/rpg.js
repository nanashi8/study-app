// 学習XPを、下がらない「冒険者LV 1〜99」へ変換する純ロジック。
// 英検級に応じて上下する適応難易度（adaptive.js）とは別軸にすることで、
// 苦手な問題で敵ランクが下がっても、これまでの努力は失われない。

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
  { level: 1, name: '見習いの旅人', emoji: '🌱' },
  { level: 10, name: 'ことばの探索者', emoji: '🧭' },
  { level: 20, name: '記憶の森番', emoji: '🌲' },
  { level: 30, name: '知識の航海士', emoji: '⛵' },
  { level: 40, name: '文法の魔導士', emoji: '🔮' },
  { level: 50, name: '語彙の騎士', emoji: '⚔️' },
  { level: 60, name: '読解の賢者', emoji: '📜' },
  { level: 70, name: '不屈の冒険者', emoji: '🔥' },
  { level: 80, name: '天空の書記官', emoji: '🪽' },
  { level: 90, name: '言葉の守護者', emoji: '🛡️' },
  { level: 99, name: 'ことばマスター', emoji: '👑' },
]

export const RELICS = [
  {
    level: 1,
    name: '旅人のしおり',
    emoji: '🔖',
    text: '最初の一歩を記すしおり',
    slot: 'charm',
    stats: { maxHp: 4 },
  },
  {
    level: 5,
    name: '集中の羽根ペン',
    emoji: '🪶',
    text: '迷いを一行ずつほどく羽根ペン',
    slot: 'weapon',
    stats: { attack: 2 },
  },
  {
    level: 10,
    name: '森番の単語帳',
    emoji: '📗',
    text: '覚えた言葉が淡く光る手帳',
    slot: 'offhand',
    stats: { maxHp: 8 },
  },
  {
    level: 15,
    name: '反復の小瓶',
    emoji: '🧪',
    text: '忘れかけた記憶を呼び戻す小瓶',
    slot: 'charm',
    stats: { defense: 2 },
  },
  {
    level: 20,
    name: '記憶樹の葉',
    emoji: '🍃',
    text: '積み重ねた復習の証',
    slot: 'aura',
    stats: { maxHp: 8 },
  },
  {
    level: 25,
    name: '旅路のコンパス',
    emoji: '🧭',
    text: '弱点の方角を示すコンパス',
    slot: 'charm',
    stats: { attack: 3 },
  },
  {
    level: 30,
    name: '青海の羅針盤',
    emoji: '🧿',
    text: '長い英文でも道を見失わない',
    slot: 'offhand',
    stats: { defense: 3 },
  },
  {
    level: 35,
    name: '静寂の耳飾り',
    emoji: '🎧',
    text: '小さな音の違いを聞き分ける',
    slot: 'head',
    stats: { defense: 3 },
  },
  {
    level: 40,
    name: '構文の水晶',
    emoji: '💎',
    text: '文の骨組みを映し出す水晶',
    slot: 'offhand',
    stats: { attack: 4 },
  },
  {
    level: 45,
    name: 'ひらめきの鍵',
    emoji: '🗝️',
    text: '難問への入口を開く鍵',
    slot: 'charm',
    stats: { attack: 4 },
  },
  {
    level: 50,
    name: '語彙騎士の剣',
    emoji: '🗡️',
    text: '知っている言葉を力へ変える剣',
    slot: 'weapon',
    stats: { attack: 6 },
  },
  {
    level: 55,
    name: '連続のマント',
    emoji: '🧣',
    text: '毎日の歩みを守る旅装',
    slot: 'aura',
    stats: { maxHp: 12 },
  },
  {
    level: 60,
    name: '賢者の巻物',
    emoji: '📜',
    text: '長文の要点が浮かぶ巻物',
    slot: 'weapon',
    stats: { attack: 6 },
  },
  {
    level: 65,
    name: '発音の音叉',
    emoji: '🎵',
    text: '声の響きを整える音叉',
    slot: 'charm',
    stats: { defense: 4 },
  },
  {
    level: 70,
    name: '不屈の灯火',
    emoji: '🏮',
    text: '間違えても消えない灯火',
    slot: 'aura',
    stats: { maxHp: 16 },
  },
  {
    level: 75,
    name: '星読みの地図',
    emoji: '🗺️',
    text: '次に学ぶべき場所を示す地図',
    slot: 'offhand',
    stats: { attack: 6 },
  },
  {
    level: 80,
    name: '天空図書の羽',
    emoji: '🪽',
    text: '知識の階段を軽やかに上る羽',
    slot: 'head',
    stats: { maxHp: 20 },
  },
  {
    level: 85,
    name: '時戻しの砂',
    emoji: '⏳',
    text: '復習の好機を逃さない砂時計',
    slot: 'charm',
    stats: { defense: 6 },
  },
  {
    level: 90,
    name: '守護者の盾',
    emoji: '🛡️',
    text: '難しい問題にも向き合える盾',
    slot: 'offhand',
    stats: { defense: 8 },
  },
  {
    level: 95,
    name: '王城の古辞書',
    emoji: '📕',
    text: '長い旅で集めた言葉の記録',
    slot: 'weapon',
    stats: { attack: 10 },
  },
  {
    level: 99,
    name: 'ことばの王冠',
    emoji: '👑',
    text: 'LV99へ到達した冒険者の証',
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
    name: 'はじまりの草原',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg,#064e3b,#0f766e 52%,#2563eb)',
    story: '消えた「ことばの種」を探し、朝露の街道へ踏み出す。',
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
    name: 'こだまの霧森',
    emoji: '🌲',
    gradient: 'linear-gradient(135deg,#052e16,#166534 52%,#0f766e)',
    story: '似た意味の声がこだまする森で、本物の答えを聞き分ける。',
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
    name: '時忘れの時計塔',
    emoji: '🕰️',
    gradient: 'linear-gradient(135deg,#172554,#1e40af 52%,#0891b2)',
    story: 'ばらばらになった時制の歯車を、正しい順序へ戻していく。',
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
    name: '群青のことば海',
    emoji: '🌊',
    gradient: 'linear-gradient(135deg,#082f49,#0369a1 52%,#4f46e5)',
    story: '長文の波を読み、失われた一文を載せた船を追う。',
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
    name: '水晶の大図書館',
    emoji: '🔮',
    gradient: 'linear-gradient(135deg,#2e1065,#6d28d9 52%,#4f46e5)',
    story: '文法の水晶に閉じ込められた、千の例文を解き放つ。',
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
    name: '星降る航路',
    emoji: '🌠',
    gradient: 'linear-gradient(135deg,#0f172a,#4338ca 52%,#7e22ce)',
    story: '音だけで光る星を頼りに、夜空の航路を進む。',
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
    name: '雷鳴の連峰',
    emoji: '⛰️',
    gradient: 'linear-gradient(135deg,#422006,#b45309 52%,#be123c)',
    story: '一瞬のひらめきをつなぎ、雷より速く山頂を目指す。',
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
    name: '虚ろの空中城',
    emoji: '🏰',
    gradient: 'linear-gradient(135deg,#18181b,#52525b 52%,#7c3aed)',
    story: '選ばなかった答えがささやく城で、自分の判断を貫く。',
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
    name: '天空の記憶書庫',
    emoji: '☁️',
    gradient: 'linear-gradient(135deg,#0c4a6e,#0284c7 52%,#7c3aed)',
    story: 'これまで覚えた言葉が、本棚の星座になって空へ続く。',
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
    name: 'ことばの王城',
    emoji: '🏯',
    gradient: 'linear-gradient(135deg,#450a0a,#be123c 52%,#7c2d12)',
    story: 'すべての章で得た知識を携え、最後の門へ挑む。',
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
    name: '語彙王の玉座',
    emoji: '👑',
    gradient: 'linear-gradient(135deg,#713f12,#d97706 52%,#be123c)',
    story: 'LV99の先にあるのは終わりではない。知識を磨く新しい周回の始まり。',
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
  '行く手の文字がざわめき、影がゆっくりと形をとった。',
  '忘れかけた言葉をまとい、敵が道をふさいでいる。',
  '遠くで鐘が鳴る。今夜の一戦が始まろうとしている。',
  'ページをめくる風の中から、新たな挑戦者が現れた。',
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
    label: '偵察戦',
    emoji: '🗡️',
    size: 5,
    minutes: '約2分',
    description: 'すきま時間で5問',
  },
  {
    id: 'duel',
    label: '討伐戦',
    emoji: '⚔️',
    size: 10,
    minutes: '約4分',
    description: '標準の10問バトル',
  },
  {
    id: 'expedition',
    label: '総力戦',
    emoji: '🏹',
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
    label: '連撃',
    name: '連撃の型',
    emoji: '🔥',
    short: '3連続で奥義',
    description: '3問連続で正解するたび、必殺の連撃が発動。最大コンボに挑戦。',
  },
  {
    id: 'guard',
    label: '守護',
    name: '守護の型',
    emoji: '🛡️',
    short: '2正解で盾',
    description: '2問正解するたびに盾を1枚獲得。次のミスによる反撃を防ぐ。',
  },
  {
    id: 'counter',
    label: '逆転',
    name: '逆転の型',
    emoji: '⚡',
    short: 'ミス後に反撃',
    description: 'ミスの直後に正解するとカウンターが発動し、失ったHPを回復。',
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
    emoji: '⚔️',
    label: 'YOUR TURN',
    title: '次の一手を選ぶ',
    actor: 'hero',
    target: null,
  },
  hit: {
    emoji: '⚔️',
    label: 'HIT!',
    title: '攻撃成功',
    actor: 'hero',
    target: 'enemy',
  },
  burst: {
    emoji: '🔥',
    label: 'COMBO!',
    title: '奥義発動',
    actor: 'hero',
    target: 'enemy',
  },
  shield: {
    emoji: '🛡️',
    label: 'SHIELD UP',
    title: '守りを展開',
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
    emoji: '⚡',
    label: 'COUNTER!',
    title: '逆転反撃',
    actor: 'hero',
    target: 'enemy',
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
} = {}) {
  const tactic = battleTactic(tacticId)
  const log = (Array.isArray(answers) ? answers : []).filter(
    (answer) => answer === 'correct' || isMiss(answer),
  ).slice(0, Math.max(1, Math.floor(Number(total) || 1)))
  const safeTotal = Math.max(1, Math.floor(Number(total) || 1))
  const heroStats = heroBattleStats(heroLevel)
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

  for (const [turnIndex, answer] of log.entries()) {
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
          title: `${streak}連撃！ 奥義が発動`,
        }
      } else if (tactic.id === 'guard') {
        guardCharge += 1
        if (guardCharge === 2) {
          guardCharge = 0
          shields += 1
          lastEvent = {
            kind: 'shield',
            emoji: '🛡️',
            title: '守護シールドを1枚獲得！',
          }
        } else {
          lastEvent = { kind: 'hit', emoji: '⚔️', title: '敵に一撃！' }
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
          emoji: '⚡',
          title: '逆転カウンター！ HPも回復',
          healing,
        }
      } else {
        lastEvent = { kind: 'hit', emoji: '⚔️', title: '敵に一撃！' }
      }

      const multiplier =
        lastEvent.kind === 'burst'
          ? 1.5
          : lastEvent.kind === 'counter'
            ? 1.25
            : 1
      let damage = Math.max(
        1,
        Math.round(
          Math.max(1, heroStats.attack - enemyStats.defense) * multiplier,
        ),
      )
      // コンボを選ばない作戦でも、全問正解の最終問は残りHPを削り切る。
      if (finalTurn && correct === safeTotal) damage = enemyCurrentHp
      const minimumHp = finalTurn ? 0 : 1
      const appliedDamage = Math.min(
        damage,
        Math.max(0, enemyCurrentHp - minimumHp),
      )
      enemyCurrentHp -= appliedDamage
      damageDealt += appliedDamage
      lastEvent.damage = appliedDamage
      previousWasMiss = false
      continue
    }

    streak = 0
    previousWasMiss = true
    if (tactic.id === 'guard' && shields > 0) {
      shields -= 1
      protectedHits += 1
      lastEvent = {
        kind: 'block',
        emoji: '🛡️',
        title: 'シールドで反撃を完全ガード！',
        damage: 0,
      }
    } else {
      heroDamage += 1
      const damage = enemyStats.normalDamage
      const minimumHp = finalTurn ? 0 : 1
      const appliedDamage = Math.min(
        damage,
        Math.max(0, heroCurrentHp - minimumHp),
      )
      heroCurrentHp -= appliedDamage
      damageTaken += appliedDamage
      lastDamageTaken = appliedDamage
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
            title: '反撃を受けた…次の一手へ',
            damage: appliedDamage,
          }
    }
  }

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
      ? `盾 ${shields}枚 · 次の反撃を防ぐ`
      : `シールド ${guardCharge}/2`
    summary = `完全ガード ${protectedHits}回・盾 ${shields}枚`
    activations = protectedHits
  } else if (tactic.id === 'counter') {
    status = previousWasMiss
      ? 'COUNTER READY · 次の正解で回復'
      : `カウンター ${counters}回`
    summary = `逆転カウンター ${counters}回・HP回復 ${counters}回`
    activations = counters
  } else {
    const comboStep = streak % 3
    status = comboStep
      ? `${streak} COMBO · あと${3 - comboStep}問で奥義`
      : comboBursts
        ? `奥義 ${comboBursts}回 · 次の3連撃へ`
        : '0 COMBO · 3連続で奥義'
    summary = `奥義 ${comboBursts}回・最大 ${maxStreak}連撃`
    activations = comboBursts
  }

  return {
    tacticId: tactic.id,
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
  const lineIndex = positiveMod(Math.floor(day) + safeLevel + index, ENCOUNTER_LINES.length)

  return {
    ...enemy,
    ...mobProfile(enemy.id),
    isBoss,
    chapterId: chapter.id,
    chapterNumber: chapter.number,
    chapterName: chapter.name,
    chapterEmoji: chapter.emoji,
    chapterGradient: chapter.gradient,
    intro: ENCOUNTER_LINES[lineIndex],
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
        ? '最後の一問まで正解し、敵のHPをきれいに削り切った。'
        : 'ほとんどの攻撃を決めて敵を退けた。街に新しい噂が広がっていく。',
    }
  }
  if (safe >= 0.7) {
    return {
      id: 'victory',
      emoji: '⚔️',
      title: '勝利！',
      text: '積み重ねた正解で敵を退けた。覚えた言葉が、確かな力に変わった。',
    }
  }
  if (safe >= 0.4) {
    return {
      id: 'draw',
      emoji: '🛡️',
      title: '互角の戦い',
      text: '敵は霧の向こうへ退いた。復習して再戦すれば、次は押し切れそうだ。',
    }
  }
  return {
    id: 'retreat',
    emoji: '🔥',
    title: '作戦を立て直そう',
    text: '今日は偵察まで。それでも得たXPと見つけた弱点は、次の勝利につながる。',
  }
}
