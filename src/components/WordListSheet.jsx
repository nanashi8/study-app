import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getWord } from '../data/vocab.js'
import { NOTEBOOK_LIMITS } from '../lib/learningNotebook.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { Check, Plus } from './Icons.jsx'

// 単語帳は「マイ単語」（いつもの1冊）と、名前をつけて作る単語帳をまとめた呼び名。
// マイ単語は長文・辞書・写真の読み取りなどアプリ全体の保存先（myList）のまま残し、
// 名前つきの単語帳はマイ学習ノートの問題集（learningNotebook.sets）を使う。
// どちらも新しい保存領域を作らないので、進捗コード・クラウド同期はこれまでどおり。
const DOMAIN = 'vocab'
export const MY_WORDS_BOOK_TITLE = 'マイ単語'

const bookRef = (wordId) => `${DOMAIN}:${wordId}`

const vocabIdsOf = (set) => set.refs
  .filter((ref) => ref.startsWith(`${DOMAIN}:`))
  .map((ref) => ref.slice(DOMAIN.length + 1))

/** その語がどれか1冊にでも入っているか。カードの「単語帳」ボタンの塗りに使う。 */
export function useWordInAnyBook(wordId) {
  return useStore((state) => Boolean(wordId) && (
    state.myList.includes(wordId)
    || state.learningNotebook.sets.some((set) => set.refs.includes(bookRef(wordId)))
  ))
}

function BookRow({ title, detail, included, disabled, onClick, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={included}
      {...props}
      className={cx(
        'flex w-full min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left disabled:opacity-50',
        included ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white',
      )}
    >
      <span
        className={cx(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
          included ? 'bg-brand-600 text-white' : 'bg-slate-100 text-transparent',
        )}
        aria-hidden="true"
      >
        <Check size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm font-extrabold text-ink">{title}</span>
        <span className="block text-[10px] font-bold text-ink/45">{detail}</span>
      </span>
      <span className="shrink-0 text-[10px] font-extrabold text-ink/45">
        {included ? '入っている' : '入れる'}
      </span>
    </button>
  )
}

/** 1語を入れる単語帳を選ぶ。先頭がマイ単語、続いて名前をつけた単語帳。 */
export function WordListSheet({ open, onClose, wordId, wordLabel }) {
  const myList = useStore((store) => store.myList)
  const sets = useStore((store) => store.learningNotebook.sets)
  const toggleMyList = useStore((store) => store.toggleMyList)
  const createNotebookSet = useStore((store) => store.createNotebookSet)
  const setNotebookSetItem = useStore((store) => store.setNotebookSetItem)
  const navigate = useStore((store) => store.navigate)
  const [title, setTitle] = useState('')

  const full = sets.length >= NOTEBOOK_LIMITS.sets
  const ref = bookRef(wordId)

  const createAndAdd = () => {
    const clean = title.trim()
    if (!clean) return
    const setId = createNotebookSet(clean)
    if (setId && wordId) setNotebookSetItem(setId, DOMAIN, wordId, true)
    setTitle('')
  }

  return (
    <Sheet open={open} onClose={onClose} title="単語帳">
      <div className="space-y-3 pb-2" data-word-list-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {wordLabel
            ? `「${wordLabel}」を入れる単語帳を選びます。何冊に入れてもかまいません。`
            : '単語帳を作ります。'}
          名前をつけた単語帳は、マイ学習ノートの問題集と同じものです。
        </p>

        <ul className="space-y-1.5">
          <li>
            <BookRow
              title={MY_WORDS_BOOK_TITLE}
              detail={`いつもの単語帳・${myList.length}語`}
              included={myList.includes(wordId)}
              disabled={!wordId}
              onClick={() => toggleMyList(wordId)}
              data-word-list-my-words
            />
          </li>
          {sets.map((set) => {
            const count = vocabIdsOf(set).length
            const included = set.refs.includes(ref)
            return (
              <li key={set.id}>
                <BookRow
                  title={set.title}
                  detail={`英単語${count}語${set.refs.length > count ? `・ほかの教材${set.refs.length - count}項目` : ''}`}
                  included={included}
                  disabled={!wordId}
                  onClick={() => setNotebookSetItem(set.id, DOMAIN, wordId, !included)}
                  data-word-list-set-id={set.id}
                />
              </li>
            )
          })}
        </ul>

        <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
          <label className="block">
            <span className="text-[10px] font-extrabold text-ink/55">
              新しい単語帳の名前（最大{NOTEBOOK_LIMITS.setTitleLength}字）
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={NOTEBOOK_LIMITS.setTitleLength}
              disabled={full}
              placeholder="例：テスト範囲、苦手な語"
              data-word-list-new-title
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500 disabled:bg-slate-100"
            />
          </label>
          <Button
            full
            size="sm"
            className="mt-2"
            disabled={full || !title.trim()}
            onClick={createAndAdd}
          >
            <Plus size={15} /> 作って{wordLabel ? 'ここに入れる' : 'おく'}
          </Button>
          {full && (
            <p className="mt-1.5 text-[10px] font-bold text-ink/45">
              名前をつけた単語帳は{NOTEBOOK_LIMITS.sets}冊までです。使い終わった単語帳をマイ学習ノートで消すと、また作れます。
            </p>
          )}
        </div>

        <Button
          full
          size="sm"
          variant="secondary"
          onClick={() => {
            onClose?.()
            navigate('myList')
          }}
        >
          マイ学習ノートで単語帳を開く
        </Button>
      </div>
    </Sheet>
  )
}

