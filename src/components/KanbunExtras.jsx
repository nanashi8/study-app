import { Fragment, useState } from 'react'
import { conjugationTable } from '../lib/kotenConjugation.js'
import { kanbunGroupsForItem, kanbunSystemsForItem } from '../lib/kanbunGroups.js'
import { KotenConjugationTable } from './KotenConjugationTable.jsx'
import { KanbunHeadword } from './KanbunFurigana.jsx'
import { cx } from './ui.jsx'
import { ChevronDown, ChevronUp } from './Icons.jsx'

// 漢文の暗記カードの裏・一覧・テストの答え合わせで共通に出す、
// 使い分け・時代背景・仲間（漢語）・体系表（漢文法）の欄。
// 説明の文は、ほかの漢文の説明（くわしい説明・まちがえやすい点）と同じく、ふりがなを振らずに出す。

// 表の1列目（字・形）は、細く折り返して読みにくくならない幅を取る。
// 3列以上の表の中の列（読み・書き下し）も、1〜2字ずつに折り返さない幅を取る。
const FIRST_COLUMN = 'min-w-[5.5rem]'
const MIDDLE_COLUMN = 'min-w-[4rem]'
const columnWidth = (index, width) => (index === 0 ? FIRST_COLUMN : index < width - 1 ? MIDDLE_COLUMN : '')

/** 使い分けと時代背景。どちらも持たない項目は出さない。 */
export function KanbunNotes({ item, usageLabel = '使い分け', className = '' }) {
  if (!item?.usage && !item?.background) return null
  return (
    <div className={cx('space-y-2', className)} data-kanbun-notes={item.id}>
      {item.usage && (
        <section className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-100" data-kanbun-usage={item.id}>
          <p className="text-[11px] font-extrabold tracking-wide text-emerald-700">{usageLabel}</p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.usage}</p>
        </section>
      )}
      {item.background && (
        <section className="rounded-2xl bg-indigo-50/70 p-4 ring-1 ring-indigo-100" data-kanbun-background={item.id}>
          <p className="text-[11px] font-extrabold tracking-wide text-indigo-700">時代背景</p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75">{item.background}</p>
        </section>
      )}
    </div>
  )
}

/** 仲間の語の一覧（見出し・読み・意味）。 */
export function KanbunGroupMembers({ items, className = '' }) {
  if (!items.length) return null
  return (
    <ul className={cx('space-y-1', className)}>
      {items.map((entry) => (
        <li key={entry.id} className="flex items-baseline gap-2 rounded-xl bg-white px-2.5 py-1.5" data-kanbun-group-member={entry.id}>
          <span className="shrink-0 font-serif text-base font-extrabold text-ink"><KanbunHeadword item={entry} /></span>
          <span className="min-w-0 text-xs font-bold leading-relaxed text-ink/60">{entry.answer}</span>
        </li>
      ))}
    </ul>
  )
}

