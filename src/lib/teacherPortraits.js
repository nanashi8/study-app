import { publicAssetUrl } from './publicAssetUrl.js'

const portrait = (id, file, accent) => Object.freeze({
  id,
  file,
  src: publicAssetUrl(`/assets/battle/teachers/${file}`),
  standing: publicAssetUrl(`/assets/battle/standing/teachers/${id}.png`),
  accent,
})

// 学校生活・対決準備・対決中・結果で同じ立ち絵を使い、先生の人物像をつなぐ。
// 保存済みデータとの互換性のためIDは変更せず、画像だけを先生ごとの専用ビジュアルへ置き換える。
export const TEACHER_PORTRAIT_PROFILES = Object.freeze({
  'grass-wolf': portrait('grass-wolf', 'shiraishi.webp', '#818cf8'),
  'forest-keeper': portrait('forest-keeper', 'fuzuki.webp', '#34d399'),
  chronos: portrait('chronos', 'tsunoda.webp', '#38bdf8'),
  leviathan: portrait('leviathan', 'chizuno.webp', '#22d3ee'),
  librarian: portrait('librarian', 'hino.webp', '#c084fc'),
  'silent-dragon': portrait('silent-dragon', 'hibiki.webp', '#a78bfa'),
  tempest: portrait('tempest', 'hayami.webp', '#fb923c'),
  'nameless-king': portrait('nameless-king', 'kudo.webp', '#94a3b8'),
  'archive-angel': portrait('archive-angel', 'aya.webp', '#f472b6'),
  'word-emperor': portrait('word-emperor', 'kanegae.webp', '#fb7185'),
  'endless-book': portrait('endless-book', 'gakuenzaka.webp', '#fbbf24'),
  'classical-ogura': portrait('classical-ogura', 'ogura.webp', '#d97706'),
})

export const TEACHER_PORTRAIT_IDS = Object.freeze(
  Object.keys(TEACHER_PORTRAIT_PROFILES),
)

// 追跡外の先生データが渡っても壊れた画像にせず、学校職員の既存ビジュアルを表示する。
const FALLBACK_TEACHER_PORTRAIT = Object.freeze({
  id: 'faculty-fallback',
  file: null,
  src: publicAssetUrl('/assets/battle/cast/rivals/counselor-madoka.webp'),
  standing: publicAssetUrl('/assets/battle/standing/rivals/counselor-madoka.png'),
  accent: '#818cf8',
})

export function teacherPortraitProfile(teacherOrId) {
  const id = typeof teacherOrId === 'string'
    ? teacherOrId
    : teacherOrId?.portraitId ?? teacherOrId?.teacherId ?? teacherOrId?.id
  return TEACHER_PORTRAIT_PROFILES[id] ?? FALLBACK_TEACHER_PORTRAIT
}

export function hasTeacherPortrait(teacherOrId) {
  const id = typeof teacherOrId === 'string'
    ? teacherOrId
    : teacherOrId?.portraitId ?? teacherOrId?.teacherId ?? teacherOrId?.id
  return Object.hasOwn(TEACHER_PORTRAIT_PROFILES, id)
}

export function teacherStandingSrc(teacherOrId) {
  return teacherPortraitProfile(teacherOrId).standing
}
