import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { grammarReferenceTerm } from '../data/grammar-reference/terms.js'
import { SpeakButton } from './SpeakButton.jsx'
import { MeaningText } from './MeaningText.jsx'
import { WordListSheet, useWordInAnyBook } from './WordListSheet.jsx'
import { Bookmark, BookmarkFilled, Close, Link } from './Icons.jsx'
import { cx } from './ui.jsx'

// 文法の参考書の部品。英単語と用語はタップすると、画面の下に意味の窓（RefPeek）が出る。

/** 部品に分けた文を描く。英単語は押すと意味、用語（点線）は押すと説明。 */
export function RefParts({ parts, onPick, active, tone = 'text' }) {
  return parts.map((part, index) => {
    if (part.kind === 'word') {
      const on = active?.kind === 'word' && active.key === part.word.key
      return (
        <button
          key={index}
          type="button"
          onClick={() => onPick({ kind: 'word', key: part.word.key, surface: part.text, word: part.word })}
          className={cx(
            'inline rounded-sm px-[1px] text-left transition-colors',
            tone === 'text' ? 'font-extrabold text-brand-700' : 'text-inherit',
            on ? 'bg-hint/40' : 'active:bg-brand-100',
          )}
          data-grammar-ref-word={part.word.key}
        >
          {part.text}
        </button>
      )
    }
    if (part.kind === 'term') {
      const on = active?.kind === 'term' && active.key === part.term
      return (
        <button
          key={index}
          type="button"
          onClick={() => onPick({ kind: 'term', key: part.term })}
          className={cx(
            'inline rounded-sm text-left underline decoration-brand-300 decoration-dotted decoration-2 underline-offset-4 transition-colors',
            on ? 'bg-hint/40' : 'active:bg-brand-100',
          )}
          data-grammar-ref-term={part.term}
        >
          {part.text}
        </button>
      )
    }
    return <span key={index}>{part.text}</span>
  })
}

/** 例文1つ。英文の語はすべてタップでき、左のボタンで読み上げる。 */
export function RefExample({ example, onPick, active, className = '' }) {
  if (!example) return null
  return (
    <div className={cx('flex items-start gap-2 rounded-xl bg-white p-2.5 ring-1 ring-brand-100', className)}>
      <SpeakButton text={example.en} size="sm" />
      <div className="min-w-0 flex-1">
        <p lang="en" className="text-[15px] font-bold leading-relaxed text-ink">
          <RefParts parts={example.parts} onPick={onPick} active={active} tone="example" />
        </p>
        <p className="mt-0.5 text-[13px] font-bold leading-relaxed text-brand-600">{example.ja}</p>
      </div>
    </div>
  )
}

/** 表。1行目が見出し。狭い画面では横に動かして読む。 */
export function RefTable({ table, onPick, active }) {
  if (!table) return null
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
      <table className="w-full border-collapse text-left text-[13px] leading-snug">
        <thead className="bg-brand-50">
          <tr>
            {table.head.map((cell, index) => (
              <th key={index} className="whitespace-nowrap px-2.5 py-2 font-extrabold text-brand-800">
                <RefParts parts={cell} onPick={onPick} active={active} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-slate-100 bg-white">
              {row.map((cell, index) => (
                <td key={index} className={cx('px-2.5 py-2 align-top font-bold text-ink/80', index === 0 && 'min-w-[4.5rem]')}>
                  <RefParts parts={cell} onPick={onPick} active={active} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WordPeek({ item, onClose }) {
  const navigate = useStore((state) => state.navigate)
  const [bookOpen, setBookOpen] = useState(false)
  const inBook = useWordInAnyBook(item.word.id)
  // 別の語を開いたら、単語帳を選ぶ窓は閉じた状態から始める。
  useEffect(() => setBookOpen(false), [item.key])
  const { word } = item
  return (
    <>
      <div className="flex items-start gap-3">
        <SpeakButton text={item.surface} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span lang="en" className="font-display text-lg font-extrabold text-ink">{item.surface}</span>
            {word.headword && (
              <span className="text-[11px] font-extrabold text-ink/45">
                {'もとの形 '}
                <span lang="en">{word.headword}</span>
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/70"><MeaningText>{word.ja}</MeaningText></p>
        </div>
        <button type="button" onClick={onClose} aria-label="意味の窓を閉じる" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/40 active:bg-slate-100">
          <Close size={18} />
        </button>
      </div>
      {word.id && (
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate('wordDetail', { id: word.id })}
            className="flex min-h-10 items-center justify-center gap-1 rounded-xl bg-brand-100 text-xs font-extrabold text-brand-700 active:bg-brand-200"
          >
            <Link size={14} /> 詳しく
          </button>
          <button
            type="button"
            onClick={() => setBookOpen(true)}
            aria-haspopup="dialog"
            className={cx(
              'flex min-h-10 items-center justify-center gap-1 rounded-xl text-xs font-extrabold',
              inBook ? 'bg-hint-soft text-amber-700' : 'bg-brand-500 text-white active:bg-brand-600',
            )}
          >
            {inBook ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
            {inBook ? '単語帳に入っています' : '単語帳に入れる'}
          </button>
        </div>
      )}
      <WordListSheet
        open={bookOpen && Boolean(word.id)}
        onClose={() => setBookOpen(false)}
        wordId={word.id}
        wordLabel={item.surface}
      />
    </>
  )
}

function TermPeek({ item, onClose }) {
  const term = grammarReferenceTerm(item.key)
  if (!term) return null
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-black text-violet-700">用</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-lg font-extrabold text-ink">{term.term}</span>
          <span className="text-[11px] font-extrabold text-ink/45">{term.reading}</span>
        </div>
        <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{term.text}</p>
        {term.example && (
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
            {'例 '}
            <span lang="en" className="text-ink/75">{term.example}</span>
            {term.note ? `（${term.note}）` : ''}
          </p>
        )}
      </div>
      <button type="button" onClick={onClose} aria-label="説明の窓を閉じる" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink/40 active:bg-slate-100">
        <Close size={18} />
      </button>
    </div>
  )
}

/**
 * タップした語・用語の窓。ページの下に張り付き、読み進めても見えたままにする。
 * 別の語を押すと入れ替わり、× で閉じる。
 */
export function RefPeek({ item, onClose }) {
  if (!item) return null
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-4 px-3 pb-3 pt-2" data-grammar-ref-peek>
      <div className="animate-pop-in rounded-2xl bg-white p-3 shadow-[0_-6px_24px_-8px_rgba(30,27,75,0.35)] ring-2 ring-brand-200">
        {item.kind === 'word'
          ? <WordPeek item={item} onClose={onClose} />
          : <TermPeek item={item} onClose={onClose} />}
      </div>
    </div>
  )
}
