import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useStore } from '../store/useStore.js'
import {
  NOTEBOOK_DOMAIN_BY_ID,
  NOTEBOOK_LIMITS,
  activeNotebookSetId,
  parseNotebookRef,
} from '../lib/learningNotebook.js'
import { wordBookSlotNotice, wordBookSlotStatus } from '../lib/wordBookSlot.js'
import {
  announceWordBook,
  clearWordBookNotice,
  closeWordBookSettings,
  getStudyDockServerSnapshot,
  getStudyDockSnapshot,
  openWordBookSettings,
  registerWordBookButton,
  subscribeStudyDock,
} from '../lib/studyDock.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { Check, ChevronDown, ChevronUp, Gear, Plus } from './Icons.jsx'

// 単語帳ボタンの登録先（スロット）。画面下部の「単語帳」で1冊を選び、どの画面の単語帳ボタンも、その冊へ入れる・外す。
// 登録先は learningNotebook.activeSetId（選んでいない・消したときは並びの先頭の冊）。
// 単語帳の設定（登録先を選ぶ・作る・名前／並び順／削除）は、画面下部の「単語帳」の「設定」から開く。

/** 画面下部の枠の一時状態（単語帳ボタンの数・押した結果・設定を開いているか）。 */
export function useStudyDock() {
  return useSyncExternalStore(subscribeStudyDock, getStudyDockSnapshot, getStudyDockServerSnapshot)
}

/**
 * 単語帳ボタンの中身。refs（「教材:ID」の並び）を登録先（選択中の単語帳）に入れる。全部入っていれば外す。
 * label は押した項目の名前（1項目のとき、下部の知らせに出す）。ボタンが画面に出ているあいだ、下部に「単語帳」を出す。
 * 登録先がいっぱい・単語帳がないときは、下部で知らせて単語帳の設定を開く（そこで選んだ・作った冊へ入れられる）。
 */
export function useWordBookSlot(refs = [], { label = '', present: shown } = {}) {
  const list = (Array.isArray(refs) ? refs : []).filter(Boolean)
  // 下部に「単語帳」を出すのは、入れる項目があるボタンが画面に出ているあいだ。
  // 選んでから入れる画面（写真の読み取り）は、まだ選んでいなくても出す（shown）。
  const enabled = shown ?? list.length > 0
  useEffect(() => (enabled ? registerWordBookButton() : undefined), [enabled])
  const bookTitle = useStore((store) => {
    const id = activeNotebookSetId(store.learningNotebook)
    return store.learningNotebook.sets.find((set) => set.id === id)?.title ?? ''
  })
  const inBook = useStore((store) => wordBookSlotStatus(store.learningNotebook, list).inBook)
  // 登録先に入っている項目の数（まとめて入れるボタンの「3/12」など）。
  const present = useStore((store) => wordBookSlotStatus(store.learningNotebook, list).present)
  const press = () => {
    if (!list.length) return
    const result = useStore.getState().toggleWordBookSlot(list)
    const done = result.action === 'add' || result.action === 'remove'
    announceWordBook(wordBookSlotNotice(result, { label, refs: list }), done ? 'ok' : 'warn')
    if (!done) openWordBookSettings({ refs: list, label })
  }
  return { bookTitle, inBook, present, total: list.length, press }
}

/**
 * 横長の単語帳ボタンの文字。登録先の名前と、押すとどうなるか（入れる・外す）を示す。
 * what は入れる項目の名前（まとめて入れるボタンの「12語を」など。1項目のボタンは省く）。
 */
export function wordBookSlotButtonText({ bookTitle, inBook, what = '' }) {
  if (!bookTitle) return `${what}単語帳に入れる`
  return inBook ? `${what}単語帳「${bookTitle}」から外す` : `${what}単語帳「${bookTitle}」に入れる`
}

/** 単語帳ボタンの読み上げ名。登録先に入っているかと、押すとどうなるかを言う。 */
export function wordBookSlotLabel({ itemLabel, bookTitle, inBook }) {
  if (!bookTitle) return `${itemLabel}を入れる単語帳を作る`
  return inBook
    ? `${itemLabel}を単語帳「${bookTitle}」から外す（入っています）`
    : `${itemLabel}を単語帳「${bookTitle}」に入れる`
}

