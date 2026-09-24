import { useState } from 'react'
import { conjugationTablesFor } from '../lib/kotenConjugation.js'
import { kotenGroupsForWord } from '../lib/kotenWordGroups.js'
import { KotenText, KotenWord } from './KotenFurigana.jsx'
import { KotenConjugationTable } from './KotenConjugationTable.jsx'
import { cx } from './ui.jsx'
import { ChevronDown, ChevronUp } from './Icons.jsx'

// 古典単語の暗記カードの裏・辞書ページ・テストの答え合わせで共通に出す、
// 漢字表記・活用表・時代背景・仲間と使い分けの欄。

/** 漢字表記。慣用の漢字がない語は出さない。 */
export function KotenKanjiLine({ word, className = '' }) {
  if (!word?.kanji) return null
  return (
    <p className={cx('text-sm font-extrabold text-ink/60', className)} data-koten-kanji={word.id}>
      <span className="mr-1.5 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-200">漢字</span>
      <KotenText>{word.kanji}</KotenText>
    </p>
  )
}

/** 活用表の欄。活用しない語は出さない。 */
export function KotenWordConjugation({ word, className = '' }) {
  const tables = conjugationTablesFor(word)
  if (!tables.length) return null
  return (
    <section className={className} data-koten-word-conjugation={word.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-amber-600">活用</p>
      <KotenConjugationTable tables={tables} />
    </section>
  )
}

/** 時代背景の欄。背景が意味に関わらない語は出さない。 */
export function KotenBackground({ text, className = '', label = '時代背景' }) {
  if (!text) return null
  return (
    <section className={cx('rounded-2xl bg-indigo-50/70 p-4 ring-1 ring-indigo-100', className)} data-koten-background>
      <p className="text-[11px] font-extrabold tracking-wide text-indigo-700">{label}</p>
      <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75"><KotenText>{text}</KotenText></p>
    </section>
  )
}

function GroupCard({ word, group, role, onOpenWord, onStudyGroup, compact }) {
  const [explainOpen, setExplainOpen] = useState(!compact)
  const others = group.entries.filter((entry) => entry.word.id !== word.id)
  const shown = compact ? others.slice(0, 6) : others
  return (
    <div className="rounded-2xl bg-teal-50/70 p-3 ring-1 ring-teal-100" data-koten-word-group={group.id}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-teal-700 ring-1 ring-teal-200">
          {group.typeInfo?.label}
        </span>
        <span className="text-sm font-extrabold text-ink">{group.title}</span>
      </div>
      <p className="mt-1.5 text-xs font-extrabold leading-relaxed text-teal-900">
        {'この語：'}
        <KotenText>{role}</KotenText>
      </p>
      {shown.length > 0 && (
        <ul className="mt-2 space-y-1">
          {shown.map((entry) => (
            <li key={entry.word.id}>
              <button
                type="button"
                onClick={onOpenWord ? () => onOpenWord(entry.word.id) : undefined}
                disabled={!onOpenWord}
                className="flex w-full items-baseline gap-2 rounded-xl bg-white px-2.5 py-1.5 text-left disabled:cursor-default"
                aria-label={onOpenWord ? `${entry.word.word}の辞書ページを開く` : undefined}
                data-koten-group-member={entry.word.id}
              >
                <span className="shrink-0 text-sm font-extrabold text-ink"><KotenWord word={entry.word} /></span>
                <span className="min-w-0 text-xs font-bold leading-relaxed text-ink/60"><KotenText>{entry.role}</KotenText></span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {compact && others.length > shown.length && (
        <p className="mt-1 text-[11px] font-bold text-ink/45">{`ほか${others.length - shown.length}語（辞書ページですべて見られます）`}</p>
      )}
      <button
        type="button"
        onClick={() => setExplainOpen((open) => !open)}
        aria-expanded={explainOpen}
        className="mt-2 flex items-center gap-1 text-xs font-extrabold text-teal-800"
        data-koten-group-explain-toggle={group.id}
      >
        {explainOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {'使い分けの解説'}
      </button>
      {explainOpen && (
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70" data-koten-group-explain={group.id}>
          <KotenText>{group.explain}</KotenText>
        </p>
      )}
      {onStudyGroup && (
        <button
          type="button"
          onClick={() => onStudyGroup(group)}
          className="mt-2 w-full rounded-xl bg-teal-600 px-3 py-2 text-xs font-extrabold text-white"
          data-koten-group-study={group.id}
        >
          {`この仲間${group.entries.length}語をまとめて暗記`}
        </button>
      )}
    </div>
  )
}

/** その語が入っている仲間と、仲間の中での位置づけ・使い分けの解説。 */
export function KotenWordGroups({ word, onOpenWord, onStudyGroup, compact = false, className = '' }) {
  const groups = kotenGroupsForWord(word.id)
  if (!groups.length) return null
  return (
    <section className={className} data-koten-word-groups={word.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-teal-700">仲間と使い分け</p>
      <div className="space-y-2">
        {groups.map(({ group, role }) => (
          <GroupCard
            key={group.id}
            word={word}
            group={group}
            role={role}
            onOpenWord={onOpenWord}
            onStudyGroup={onStudyGroup}
            compact={compact}
          />
        ))}
      </div>
    </section>
  )
}
