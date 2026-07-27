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
  { level: 1, name: '旅人のしおり', emoji: '🔖', text: '最初の一歩を記すしおり' },
  { level: 5, name: '集中の羽根ペン', emoji: '🪶', text: '迷いを一行ずつほどく羽根ペン' },
  { level: 10, name: '森番の単語帳', emoji: '📗', text: '覚えた言葉が淡く光る手帳' },
  { level: 15, name: '反復の小瓶', emoji: '🧪', text: '忘れかけた記憶を呼び戻す小瓶' },
  { level: 20, name: '記憶樹の葉', emoji: '🍃', text: '積み重ねた復習の証' },
  { level: 25, name: '旅路のコンパス', emoji: '🧭', text: '弱点の方角を示すコンパス' },
  { level: 30, name: '青海の羅針盤', emoji: '🧿', text: '長い英文でも道を見失わない' },
  { level: 35, name: '静寂の耳飾り', emoji: '🎧', text: '小さな音の違いを聞き分ける' },
  { level: 40, name: '構文の水晶', emoji: '💎', text: '文の骨組みを映し出す水晶' },
  { level: 45, name: 'ひらめきの鍵', emoji: '🗝️', text: '難問への入口を開く鍵' },
  { level: 50, name: '語彙騎士の剣', emoji: '🗡️', text: '知っている言葉を力へ変える剣' },
  { level: 55, name: '連続のマント', emoji: '🧣', text: '毎日の歩みを守る旅装' },
  { level: 60, name: '賢者の巻物', emoji: '📜', text: '長文の要点が浮かぶ巻物' },
  { level: 65, name: '発音の音叉', emoji: '🎵', text: '声の響きを整える音叉' },
  { level: 70, name: '不屈の灯火', emoji: '🏮', text: '間違えても消えない灯火' },
  { level: 75, name: '星読みの地図', emoji: '🗺️', text: '次に学ぶべき場所を示す地図' },
  { level: 80, name: '天空図書の羽', emoji: '🪽', text: '知識の階段を軽やかに上る羽' },
  { level: 85, name: '時戻しの砂', emoji: '⏳', text: '復習の好機を逃さない砂時計' },
  { level: 90, name: '守護者の盾', emoji: '🛡️', text: '難しい問題にも向き合える盾' },
  { level: 95, name: '王城の古辞書', emoji: '📕', text: '長い旅で集めた言葉の記録' },
  { level: 99, name: 'ことばの王冠', emoji: '👑', text: 'LV99へ到達した冒険者の証' },
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

const isMiss = (answer) => answer === 'wrong' || answer === 'unknown'

// 正誤の並びから作戦の発動状況とHUD表示を再現する純ロジック。
// 一時中断から戻った場合も battleLog だけで同じ戦況を復元できる。
export function resolveBattleState({
  answers = [],
  total = 10,
  tacticId = 'combo',
} = {}) {
  const tactic = battleTactic(tacticId)
  const log = (Array.isArray(answers) ? answers : []).filter(
    (answer) => answer === 'correct' || isMiss(answer),
  )
  const safeTotal = Math.max(1, Math.floor(Number(total) || 1))
  const hitsToWin = Math.max(1, Math.ceil(safeTotal * 0.7))
  const missesToFall = Math.max(1, Math.ceil(safeTotal * 0.5))

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

  for (const answer of log) {
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
        lastEvent = {
          kind: 'counter',
          emoji: '⚡',
          title: '逆転カウンター！ HPも回復',
        }
      } else {
        lastEvent = { kind: 'hit', emoji: '⚔️', title: '敵に一撃！' }
      }
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
      }
    } else {
      heroDamage += 1
      lastEvent = answer === 'unknown'
        ? {
            kind: 'unknown',
            emoji: '🧭',
            title: '「わからない」を記録。次で立て直そう',
          }
        : {
            kind: 'damage',
            emoji: '💥',
            title: '反撃を受けた…次の一手へ',
          }
    }
  }

  const enemyHp = Math.max(0, 100 - Math.floor((correct / hitsToWin) * 100))
  const heroHp = Math.max(0, 100 - Math.floor((heroDamage / missesToFall) * 100))
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
    isBoss,
    chapterId: chapter.id,
    chapterName: chapter.name,
    chapterEmoji: chapter.emoji,
    intro: ENCOUNTER_LINES[lineIndex],
  }
}

export function battleVerdict(accuracy = 0) {
  const safe = Math.max(0, Math.min(1, Number(accuracy) || 0))
  if (safe >= 0.9) {
    return {
      id: 'legendary',
      emoji: '🏆',
      title: '完全勝利！',
      text: '鮮やかな連撃で敵を圧倒した。街に新しい噂が広がっていく。',
    }
  }
  if (safe >= 0.7) {
    return {
      id: 'victory',
      emoji: '⚔️',
      title: '討伐成功！',
      text: '最後の一撃が決まった。覚えた言葉が、確かな力に変わった。',
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
