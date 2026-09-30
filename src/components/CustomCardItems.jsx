import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { SpeakButton } from './SpeakButton.jsx'
import { StudyReviewHistory } from './StudyReviewHistory.jsx'
import { LearningStatusBars } from './LearningStatusBars.jsx'
import { Sheet } from './Sheet.jsx'
import { useWordBookSlot, wordBookSlotLabel } from './WordBookSlot.jsx'
import { Button, Card, Chip, cx } from './ui.jsx'
import { ArrowRight, Book, Bookmark, BookmarkFilled, Cards, Check, ChevronDown, ChevronUp, Gear } from './Icons.jsx'
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECTS,
  CUSTOM_SUBJECT_BY_ID,
  SUBJECT_CATEGORIES,
  cardFieldRows,
  normalizeCustomCategories,
  quizzableCustomCardIds,
  templateFor,
} from '../lib/customCards.js'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'

// 自作カードの画面で使う部品：カード1枚、分類（教科・カテゴリー）のまとまり、カテゴリーの設定。

const LIST_LABELS = Object.freeze({
  otherSenses: 'ほかの意味',
  derivatives: '派生語・ほかの品詞の形',
  synonyms: '類義語',
  antonyms: '反意語',
  confusables: 'つづりが似ていて間違えやすい語',
  phrases: '熟語・構文',
})

// 英単語のカードの、行を足して書く欄を「語（意味）」の並びで1行にする。
function englishListRows(word) {
  const rows = []
  const join = (items, text) => items.map(text).join('・')
  if (word.otherSenses.length) rows.push({ key: 'otherSenses', value: join(word.otherSenses, (sense) => `${sense.pos} ${sense.meaning}`) })
  for (const key of ['derivatives', 'synonyms', 'antonyms', 'confusables']) {
    if (word[key].length) rows.push({ key, value: join(word[key], (pair) => (pair.m ? `${pair.w}（${pair.m}）` : pair.w)) })
  }
  if (word.phrases.length) rows.push({ key: 'phrases', value: join(word.phrases, (phrase) => (phrase.meaning ? `${phrase.phrase}（${phrase.meaning}）` : phrase.phrase)) })
  return rows.map((row) => ({ ...row, label: LIST_LABELS[row.key] }))
}

function FieldRow({ label, value, className = '' }) {
  return (
    <div className={cx('rounded-lg bg-slate-50 px-2.5 py-1.5', className)}>
      <p className="text-[10px] font-extrabold text-ink/45">{label}</p>
      <p className="whitespace-pre-line break-words text-xs font-bold leading-relaxed text-ink/75">{value}</p>
    </div>
  )
}

/** カード1枚の中身（テンプレートの名前・見出し・答えの欄・ほかの欄）。一覧・編集で選ぶとき・統合の見本で同じ形。 */
function EntryContent({ kind, entry, speak = true }) {
  const english = kind === 'word'
  const title = english ? entry.word : entry.front
  const template = templateFor(english ? 'english' : entry.template)
  const level = english ? getLevel(entry.level) : null
  const rows = english ? englishListRows(entry) : cardFieldRows(entry).filter((row) => row.key !== 'front' && row.key !== 'back')
  const backLabel = english ? '意味' : template.fields.find((item) => item.key === 'back')?.label
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-extrabold text-brand-700" data-custom-entry-template={template.id}>
            {template.label}
          </span>
          {english && <Chip color={level.color}>英検{level.label}</Chip>}
          {english && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-extrabold text-ink/60">{entry.pos}</span>
          )}
          {english && (
            <span className="truncate rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-ink/45">{entry.field}</span>
          )}
        </div>
        <p className="mt-1 whitespace-pre-line break-words font-display text-xl font-extrabold text-ink">{title}</p>
        {english && entry.phonetic && <p className="text-xs font-bold text-ink/40">{entry.phonetic}</p>}
        <p className="mt-0.5 whitespace-pre-line break-words text-sm font-extrabold text-ink/70">
          <span className="mr-1 text-[10px] text-ink/40">{backLabel}</span>
          {english ? entry.meanings.join('・') : entry.back}
        </p>
        {english && entry.example?.en && (
          <p className="mt-1 break-words text-xs font-bold text-ink/55">{entry.example.en}</p>
        )}
        {english && entry.example?.ja && (
          <p className="break-words text-xs font-bold text-ink/40">{entry.example.ja}</p>
        )}
        {(rows.length > 0 || (english && (entry.note || entry.etymology))) && (
          <div className="mt-2 space-y-1" data-custom-entry-fields>
            {rows.map((row) => <FieldRow key={row.key} label={row.label} value={row.value} />)}
            {english && entry.note && <FieldRow label="使い方・メモ" value={entry.note} />}
            {english && entry.etymology && <FieldRow label="語の成り立ち" value={entry.etymology} />}
          </div>
        )}
      </div>
      {english && speak && <SpeakButton text={entry.word} size="sm" />}
    </div>
  )
}

