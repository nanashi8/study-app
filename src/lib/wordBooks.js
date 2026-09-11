// 単語帳＝マイ学習ノートの単語帳（learningNotebook.sets）。「マイ単語」もその1冊で、
// 名前の変更・並べ替え・削除・暗記・テスト・一覧確認のどれも、ほかの冊と同じに扱う。
// 冊の並びや語の数え方が画面ごとにずれないよう、ここだけで組み立てる。
import { getWord } from '../data/vocab.js'

const VOCAB_REF_PREFIX = 'vocab:'

export const wordBookRef = (wordId) => `${VOCAB_REF_PREFIX}${wordId}`

/** 単語帳に入っている英単語のID。熟語・文法などほかの教材の項目は数えない。 */
export function wordBookVocabIds(set) {
  return (Array.isArray(set?.refs) ? set.refs : [])
    .filter((ref) => typeof ref === 'string' && ref.startsWith(VOCAB_REF_PREFIX))
    .map((ref) => ref.slice(VOCAB_REF_PREFIX.length))
}

/**
 * 単語帳を、マイ学習ノートと同じ並び（利用者が並べ替えた順）で返す。ids は出題・一覧に出せる語だけ
 * （辞書から外れた語のIDが残っていても数えない。自作単語は引き当てられれば含める）。
 */
export function wordBooksFromState({ learningNotebook } = {}) {
  const resolvable = (id) => Boolean(getWord(id))
  const sets = Array.isArray(learningNotebook?.sets) ? learningNotebook.sets : []
  return sets.map((set) => ({
    id: set.id,
    title: set.title,
    ids: wordBookVocabIds(set).filter(resolvable),
    set,
  }))
}

export function findWordBook(state, bookId) {
  return wordBooksFromState(state).find((book) => book.id === bookId) ?? null
}
