import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  NOTEBOOK_DOMAIN_BY_ID,
  NOTEBOOK_LIMITS,
  notebookRefs,
  parseNotebookRef,
} from '../lib/learningNotebook.js'
import { wordBookRef, wordBooksFromState } from '../lib/wordBooks.js'
import { wordBookCanStudy, wordBookLaunchTarget } from '../lib/wordBookLaunch.js'
import { CardSaveToggle } from './CardStudyControls.jsx'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { Bookmark, BookmarkFilled, Check, ChevronDown, ChevronUp, Gear, Plus } from './Icons.jsx'

// 単語帳は、マイ学習ノートの「単語帳」（learningNotebook.sets）と同じもの。
// 「マイ単語」もその1冊で、入れる・外す・名前・並び順・削除のどれもほかの冊と同じに扱う。
// 英単語だけでなく、熟語・文法・リスニング・古典・漢文など、どの教材の項目も同じ窓で入れる。
// 新しい保存領域は作らないので、進捗コード・クラウド同期はこれまでどおり。

const anyBookHas = (state, ref) => state.learningNotebook.sets.some((set) => set.refs.includes(ref))

/** その項目がどれか1冊にでも入っているか。「単語帳」ボタンの塗りに使う。 */
export function useItemInAnyBook(domain, itemId) {
  const [ref] = notebookRefs(domain, itemId)
  return useStore((state) => Boolean(ref) && anyBookHas(state, ref))
}

/** その語がどれか1冊にでも入っているか。単語の「単語帳」ボタンの塗りに使う。 */
export function useWordInAnyBook(wordId) {
  return useItemInAnyBook('vocab', wordId)
}

/** まとめて入れる項目（「教材:ID」の並び）が、どれも1冊以上の単語帳に入っているか。 */
export function useRefsInAnyBook(refs = []) {
  return useStore((state) => refs.length > 0 && refs.every((ref) => anyBookHas(state, ref)))
}

/** まとめて入れる語（長文の全語など）が、どれも1冊以上の単語帳に入っているか。 */
export function useWordsInAnyBook(wordIds = []) {
  return useRefsInAnyBook(wordIds.map(wordBookRef))
}