/**
 * 一覧のカード1枚。英単語のカード（kind: 'word'）と、ほかのテンプレートのカード（kind: 'card'）を同じ形で出す。
 * mode は list（下の段に 単語帳・書き換える・削除）・select（編集で選ぶ。押すと選ぶ・外す）・preview（統合の見本。操作なし）。
 */
export function CustomEntryCard({ kind, entry, srsEntry, onEdit, onDelete, onOpenWord, mode = 'list', selected = false, onToggleSelect }) {
  const english = kind === 'word'
  const domain = english ? 'vocab' : 'customCards'
  const title = english ? entry.word : entry.front
  const wordBook = useWordBookSlot([`${domain}:${entry.id}`], { label: title })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const data = {
    'data-custom-entry-id': entry.id,
    'data-custom-entry-kind': kind,
    'data-custom-word-id': english ? entry.id : undefined,
  }

  if (mode === 'select') {
    return (
      <Card className={cx('overflow-hidden', selected && 'border-brand-500 ring-2 ring-brand-500/30')} {...data}>
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`${title}を選ぶ`}
          onClick={() => onToggleSelect?.(kind, entry)}
          className={cx('flex w-full items-start gap-3 p-3.5 text-left', selected ? 'bg-brand-50/60' : 'active:bg-slate-50')}
          data-custom-entry-select={entry.id}
        >
          <span
            className={cx(
              'mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2',
              selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 bg-white',
            )}
            aria-hidden="true"
          >
            {selected && <Check size={14} />}
          </span>
          <div className="min-w-0 flex-1">
            <EntryContent kind={kind} entry={entry} speak={false} />
          </div>
        </button>
      </Card>
    )
  }

  if (mode === 'preview') {
    return (
      <Card className="p-3.5" {...data} data-custom-entry-preview>
        <EntryContent kind={kind} entry={entry} speak={false} />
      </Card>
    )
  }

  return (
    <Card className="p-3.5" {...data}>
      <EntryContent kind={kind} entry={entry} />
      <StudyReviewHistory entry={srsEntry} className="mt-2 items-start" />

      <div className="mt-2.5 grid grid-cols-3 gap-1.5 border-t border-slate-200 pt-2.5">
        {/* 押すと、画面下部の「単語帳」で選んだ登録先に入れる（もう一度押すと外す）。 */}
        <button
          type="button"
          onClick={wordBook.press}
          aria-pressed={wordBook.inBook}
          aria-label={wordBookSlotLabel({ itemLabel: title, bookTitle: wordBook.bookTitle, inBook: wordBook.inBook })}
          data-custom-word-book
          className={cx(
            'flex min-h-10 items-center justify-center gap-1 rounded-lg border px-1 text-[10px] font-extrabold',
            wordBook.inBook ? 'border-hint/30 bg-hint/10 text-hint' : 'border-slate-300 bg-white text-ink/60',
          )}
        >
          {wordBook.inBook ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
          単語帳
        </button>
        <button
          type="button"
          onClick={() => onEdit(kind, entry)}
          className="min-h-10 rounded-lg border border-slate-300 bg-white px-1 text-[10px] font-extrabold text-ink/70"
          data-custom-entry-edit
        >
          書き換える
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? onDelete(kind, entry.id) : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          data-custom-word-delete
          className={cx(
            'min-h-10 rounded-lg border px-1 text-[10px] font-extrabold',
            confirmDelete ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-ink/70',
          )}
        >
          {confirmDelete ? '本当に消す' : '削除'}
        </button>
      </div>
      {english && onOpenWord && (
        <button
          type="button"
          onClick={() => onOpenWord(entry.id)}
          className="mt-1.5 flex min-h-10 w-full items-center justify-center gap-1 rounded-lg bg-brand-50 text-xs font-extrabold text-brand-700"
          data-custom-entry-dictionary
        >
          辞書ページで見る <ArrowRight size={14} />
        </button>
      )}
    </Card>
  )
}

