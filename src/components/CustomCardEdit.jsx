import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { Sheet } from './Sheet.jsx'
import { Button, cx } from './ui.jsx'
import { CustomEntryCard } from './CustomCardItems.jsx'
import { NEW_CATEGORY_OPTION } from './CustomCardForm.jsx'
import {
  CUSTOM_CARD_LIMITS,
  SUBJECT_CATEGORIES,
  normalizeCustomCategories,
  templateFor,
} from '../lib/customCards.js'
import {
  MERGE_BLOCKER_TEXT,
  entryKey,
  mergeBlocker,
  mergeCardsPreview,
  mergeWordsPreview,
} from '../lib/customCardsEdit.js'

// 自作カードの編集（カードの一覧で「編集」を押したとき）：選んだカードの操作の欄と、移動・統合のシート。
// 計算は lib/customCardsEdit.js、保存はストアの moveCustomEntries・mergeCustomEntries・deleteCustomEntries。

const selectClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-ink outline-none focus:border-brand-500'
const inputClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500'

const entryTitle = (item) => (item.kind === 'word' ? item.entry.word : item.entry.front)

/**
 * 編集のときの下の欄：選んでいる枚数、全部選ぶ、書き換える（1枚）・別の分類へ移す・1枚に統合する（2枚以上）・削除。
 * 削除は1回目で確かめの文に変わり、2回目で消す。
 */
export function CustomEditBar({ count, visibleCount, allSelected, onToggleAll, onEdit, onMove, onMerge, onDelete, confirmDelete }) {
  return (
    <div className="shrink-0 space-y-2 border-t border-slate-200 bg-white/95 p-3 backdrop-blur" data-custom-edit-bar>
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 text-sm font-extrabold text-ink" data-custom-edit-count={count}>
          {count ? `${count}枚を選んでいます` : 'カードを押して選んでください'}
        </p>
        <button
          type="button"
          onClick={onToggleAll}
          disabled={!visibleCount}
          className="min-h-10 shrink-0 rounded-lg px-2 text-xs font-extrabold text-brand-700 active:bg-brand-50 disabled:text-ink/30"
          data-custom-edit-all
        >
          {allSelected ? '選ぶのをやめる' : '全部選ぶ'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="secondary" disabled={count !== 1} onClick={onEdit} data-custom-edit-action="edit">
          書き換える
        </Button>
        <Button size="sm" variant="secondary" disabled={count < 1} onClick={onMove} data-custom-edit-action="move">
          別の分類へ移す
        </Button>
        <Button size="sm" variant="secondary" disabled={count < 2} onClick={onMerge} data-custom-edit-action="merge">
          1枚に統合する
        </Button>
        <Button size="sm" variant={confirmDelete ? 'danger' : 'secondary'} disabled={count < 1} onClick={onDelete} data-custom-edit-action="delete">
          {confirmDelete ? `${count}枚を本当に消す` : '削除'}
        </Button>
      </div>
    </div>
  )
}

/**
 * 選んだカードを別の分類へ移すシート。移し先は教科・自分のカテゴリー・その場で作る新しいカテゴリー。
 * onMove(分類の id) を呼ぶ（移す計算と知らせは呼んだ画面が行う）。
 */
export function MoveEntriesSheet({ open, count, currentCategory, onClose, onMove }) {
  const categories = useStore((state) => state.customCategories)
  const saveCustomCategory = useStore((state) => state.saveCustomCategory)
  const [target, setTarget] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState('')
  const custom = normalizeCustomCategories(categories)

  const run = () => {
    if (!target) {
      setError('移す先を選んでください。')
      return
    }
    let categoryId = target
    if (target === NEW_CATEGORY_OPTION) {
      const created = saveCustomCategory({ title: newTitle })
      if (created.status !== 'saved') {
        setError(created.status === 'full'
          ? `カテゴリーは${CUSTOM_CARD_LIMITS.categories}個までです。`
          : '新しいカテゴリーの名前を入れてください。')
        return
      }
      categoryId = created.id
    }
    onMove(categoryId)
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="別の分類へ移す"
      footer={(
        <Button full onClick={run} data-custom-move-run>
          {`${count}枚を移す`}
        </Button>
      )}
    >
      <div className="space-y-3 pb-2" data-custom-move-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/60">
          {`選んだ${count}枚を、ほかの教科かカテゴリーへ移します。暗記・テストの記録と単語帳はそのまま残ります。`}
        </p>
        <label className="block">
          <span className="text-[11px] font-extrabold text-ink/60">移す先</span>
          <select
            value={target}
            onChange={(event) => {
              setTarget(event.target.value)
              setError('')
            }}
            className={selectClass}
            data-custom-move-target
          >
            <option value="">移す先を選ぶ</option>
            <optgroup label="教科">
              {SUBJECT_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id} disabled={item.id === currentCategory}>
                  {item.id === currentCategory ? `${item.title}（今の分類）` : item.title}
                </option>
              ))}
            </optgroup>
            {custom.length > 0 && (
              <optgroup label="自分のカテゴリー">
                {custom.map((item) => (
                  <option key={item.id} value={item.id} disabled={item.id === currentCategory}>
                    {item.id === currentCategory ? `${item.title}（今の分類）` : item.title}
                  </option>
                ))}
              </optgroup>
            )}
            {custom.length < CUSTOM_CARD_LIMITS.categories && (
              <option value={NEW_CATEGORY_OPTION}>＋ 新しいカテゴリーを作る</option>
            )}
          </select>
        </label>
        {target === NEW_CATEGORY_OPTION && (
          <label className="block">
            <span className="text-[11px] font-extrabold text-ink/60">新しいカテゴリーの名前</span>
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              maxLength={CUSTOM_CARD_LIMITS.categoryTitle}
              placeholder="例：2学期期末英語"
              className={inputClass}
              data-custom-move-new-category
            />
          </label>
        )}
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700" data-custom-move-error>{error}</p>}
      </div>
    </Sheet>
  )
}

