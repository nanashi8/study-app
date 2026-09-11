import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { NOTEBOOK_LIMITS } from '../lib/learningNotebook.js'
import {
  wordBookRef,
  wordBookVocabIds,
  wordBooksFromState,
} from '../lib/wordBooks.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { Check, ChevronDown, ChevronUp, Gear, Plus } from './Icons.jsx'

// 単語帳は、マイ学習ノートの「単語帳」（learningNotebook.sets）と同じもの。
// 「マイ単語」もその1冊で、入れる・外す・名前・並び順・削除のどれもほかの冊と同じに扱う。
// 新しい保存領域は作らないので、進捗コード・クラウド同期はこれまでどおり。
const DOMAIN = 'vocab'

/** その語がどれか1冊にでも入っているか。単語の「単語帳」ボタンの塗りに使う。 */
export function useWordInAnyBook(wordId) {
  return useStore((state) => Boolean(wordId)
    && state.learningNotebook.sets.some((set) => set.refs.includes(wordBookRef(wordId))))
}

/** まとめて入れる語（長文の全語など）が、どれも1冊以上の単語帳に入っているか。 */
export function useWordsInAnyBook(wordIds = []) {
  return useStore((state) => wordIds.length > 0 && wordIds.every((wordId) => (
    state.learningNotebook.sets.some((set) => set.refs.includes(wordBookRef(wordId)))
  )))
}

const bookDetail = (set) => {
  const count = wordBookVocabIds(set).length
  const others = set.refs.length - count
  return `英単語${count}語${others > 0 ? `・ほかの教材${others}項目` : ''}`
}

function BookRow({ title, detail, included, status, disabled, onClick, ...props }) {
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
      <span className="shrink-0 text-[10px] font-extrabold text-ink/45">{status}</span>
    </button>
  )
}

/**
 * 語を入れる単語帳を選ぶ。1語（wordId）でも、長文の全語などまとめて（wordIds）でも同じ窓を使う。
 * 冊を押すと入っていない語を入れ、全部入っている冊を押すとその語を外す。
 */