/** 分類の見出しの小さな説明（教科か、作ったカテゴリーと表示する教科）。 */
export function categoryCaption(category) {
  if (category.kind === 'subject') return `教科・${CUSTOM_SUBJECT_BY_ID[category.subject].appLabel}に出ます`
  const subject = CUSTOM_SUBJECT_BY_ID[category.subject]
  return subject ? `自分のカテゴリー・${subject.appLabel}にも出ます` : '自分のカテゴリー'
}

/** 暗記・テストの1行（英単語のカードか、ほかのカード）。 */
function StudyRow({ label, count, unit, status, units, onStudy, onQuiz, quizDisabled, quizNote, kind }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5" data-custom-study-row={kind}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-extrabold text-ink/70">{label}</span>
        <span className="text-xs font-extrabold tabular-nums text-ink/45">{`${count}${unit}`}</span>
      </div>
      <LearningStatusBars progress={status} className="mt-2" compact units={units} />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={onStudy} data-custom-study={kind}>
          <Book size={16} /> 暗記
        </Button>
        <Button size="sm" variant="secondary" onClick={onQuiz} disabled={quizDisabled} data-custom-quiz={kind}>
          <Cards size={16} /> テスト
        </Button>
      </div>
      {quizNote && <p className="mt-1.5 text-[11px] font-bold leading-relaxed text-ink/45">{quizNote}</p>}
    </div>
  )
}

/**
 * 分類（教科・自分のカテゴリー）のまとまり。枚数、英単語のカードとほかのカードの暗記・テスト、カードを見る・作る入口。
 * 作ったカテゴリーだけ歯車（名前・表示する教科・最初に選ぶテンプレート・並び・削除）を持つ。
 */
