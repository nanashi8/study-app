import { BATTLE_STUDENTS } from './battleCast.js'
import { publicAssetUrl } from './publicAssetUrl.js'

export const CHARACTER_DAILY_VISUAL_MOMENTS = [
  {
    id: 'home-welcome',
    label: '家へようこそ',
    emoji: '🥤',
    outfitId: 'home',
    place: '自宅',
    interactionCue: '画面外の主人公へ、自分と同じ飲み物を差し出して迎える',
  },
  {
    id: 'home-cook',
    label: '一緒に料理',
    emoji: '🍳',
    outfitId: 'home',
    place: '自宅の台所',
    interactionCue: '一つの料理を一緒に仕上げるため、味見や材料を頼む',
  },
  {
    id: 'home-study',
    label: '同じ課題を解く',
    emoji: '🧩',
    outfitId: 'home',
    place: '自宅の机',
    interactionCue: '同じ盤面や課題を指し、次に置く物を主人公へ渡す',
  },
  {
    id: 'home-hobby',
    label: '趣味を手伝う',
    emoji: '🛠️',
    outfitId: 'home',
    place: '自宅の趣味スペース',
    interactionCue: '本人らしい一つの趣味を、主人公と同じ道具で進める',
  },
  {
    id: 'home-evening',
    label: '夜のひととき',
    emoji: '🌙',
    outfitId: 'home',
    place: '自宅の夜',
    interactionCue: '夜の一つの作業や休息へ、主人公を自然に誘う',
  },
  {
    id: 'home-welcome-seat',
    label: '席へどうぞ',
    emoji: '🍵',
    outfitId: 'home',
    place: '自宅の居間',
    interactionCue: '主人公の飲み物を置き、空いた座布団を示して迎える',
  },
  {
    id: 'home-cook-mix',
    label: '材料を混ぜる',
    emoji: '🥣',
    outfitId: 'home',
    place: '自宅の台所',
    interactionCue: '一つの料理を仕上げるため、混ぜながら次の材料を頼む',
  },
  {
    id: 'home-study-explain',
    label: '解き方を説明',
    emoji: '💡',
    outfitId: 'home',
    place: '自宅の机',
    interactionCue: '同じ課題の現在地を指し、次に使う駒を主人公へ示す',
  },
  {
    id: 'home-hobby-build',
    label: '一緒に組み立て',
    emoji: '🧰',
    outfitId: 'home',
    place: '自宅の趣味スペース',
    interactionCue: '本人らしい趣味の一工程を進め、主人公の担当箇所を示す',
  },
  {
    id: 'home-evening-plan',
    label: '次の予定を相談',
    emoji: '🗺️',
    outfitId: 'home',
    place: '自宅の夜',
    interactionCue: '次の友だち同士のお出かけ先を、二つの候補から相談する',
  },
  {
    id: 'home-welcome-plan',
    label: '今日の予定を広げる',
    emoji: '📦',
    outfitId: 'home',
    place: '自宅の居間',
    interactionCue: '友だちを招いた目的の道具を広げ、最初の工程へ誘う',
  },
  {
    id: 'home-cook-serve',
    label: 'できた料理を盛る',
    emoji: '🍽️',
    outfitId: 'home',
    place: '自宅の食卓',
    interactionCue: '完成した一つの料理を二人分に分け、主人公の席へ置く',
  },
  {
    id: 'home-study-review',
    label: '答えを見直す',
    emoji: '✅',
    outfitId: 'home',
    place: '自宅の机',
    interactionCue: '完成した課題を一緒に見直し、直す一か所を主人公へ示す',
  },
  {
    id: 'home-hobby-demo',
    label: 'やり方を見せる',
    emoji: '🪄',
    outfitId: 'home',
    place: '自宅の趣味スペース',
    interactionCue: '趣味の一手本を見せ、主人公用の同じ道具を指して交代する',
  },
  {
    id: 'home-evening-tidy',
    label: '一緒に片づけ',
    emoji: '🧺',
    outfitId: 'home',
    place: '自宅の夜',
    interactionCue: '同じ活動の道具だけを二つのトレーへ分け、片づけを頼む',
  },
  {
    id: 'weekend-walk',
    label: '休日を歩く',
    emoji: '🚶',
    outfitId: 'weekend',
    place: '休日のお出かけ先',
    interactionCue: '主人公のための空いた歩行スペースを残し、同じ道を示す',
  },
  {
    id: 'weekend-shop',
    label: '買い物で相談',
    emoji: '🛍️',
    outfitId: 'weekend',
    place: '休日の店',
    interactionCue: '同じ買い物について二つの候補を見せ、主人公へ選択を頼む',
  },
  {
    id: 'weekend-snack',
    label: 'おやつを分ける',
    emoji: '🍰',
    outfitId: 'weekend',
    place: '休日の休憩先',
    interactionCue: '一つのおやつを、画面外の主人公と分け合う',
  },
  {
    id: 'weekend-play',
    label: '一緒に遊ぶ',
    emoji: '🎮',
    outfitId: 'weekend',
    place: '休日の遊び場',
    interactionCue: '空いた二人目の場所や道具を示し、同じ遊びへ誘う',
  },
  {
    id: 'weekend-memory',
    label: '思い出を残す',
    emoji: '🌆',
    outfitId: 'weekend',
    place: '休日の思い出の場所',
    interactionCue: '空いた隣席や同じ景色を示し、主人公と余韻を分け合う',
  },
  {
    id: 'weekend-walk-route',
    label: '道を相談',
    emoji: '🧭',
    outfitId: 'weekend',
    place: '休日の散歩道',
    interactionCue: '地図と安全な歩道を交互に示し、主人公へ進む道を相談する',
  },
  {
    id: 'weekend-shop-gift',
    label: '友だちの贈り物選び',
    emoji: '🎁',
    outfitId: 'weekend',
    place: '休日の店',
    interactionCue: '別の友だちへ渡す実用品を二つ比べ、主人公へ意見を求める',
  },
  {
    id: 'weekend-snack-unpack',
    label: 'おやつを半分こ',
    emoji: '🍪',
    outfitId: 'weekend',
    place: '休日の公園',
    interactionCue: '普通量のおやつを同じ大きさに分け、主人公の席へ滑らせる',
  },
  {
    id: 'weekend-play-turn',
    label: '次は主人公の番',
    emoji: '🎲',
    outfitId: 'weekend',
    place: '休日の遊び場',
    interactionCue: '一つの遊びで自分の手番を終え、主人公側の駒を示して交代する',
  },
  {
    id: 'weekend-memory-timer',
    label: 'タイマー写真を準備',
    emoji: '📷',
    outfitId: 'weekend',
    place: '休日の展望場所',
    interactionCue: 'スマホを三脚へ置き、十分に離れた立ち位置を主人公へ示す',
  },
  {
    id: 'weekend-walk-discover',
    label: '寄り道を見つける',
    emoji: '🌿',
    outfitId: 'weekend',
    place: '休日の散歩道',
    interactionCue: '安全な歩道で一つの発見を指し、隣の空いた場所から見るよう誘う',
  },
  {
    id: 'weekend-shop-try',
    label: '使い心地を確認',
    emoji: '🛒',
    outfitId: 'weekend',
    place: '休日の店',
    interactionCue: '実用品を一つ試し、主人公用の比較見本を指して感想を求める',
  },
  {
    id: 'weekend-snack-rest',
    label: '休憩の席へ誘う',
    emoji: '🧃',
    outfitId: 'weekend',
    place: '休日の休憩先',
    interactionCue: '主人公の飲み物を空いた席へ置き、普通の休憩へ誘う',
  },
  {
    id: 'weekend-play-cheer',
    label: '一緒の成功を喜ぶ',
    emoji: '🙌',
    outfitId: 'weekend',
    place: '休日の遊び場',
    interactionCue: '一つの協力ゲームの成功を、空いた二人目の操作席へ向けて喜ぶ',
  },
  {
    id: 'weekend-memory-keepsake',
    label: '思い出の印を残す',
    emoji: '🎟️',
    outfitId: 'weekend',
    place: '休日の思い出の場所',
    interactionCue: '友だち同士の外出ノートへ印を一つ残し、主人公の空欄を示す',
  },
]

