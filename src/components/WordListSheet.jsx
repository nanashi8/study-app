import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { NOTEBOOK_DOMAIN_BY_ID, notebookRefs } from '../lib/learningNotebook.js'
import { wordBooksFromState } from '../lib/wordBooks.js'
import { wordBookCanStudy, wordBookLaunchTarget } from '../lib/wordBookLaunch.js'
import { CardSaveToggle } from './CardStudyControls.jsx'
import { Sheet } from './Sheet.jsx'
import {
  WordBookEditPanel,
  WordBookGearButton,
  useWordBookSlot,
  wordBookSlotButtonText,
  wordBookSlotLabel,
} from './WordBookSlot.jsx'
import { Button, cx } from './ui.jsx'
import { Bookmark, BookmarkFilled } from './Icons.jsx'

// 単語帳は、マイ学習ノートの「単語帳」（learningNotebook.sets）と同じもの。
// 「マイ単語」もその1冊で、入れる・外す・名前・並び順・削除のどれもほかの冊と同じに扱う。
// 英単語だけでなく、熟語・文法・リスニング・古典・漢文など、どの教材の項目も入れられる。
// 単語帳ボタンは、画面下部の「単語帳」で選んだ登録先の1冊へ入れる・外す（WordBookSlot.jsx）。
// 新しい保存領域は作らないので、進捗コード・クラウド同期はこれまでどおり（登録先は learningNotebook.activeSetId）。

/**
 * カード上部の「単語帳」ボタン。押すと、その項目を登録先（画面下部の「単語帳」で選んだ単語帳）に入れる。
 * もう一度押すと外す。単語・熟語・文法・リスニング・古典・漢文のどのカードでも、同じ見た目・同じ操作にする。
 */
export function WordBookToggle({ domain, itemId, itemLabel, className = '', ...props }) {
  const slot = useWordBookSlot(notebookRefs(domain, itemId ? [itemId] : []), { label: itemLabel })
  if (!itemId) return null
  return (
    <CardSaveToggle
      saved={slot.inBook}
      onToggle={slot.press}
      label="単語帳"
      savedLabel={wordBookSlotLabel({ itemLabel, bookTitle: slot.bookTitle, inBook: true })}
      unsavedLabel={wordBookSlotLabel({ itemLabel, bookTitle: slot.bookTitle, inBook: false })}
      data-word-book-toggle={domain}
      className={className}
      {...props}
    />
  )
}

/**
 * 一覧の説明などに置く、横長の「単語帳」ボタン。押すと、その項目を登録先の単語帳に入れる（もう一度押すと外す）。
 */
export function WordBookButton({ domain, itemId, itemLabel, className = '', ...props }) {
  const slot = useWordBookSlot(notebookRefs(domain, itemId ? [itemId] : []), { label: itemLabel })
  if (!itemId) return null
  return (
    <button
      type="button"
      onClick={slot.press}
      aria-pressed={slot.inBook}
      aria-label={wordBookSlotLabel({ itemLabel, bookTitle: slot.bookTitle, inBook: slot.inBook })}
      data-word-book-button={domain}
      {...props}
      className={cx(
        'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-extrabold',
        className,
      )}
    >
      {slot.inBook ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
      <span className="min-w-0 truncate">
        {wordBookSlotButtonText({ bookTitle: slot.bookTitle, inBook: slot.inBook })}
      </span>
    </button>
  )
}

/**
 * 単語帳の一覧から、1つの教材（domain）を冊ごとに学ぶ窓。単語画面や各コンテンツのトップの「単語帳」から開く。
 * 冊ごとに暗記・テスト・一覧確認を始められ、歯車から名前の変更・並び順・削除ができる（どの冊も同じ）。
 */
export function WordBookStudySheet({ open, onClose, returnTo = { screen: 'vocabLevels' }, domain = 'vocab' }) {
  const learningNotebook = useStore((store) => store.learningNotebook)
  const navigate = useStore((store) => store.navigate)
  const recordNotebookSetLaunch = useStore((store) => store.recordNotebookSetLaunch)
  // 歯車で開いている単語帳の設定。{ id, title, confirmDelete } で、閉じるたびに破棄する一時状態。
  const [editing, setEditing] = useState(null)

  const meta = NOTEBOOK_DOMAIN_BY_ID[domain] ?? NOTEBOOK_DOMAIN_BY_ID.vocab
  const canStudy = wordBookCanStudy(meta.id)
  const books = wordBooksFromState({ learningNotebook }, meta.id)

  const close = () => {
    setEditing(null)
    onClose?.()
  }

  const start = (book, mode) => {
    const target = wordBookLaunchTarget(meta.id, mode, book.ids, { title: book.title, returnTo })
    if (!target) return
    recordNotebookSetLaunch({
      setId: book.id,
      setTitle: book.title,
      domain: meta.id,
      mode: canStudy ? mode : 'quiz',
      count: book.ids.length,
    })
    close()
    navigate(target.screen, target.params)
  }

  // 英単語は級の一覧確認と同じ画面で左右スワイプしながら、ほかの教材はマイ学習ノートのその冊で確認する。
  const openList = (book) => {
    if (!book.ids.length) return
    close()
    if (meta.id === 'vocab') navigate('vocabDecks', { wordBookId: book.id })
    else navigate('myList', { tab: 'sets', setId: book.id })
  }

  return (
    <Sheet open={open} onClose={close} title="単語帳">
      <div className="space-y-3 pb-2" data-word-book-study-sheet={meta.id}>
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
                        {meta.id === 'vocab' ? '' : meta.label}{book.ids.length}{meta.unit}
                      </span>
                      {/* 名前・並び順・削除は、どの単語帳も冊ごとの歯車から変える（単語帳の設定と同じ部品）。 */}
                      <WordBookGearButton
                        book={book}
                        open={Boolean(settings)}
                        onClick={() => setEditing(settings
                          ? null
                          : { id: book.id, title: book.title, confirmDelete: false })}
                      />
                    </span>
                  </div>

                  {settings && (
                    <WordBookEditPanel
                      book={book}
                      index={index}
                      total={books.length}
                      editing={settings}
                      onEditing={setEditing}
                    />
                  )}

                  <div className={cx('mt-2 grid gap-2', canStudy ? 'grid-cols-3' : 'grid-cols-2')}>
                    {canStudy && (
                      <Button size="sm" disabled={!book.ids.length} onClick={() => start(book, 'study')}>
                        暗記
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant={canStudy ? 'secondary' : 'primary'}
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
                      aria-label={`${book.title}の${meta.id === 'vocab' ? '単語' : meta.label}を一覧で確認する`}
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
          単語帳は、暗記・テストのカードや辞書の「単語帳」ボタンから作れます。
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
