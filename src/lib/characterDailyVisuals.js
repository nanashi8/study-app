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
]

const VISUAL_MOMENT_BY_ID = new Map(
  CHARACTER_DAILY_VISUAL_MOMENTS.map((moment) => [moment.id, moment]),
)

const CATEGORY_VISUAL_MOMENT = {
  surprise: 'weekend-memory',
  school: 'home-study',
  study: 'home-study',
  'learning-technique': 'home-study',
  'learning-advice': 'home-study',
  club: 'weekend-play',
  routine: 'home-evening',
  food: 'home-cook',
  friends: 'weekend-play',
  weekend: 'weekend-walk',
  summer: 'weekend-memory',
  hobby: 'home-hobby',
  future: 'weekend-memory',
  home: 'home-welcome',
  family: 'home-cook',
  room: 'home-hobby',
  chores: 'home-cook',
  appearance: 'weekend-shop',
  shopping: 'weekend-shop',
  'digital-life': 'home-hobby',
  evening: 'home-evening',
  neighborhood: 'weekend-walk',
  money: 'weekend-shop',
  'self-care': 'home-evening',
  feelings: 'weekend-memory',
  classroom: 'home-study',
  events: 'weekend-play',
  seasons: 'weekend-walk',
  places: 'weekend-walk',
  'small-talk': 'home-welcome',
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
