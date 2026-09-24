import { Fragment, useState } from 'react'
import { KOTEN_GRAMMAR_ITEM_LEVEL_BY_ID } from '../data/koten-grammar.js'
import { kotenGrammarSystemsFor } from '../data/koten-grammar-systems.js'
import { kotenGrammarConjugationTables, kotenGrammarListTable } from '../lib/kotenGrammarTables.js'
import { KotenConjugationTable } from './KotenConjugationTable.jsx'
import { KotenText } from './KotenFurigana.jsx'
import { KotenBackground } from './KotenWordExtras.jsx'
import { cx } from './ui.jsx'
import { ChevronDown, ChevronUp } from './Icons.jsx'

// 古典文法の暗記カードの裏・文法辞典・体系表・テストの答え合わせで共通に出す、
// 重要度・活用表・一覧表・使い分け・時代背景・体系表への入口。

// 表の1列目（語・活用の種類など）は、細く折り返して読みにくくならない幅を取る。
const FIRST_COLUMN = 'min-w-[5.5rem]'

/** 重要度（中学入門〜最難関大学の5段）。 */
export function KotenGrammarLevelChip({ item, className = '' }) {
  const level = KOTEN_GRAMMAR_ITEM_LEVEL_BY_ID[item?.level]
  if (!level) return null
  return (
    <span
      className={cx('rounded-full px-2 py-0.5 text-[10px] font-extrabold text-white', className)}
      style={{ background: level.color }}
      data-koten-grammar-level={item.level}
    >
      {level.label}
    </span>
  )
}

