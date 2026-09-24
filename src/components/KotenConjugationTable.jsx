import { stemLabel } from '../lib/kotenConjugation.js'
import { KotenText } from './KotenFurigana.jsx'
import { cx } from './ui.jsx'

// 活用表。6つの活用形を横一列に並べ、語幹は上に添える（助動詞は語幹を持たない）。
// 1つの活用形に2つの形がある所（形容詞の補助活用・ナリ活用の連用形など）は、縦に並べる。
const FORM_HEADINGS = ['未然', '連用', '終止', '連体', '已然', '命令']

export function KotenConjugationTable({ tables, className = '', tone = 'amber' }) {
  if (!tables?.length) return null
  const palette = tone === 'violet'
    ? { box: 'bg-violet-50/70 ring-violet-100', head: 'text-violet-800', th: 'bg-violet-100/70 text-violet-900' }
    : { box: 'bg-amber-50/70 ring-amber-100', head: 'text-amber-800', th: 'bg-amber-100/70 text-amber-900' }
  return (
    <div className={cx('space-y-2.5', className)} data-koten-conjugation>
      {tables.map((table, index) => (
        <div key={`${table.label}-${index}`} className={cx('rounded-2xl p-3 ring-1', palette.box)} data-koten-conjugation-table={table.type}>
          <p className={cx('text-xs font-extrabold', palette.head)}>
            {table.label}
            {table.stem !== null && <span className="ml-2 font-bold text-ink/60">{`語幹：${stemLabel(table)}`}</span>}
          </p>
          {table.gloss && <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/60">{table.gloss}</p>}
          <table className="mt-2 w-full table-fixed border-collapse text-center" aria-label={`${table.label}の活用表`}>
            <thead>
              <tr>
                {FORM_HEADINGS.map((heading) => (
                  <th key={heading} scope="col" className={cx('border border-white px-0.5 py-1 text-[10px] font-extrabold', palette.th)}>
                    <KotenText>{heading}</KotenText>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {table.forms.map((cell, cellIndex) => (
                  <td key={FORM_HEADINGS[cellIndex]} className="border border-white bg-white px-0.5 py-1.5 align-top text-sm font-extrabold text-ink">
                    {cell.length ? cell.map((form) => (
                      <span key={form} className="block leading-snug">{form}</span>
                    )) : <span className="text-ink/30">○</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
