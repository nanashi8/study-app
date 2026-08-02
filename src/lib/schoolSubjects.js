export const SCHOOL_SUBJECTS = Object.freeze([
  { id: 'japanese', name: '国語', emoji: '📝', area: 'humanities' },
  { id: 'english', name: '英語', emoji: '🔤', area: 'languages' },
  { id: 'mathematics', name: '数学', emoji: '➗', area: 'stem' },
  { id: 'physics', name: '物理', emoji: '🧲', area: 'stem' },
  { id: 'chemistry', name: '化学', emoji: '🧪', area: 'stem' },
  { id: 'biology', name: '生物', emoji: '🧬', area: 'stem' },
  { id: 'earth-science', name: '地学', emoji: '🌋', area: 'stem' },
  { id: 'geography', name: '地理', emoji: '🌏', area: 'humanities' },
  { id: 'japanese-history', name: '日本史', emoji: '🏯', area: 'humanities' },
  { id: 'world-history', name: '世界史', emoji: '🌐', area: 'humanities' },
  { id: 'classical-japanese', name: '古文', emoji: '📜', area: 'humanities' },
  { id: 'english-communication', name: '英コミュ', emoji: '🗣️', area: 'languages' },
])

export const SCHOOL_SUBJECT_NAMES = Object.freeze(
  SCHOOL_SUBJECTS.map((subject) => subject.name),
)

const SUBJECT_BY_NAME = new Map(
  SCHOOL_SUBJECTS.map((subject) => [subject.name, subject]),
)

export function schoolSubjectByName(name) {
  return SUBJECT_BY_NAME.get(name) ?? null
}
