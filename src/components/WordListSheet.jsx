import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { NOTEBOOK_LIMITS } from '../lib/learningNotebook.js'
import { Sheet } from './Sheet.jsx'
import { Button } from './ui.jsx'
import { Check, Plus } from './Icons.jsx'

// マイ単語帳は、マイ学習ノートの「問題集」をそのまま単語側から作り・選ぶための窓。
// 保存先を増やしても新しい保存領域は作らないので、進捗コードもクラウド同期も
// これまでどおりのまま複数の単語帳を持ち運べる。
const DOMAIN = 'vocab'

const vocabCount = (set) => (
  set.refs.filter((ref) => ref.startsWith(`${DOMAIN}:`)).length
)

export function WordListSheet({ open, onClose, wordId, wordLabel }) {
  const sets = useStore((store) => store.learningNotebook.sets)
  const createNotebookSet = useStore((store) => store.createNotebookSet)
  const setNotebookSetItem = useStore((store) => store.setNotebookSetItem)
  const navigate = useStore((store) => store.navigate)
  const [title, setTitle] = useState('')

  const full = sets.length >= NOTEBOOK_LIMITS.sets
  const ref = `${DOMAIN}:${wordId}`

  const createAndAdd = () => {
    const clean = title.trim()
    if (!clean) return
    const setId = createNotebookSet(clean)
    if (setId && wordId) setNotebookSetItem(setId, DOMAIN, wordId, true)
    setTitle('')
  }

  return (
    <Sheet open={open} onClose={onClose} title="マイ単語帳">
      <div className="space-y-3 pb-2" data-word-list-sheet>
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {wordLabel
            ? `「${wordLabel}」を入れる単語帳を選びます。`
            : '単語帳を作ります。'}
          いくつでも作れて、1冊に{NOTEBOOK_LIMITS.itemsPerSet}語まで入ります。
          ここで作った単語帳は、マイ学習ノートの問題集と同じものです。
        </p>

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
              単語帳は{NOTEBOOK_LIMITS.sets}冊までです。使い終わった単語帳をマイ学習ノートで消すと、また作れます。
            </p>
          )}
        </div>

        {sets.length === 0 ? (
          <p className="rounded-2xl bg-brand-50 p-3 text-xs font-bold leading-relaxed text-ink/55">
            まだ単語帳がありません。上で名前をつけると1冊目ができます。
          </p>
        ) : (
          <ul className="space-y-1.5">
            {sets.map((set) => {
              const included = set.refs.includes(ref)
              return (
                <li key={set.id}>
                  <button
                    type="button"
                    disabled={!wordId}
                    onClick={() => setNotebookSetItem(set.id, DOMAIN, wordId, !included)}
                    aria-pressed={included}
                    data-word-list-set-id={set.id}
                    className={`flex w-full min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left ${
                      included
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-slate-200 bg-white'
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        included ? 'bg-brand-600 text-white' : 'bg-slate-100 text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      <Check size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-extrabold text-ink">
                        {set.title}
                      </span>
                      <span className="block text-[10px] font-bold text-ink/45">
                        英単語{vocabCount(set)}語
                        {set.refs.length > vocabCount(set)
                          ? `・ほかの教材${set.refs.length - vocabCount(set)}項目`
                          : ''}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] font-extrabold text-ink/45">
                      {included ? '入っている' : '入れる'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

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