// 冊に入っている項目を、教材ごとに数えて短く示す（多い順に2教材まで、残りは「ほか」でまとめる）。
export function wordBookDetail(set) {
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

/**
 * 1冊の設定（名前・並び順・削除）。単語帳の一覧の歯車と、単語帳の設定（登録先）の歯車で同じものを使う。
 * editing は { id, title, confirmDelete }（開いている冊の編集中の値）、onEditing で変える。
 */
export function WordBookEditPanel({ book, index, total, editing, onEditing }) {
  const updateNotebookSet = useStore((store) => store.updateNotebookSet)
  const moveNotebookSet = useStore((store) => store.moveNotebookSet)
  const deleteNotebookSet = useStore((store) => store.deleteNotebookSet)

  const saveTitle = () => {
    const title = editing?.title.trim()
    if (!editing || !title) return
    updateNotebookSet(editing.id, { title })
  }

  const remove = (bookId) => {
    deleteNotebookSet(bookId)
    onEditing(null)
  }

  return (
    <div className="mt-2 space-y-2.5 rounded-xl bg-slate-50 p-2.5" data-word-book-settings>
      <div>
        <span className="text-[10px] font-extrabold text-ink/55">名前</span>
        <div className="mt-1 flex items-center gap-1.5">
          <input
            value={editing.title}
            onChange={(event) => onEditing({ ...editing, title: event.target.value })}
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
            disabled={!editing.title.trim() || editing.title.trim() === book.title}
          >
            保存
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5" data-word-book-order>
        <span className="min-w-0 flex-1 text-[10px] font-extrabold text-ink/55">
          並び順（{total}冊中{index + 1}番目）
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
          disabled={index === total - 1}
          aria-label={`${book.title}を1つ下へ`}
          data-word-book-move-down
          className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink/70 ring-1 ring-slate-200 disabled:opacity-30"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {editing.confirmDelete ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5" data-word-book-delete-confirm>
          <p className="text-xs font-extrabold leading-relaxed text-rose-900">
            「{book.title}」を削除しますか？ 入っている項目の学習記録は残ります。
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEditing({ ...editing, confirmDelete: false })}
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
          onClick={() => onEditing({ ...editing, confirmDelete: true })}
          data-word-book-delete
          className="min-h-10 w-full rounded-lg text-xs font-extrabold text-rose-700 active:bg-rose-50"
        >
          この単語帳を削除
        </button>
      )}
    </div>
  )
}

/** 冊ごとの歯車（名前・並び順・削除を開く）。 */
export function WordBookGearButton({ book, open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={`${book.title}の名前・並び順・削除`}
      title="名前・並び順・削除"
      data-word-book-settings-button
      className={cx(
        'grid h-11 w-11 shrink-0 place-items-center rounded-lg active:bg-slate-200',
        open ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-ink/60',
      )}
    >
      <Gear size={18} />
    </button>
  )
}

/**
 * 画面下部の「単語帳」。見出し行に登録先（または単語帳ボタンを押した結果）と「設定」、
 * 操作行に単語帳の並び（押した冊が登録先になる）を置く。見出し1行＋操作1行で、読み上げ・出題と同じ高さにそろえる。
 * titled は見出し行の先頭に「単語帳」と名前を出すか（左の切り替えで名前が見えているときは出さない）。
 */