const VISUAL_MOMENT_BY_ID = new Map(
  CHARACTER_DAILY_VISUAL_MOMENTS.map((moment) => [moment.id, moment]),
)

const CATEGORY_VISUAL_MOMENT = {
  surprise: 'weekend-memory-keepsake',
  school: 'home-study-review',
  study: 'home-study',
  'learning-technique': 'home-study-explain',
  'learning-advice': 'home-evening-plan',
  club: 'weekend-play-cheer',
  routine: 'home-evening-tidy',
  food: 'home-cook-mix',
  friends: 'weekend-snack-unpack',
  weekend: 'weekend-walk-route',
  summer: 'weekend-memory-timer',
  hobby: 'home-hobby',
  future: 'home-welcome-plan',
  home: 'home-welcome',
  family: 'home-cook-serve',
  room: 'home-hobby-build',
  chores: 'home-cook',
  appearance: 'weekend-shop-try',
  shopping: 'weekend-shop-gift',
  'digital-life': 'weekend-play-turn',
  evening: 'home-evening',
  neighborhood: 'weekend-walk-discover',
  money: 'weekend-shop',
  'self-care': 'weekend-snack-rest',
  feelings: 'weekend-memory',
  classroom: 'home-hobby-demo',
  events: 'weekend-play',
  seasons: 'weekend-snack',
  places: 'weekend-walk',
  'small-talk': 'home-welcome-seat',
}

