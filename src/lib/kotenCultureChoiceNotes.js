import { KOTEN_CULTURE } from '../data/koten-culture.js'
import { KOTEN_CULTURE_CHOICE_NOTES } from '../data/koten-culture-choice-notes.js'

// 古典常識テストの選択肢1件ずつの説明。
// 文脈問題は台帳に書いた説明を使う。基礎問題（用語と意味を結ぶ）の選択肢は、
// どれもいずれかの項目の説明文そのものなので、その選択肢がどの項目の説明かを示す。
function foundationChoiceNote(question, choice) {
  const own = KOTEN_CULTURE.find((item) => item.id === question.cultureIds?.[0])
  if (!own) return ''
  if (choice === question.answer) return `「${own.title}」の説明。`
  const owners = KOTEN_CULTURE.filter((item) => item.id !== own.id && item.core === choice)
  if (!owners.length) return ''
  return `${owners.map((item) => `「${item.title}」`).join('・')}の説明で、「${own.title}」の説明ではない。`
}

export function kotenCultureChoiceNoteFor(question, choice) {
  const written = KOTEN_CULTURE_CHOICE_NOTES[question?.id]?.[choice]
  if (written) return written
  return question?.style === 'foundation' ? foundationChoiceNote(question, choice) : ''
}