export function WordListSheet({ open, onClose, wordId, wordIds, wordLabel }) {
  const sets = useStore((store) => store.learningNotebook.sets)
  const createNotebookSet = useStore((store) => store.createNotebookSet)
  const setNotebookSetItems = useStore((store) => store.setNotebookSetItems)
  const navigate = useStore((store) => store.navigate)
  const [title, setTitle] = useState('')

  const ids = [...new Set((wordIds ?? (wordId ? [wordId] : [])).filter(Boolean))]
  const full = sets.length >= NOTEBOOK_LIMITS.sets

  const createAndAdd = () => {
    const clean = title.trim()
    if (!clean) return
    const setId = createNotebookSet(clean)
    if (setId && ids.length) setNotebookSetItems(setId, DOMAIN, ids, true)
    setTitle('')
  }

  return (
    <Sheet open={open} onClose={onClose} title="単語帳">
      <div className="space-y-3 pb-2" data-word-list-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {wordLabel
            ? `「${wordLabel}」を入れる単語帳を選びます。何冊に入れてもかまいません。`
            : '単語帳を作ります。'}
          単語帳は、マイ学習ノートの「単語帳」にも並びます。
        </p>

        {sets.length ? (
          <ul className="space-y-1.5">
            {sets.map((set) => {
              const present = ids.filter((id) => set.refs.includes(wordBookRef(id))).length
              const noRoom = set.refs.length >= NOTEBOOK_LIMITS.itemsPerSet
              const canAdd = present < ids.length && !noRoom
              // まだ入れられる語があれば入れる。もう入らない（全部入っている・冊がいっぱい）なら、入っている語を外す。
              const removes = present > 0 && !canAdd
              return (
                <li key={set.id}>
                  <BookRow
                    title={set.title}
                    detail={noRoom && present < ids.length
                      ? `${bookDetail(set)}・${NOTEBOOK_LIMITS.itemsPerSet}項目まで入っています`
                      : bookDetail(set)}
                    included={removes}
                    status={present === ids.length && ids.length > 0
                      ? '入っている'
                      : present > 0
                        ? `${present}/${ids.length}語が入っている`
                        : '入れる'}
                    disabled={!ids.length || (!canAdd && !removes)}
                    onClick={() => setNotebookSetItems(set.id, DOMAIN, ids, !removes)}
                    data-word-list-set-id={set.id}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold leading-relaxed text-ink/55" data-word-list-empty>
            まだ単語帳がありません。下で名前をつけて作ると、そのまま入れられます。
          </p>
        )}

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
            <Plus size={15} /> 作って{ids.length ? 'ここに入れる' : 'おく'}
          </Button>
          {full && (
            <p className="mt-1.5 text-[10px] font-bold text-ink/45">
              単語帳は{NOTEBOOK_LIMITS.sets}冊までです。使い終わった単語帳を消すと、また作れます。
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
 * 冊ごとに暗記・テスト・一覧確認を始められ、歯車から名前の変更・並び順・削除ができる（どの冊も同じ）。
 */
export function WordBookStudySheet({ open, onClose, returnTo = { screen: 'vocabLevels' } }) {
  const learningNotebook = useStore((store) => store.learningNotebook)
  const navigate = useStore((store) => store.navigate)
  const recordNotebookSetLaunch = useStore((store) => store.recordNotebookSetLaunch)
  const updateNotebookSet = useStore((store) => store.updateNotebookSet)
  const moveNotebookSet = useStore((store) => store.moveNotebookSet)
  const deleteNotebookSet = useStore((store) => store.deleteNotebookSet)
  // 歯車で開いている単語帳の設定。{ id, title, confirmDelete } で、閉じるたびに破棄する一時状態。
  const [editing, setEditing] = useState(null)

  const books = wordBooksFromState({ learningNotebook })

  const close = () => {
    setEditing(null)
    onClose?.()
  }

  const start = (book, mode) => {
    if (!book.ids.length) return
    recordNotebookSetLaunch({
      setId: book.id,
      setTitle: book.title,
      domain: DOMAIN,
      mode,
      count: book.ids.length,
    })
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

  const saveTitle = () => {
    const title = editing?.title.trim()
    if (!editing || !title) return
    updateNotebookSet(editing.id, { title })
  }

  const remove = (bookId) => {
    deleteNotebookSet(bookId)
    setEditing(null)
  }

  return (
    <Sheet open={open} onClose={close} title="単語帳">
      <div className="space-y-3 pb-2" data-word-book-study-sheet>
        {books.length ? (
          <ul className="space-y-2">
            {books.map((book, index) => {
              const settings = editing?.id === book.id ? editing : null
              return (
                <li
                  key={book.id}
                  className="rounded-2xl bg-white p-3 ring-1 ring-brand-100"
                  data-word-book-id={book.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate font-display text-base font-extrabold text-ink">
                      {book.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="text-xs font-extrabold tabular-nums text-ink/45">
                        {book.ids.length}語
                      </span>
                      {/* 名前・並び順・削除は、どの単語帳も冊ごとの歯車から変える。 */}
                      <button
                        type="button"
                        onClick={() => setEditing(settings
                          ? null
                          : { id: book.id, title: book.title, confirmDelete: false })}
                        aria-expanded={Boolean(settings)}
                        aria-label={`${book.title}の名前・並び順・削除`}
                        title="名前・並び順・削除"
                        data-word-book-settings-button
                        className={cx(
                          'grid h-11 w-11 place-items-center rounded-lg active:bg-slate-200',
                          settings ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-ink/60',
                        )}
                      >
                        <Gear size={18} />
                      </button>
                    </span>
                  </div>

                  {settings && (
                    <div className="mt-2 space-y-2.5 rounded-xl bg-slate-50 p-2.5" data-word-book-settings>
                      <div>
                        <span className="text-[10px] font-extrabold text-ink/55">名前</span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <input
                            value={settings.title}
                            onChange={(event) => setEditing({ ...settings, title: event.target.value })}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') saveTitle()
                            }}
                            maxLength={NOTEBOOK_LIMITS.setTitleLength}
                            aria-label="単語帳の名前"
                            data-word-book-rename-input
                            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-bold text-ink outline-none focus:border-brand-500"
                          />
                          <Button
                            size="sm"
                            onClick={saveTitle}
                            disabled={!settings.title.trim() || settings.title.trim() === book.title}
                          >
                            保存
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" data-word-book-order>
                        <span className="min-w-0 flex-1 text-[10px] font-extrabold text-ink/55">
                          並び順（{books.length}冊中{index + 1}番目）
                        </span>
                        <button
                          type="button"
                          onClick={() => moveNotebookSet(book.id, 'up')}
                          disabled={index === 0}
                          aria-label={`${book.title}を1つ上へ`}
                          data-word-book-move-up
                          className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink/70 ring-1 ring-slate-200 disabled:opacity-30"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveNotebookSet(book.id, 'down')}
                          disabled={index === books.length - 1}
                          aria-label={`${book.title}を1つ下へ`}
                          data-word-book-move-down
                          className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink/70 ring-1 ring-slate-200 disabled:opacity-30"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>

                      {settings.confirmDelete ? (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5" data-word-book-delete-confirm>
                          <p className="text-xs font-extrabold leading-relaxed text-rose-900">
                            「{book.title}」を削除しますか？ 単語の学習記録は残ります。
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditing({ ...settings, confirmDelete: false })}
                            >
                              やめる
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => remove(book.id)}>
                              削除
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditing({ ...settings, confirmDelete: true })}
                          data-word-book-delete
                          className="min-h-10 w-full rounded-lg text-xs font-extrabold text-rose-700 active:bg-rose-50"
                        >
                          この単語帳を削除
                        </button>
                      )}
                    </div>
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
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs font-bold text-ink/55" data-word-book-study-empty>
            まだ単語帳がありません。
          </p>
        )}
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