/** 見出しの行と中身の行でできた表。体系表と、項目ごとの見分け方の表で使う。 */
export function KotenPlainTable({ columns, rows, label, className = '' }) {
  return (
    <div className={cx('overflow-x-auto rounded-2xl bg-white ring-1 ring-amber-100', className)}>
      <table className={cx('w-full border-collapse text-left text-xs', columns.length >= 4 && 'min-w-[26rem]')} aria-label={label}>
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={column} scope="col" className={cx('bg-amber-50 px-2 py-1.5 text-[11px] font-extrabold text-amber-900', columnIndex === 0 && FIRST_COLUMN)}>
                <KotenText>{column}</KotenText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, rowIndex) => (
            <tr key={rowIndex} className="border-t border-amber-100">
              {cells.map((cell, cellIndex) => (
                <td key={cellIndex} className={cx('px-2 py-1.5 align-top font-bold leading-relaxed text-ink/75', cellIndex === 0 && FIRST_COLUMN)}>
                  <KotenText>{cell}</KotenText>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 文法項目の活用表（助動詞・用言・敬語動詞）と、見分け方などの表。 */
export function KotenGrammarTables({ item, className = '' }) {
  const conjugation = kotenGrammarConjugationTables(item)
  const list = kotenGrammarListTable(item)
  if (!conjugation.length && !list) return null
  return (
    <section className={cx('space-y-2.5', className)} data-koten-grammar-tables={item.id}>
      {conjugation.length > 0 && (
        <div data-koten-grammar-conjugation={item.id}>
          <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-amber-600">活用表</p>
          <KotenConjugationTable tables={conjugation} />
        </div>
      )}
      {list && (
        <div data-koten-grammar-list-table={item.id}>
          <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-amber-600">表で整理</p>
          <KotenPlainTable columns={list.columns} rows={list.rows} label={`${item.title}の表`} />
        </div>
      )}
    </section>
  )
}

/** 使い分け・見分け方と、時代背景。 */
export function KotenGrammarNotes({ item, className = '' }) {
  if (!item?.usage && !item?.background) return null
  return (
    <div className={cx('space-y-2', className)} data-koten-grammar-notes={item.id}>
      {item.usage && (
        <section className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-100" data-koten-grammar-usage={item.id}>
          <p className="text-[11px] font-extrabold tracking-wide text-emerald-700">使い分け・見分け方</p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-ink/75"><KotenText>{item.usage}</KotenText></p>
        </section>
      )}
      <KotenBackground text={item.background} />
    </div>
  )
}

/** 表を畳んでおき、押すと開く。テストの答え合わせのように縦に長くしたくない所で使う。 */
export function KotenGrammarTablesToggle({ item, className = '' }) {
  const [open, setOpen] = useState(false)
  const conjugation = kotenGrammarConjugationTables(item)
  const list = kotenGrammarListTable(item)
  if (!conjugation.length && !list) return null
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex items-center gap-1 text-xs font-extrabold text-amber-800"
        data-koten-grammar-tables-toggle={item.id}
      >
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {conjugation.length ? '活用表・表を見る' : '表を見る'}
      </button>
      {open && <KotenGrammarTables item={item} className="mt-2" />}
    </div>
  )
}

/** その項目が出てくる体系表。押すと体系表を開く（押せない所では名前だけ出す）。 */
export function KotenGrammarSystemLinks({ item, onOpenSystem, className = '' }) {
  const systems = kotenGrammarSystemsFor(item.id)
  if (!systems.length) return null
  return (
    <section className={className} data-koten-grammar-system-links={item.id}>
      <p className="mb-1.5 text-[11px] font-extrabold tracking-wide text-amber-700">この項目が入っている体系表</p>
      <div className="flex flex-wrap gap-1.5">
        {systems.map((system) => onOpenSystem ? (
          <button
            key={system.id}
            type="button"
            onClick={() => onOpenSystem(system.id)}
            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-200"
            data-koten-grammar-system-link={system.id}
          >
            {system.emoji} {system.title}
          </button>
        ) : (
          <span
            key={system.id}
            className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-200"
            data-koten-grammar-system-link={system.id}
          >
            {system.emoji} {system.title}
          </span>
        ))}
      </div>
    </section>
  )
}

/**
 * 体系表。見出しの行（接続・助詞の種類など）で区切り、各行の最初の欄を押すと、
 * その行の項目の説明を表の中に開く（renderItem が中身を作る）。
 */
export function KotenGrammarSystemTable({ system, openRow, onToggleRow, renderItem, className = '' }) {
  const width = system.columns.length
  return (
    <div className={cx('overflow-x-auto rounded-2xl bg-white ring-1 ring-amber-100', className)} data-koten-grammar-system-table={system.id}>
      <table className={cx('w-full border-collapse text-left text-xs', width >= 4 && 'min-w-[26rem]')} aria-label={system.title}>
        <thead>
          <tr>
            {system.columns.map((column, columnIndex) => (
              <th key={column} scope="col" className={cx('bg-amber-50 px-2 py-1.5 text-[11px] font-extrabold text-amber-900', columnIndex === 0 && FIRST_COLUMN)}>
                <KotenText>{column}</KotenText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {system.rows.map((entry, index) => {
            if (entry.group) {
              return (
                <tr key={`group-${index}`} className="border-t border-amber-200">
                  <th colSpan={width} scope="colgroup" className="bg-amber-100/60 px-2 py-1.5 text-[11px] font-extrabold text-amber-900">
                    <KotenText>{entry.group}</KotenText>
                  </th>
                </tr>
              )
            }
            const rowKey = `${system.id}:${index}`
            const open = openRow === rowKey
            return (
              <Fragment key={rowKey}>
                <tr className={cx('border-t border-amber-100', open && 'bg-amber-50/60')}>
                  {entry.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cx('px-2 py-1.5 align-top font-bold leading-relaxed text-ink/75', cellIndex === 0 && FIRST_COLUMN)}>
                      {cellIndex === 0 && onToggleRow ? (
                        <button
                          type="button"
                          onClick={() => onToggleRow(open ? null : rowKey)}
                          aria-expanded={open}
                          className="text-left font-extrabold text-amber-800 underline decoration-amber-300 underline-offset-2"
                          data-koten-grammar-system-row={entry.ids[0]}
                        >
                          <KotenText>{cell}</KotenText>
                        </button>
                      ) : (
                        <KotenText>{cell}</KotenText>
                      )}
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