// 冊に入っている項目を、教材ごとに数えて短く示す（多い順に2教材まで、残りは「ほか」でまとめる）。
function bookDetail(set) {
  const counts = new Map()
  for (const ref of set.refs) {
    const domain = parseNotebookRef(ref)?.domain
    if (domain) counts.set(domain, (counts.get(domain) ?? 0) + 1)
  }
  if (!counts.size) return 'まだ何も入っていません'
  const ranked = [...counts].sort((left, right) => right[1] - left[1])
  const shown = ranked.slice(0, 2).map(([domain, count]) => {
    const meta = NOTEBOOK_DOMAIN_BY_ID[domain]
    return `${meta.label}${count}${meta.unit}`
  })
  const rest = ranked.slice(2).reduce((sum, [, count]) => sum + count, 0)
  return rest > 0 ? `${shown.join('・')}・ほか${rest}項目` : shown.join('・')
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
 * 項目を入れる単語帳を選ぶ。1項目（itemId）でも、長文の全語などまとめて（itemIds）でも、
 * 教材をまたいでまとめて（refs＝「教材:ID」の並び）でも同じ窓を使う。英単語は wordId / wordIds でも渡せる。
 * 冊を押すと入っていない項目を入れ、全部入っている冊を押すとその項目を外す。
 */
export function WordListSheet({
  open,
  onClose,
  domain = 'vocab',
  itemId,
  itemIds,
  refs: givenRefs,
  label,
  wordId,
  wordIds,
  wordLabel,
}) {
  const sets = useStore((store) => store.learningNotebook.sets)
  const createNotebookSet = useStore((store) => store.createNotebookSet)
  const setNotebookSetRefs = useStore((store) => store.setNotebookSetRefs)
  const navigate = useStore((store) => store.navigate)
  const [title, setTitle] = useState('')

  const refs = givenRefs
    ? [...new Set(givenRefs.filter(Boolean))]
    : notebookRefs(domain, itemIds ?? wordIds ?? [itemId ?? wordId])
  const itemLabel = label ?? wordLabel
  // 1つの教材だけなら「3/5語」のようにその単位で、教材をまたぐときは「項目」で数える。
  const domains = [...new Set(refs.map((ref) => parseNotebookRef(ref)?.domain).filter(Boolean))]
  const unit = domains.length === 1 ? NOTEBOOK_DOMAIN_BY_ID[domains[0]].unit : '項目'
  const full = sets.length >= NOTEBOOK_LIMITS.sets

  const createAndAdd = () => {
    const clean = title.trim()
    if (!clean) return
    const setId = createNotebookSet(clean)
    if (setId && refs.length) setNotebookSetRefs(setId, refs, true)
    setTitle('')
  }

  return (
    <Sheet open={open} onClose={onClose} title="単語帳">
      <div className="space-y-3 pb-2" data-word-list-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {itemLabel
            ? `「${itemLabel}」を入れる単語帳を選びます。何冊に入れてもかまいません。`
            : '単語帳を作ります。'}
          単語帳は、マイ学習ノートの「単語帳」にも並びます。
        </p>

        {sets.length ? (
          <ul className="space-y-1.5">
            {sets.map((set) => {
              const present = refs.filter((ref) => set.refs.includes(ref)).length
              const noRoom = set.refs.length >= NOTEBOOK_LIMITS.itemsPerSet
              const canAdd = present < refs.length && !noRoom
              // まだ入れられる項目があれば入れる。もう入らない（全部入っている・冊がいっぱい）なら、入っている項目を外す。
              const removes = present > 0 && !canAdd
              return (
                <li key={set.id}>
                  <BookRow
                    title={set.title}
                    detail={noRoom && present < refs.length
                      ? `${bookDetail(set)}・${NOTEBOOK_LIMITS.itemsPerSet}項目まで入っています`
                      : bookDetail(set)}
                    included={removes}
                    status={present === refs.length && refs.length > 0
                      ? '入っている'
                      : present > 0
                        ? `${present}/${refs.length}${unit}が入っている`
                        : '入れる'}
                    disabled={!refs.length || (!canAdd && !removes)}
                    onClick={() => setNotebookSetRefs(set.id, refs, !removes)}
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
              placeholder="例：テスト範囲、苦手なところ"
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
            <Plus size={15} /> 作って{refs.length ? 'ここに入れる' : 'おく'}
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
 * カード上部の「単語帳」ボタン。押すと、その項目を入れる単語帳を選ぶ窓を開く。
 * 単語・熟語・文法・リスニング・古典・漢文のどのカードでも、同じ見た目・同じ操作にする。
 */
export function WordBookToggle({ domain, itemId, itemLabel, className = '', ...props }) {
  const [open, setOpen] = useState(false)
  const inBook = useItemInAnyBook(domain, itemId)
  if (!itemId) return null
  return (
    <>
      <CardSaveToggle
        saved={inBook}
        onToggle={() => setOpen(true)}
        label="単語帳"
        savedLabel={`${itemLabel}の単語帳を選ぶ（単語帳に入っています）`}
        unsavedLabel={`${itemLabel}を入れる単語帳を選ぶ`}
        aria-pressed={undefined}
        aria-haspopup="dialog"
        data-word-book-toggle={domain}
        className={className}
        {...props}
      />
      <WordListSheet
        open={open}
        onClose={() => setOpen(false)}
        domain={domain}
        itemId={itemId}
        label={itemLabel}
      />
    </>
  )
}

/**
 * 一覧の説明などに置く、横長の「単語帳」ボタン。押すと、その項目を入れる単語帳を選ぶ窓を開く。
 */
export function WordBookButton({ domain, itemId, itemLabel, className = '', ...props }) {
  const [open, setOpen] = useState(false)
  const inBook = useItemInAnyBook(domain, itemId)
  if (!itemId) return null
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-word-book-button={domain}
        {...props}
        className={cx(
          'flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-xs font-extrabold',
          className,
        )}
      >
        {inBook ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
        {inBook ? '単語帳に入っています（入れる冊を選ぶ）' : '単語帳に入れる'}
      </button>
      <WordListSheet
        open={open}
        onClose={() => setOpen(false)}
        domain={domain}
        itemId={itemId}
        label={itemLabel}
      />
    </>
  )
}

/**
 * 画面ごとの独自のボタンから、単語帳を選ぶ窓を開くとき用。
 * open(refs, label) で開き、返ってくる sheet を画面のどこかに置く。
 */
export function useWordBookPicker() {
  const [target, setTarget] = useState(null)
  const sheet = (
    <WordListSheet
      open={Boolean(target)}
      onClose={() => setTarget(null)}
      refs={target?.refs ?? []}
      label={target?.label}
    />
  )
  return { open: (refs, label) => setTarget({ refs, label }), sheet }
}

/**
 * 単語帳の一覧から、1つの教材（domain）を冊ごとに学ぶ窓。単語画面や各コンテンツのトップの「単語帳」から開く。
 * 冊ごとに暗記・テスト・一覧確認を始められ、歯車から名前の変更・並び順・削除ができる（どの冊も同じ）。
 */
export function WordBookStudySheet({ open, onClose, returnTo = { screen: 'vocabLevels' }, domain = 'vocab' }) {
  const learningNotebook = useStore((store) => store.learningNotebook)
  const navigate = useStore((store) => store.navigate)
  const recordNotebookSetLaunch = useStore((store) => store.recordNotebookSetLaunch)
  const updateNotebookSet = useStore((store) => store.updateNotebookSet)
  const moveNotebookSet = useStore((store) => store.moveNotebookSet)
  const deleteNotebookSet = useStore((store) => store.deleteNotebookSet)
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
                            「{book.title}」を削除しますか？ 入っている項目の学習記録は残ります。
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
