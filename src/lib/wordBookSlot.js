// 単語帳ボタンの登録先（スロット）。画面下部の「単語帳」で選んだ1冊に、単語帳ボタンで入れる・外す。
// 登録先は learningNotebook.activeSetId に保存する（選んでいない・消したときは並びの先頭の冊）。
import {
  NOTEBOOK_DOMAIN_BY_ID,
  NOTEBOOK_LIMITS,
  activeNotebookSetId,
  parseNotebookRef,
} from './learningNotebook.js'

/** 登録先の冊。単語帳が1冊もなければ null。 */
export function activeWordBook(notebook) {
  const id = activeNotebookSetId(notebook)
  return id ? (notebook.sets.find((set) => set.id === id) ?? null) : null
}

/**
 * refs（「教材:ID」の並び）と登録先の関係。
 * inBook は、全部が登録先に入っているか（単語帳ボタンの塗り）。room は登録先にあと何項目入るか。
 */
export function wordBookSlotStatus(notebook, refs = []) {
  const unique = [...new Set((Array.isArray(refs) ? refs : []).filter((ref) => parseNotebookRef(ref)))]
  const book = activeWordBook(notebook)
  if (!book) return { book: null, refs: unique, present: 0, room: 0, inBook: false }
  const have = new Set(book.refs)
  const present = unique.filter((ref) => have.has(ref)).length
  return {
    book,
    refs: unique,
    present,
    room: Math.max(0, NOTEBOOK_LIMITS.itemsPerSet - book.refs.length),
    inBook: unique.length > 0 && present === unique.length,
  }
}

/**
 * 単語帳ボタンを押したときにすること。
 * remove（全部入っている → 外す）・add（入れる）・full（登録先が500項目でいっぱい）・noBook（単語帳がない）・none（入れる項目がない）。
 */
export function wordBookSlotAction(status) {
  if (!status.refs.length) return 'none'
  if (!status.book) return 'noBook'
  if (status.inBook) return 'remove'
  if (status.room <= 0) return 'full'
  return 'add'
}

// 項目の数え方（1つの教材ならその単位、教材をまたぐときは「項目」）。
function unitOf(refs) {
  const domains = [...new Set(refs.map((ref) => parseNotebookRef(ref)?.domain).filter(Boolean))]
  return domains.length === 1 ? NOTEBOOK_DOMAIN_BY_ID[domains[0]].unit : '項目'
}

/**
 * 押した結果を下部の「単語帳」に出す1行。label は押した項目の名前（1項目のとき）。
 * result は { action, bookTitle, requested, added, removed }（ストアの toggleWordBookSlot の戻り値）。
 */
export function wordBookSlotNotice(result, { label = '', refs = [] } = {}) {
  const unit = unitOf(refs)
  const name = refs.length === 1 && label ? label : `${refs.length}${unit}`
  const book = `「${result?.bookTitle ?? ''}」`
  // 下部の1行に収まるよう、入れた先と結果を先に書き、項目の名前は最後に添える。
  switch (result?.action) {
    case 'add':
      return result.added < result.requested
        ? `${book}に${result.added}${unit}入れました（${NOTEBOOK_LIMITS.itemsPerSet}項目まで）`
        : `${book}に入れました（${name}）`
    case 'remove':
      return `${book}から外しました（${name}）`
    case 'full':
      return `${book}は${NOTEBOOK_LIMITS.itemsPerSet}項目まで入っています`
    case 'noBook':
      return '単語帳がありません。作ると入れられます'
    default:
      return ''
  }
}