export const CHARACTER_DAILY_VISUALS = BATTLE_STUDENTS.flatMap((student) => (
  CHARACTER_DAILY_VISUAL_MOMENTS.map((moment) => ({
    id: `${student.id}:${moment.id}`,
    studentId: student.id,
    sceneId: moment.id,
    image: publicAssetUrl(`/assets/battle/daily/${student.id}/${moment.id}.webp`),
    imageAlt: `${student.name}が${moment.place}で${moment.interactionCue}場面。主人公の手・姿・影・反射は描かれていない。`,
    label: moment.label,
    emoji: moment.emoji,
    outfitId: moment.outfitId,
    place: moment.place,
    interactionCue: moment.interactionCue,
    protagonistVisible: false,
  }))
))

export const CHARACTER_DAILY_VISUAL_COUNT = CHARACTER_DAILY_VISUALS.length

const VISUALS_BY_STUDENT = new Map(BATTLE_STUDENTS.map((student) => [
  student.id,
  CHARACTER_DAILY_VISUALS.filter((visual) => visual.studentId === student.id),
]))

export function characterDailyVisualsByStudent(studentId) {
  return VISUALS_BY_STUDENT.get(studentId) ?? []
}

export function characterDailyVisualById(studentId, sceneId) {
  return characterDailyVisualsByStudent(studentId)
    .find((visual) => visual.sceneId === sceneId)
    ?? characterDailyVisualsByStudent(studentId)[0]
}

export function characterDailyVisualForCategory(studentId, categoryId) {
  const sceneId = CATEGORY_VISUAL_MOMENT[categoryId]
    ?? CHARACTER_DAILY_VISUAL_MOMENTS[0].id
  return characterDailyVisualById(studentId, sceneId)
}

export function characterDailyVisualMomentById(sceneId) {
  return VISUAL_MOMENT_BY_ID.get(sceneId) ?? CHARACTER_DAILY_VISUAL_MOMENTS[0]
}
