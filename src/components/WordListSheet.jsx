import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { NOTEBOOK_LIMITS } from '../lib/learningNotebook.js'
import {
  MY_WORDS_BOOK_TITLE,
  wordBookRef,
  wordBookVocabIds,
  wordBooksFromState,
} from '../lib/wordBooks.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { Check, Gear, Plus } from './Icons.jsx'

// 単語帳は「マイ単語」（いつもの1冊）と、名前をつけて作る単語帳をまとめた呼び名。
// マイ単語は長文・辞書・写真の読み取りなどアプリ全体の保存先（myList）のまま残し、
// 名前つきの単語帳は learningNotebook.sets（マイ学習ノートの「単語帳」タブと同じもの）を使う。
// どちらも新しい保存領域を作らないので、進捗コード・クラウド同期はこれまでどおり。
const DOMAIN = 'vocab'

/** その語がどれか1冊にでも入っているか。カードの「単語帳」ボタンの塗りに使う。 */
export function useWordInAnyBook(wordId) {
  return useStore((state) => Boolean(wordId) && (
    state.myList.includes(wordId)
    || state.learningNotebook.sets.some((set) => set.refs.includes(wordBookRef(wordId)))
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
  const ref = wordBookRef(wordId)

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
          作った単語帳は、マイ学習ノートの「単語帳」にも並びます。
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
            const count = wordBookVocabIds(set).length
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

/**
 * 単語画面のショートカットから開く単語帳の一覧。
 * 冊ごとに暗記・テスト・一覧確認を始められ、名前をつけた単語帳はその場で名前を変えられる。
 */
export function WordBookStudySheet({ open, onClose, returnTo = { screen: 'vocabLevels' } }) {
  const myList = useStore((store) => store.myList)
  const learningNotebook = useStore((store) => store.learningNotebook)
  const navigate = useStore((store) => store.navigate)
  const recordNotebookSetLaunch = useStore((store) => store.recordNotebookSetLaunch)
  const updateNotebookSet = useStore((store) => store.updateNotebookSet)
  // 名前を変えている途中の単語帳。{ id, title } で、閉じるたびに破棄する一時状態。
  const [renaming, setRenaming] = useState(null)

  const books = wordBooksFromState({ myList, learningNotebook })

  const close = () => {
    setRenaming(null)
    onClose?.()
  }

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
    close()
    navigate(mode === 'study' ? 'vocabStudy' : 'vocabQuiz', {
      source: { type: 'mylist', ids: book.ids },
      title: book.title,
      mode,
      returnTo,
    })
  }

  // 級の一覧確認と同じ画面で、その冊の語を左右スワイプで確認する。
  const openList = (book) => {
    if (!book.ids.length) return
    close()
    navigate('vocabDecks', { wordBookId: book.id })
  }

  const saveRename = () => {
    const title = renaming?.title.trim()
    if (!renaming || !title) return
    updateNotebookSet(renaming.id, { title })
    setRenaming(null)
  }

  return (
    <Sheet open={open} onClose={close} title="単語帳">
      <div className="space-y-3 pb-2" data-word-book-study-sheet>
        <ul className="space-y-2">
          {books.map((book) => {
            const editing = renaming?.id === book.id
            return (
              <li
                key={book.id}
                className="rounded-2xl bg-white p-3 ring-1 ring-brand-100"
                data-word-book-id={book.id}
              >
                {editing ? (
                  <div className="flex items-center gap-1.5" data-word-book-rename>
                    <input
                      value={renaming.title}
                      onChange={(event) => setRenaming({ ...renaming, title: event.target.value })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') saveRename()
                        if (event.key === 'Escape') setRenaming(null)
                      }}
                      maxLength={NOTEBOOK_LIMITS.setTitleLength}
                      aria-label="単語帳の新しい名前"
                      autoFocus
                      data-word-book-rename-input
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-bold text-ink outline-none focus:border-brand-500"
                    />
                    <Button size="sm" onClick={saveRename} disabled={!renaming.title.trim()}>
                      保存
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setRenaming(null)}>
                      やめる
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate font-display text-base font-extrabold text-ink">
                      {book.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="text-xs font-extrabold tabular-nums text-ink/45">
                        {book.ids.length}語
                      </span>
                      {/* 名前つきの単語帳は、歯車からその場で名前を変えられる。 */}
                      {book.renamable && (
                        <button
                          type="button"
                          onClick={() => setRenaming({ id: book.id, title: book.title })}
                          aria-label={`${book.title}の名前を変更`}
                          title="名前を変更"
                          data-word-book-rename-button
                          className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-ink/60 active:bg-slate-200"
                        >
                          <Gear size={18} />
                        </button>
                      )}
                    </span>
                  </div>
                )}
                {!book.renamable && (
                  <p className="mt-0.5 text-[10px] font-bold text-ink/40">
                    長文や辞書からの保存先なので、名前は変えられません。
                  </p>
                )}
                <div className="mt-2 grid grid-cols-3 gap-2">
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
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!book.ids.length}
                    onClick={() => openList(book)}
                    aria-label={`${book.title}の単語を一覧で確認する`}
                    data-word-book-catalog
                  >
                    一覧で確認
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
        <p className="text-[11px] font-bold leading-relaxed text-ink/45">
          単語帳は、単語カードや辞書ページの「単語帳」ボタンから作れます。
        </p>
        <Button
          full
          size="sm"
          variant="secondary"
          onClick={() => {
            close()
            navigate('myList')
          }}
        >
          マイ学習ノートで単語帳を編集
        </Button>
      </div>
    </Sheet>
  )
}
