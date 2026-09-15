import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../data/koten-grammar.js'
import { KOTEN_GRAMMAR_CHOICE_NOTES } from '../data/koten-grammar-choice-notes.js'

// 古典文法テストの選択肢1件ずつの説明。
// 文脈問題は台帳に書いた説明を使う。基礎問題（意味・接続・活用・形を問う）の選択肢は、
// どれもいずれかの文法項目の説明文そのものなので、その選択肢がどの項目のものかを示す。
const FOUNDATION_KEY_BY_FORMAT = Object.freeze({
  meaning: 'meaning',
  connection: 'connection',
  inflection: 'forms',
})
const FOUNDATION_ASPECT = Object.freeze({
  meaning: '意味・働き',
  connection: '接続',
  forms: '活用・形',
})

function foundationChoiceNote(question, choice) {
  const key = FOUNDATION_KEY_BY_FORMAT[question.format]
  const own = KOTEN_GRAMMAR_BY_ID[question.grammarIds?.[0]]
  if (!key || !own) return ''
  const aspect = FOUNDATION_ASPECT[key]
  if (choice === question.answer) return `${own.title}の${aspect}。`
  const owners = KOTEN_GRAMMAR.filter((item) => item.id !== own.id && item[key] === choice)
  if (!owners.length) return ''
  const names = owners.slice(0, 2).map((item) => item.title).join('、')
  return `${names}${owners.length > 2 ? 'など' : ''}の${aspect}。${own.title}の${aspect}ではない。`
}

export function kotenGrammarChoiceNoteFor(question, choice) {
  const written = KOTEN_GRAMMAR_CHOICE_NOTES[question?.id]?.[choice]
  if (written) return written
  return question?.style === 'foundation' ? foundationChoiceNote(question, choice) : ''
}