export function WordBookSlotConsole({ titled = true }) {
  const sets = useStore((store) => store.learningNotebook.sets)
  const activeId = useStore((store) => activeNotebookSetId(store.learningNotebook))
  const selectNotebookSet = useStore((store) => store.selectNotebookSet)
  const { notice } = useStudyDock()
  const activeRef = useRef(null)
  const active = sets.find((set) => set.id === activeId) ?? null

  // 押した結果は少しのあいだだけ出し、そのあとは登録先の名前に戻す。
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => clearWordBookNotice(notice.id), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  // 登録先の冊が並びの外に隠れないよう、見える位置へ寄せる。
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  return (
    <section
      aria-label="単語帳の登録先"
      data-word-book-slot-console
      className="flex h-full min-w-0 flex-col px-2 py-1"
    >
      <div className="mb-1 flex h-8 min-w-0 items-center gap-1.5">
        {titled && (
          <span className="shrink-0 text-[9px] font-black tracking-[0.08em] text-brand-600">
            単語帳
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink" aria-live="polite" data-word-book-slot-status>
          {notice ? (
            <span className={notice.tone === 'warn' ? 'text-rose-700' : 'text-emerald-700'} data-word-book-slot-notice>
              {notice.text}
            </span>
          ) : active ? (
            <>
              <span className="mr-1 text-[9px] font-black text-ink/45">登録先</span>
              {active.title}
              <span className="ml-1 font-bold text-ink/45">· {active.refs.length}項目</span>
            </>
          ) : (
            '単語帳がありません'
          )}
        </p>
        <button
          type="button"
          onClick={() => openWordBookSettings()}
          aria-haspopup="dialog"
          aria-label="単語帳の設定を開く"
          data-word-book-slot-settings
          className="flex h-7 shrink-0 items-center gap-0.5 rounded-lg bg-slate-100 px-2 text-[10px] font-extrabold text-ink/70 active:bg-slate-200"
        >
          <Gear size={12} />
          設定
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="登録先の単語帳"
        data-word-book-slot-list
        className="no-scrollbar flex min-h-11 min-w-0 flex-1 items-center gap-1 overflow-x-auto"
      >
        {sets.length ? sets.map((set) => {
          const selected = set.id === activeId
          return (
            <button
              key={set.id}
              ref={selected ? activeRef : null}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectNotebookSet(set.id)}
              data-word-book-slot={set.id}
              className={cx(
                'flex h-9 max-w-[10rem] shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-extrabold transition-colors',
                selected
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-ink/70 active:bg-slate-200',
              )}
            >
              {selected && <Check size={12} />}
              <span className="truncate">{set.title}</span>
            </button>
          )
        }) : (
          <Button size="sm" onClick={() => openWordBookSettings()}>
            <Plus size={14} /> 単語帳を作る
          </Button>
        )}
      </div>
    </section>
  )
}

/**
 * 単語帳の設定。画面下部の「単語帳」の「設定」から開き、単語帳ボタンで入れる先（登録先）を選ぶ・新しく作る・
 * 冊ごとの歯車で名前／並び順／削除を変える。単語帳がない・登録先がいっぱいで単語帳ボタンが入れられなかったときも開き、
 * そのとき選んだ冊・作った冊へ、押した項目を入れる（pending）。
 */
export function WordBookSlotSheet() {
  const { settings } = useStudyDock()
  const sets = useStore((store) => store.learningNotebook.sets)
  const activeId = useStore((store) => activeNotebookSetId(store.learningNotebook))
  const selectNotebookSet = useStore((store) => store.selectNotebookSet)
  const createNotebookSet = useStore((store) => store.createNotebookSet)
  const navigate = useStore((store) => store.navigate)
  const [title, setTitle] = useState('')
  const [editing, setEditing] = useState(null)
  const open = Boolean(settings)
  const pending = settings?.pending ?? null
  const full = sets.length >= NOTEBOOK_LIMITS.sets

  const close = () => {
    setEditing(null)
    setTitle('')
    closeWordBookSettings()
  }

  // 選んだ冊を登録先にする。押した項目が入れられずに開いたときは、その冊へ入れて閉じる。
  const choose = (setId) => {
    selectNotebookSet(setId)
    if (!pending?.refs?.length) return
    const status = wordBookSlotStatus(useStore.getState().learningNotebook, pending.refs)
    if (status.inBook) {
      announceWordBook(`「${status.book.title}」にはもう入っています`)
      close()
      return
    }
    const result = useStore.getState().toggleWordBookSlot(pending.refs)
    const done = result.action === 'add'
    announceWordBook(wordBookSlotNotice(result, { label: pending.label, refs: pending.refs }), done ? 'ok' : 'warn')
    if (done) close()
  }

  const createAndChoose = () => {
    const clean = title.trim()
    if (!clean) return
    const setId = createNotebookSet(clean)
    setTitle('')
    if (setId) choose(setId)
  }

  return (
    <Sheet open={open} onClose={close} title="単語帳の設定">
      <div className="space-y-3 pb-2" data-word-book-slot-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {pending?.refs?.length
            ? `「${pending.label || `${pending.refs.length}項目`}」を入れる単語帳を選んでください。選んだ単語帳が、このあとも単語帳ボタンの登録先になります。`
            : '単語帳ボタンを押すと、ここで選んだ登録先の単語帳に入ります。もう一度押すと外れます。'}
        </p>

        {sets.length ? (
          <ul className="space-y-1.5" role="radiogroup" aria-label="登録先の単語帳">
            {sets.map((set, index) => {
              const selected = set.id === activeId
              const edit = editing?.id === set.id ? editing : null
              return (
                <li key={set.id} data-word-book-slot-row={set.id}>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(set.id)}
                      data-word-book-slot-choose={set.id}
                      className={cx(
                        'flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-left',
                        selected ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white',
                      )}
                    >
                      <span
                        className={cx(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                          selected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-transparent',
                        )}
                        aria-hidden="true"
                      >
                        <Check size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-extrabold text-ink">{set.title}</span>
                        <span className="block text-[10px] font-bold text-ink/45">{wordBookDetail(set)}</span>
                      </span>
                      <span className="shrink-0 text-[10px] font-extrabold text-ink/45">
                        {selected ? '登録先' : `${set.refs.length}項目`}
                      </span>
                    </button>
                    <WordBookGearButton
                      book={set}
                      open={Boolean(edit)}
                      onClick={() => setEditing(edit ? null : { id: set.id, title: set.title, confirmDelete: false })}
                    />
                  </div>
                  {edit && (
                    <WordBookEditPanel
                      book={set}
                      index={index}
                      total={sets.length}
                      editing={edit}
                      onEditing={setEditing}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold leading-relaxed text-ink/55" data-word-book-slot-empty>
            まだ単語帳がありません。下で名前をつけて作ると、その単語帳が登録先になります。
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
              onKeyDown={(event) => {
                if (event.key === 'Enter') createAndChoose()
              }}
              maxLength={NOTEBOOK_LIMITS.setTitleLength}
              disabled={full}
              placeholder="例：テスト範囲、苦手なところ"
              data-word-book-slot-new-title
              className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500 disabled:bg-slate-100"
            />
          </label>
          <Button
            full
            size="sm"
            className="mt-2"
            disabled={full || !title.trim()}
            onClick={createAndChoose}
          >
            <Plus size={15} /> 作って登録先にする
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
            close()
            navigate('myList', { tab: 'sets' })
          }}
        >
          マイ学習ノートで単語帳を開く
        </Button>
      </div>
    </Sheet>
  )
}
