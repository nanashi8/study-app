const portrait = (id, profile) => Object.freeze({ id, ...profile })

// 先生ごとの専用ベクターアイコン設計。OS絵文字に依存せず、髪型・眼鏡・
// 服色・氏名印・教科印の組み合わせで小さい表示でも人物を識別できるようにする。
export const TEACHER_PORTRAIT_PROFILES = Object.freeze({
  'grass-wolf': portrait('grass-wolf', {
    initial: '白', subjectMark: '英', hairStyle: 'bob', hair: '#3f2937',
    skin: '#f5c9a5', jacket: '#4f46e5', accent: '#818cf8', glasses: false,
  }),
  'forest-keeper': portrait('forest-keeper', {
    initial: '文', subjectMark: '国', hairStyle: 'short', hair: '#26352f',
    skin: '#edc19d', jacket: '#047857', accent: '#34d399', glasses: true,
  }),
  chronos: portrait('chronos', {
    initial: '角', subjectMark: '数', hairStyle: 'parted', hair: '#24324a',
    skin: '#e9bd98', jacket: '#0369a1', accent: '#38bdf8', glasses: true,
  }),
  leviathan: portrait('leviathan', {
    initial: '地', subjectMark: '地', hairStyle: 'ponytail', hair: '#173f4a',
    skin: '#f2c6a2', jacket: '#0f766e', accent: '#22d3ee', glasses: false,
  }),
  librarian: portrait('librarian', {
    initial: '火', subjectMark: '化', hairStyle: 'bun', hair: '#4a294f',
    skin: '#efc39e', jacket: '#7e22ce', accent: '#c084fc', glasses: true,
  }),
  'silent-dragon': portrait('silent-dragon', {
    initial: '響', subjectMark: '会', hairStyle: 'swept', hair: '#292342',
    skin: '#e7b994', jacket: '#6d28d9', accent: '#a78bfa', glasses: false,
  }),
  tempest: portrait('tempest', {
    initial: '速', subjectMark: '物', hairStyle: 'cropped', hair: '#452b23',
    skin: '#dca77f', jacket: '#c2410c', accent: '#fb923c', glasses: false,
  }),
  'nameless-king': portrait('nameless-king', {
    initial: '工', subjectMark: '学', hairStyle: 'rough', hair: '#30343b',
    skin: '#d9aa86', jacket: '#475569', accent: '#94a3b8', glasses: false,
    beard: true,
  }),
  'archive-angel': portrait('archive-angel', {
    initial: '彩', subjectMark: '生', hairStyle: 'long', hair: '#522646',
    skin: '#f3c3a4', jacket: '#be185d', accent: '#f472b6', glasses: false,
  }),
  'word-emperor': portrait('word-emperor', {
    initial: '鐘', subjectMark: '日', hairStyle: 'formal', hair: '#242b35',
    skin: '#dcb08e', jacket: '#9f1239', accent: '#fb7185', glasses: true,
  }),
  'endless-book': portrait('endless-book', {
    initial: '学', subjectMark: '世', hairStyle: 'silver', hair: '#d5d7df',
    skin: '#e3b995', jacket: '#854d0e', accent: '#fbbf24', glasses: true,
  }),
  'classical-ogura': portrait('classical-ogura', {
    initial: '小', subjectMark: '古', hairStyle: 'classic-bun', hair: '#392921',
    skin: '#f0c39f', jacket: '#92400e', accent: '#d97706', glasses: false,
  }),
})

export const TEACHER_PORTRAIT_IDS = Object.freeze(
  Object.keys(TEACHER_PORTRAIT_PROFILES),
)

const FALLBACK_TEACHER_PORTRAIT = portrait('faculty-fallback', {
  initial: '先', subjectMark: '科', hairStyle: 'short', hair: '#334155',
  skin: '#e9bd98', jacket: '#4f46e5', accent: '#818cf8', glasses: false,
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