/** 単語画面のショートカットから、学ぶ単語帳を選んで暗記・テストを始める。 */
export function WordBookStudySheet({ open, onClose, returnTo = { screen: 'vocabLevels' } }) {
  const myList = useStore((store) => store.myList)
  const sets = useStore((store) => store.learningNotebook.sets)
  const navigate = useStore((store) => store.navigate)
  const recordNotebookSetLaunch = useStore((store) => store.recordNotebookSetLaunch)

  // 辞書から外れた語のIDが残っていても、出題できる語だけを数えて出す。
  const books = [
    { id: 'myList', title: MY_WORDS_BOOK_TITLE, ids: myList.filter((id) => getWord(id)), set: null },
    ...sets.map((set) => ({
      id: set.id,
      title: set.title,
      ids: vocabIdsOf(set).filter((id) => getWord(id)),
      set,
    })),
  ]

  const start = (book, mode) => {
    if (!book.ids.length) return
    if (book.set) {
      recordNotebookSetLaunch({
        setId: book.set.id,
        setTitle: book.set.title,
        domain: DOMAIN,
        mode,
        count: book.ids.length,
      })
    }
    onClose?.()
    navigate(mode === 'study' ? 'vocabStudy' : 'vocabQuiz', {
      source: { type: 'mylist', ids: book.ids },
      title: book.title,
      mode,
      returnTo,
    })
  }

  return (
    <Sheet open={open} onClose={onClose} title="単語帳">
      <div className="space-y-3 pb-2" data-word-book-study-sheet>
        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book.id}
              className="rounded-2xl bg-white p-3 ring-1 ring-brand-100"
              data-word-book-id={book.id}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate font-display text-base font-extrabold text-ink">
                  {book.title}
                </span>
                <span className="shrink-0 text-xs font-extrabold tabular-nums text-ink/45">
                  {book.ids.length}語
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button size="sm" disabled={!book.ids.length} onClick={() => start(book, 'study')}>
                  暗記
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!book.ids.length}
                  onClick={() => start(book, 'quiz')}
                >
                  テスト
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[11px] font-bold leading-relaxed text-ink/45">
          単語帳は、単語カードや辞書ページの「単語帳」ボタンから作れます。
        </p>
        <Button
          full
          size="sm"
          variant="secondary"
          onClick={() => {
            onClose?.()
            navigate('myList')
          }}
        >
          マイ学習ノートで単語帳を編集
        </Button>
      </div>
    </Sheet>
  )
}