/**
 * 選んだカードを1枚に統合するシート。残すカードを選び、統合したあとのカードを見せてから統合する。
 * 統合できない選び方（テンプレートがちがう・英単語とほかのカードが混ざる）は、理由だけを出す。
 * onMerged({ title, count }) を統合のあとに呼ぶ。
 */
export function MergeEntriesSheet({ open, selected, onClose, onMerged }) {
  const mergeCustomEntries = useStore((state) => state.mergeCustomEntries)
  const items = Array.isArray(selected) ? selected : []
  const blocker = mergeBlocker(items)
  const [targetKey, setTargetKey] = useState(items[0] ? entryKey(items[0].kind, items[0].entry.id) : '')
  const target = items.find((item) => entryKey(item.kind, item.entry.id) === targetKey) ?? items[0]
  const entries = items.map((item) => item.entry)
  const english = target?.kind === 'word'
  const preview = !blocker && target
    ? (english ? mergeWordsPreview(entries, target.entry.id) : mergeCardsPreview(entries, target.entry.id))
    : null
  const merged = english ? preview?.word : preview?.card

  const run = () => {
    if (!merged) return
    const result = mergeCustomEntries({
      kind: target.kind,
      targetId: target.entry.id,
      sourceIds: entries.filter((entry) => entry.id !== target.entry.id).map((entry) => entry.id),
    })
    if (result.status === 'merged') onMerged({ title: entryTitle(target), count: items.length })
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="1枚に統合する"
      footer={merged ? (
        <Button full onClick={run} data-custom-merge-run>
          {`${items.length}枚を1枚に統合する`}
        </Button>
      ) : null}
    >
      <div className="space-y-3 pb-2" data-custom-merge-sheet>
        {blocker ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-900" data-custom-merge-blocked={blocker}>
            {MERGE_BLOCKER_TEXT[blocker]}
          </p>
        ) : (
          <>
            <div>
              <p className="text-[11px] font-extrabold text-ink/60">残すカード</p>
              <div className="mt-1 space-y-1.5" role="radiogroup" aria-label="残すカード" data-custom-merge-targets>
                {items.map((item) => {
                  const key = entryKey(item.kind, item.entry.id)
                  const on = item === target
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setTargetKey(key)}
                      className={cx(
                        'flex min-h-12 w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left',
                        on ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white active:bg-slate-50',
                      )}
                      data-custom-merge-target={item.entry.id}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-ink">{entryTitle(item)}</span>
                        <span className="block truncate text-[11px] font-bold text-ink/50">
                          {item.kind === 'word' ? item.entry.meanings.join('・') : item.entry.back}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/45">
                {'残すカードの中身に、ほかのカードの中身を足します。同じ文は重ねず、ちがう文は消さずに並べるか、'}
                {english ? '使い方・メモへ移します。' : `${templateFor(target.entry.template).fields.find((field) => field.key === 'note')?.label ?? '解説'}へ移します。`}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-extrabold text-ink/60">統合したあとのカード</p>
              <div className="mt-1" data-custom-merge-preview>
                <CustomEntryCard kind={target.kind} entry={merged} mode="preview" />
              </div>
            </div>

            {preview.cut.length > 0 && (
              <ul className="space-y-1 rounded-lg bg-amber-50 px-3 py-2" data-custom-merge-cut>
                {preview.cut.map((item) => (
                  <li key={item.key} className="text-xs font-extrabold leading-relaxed text-amber-900">
                    {`${item.label}が${item.limit}字を超えるので、超えた${item.length - item.limit}字は入りません。`}
                  </li>
                ))}
              </ul>
            )}

            <ul className="space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[11px] font-bold leading-relaxed text-ink/55" data-custom-merge-notes>
              <li>{`ほかの${items.length - 1}枚は消えます。`}</li>
              <li>{'暗記・テストの記録は、残すカードの記録を残します。残すカードに記録がないときは、ほかのカードのうち学習の進んだ記録を移します。'}</li>
              <li>{'単語帳とメモは、残すカードへ移します。'}</li>
            </ul>
          </>
        )}
      </div>
    </Sheet>
  )
}
