// つづりが似た語は語源がつながっているのか（src/lib/lookalikeOrigins.js）を見せる部品。
// 「humiliate と human は同じ語源？」のような疑問に、単語の画面（辞書ページ・暗記カードの裏・テストの答え）と
// 語源カードの画面（同じ語根の単語・カード・カードの暗記・カードのテスト）で答える。
import { useState } from 'react'
import { lookalikeRowsForCard, lookalikeSectionsForWord } from '../lib/lookalikeOrigins.js'
import { MeaningText } from './MeaningText.jsx'
import { cx } from './ui.jsx'

const KIND_STYLES = {
  same: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  distant: 'bg-sky-50 text-sky-700 ring-sky-200',
  unclear: 'bg-amber-50 text-amber-800 ring-amber-200',
  unrelated: 'bg-slate-100 text-slate-600 ring-slate-200',
}

// 1行に並べる語の数と、はじめに見せる行の数。多い分は押すと開く。
const WORD_LIMIT = 8
const ROW_LIMIT = 4

/** つながりの種類（同じ語源・遠い親戚・はっきりしない・別の語源）の印。 */
export function LookalikeKindChip({ kind, label }) {
  return (
    <span
      className={cx('inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1', KIND_STYLES[kind])}
      data-lookalike-kind={kind}
    >
      {label}
    </span>
  )
}

/** つづり注意の行に添える、その2語の語源のつながり。 */
export function OriginNote({ origin }) {
  if (!origin) return null
  return (
    <p
      className="mt-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold leading-relaxed text-ink/70 ring-1 ring-slate-100"
      data-word-origin-note={origin.kind}
    >
      <span className="mr-1 font-extrabold text-slate-600">語源</span>
      <LookalikeKindChip kind={origin.kind} label={origin.label} />{' '}
      <MeaningText>{origin.note}</MeaningText>
    </p>
  )
}

function LookalikeRow({ row, onWord }) {
  const [allWords, setAllWords] = useState(false)
  const words = allWords ? row.words : row.words.slice(0, WORD_LIMIT)
  return (
    <li className="py-2" data-lookalike-row={row.kind}>
      <div className="flex flex-wrap items-center gap-1.5">
        <LookalikeKindChip kind={row.kind} label={row.label} />
        {words.map((word) => (onWord ? (
          <button
            key={word.id}
            type="button"
            onClick={() => onWord(word.id)}
            className="min-h-8 rounded-lg bg-white px-2 font-display text-sm font-extrabold text-ink ring-1 ring-slate-200 active:bg-slate-50"
          >
            {word.word}
          </button>
        ) : (
          <span key={word.id} className="font-display text-sm font-extrabold text-ink">{word.word}</span>
        )))}
        {row.words.length > words.length && (
          <button
            type="button"
            onClick={() => setAllWords(true)}
            className="min-h-8 rounded-lg px-2 text-[11px] font-extrabold text-violet-700 active:bg-violet-50"
          >
            ほか{row.words.length - words.length}語
          </button>
        )}
      </div>
      {row.note && (
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/60"><MeaningText>{row.note}</MeaningText></p>
      )}
    </li>
  )
}

function LookalikeRows({ rows, onWord }) {
  const [allRows, setAllRows] = useState(false)
  const shown = allRows ? rows : rows.slice(0, ROW_LIMIT)
  return (
    <>
      <ul className="divide-y divide-slate-100">
        {shown.map((row, index) => (
          <LookalikeRow key={`${row.kind}:${row.words[0]?.id ?? index}`} row={row} onWord={onWord} />
        ))}
      </ul>
      {rows.length > shown.length && (
        <button
          type="button"
          onClick={() => setAllRows(true)}
          className="mt-1 min-h-10 w-full rounded-xl bg-slate-50 px-3 text-xs font-extrabold text-slate-600 active:bg-slate-100"
        >
          ほかの似た語（{rows.length - shown.length}組）も見る
        </button>
      )}
    </>
  )
}

const KIND_GUIDE = '同じ語源＝同じ語・同じ語根から来た語。遠い親戚＝元の語はちがうが、さかのぼると同じ古い語根につながる語。別の語源＝つづりが似ているのは偶然か、あとから似せた語。'

// テストの答えのように、ほかの説明が多い所では見出しだけを出し、押すと開く。
function Foldable({ title, count, collapsible, children, dataAttrs }) {
  const [open, setOpen] = useState(!collapsible)
  return (
    <div {...dataAttrs}>
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-h-10 w-full items-center justify-between gap-2 text-left active:opacity-70"
        >
          <span className="text-xs font-extrabold text-slate-700">{open ? '▼' : '▶'} {title}</span>
          <span className="text-[11px] font-bold text-ink/40">{count}組</span>
        </button>
      ) : (
        <p className="text-xs font-extrabold text-slate-700">{title}</p>
      )}
      {open && children}
    </div>
  )
}

/**
 * 単語の画面の「つづりが似た語は同じ語源？」。その語が入る語源カードごとに1つ出す。
 * - カードの語: カードの形とつづりが似た語を、カードの語根とのつながりの近い順に並べる。
 * - カードの形に似た語: まずカードの語とのつながり、続けて同じまとまりの語、ほかの似た語とのつながり。
 */
export function LookalikeWordSection({ word, onWord, collapsible = false, className }) {
  const sections = lookalikeSectionsForWord(word)
  if (!sections.length) return null
  const count = sections.reduce((sum, section) => sum + section.rows.length, 0)
  return (
    <Foldable
      title="つづりが似た語は同じ語源？"
      count={count}
      collapsible={collapsible}
      dataAttrs={{ className: cx('rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200', className), 'data-lookalike-word': word.id }}
    >
      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">{KIND_GUIDE}</p>
      {sections.map((section) => {
        const cardName = `${section.card.rootForm}（${section.card.rootMeaning}）`
        const siblings = section.siblings ?? []
        return (
          <div key={`${section.card.rootId}:${section.role}`} className="mt-2" data-lookalike-section={section.role}>
            <p className="text-xs font-bold leading-relaxed text-ink/70">
              {section.role === 'family'
                ? `語根 ${cardName} とつづりが似た語。語根とのつながり:`
                : `${word.word} は、語根 ${cardName} の語とつづりが似ている。`}
            </p>
            {siblings.length > 0 && (
              <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">
                同じ由来の語: {siblings.map((sibling) => sibling.word).join('・')}
              </p>
            )}
            <LookalikeRows rows={section.rows} onWord={onWord} />
          </div>
        )
      })}
    </Foldable>
  )
}

/** 語源カードの画面の「つづりが似た語は同じ語源？」。カードに入れていない似た語と、この語根とのつながり。 */
export function LookalikeCardSection({ rootId, onWord, collapsible = false, className }) {
  const rows = lookalikeRowsForCard(rootId)
  if (!rows.length) return null
  return (
    <Foldable
      title="つづりが似た語は同じ語源？"
      count={rows.length}
      collapsible={collapsible}
      dataAttrs={{ className: cx('rounded-2xl bg-white p-4 ring-1 ring-slate-200', className), 'data-lookalike-card': rootId }}
    >
      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/50">
        このカードの形とつづりが似ていても、カードに入れていない語です。この語根とのつながりを示します。{KIND_GUIDE}
      </p>
      <LookalikeRows rows={rows} onWord={onWord} />
    </Foldable>
  )
}