export function CustomCategoryBlock({ group, onStudy, onOpen, onCreate, onSettings }) {
  const { category, words, cards } = group
  const srs = useStore((state) => state.srs)
  const cardSrs = useStore((state) => state.customCardSrs)
  const total = words.length + cards.length
  const quizzable = quizzableCustomCardIds(cards.map((card) => card.id))
  const cardStatus = summarizeSrsItems(cards, cardSrs)
  return (
    <Card className="p-4" data-custom-category={category.id}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${category.color}22` }}
          aria-hidden="true"
        >
          {category.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="break-words font-display text-lg font-extrabold text-ink">{category.title}</p>
          <p className="text-[11px] font-bold leading-snug text-ink/50">{categoryCaption(category)}</p>
        </div>
        <span className="shrink-0 text-xs font-extrabold tabular-nums text-ink/45">{`${total}枚`}</span>
        {onSettings && (
          <button
            type="button"
            onClick={() => onSettings(category)}
            aria-label={`カテゴリー「${category.title}」の設定`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink/45 active:bg-slate-100"
            data-custom-category-settings={category.id}
          >
            <Gear size={20} />
          </button>
        )}
      </div>

      {total === 0 ? (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold leading-relaxed text-ink/50">
          {'まだカードがありません。下の「カードを作る」から登録すると、ここで暗記・テストできます。'}
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {words.length > 0 && (
            <StudyRow
              kind="word"
              label="英単語のカード"
              count={words.length}
              unit="語"
              status={summarizeVocabularySrsItems(words, srs)}
              units={{ learning: '語', quiz: '問' }}
              onStudy={() => onStudy(group, 'word', 'study')}
              onQuiz={() => onStudy(group, 'word', 'quiz')}
            />
          )}
          {cards.length > 0 && (
            <StudyRow
              kind="card"
              label="カード（英単語のほか）"
              count={cards.length}
              unit="枚"
              status={cardStatus}
              units={{ learning: '枚', quiz: '問' }}
              onStudy={() => onStudy(group, 'card', 'study')}
              onQuiz={() => onStudy(group, 'card', 'quiz')}
              quizDisabled={!quizzable.length}
              quizNote={quizzable.length ? '' : 'テストは、答えのちがうカードが2枚以上になるとできます。'}
            />
          )}
        </div>
      )}

      <div className={cx('mt-2 grid gap-2', onOpen ? 'grid-cols-2' : 'grid-cols-1')}>
        {onOpen && (
          <button
            type="button"
            onClick={() => onOpen(category)}
            disabled={total === 0}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 disabled:opacity-50"
            data-custom-category-open={category.id}
          >
            カードを見る
          </button>
        )}
        <button
          type="button"
          onClick={() => onCreate(category)}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-paper px-2 text-xs font-extrabold text-brand-600"
          data-custom-category-create={category.id}
        >
          カードを作る
        </button>
      </div>
    </Card>
  )
}

const selectClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-ink outline-none focus:border-brand-500'
const inputClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500'

/**
 * カテゴリーを作る・設定を変えるシート。category が null なら新しく作る。
 * 表示する教科を選ぶと、その教科のアプリにもこのカテゴリーが出る。消すと中のカードも消える（枚数を示して確かめる）。
 */
export function CustomCategorySheet({ open, category, cardCount = 0, defaultSubject = null, onClose, onSaved, onMerged, isFirst, isLast }) {
  const saveCustomCategory = useStore((state) => state.saveCustomCategory)
  const moveCustomCategory = useStore((state) => state.moveCustomCategory)
  const deleteCustomCategory = useStore((state) => state.deleteCustomCategory)
  const mergeCustomCategory = useStore((state) => state.mergeCustomCategory)
  const categories = useStore((state) => state.customCategories)
  const [title, setTitle] = useState(category?.title ?? '')
  const [subject, setSubject] = useState(category ? category.subject ?? '' : defaultSubject ?? '')
  const [template, setTemplate] = useState(category?.template ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [mergeTarget, setMergeTarget] = useState('')
  const [confirmMerge, setConfirmMerge] = useState(false)
  const [error, setError] = useState('')
  // まとめる先：教科と、このカテゴリーのほかの作ったカテゴリー。
  const otherCategories = normalizeCustomCategories(categories).filter((item) => item.id !== category?.id)
  const mergeTargetTitle = [...SUBJECT_CATEGORIES, ...otherCategories].find((item) => item.id === mergeTarget)?.title ?? ''

  const merge = () => {
    if (!mergeTarget) return
    if (!confirmMerge) {
      setConfirmMerge(true)
      return
    }
    const result = mergeCustomCategory(category.id, mergeTarget)
    if (result.status !== 'merged') {
      setError('まとめる先の分類が見つかりませんでした。')
      return
    }
    onClose()
    onMerged?.(result)
  }

  const save = () => {
    const result = saveCustomCategory({
      id: category?.id,
      title,
      subject: subject || null,
      template: template || null,
    })
    if (result.status === 'invalid') {
      setError('カテゴリーの名前を入れてください。')
      return
    }
    if (result.status === 'full') {
      setError(`カテゴリーは${CUSTOM_CARD_LIMITS.categories}個までです。`)
      return
    }
    onSaved?.(result.id)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={category ? 'カテゴリーの設定' : 'カテゴリーを作る'}>
      <div className="space-y-3 pb-2" data-custom-category-sheet={category?.id ?? 'new'}>
        <label className="block">
          <span className="text-[11px] font-extrabold text-ink/60">名前</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={CUSTOM_CARD_LIMITS.categoryTitle}
            placeholder="例：2学期中間英語"
            className={inputClass}
            data-custom-category-title
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-extrabold text-ink/60">表示する教科</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)} className={selectClass} data-custom-category-subject>
            <option value="">表示しない（自作カードの画面だけ）</option>
            {CUSTOM_SUBJECTS.map((item) => <option key={item.id} value={item.id}>{`${item.label}（${item.appLabel}にも出す）`}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-extrabold text-ink/60">カードを作るときに最初に選ぶテンプレート</span>
          <select value={template} onChange={(event) => setTemplate(event.target.value)} className={selectClass} data-custom-category-template>
            <option value="">教科に合わせる</option>
            {CUSTOM_CARD_TEMPLATES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700">{error}</p>}
        <Button full onClick={save} data-custom-category-save>
          {category ? 'この設定にする' : 'カテゴリーを作る'}
        </Button>

        {category && (
          <div className="space-y-2 border-t border-slate-200 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" disabled={isFirst} onClick={() => moveCustomCategory(category.id, 'up')} data-custom-category-move="up">
                <ChevronUp size={16} /> 上へ
              </Button>
              <Button size="sm" variant="secondary" disabled={isLast} onClick={() => moveCustomCategory(category.id, 'down')} data-custom-category-move="down">
                <ChevronDown size={16} /> 下へ
              </Button>
            </div>
            {/* ほかの分類にまとめる：中のカードをすべて移して、このカテゴリーを消す（記録・単語帳はそのまま）。 */}
            <div className="space-y-2 rounded-xl bg-slate-50 p-3" data-custom-category-merge>
              <label className="block">
                <span className="text-[11px] font-extrabold text-ink/60">ほかの分類にまとめる</span>
                <select
                  value={mergeTarget}
                  onChange={(event) => {
                    setMergeTarget(event.target.value)
                    setConfirmMerge(false)
                  }}
                  className={selectClass}
                  data-custom-category-merge-target
                >
                  <option value="">まとめる先を選ぶ</option>
                  <optgroup label="教科">
                    {SUBJECT_CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                  </optgroup>
                  {otherCategories.length > 0 && (
                    <optgroup label="自分のカテゴリー">
                      {otherCategories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                    </optgroup>
                  )}
                </select>
                <span className="mt-0.5 block text-[11px] font-bold leading-relaxed text-ink/45">
                  {'中のカードをすべて移して、このカテゴリーを消します。カードの暗記・テストの記録と単語帳はそのまま残ります。'}
                </span>
              </label>
              {confirmMerge && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-rose-700" data-custom-category-merge-confirm>
                  {`中のカード${cardCount}枚を「${mergeTargetTitle}」へ移して、このカテゴリーを消します。`}
                </p>
              )}
              <Button
                full
                size="sm"
                variant={confirmMerge ? 'danger' : 'secondary'}
                disabled={!mergeTarget}
                onClick={merge}
                data-custom-category-merge-run
              >
                {confirmMerge ? '本当にまとめる' : 'まとめる'}
              </Button>
            </div>
            <Button
              full
              size="sm"
              variant={confirmDelete ? 'danger' : 'secondary'}
              onClick={() => {
                if (!confirmDelete) {
                  setConfirmDelete(true)
                  return
                }
                deleteCustomCategory(category.id)
                onClose()
              }}
              data-custom-category-delete
            >
              {confirmDelete
                ? cardCount ? `中のカード${cardCount}枚も消えます。本当に消す` : '本当に消す'
                : 'このカテゴリーを消す'}
            </Button>
          </div>
        )}
      </div>
    </Sheet>
  )
}
