// 単語帳＝「マイ単語」（いつもの1冊・保存先は myList）＋名前をつけた単語帳（learningNotebook.sets）。
// 暗記・テスト・一覧確認・名前の変更で、冊の並びや語の数え方がずれないよう、ここだけで組み立てる。
import { getWord } from '../data/vocab.js'

export const MY_WORDS_BOOK_ID = 'myList'
export const MY_WORDS_BOOK_TITLE = 'マイ単語'

const VOCAB_REF_PREFIX = 'vocab:'

export const wordBookRef = (wordId) => `${VOCAB_REF_PREFIX}${wordId}`

/** 名前をつけた単語帳（問題集）に入っている英単語のID。ほかの教材の項目は数えない。 */
export function wordBookVocabIds(set) {
  return (Array.isArray(set?.refs) ? set.refs : [])
    .filter((ref) => typeof ref === 'string' && ref.startsWith(VOCAB_REF_PREFIX))
    .map((ref) => ref.slice(VOCAB_REF_PREFIX.length))
}

/**
 * マイ単語を先頭に、作った順で並べる。ids は出題・一覧に出せる語だけ
 * （辞書から外れた語のIDが残っていても数えない。自作単語は引き当てられれば含める）。
 * 名前を変えられるのは名前をつけた単語帳だけ。マイ単語は長文・辞書などの保存先の名前なので固定。
 */
export function wordBooksFromState({ myList = [], learningNotebook } = {}) {
  const resolvable = (id) => Boolean(getWord(id))
  const sets = Array.isArray(learningNotebook?.sets) ? learningNotebook.sets : []
  return [
    {
      id: MY_WORDS_BOOK_ID,
      title: MY_WORDS_BOOK_TITLE,
      ids: (Array.isArray(myList) ? myList : []).filter(resolvable),
      set: null,
      renamable: false,
    },
    ...sets.map((set) => ({
      id: set.id,
      title: set.title,
      ids: wordBookVocabIds(set).filter(resolvable),
      set,
      renamable: true,
    })),
  ]
}

export function findWordBook(state, bookId) {
  return wordBooksFromState(state).find((book) => book.id === bookId) ?? null
}