function GroupBox({ item, group, compact, onStudyGroup }) {
  const [explainOpen, setExplainOpen] = useState(!compact)
  const others = group.items.filter((entry) => entry.id !== item.id)
  return (
    <div className="rounded-2xl bg-teal-50/70 p-3 ring-1 ring-teal-100" data-kanbun-group={group.id}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-teal-700 ring-1 ring-teal-200">
          {group.typeInfo?.label}
        </span>
        <span className="text-sm font-extrabold text-ink">{group.title}</span>
      </div>
      <KanbunGroupMembers items={others} className="mt-2" />
      <button
        type="button"
        onClick={() => setExplainOpen((open) => !open)}
        aria-expanded={explainOpen}
        className="mt-2 flex items-center gap-1 text-xs font-extrabold text-teal-800"
        data-kanbun-group-explain-toggle={group.id}
      >
        {explainOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {'使い分けの解説'}
      </button>
      {explainOpen && (
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/70" data-kanbun-group-explain={group.id}>
          {group.explain}
        </p>
      )}
      {onStudyGroup && (
        <button
          type="button"
          onClick={() => onStudyGroup(group)}
          className="mt-2 w-full rounded-xl bg-teal-600 px-3 py-2 text-xs font-extrabold text-white"
          data-kanbun-group-study={group.id}
        >
          {`この仲間${group.items.length}語をまとめて暗記`}
        </button>
      )}
    </div>
  )
}

/** その漢語が入っている仲間と、仲間の語・使い分けの解説。 */
export function KanbunGroups({ item, onStudyGroup, compact = false, className = '' }) {
  const groups = kanbunGroupsForItem(item?.id)
  if (!groups.length) return null
  return (
    <section className={className} data-kanbun-groups={item.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-teal-700">仲間と使い分け</p>
      <div className="space-y-2">
        {groups.map((group) => (
          <GroupBox key={group.id} item={item} group={group} compact={compact} onStudyGroup={onStudyGroup} />
        ))}
      </div>
    </section>
  )
}

/** 体系表の下に出す、書き下しで助動詞になる字の活用表。 */
export function KanbunSystemAuxTables({ system, className = '' }) {
  const tables = (system?.aux ?? [])
    .map((entry) => conjugationTable(null, { type: `aux:${entry.name}`, gloss: entry.gloss }))
    .filter(Boolean)
  if (!tables.length) return null
  return (
    <div className={className} data-kanbun-system-aux={system.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-rose-700">活用表</p>
      <KotenConjugationTable tables={tables} />
    </div>
  )
}

/**
 * 体系表。見出しの行で区切り、各行の最初の欄を押すと、その行の項目の説明を表の中に開く（renderItem が中身を作る）。
 * highlightId の項目が出てくる行は色を付ける（暗記カード・答え合わせで、いまの項目がどこにあるかを示す）。
 */
export function KanbunSystemTable({ system, openRow, onToggleRow, renderItem, highlightId, className = '' }) {
  const width = system.columns.length
  return (
    <div className={cx('overflow-x-auto rounded-2xl bg-white ring-1 ring-rose-100', className)} data-kanbun-system-table={system.id}>
      <table className={cx('w-full border-collapse text-left text-xs', width >= 4 && 'min-w-[26rem]')} aria-label={system.title}>
        <thead>
          <tr>
            {system.columns.map((column, columnIndex) => (
              <th key={column} scope="col" className={cx('bg-rose-50 px-2 py-1.5 text-[11px] font-extrabold text-rose-900', columnWidth(columnIndex, width))}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {system.rows.map((entry, index) => {
            if (entry.group) {
              return (
                <tr key={`group-${index}`} className="border-t border-rose-200">
                  <th colSpan={width} scope="colgroup" className="bg-rose-100/60 px-2 py-1.5 text-[11px] font-extrabold text-rose-900">
                    {entry.group}
                  </th>
                </tr>
              )
            }
            const rowKey = `${system.id}:${index}`
            const open = openRow === rowKey
            const current = highlightId && entry.ids.includes(highlightId)
            return (
              <Fragment key={rowKey}>
                <tr
                  className={cx('border-t border-rose-100', current ? 'bg-amber-100' : open && 'bg-rose-50/70')}
                  data-kanbun-system-current={current ? highlightId : undefined}
                >
                  {entry.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cx('px-2 py-1.5 align-top font-bold leading-relaxed text-ink/75', columnWidth(cellIndex, width), cellIndex === 0 && 'font-serif text-sm')}>
                      {cellIndex === 0 && onToggleRow ? (
                        <button
                          type="button"
                          onClick={() => onToggleRow(open ? null : rowKey)}
                          aria-expanded={open}
                          className="text-left font-extrabold text-rose-800 underline decoration-rose-300 underline-offset-2"
                          data-kanbun-system-row={entry.ids[0]}
                        >
                          {cell}
                        </button>
                      ) : cell}
                    </td>
                  ))}
                </tr>
                {open && renderItem && (
                  <tr>
                    <td colSpan={width} className="px-2 pb-3 pt-1">
                      <div className="space-y-2">
                        {entry.ids.map((id) => <Fragment key={id}>{renderItem(id)}</Fragment>)}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SystemToggle({ item, system }) {
  const [open, setOpen] = useState(false)
  return (
    <div data-kanbun-system-link={system.id}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-left text-xs font-extrabold text-rose-800 ring-1 ring-rose-200"
        data-kanbun-system-toggle={system.id}
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <span className="min-w-0 flex-1">{system.emoji} {system.title}</span>
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <p className="rounded-2xl bg-rose-50/70 p-3 text-xs font-bold leading-relaxed text-ink/70 ring-1 ring-rose-100">{system.explain}</p>
          <KanbunSystemTable system={system} highlightId={item.id} />
          <KanbunSystemAuxTables system={system} />
        </div>
      )}
    </div>
  )
}

/**
 * その漢文法の項目が入っている体系表。onOpenSystem があれば押すと体系表の画面へ、
 * なければ押すとその場で表を開く（暗記カード・答え合わせ）。いまの項目の行には色が付く。
 */
export function KanbunSystemLinks({ item, onOpenSystem, className = '' }) {
  const systems = kanbunSystemsForItem(item?.id)
  if (!systems.length) return null
  return (
    <section className={className} data-kanbun-system-links={item.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-rose-700">この項目が入っている体系表</p>
      {onOpenSystem ? (
        <div className="flex flex-wrap gap-1.5">
          {systems.map((system) => (
            <button
              key={system.id}
              type="button"
              onClick={() => onOpenSystem(system.id)}
              className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-rose-800 ring-1 ring-rose-200"
              data-kanbun-system-link={system.id}
            >
              {system.emoji} {system.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {systems.map((system) => <SystemToggle key={system.id} item={item} system={system} />)}
        </div>
      )}
    </section>
  )
}

/** 漢語なら仲間、漢文法なら体系表。故事成語など、どちらも持たない教材では何も出さない。 */
export function KanbunExtras({ domain, item, compact = false, onStudyGroup, onOpenSystem, className = '' }) {
  if (domain === 'vocab') {
    return (
      <div className={cx('space-y-3', className)}>
        <KanbunNotes item={item} />
        <KanbunGroups item={item} compact={compact} onStudyGroup={onStudyGroup} />
      </div>
    )
  }
  if (domain === 'grammar') {
    return (
      <div className={cx('space-y-3', className)}>
        <KanbunNotes item={item} usageLabel="使い分け・見分け方" />
        <KanbunSystemLinks item={item} onOpenSystem={onOpenSystem} />
      </div>
    )
  }
  return null
}
